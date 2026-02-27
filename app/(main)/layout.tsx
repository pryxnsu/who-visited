'use client';

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SessionProvider } from 'next-auth/react';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <div className="bg-background flex h-dvh w-full gap-2 overflow-hidden p-2 md:gap-3 md:p-3">
          <AppSidebar />
          <main className="relative flex flex-1 flex-col overflow-y-auto px-5 pt-16 pb-4 md:pt-4">
            <SidebarTrigger className="absolute top-4 left-4 md:hidden" />
            {children}
          </main>
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}
