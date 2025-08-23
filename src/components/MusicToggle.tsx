// src/components/MusicToggle.tsx
"use client"

import * as React from "react"
import { Volume2, VolumeX } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"

export default function MusicToggle() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(1);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  React.useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = volume;
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
  }, [isPlaying, volume]);

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  }
  
  return (
    <>
      <audio ref={audioRef} src="/music.mp3" loop />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" onClick={toggleMusic}>
            {isPlaying ? (
                <Volume2 className="h-[1.2rem] w-[1.2rem]" />
            ) : (
                <VolumeX className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">Toggle music</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40">
            <div className="grid gap-4">
                <div className="space-y-2">
                    <h4 className="font-medium leading-none">Volume</h4>
                    <p className="text-sm text-muted-foreground">
                        Set the music volume.
                    </p>
                </div>
                <Slider
                    defaultValue={[volume]}
                    max={1}
                    step={0.1}
                    onValueChange={handleVolumeChange}
                    className="w-full"
                />
            </div>
        </PopoverContent>
      </Popover>
    </>
  )
}
