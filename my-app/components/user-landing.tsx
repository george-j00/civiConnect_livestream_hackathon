"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const slugSchema = z
  .string()
  .regex(/^([a-z][a-z0-9]*)(-[a-z0-9]+)*$/)
  .min(3);

export default function HomeForm() {
  const [slug, setSlug] = useState("");
  const [validSlug, setValidSlug] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      slugSchema.parse(slug);
      setValidSlug(true);
    } catch {
      setValidSlug(false);
    }
  }, [slug]);

  return (
    <div className="flex items-center gap-2">
      <Input
        className="w-[200px]"
        type="text"
        placeholder="example-stream"
        onChange={(e) => {
          setSlug(e.target.value);
        }}
        value={slug}
      />
      <Button
        variant="secondary"
        disabled={!validSlug}
        onClick={() => router.push(`/user/channel/${slug}`)}
      >
        Join as viewer
      </Button>
    </div>
  );
}
