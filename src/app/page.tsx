
// src/app/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { SettingsIcon } from 'lucide-react';
import Logo from '@/components/game/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import MusicToggle from '@/components/MusicToggle';
import Footer from '@/components/game/Footer';

export default function Home() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="flex">
      <Sidebar collapsible="offcanvas">
        <SidebarContent className="space-y-4">
          <SidebarHeader>
            <h2 className="text-lg font-semibold">Settings</h2>
          </SidebarHeader>
          {/* Settings content will go here */}
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen bg-background text-foreground bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/30 to-background overflow-x-hidden">
          <div className="w-full mx-auto max-w-7xl px-4 lg:px-8">
            <header className="w-full flex justify-between items-center text-center py-4">
              <div className="flex items-center gap-4">
                <Logo />
              </div>
              
              <div className="flex items-center gap-2">
                <MusicToggle />
                <ThemeToggle />
                <Button variant="outline" size="icon" onClick={toggleSidebar}>
                  <SettingsIcon />
                </Button>
              </div>
            </header>
            
            <main className="flex-1 flex flex-col items-center justify-center w-full mx-auto my-8">
                <div className="text-center">
                    <h1 className="text-5xl font-headline text-primary">Welcome to Nitro Rush</h1>
                    <p className="mt-4 text-lg text-muted-foreground">Let's build a new game!</p>
                </div>
            </main>
          </div>
          <Footer />
        </div>
      </SidebarInset>
    </div>
  );
}
