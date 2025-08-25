// src/components/game/Footer.tsx
import React from 'react';
import { Github, Twitter } from 'lucide-react';
import { Button } from '../ui/button';

export default function Footer() {
  return (
    <footer className="w-full text-center text-muted-foreground text-xs py-4 mt-auto border-t border-border/20">
      <div className="container mx-auto flex flex-col sm:flex-row justify-center items-center gap-4">
        <p>
          Built by <a href="https://warpcast.com/thecodinggeek" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@thecodinggeek</a>. Powered by Next.js & Farcaster.
        </p>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" asChild>
                <a href="https://github.com/qasim-rokeeb/velocity-frontline" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository">
                    <Github className="h-4 w-4" />
                </a>
           </Button>
           <Button variant="ghost" size="icon" asChild>
                <a href="https://twitter.com/thecodinggeek_" target="_blank" rel="noopener noreferrer" aria-label="Twitter Profile">
                    <Twitter className="h-4 w-4" />
                </a>
           </Button>
        </div>
        <p>&copy; {new Date().getFullYear()} Nitro Rush. All rights reserved.</p>
      </div>
    </footer>
  );
}
