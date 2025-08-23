
// src/components/MusicToggle.tsx
"use client"

import * as React from "react"
import { Volume2, VolumeX } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function MusicToggle() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  React.useEffect(() => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.play().catch(error => {
                // Autoplay was prevented.
                console.error("Audio autoplay was prevented:", error);
                setIsPlaying(false);
            });
        } else {
            audioRef.current.pause();
        }
    }
  }, [isPlaying]);

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };
  
  return (
    <>
      <audio ref={audioRef} src="/music.mp3" loop />
      <Button variant="outline" size="icon" onClick={toggleMusic}>
        {isPlaying ? (
            <Volume2 className="h-[1.2rem] w-[1.2rem]" />
        ) : (
            <VolumeX className="h-[1.2rem] w-[1.2rem]" />
        )}
        <span className="sr-only">Toggle music</span>
      </Button>
    </>
  )
}
