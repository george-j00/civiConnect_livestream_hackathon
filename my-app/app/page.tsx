import LandForm from "@/components/user-landing";
import { Icons } from "@/components/ui/icons";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Live streaming application for civic empowerment",
};

export default function IndexPage() {
  return (
    <section className="flex items-center justify-center  px-6 container mx-auto flex max-w-[680px] flex-1 flex-col pt-6 pb-8">
      <div className="mx-auto flex w-full flex-col items-start gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-[48pt] leading-tight tracking-tighter ">
            LIVE STREAM APPLICATION FOR CIVIC
          </h1>
        </div>
        <div className="flex flex-col gap-6 text-foreground">
          <p className="text-2xl">
            Open source livestreaming app built for civic 
          
          </p>
          <p>Join As A User:</p>
          <LandForm />
        </div>
      </div>
    </section>
  );
}
