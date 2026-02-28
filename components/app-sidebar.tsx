'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { LayoutDashboard, LogOut, Settings, Wrench, Globe } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Sites', href: '/sites', icon: Globe },
  { label: 'Setup', href: '/setup', icon: Wrench },
  { label: 'Settings', href: '/settings', icon: Settings },
] as const;

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  if (status === 'unauthenticated') {
    return null;
  }

  if (!session?.user) {
    return null;
  }
  return (
    <Sidebar className="bg-sidebar text-sidebar-foreground overflow-hidden rounded-xl border backdrop-blur-xl md:rounded-2xl">
      <SidebarHeader className="shrink-0 px-3 py-6 pb-2">
        <div className="hover:bg-accent group flex cursor-pointer items-center gap-3 rounded-md p-2 transition-colors">
          <Avatar className="h-9 w-9 rounded-md">
            <AvatarImage src={session.user.avatar} />
            <AvatarFallback>{session.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col">
            <p className="text-foreground mb-1 truncate text-sm leading-none font-medium">
              {session.user.name ?? '...'}
            </p>
            <p className="text-muted-foreground truncate text-xs leading-none">{session.user.email ?? '...'}</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="w-full flex-1 overflow-y-auto px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground mb-2 px-3 text-xs font-semibold tracking-wider uppercase">
            Pages
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navItems.map(item => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.href}>
                    <Button
                      asChild
                      variant="ghost"
                      className={cn(
                        'h-10 w-full justify-start rounded-lg px-4 text-sm transition-all duration-300',
                        active
                          ? 'bg-background border-border/40 text-foreground border font-medium shadow-none'
                          : 'text-muted-foreground hover:text-foreground hover:bg-black/5'
                      )}
                    >
                      <Link href={item.href}>
                        <Icon className={cn('mr-2 h-5 w-5', active ? 'text-foreground' : 'text-muted-foreground/80')} />
                        {item.label}
                      </Link>
                    </Button>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="relative z-10 flex w-full shrink-0 flex-col gap-2 px-3 pb-3">
        <SidebarMenu className="w-full">
          <SidebarMenuItem className="w-full">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-muted-foreground h-10 w-full cursor-pointer justify-start rounded-lg px-4 text-base transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <LogOut className="mr-4 h-5 w-5 hover:text-red-500" />
                  Log out
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Log out?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be signed out of your account and redirected to the login page.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => {
                      signOut({ callbackUrl: '/login' });
                      localStorage.clear();
                    }}
                  >
                    Log out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
