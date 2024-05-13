
import { Button } from "@/components/ui/button";
import { useLocalParticipant } from "@livekit/components-react";
import { confirmPasswordReset } from "firebase/auth";
import { Track, createLocalTracks, type LocalTrack } from "livekit-client";
import { useCallback, useEffect, useRef, useState } from "react";
import io from 'socket.io-client';
// import { AssemblyAI } from "assemblyai";



console.log('hello world');


// const CHUNK_SIZE = 1024; // Define your desired chunk size
// const DELAY_BETWEEN_CHUNKS = 100000;

// interface Props {
//   slug: string;
// }

// export default function HostControls({ slug }: Props) {
//   const [videoTrack, setVideoTrack] = useState<LocalTrack>();
//   const [audioTrack, setAudioTrack] = useState<LocalTrack | any>();
//   const [isPublishing, setIsPublishing] = useState(false);
//   const [isUnpublishing, setIsUnpublishing] = useState(false);
//   const previewVideoEl = useRef<HTMLVideoElement>(null);
//   let socket :any;

//   const { localParticipant } = useLocalParticipant();



//   const createTracks = async () => {
//     const tracks = await createLocalTracks({ audio: true, video: true });
//     tracks.forEach((track) => {
//       switch (track.kind) {
//         case Track.Kind.Video: {
//           if (previewVideoEl?.current) {
//             track.attach(previewVideoEl.current);
//           }
//           setVideoTrack(track);
//           break;
//         }
//         case Track.Kind.Audio: {
//           setAudioTrack(track);
//           break;
//         }
//       }
//     });
//   };


//   const sendAudioDataInChunks = (dataArray: Uint8Array) => {
//     let offset = 0;

//     // Define a function to send each chunk with a delay
//     function sendChunk() {
//       if (offset >= dataArray.length) {
//         // All data sent
//         return;
//       }

//       // Calculate the end index of the current chunk
//       const endIndex = Math.min(offset + CHUNK_SIZE, dataArray.length);

//       // Extract the current chunk (slice operation creates a new array copy)
//       const chunk = dataArray.slice(offset, endIndex);

//       // Emit the chunk as a buffer
//       socket.emit("audioData", chunk.buffer);

//       // Update the offset for the next chunk
//       offset = endIndex;

//       // Schedule the next chunk
//       setTimeout(sendChunk, DELAY_BETWEEN_CHUNKS);
//     }

//     // Start sending chunks
//     sendChunk();
//   };

//   useEffect(() => {
//     socket = io("http://localhost:3005"); // Replace with your server URL

//     return () => {
//       if (socket.current) {
//         socket.disconnect();
//       }
//     };
//   }, []);

//   useEffect(() => {
//     let audioContext: any = null;
//     let mediaStream: any = null;

//     const startAudioCapture = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         mediaStream = stream;
//         audioContext = new AudioContext();
//         const source = audioContext.createMediaStreamSource(stream);
//         source.connect(audioContext.destination);

//         const analyser = audioContext.createAnalyser();
//         source.connect(analyser);
//         analyser.fftSize = 2048;
//         const bufferLength = analyser.frequencyBinCount;
//         const dataArray = new Uint8Array(bufferLength);

//         const logAudioData = () => {
//           analyser.getByteFrequencyData(dataArray);
//           sendAudioDataInChunks(dataArray); // Ensure a copy is sent
//           requestAnimationFrame(logAudioData);
//         };

//         logAudioData();
//       } catch (error) {
//         console.error("Error accessing microphone:", error);
//       }
//     };

//     startAudioCapture();

//     return () => {
//       if (audioContext) {
//         audioContext.close();
//       }
//       if (mediaStream) {
//         mediaStream.getTracks().forEach((track : any) => track.stop());
//       }
//     };
//   }, []);


//   const togglePublishing = useCallback(async () => {
//     if (isPublishing && localParticipant) {
//       setIsUnpublishing(true);

//       if (videoTrack) {
//         void localParticipant.unpublishTrack(videoTrack);
//       }
//       if (audioTrack) {
//         void localParticipant.unpublishTrack(audioTrack); 
//       }

//       await createTracks();

//       setTimeout(() => {
//         setIsUnpublishing(false);
//       }, 2000);
//     } else if (localParticipant) {
//       if (videoTrack) {
//         void localParticipant.publishTrack(videoTrack);
//       }
//       if (audioTrack) {
//         void localParticipant.publishTrack(audioTrack);
//         //send audio track to the sendAudioChunks function 
//         // sendAudioChunks(audioTrack); 
//       }
//     }

//     setIsPublishing((prev) => !prev);
//   }, [audioTrack, isPublishing, localParticipant, videoTrack]);



const CHUNK_SIZE = 1024;
const DELAY_BETWEEN_CHUNKS = 100000;

// Define noise gate threshold (adjust as needed)
const NOISE_GATE_THRESHOLD = 50;

interface Props {
  slug: string;
}

export default function HostControls({ slug }: Props) {
  const [videoTrack, setVideoTrack] = useState<LocalTrack>();
  const [audioTrack, setAudioTrack] = useState<LocalTrack | any>();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);
  const previewVideoEl = useRef<HTMLVideoElement>(null);
  let socket :any;

  const { localParticipant } = useLocalParticipant();

  const noiseGateRef = useRef<number>(NOISE_GATE_THRESHOLD);

  const createTracks = async () => {
    const tracks = await createLocalTracks({ audio: true, video: true });
    tracks.forEach((track) => {
      switch (track.kind) {
        case Track.Kind.Video: {
          if (previewVideoEl?.current) {
            track.attach(previewVideoEl.current);
          }
          setVideoTrack(track);
          break;
        }
        case Track.Kind.Audio: {
          setAudioTrack(track);
          break;
        }
      }
    });
  };

  const sendAudioDataInChunks = (dataArray: Uint8Array) => {
    let offset = 0;

    function sendChunk() {
      if (offset >= dataArray.length) {
        return;
      }

      const endIndex = Math.min(offset + CHUNK_SIZE, dataArray.length);
      const chunk = dataArray.slice(offset, endIndex);
      
      // Apply noise gate
      const isSpeech = chunk.some(value => value > noiseGateRef.current);
      
      if (isSpeech) {
        socket.emit("audioData", chunk.buffer);
      }

      offset = endIndex;
      setTimeout(sendChunk, DELAY_BETWEEN_CHUNKS);
    }

    sendChunk();
  };

  useEffect(() => {
    socket = io("http://localhost:3005");

    return () => {
      if (socket.current) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
<<<<<<< HEAD
    let audioContext:any = null;
    let mediaStream:any = null;
    const client = new AssemblyAI({
      apiKey: "b2a76c0a62fc48d78cc02327dd8ad915",
    });
    
  
=======
    let audioContext: any = null;
    let mediaStream: any = null;

>>>>>>> new-branch
    const startAudioCapture = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStream = stream;
        audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(audioContext.destination);

        const analyser = audioContext.createAnalyser();
        source.connect(analyser);
        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const logAudioData = () => {
          analyser.getByteFrequencyData(dataArray);
          sendAudioDataInChunks(dataArray);
          requestAnimationFrame(logAudioData);
        };

        logAudioData();
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    };

    startAudioCapture();

    return () => {
      if (audioContext) {
        audioContext.close();
      }
      if (mediaStream) {
        mediaStream.getTracks().forEach((track : any) => track.stop());
      }
    };
  }, []);


  const togglePublishing = useCallback(async () => {
    if (isPublishing && localParticipant) {
      setIsUnpublishing(true);

      if (videoTrack) {
        void localParticipant.unpublishTrack(videoTrack);
      }
      if (audioTrack) {
        void localParticipant.unpublishTrack(audioTrack); 
      }

      await createTracks();

      setTimeout(() => {
        setIsUnpublishing(false);
      }, 2000);
    } else if (localParticipant) {
      if (videoTrack) {
        void localParticipant.publishTrack(videoTrack);
      }
      if (audioTrack) {
        void localParticipant.publishTrack(audioTrack);
      }
    }

    setIsPublishing((prev) => !prev);
  }, [audioTrack, isPublishing, localParticipant, videoTrack]);
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-[5px] text-lg font-bold">
          {isPublishing && !isUnpublishing ? (
            <div className="flex items-center gap-1">
              <span className="relative mr-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
              </span>
              LIVE
            </div>
          ) : (
            "Ready to stream"
          )}{" "}
          as{" "}
          <div className="italic text-purple-500 dark:text-purple-300">
            {slug}
          </div>
        </div>
        <div className="flex gap-2">
          {isPublishing ? (
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700"
              onClick={() => void togglePublishing()}
              disabled={isUnpublishing}
            >
              {isUnpublishing ? "Stopping..." : "Stop stream"}
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => void togglePublishing()}
              className="animate-pulse"
            >
              Start stream
            </Button>
          )}
        </div>
      </div>
      <div className="aspect-video rounded-sm border bg-neutral-800">
        <video ref={previewVideoEl} width="100%" height="100%" />
      </div>
      <div>
      </div>
    </div>
  );
}
