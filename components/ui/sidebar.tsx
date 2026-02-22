'use client';

import * as React from 'react';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

type SidebarContextValue = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggle: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider.');
  }
  return context;
}

function SidebarProvider({
  children,
  defaultOpen = true,
  className,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const toggle = React.useCallback(() => setOpen(prev => !prev), []);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const handleChange = (event: MediaQueryListEvent) => {
      setOpen(event.matches ? defaultOpen : false);
    };

    setOpen(mediaQuery.matches ? defaultOpen : false);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [defaultOpen]);

  return (
    <SidebarContext.Provider value={{ open, setOpen, toggle }}>
      <div className={cn('bg-background flex min-h-screen w-full', className)}>{children}</div>
    </SidebarContext.Provider>
  );
}

function Sidebar({ children, className }: { children: React.ReactNode; className?: string }) {
  const { open, setOpen } = useSidebar();

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}
      <aside
        data-state={open ? 'open' : 'collapsed'}
        className={cn(
          'bg-background fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r transition-transform duration-200 md:static md:translate-x-0 md:transition-[width]',
          open ? 'translate-x-0 md:w-56' : '-translate-x-full md:w-16',
          className
        )}
      >
        {children}
      </aside>
    </>
  );
}

function SidebarInset({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('min-w-0 flex-1', className)}>{children}</div>;
}

function SidebarHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-3 py-3', className)}>{children}</div>;
}

function SidebarContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex-1 overflow-y-auto px-2 py-2', className)}>{children}</div>;
}

function SidebarFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-2 py-3', className)}>{children}</div>;
}

function SidebarGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('space-y-2', className)}>{children}</div>;
}

function SidebarGroupLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('text-muted-foreground px-2 text-xs', className)}>{children}</p>;
}

function SidebarGroupContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('', className)}>{children}</div>;
}

function SidebarMenu({ children, className }: { children: React.ReactNode; className?: string }) {
  return <ul className={cn('space-y-1', className)}>{children}</ul>;
}

function SidebarMenuItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <li className={cn('', className)}>{children}</li>;
}

type SidebarMenuButtonProps = {
  children: React.ReactNode;
  asChild?: boolean;
  isActive?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};

function SidebarMenuButton({
  children,
  asChild = false,
  isActive = false,
  className,
  onClick,
  type = 'button',
  disabled,
}: SidebarMenuButtonProps) {
  const baseClassName = cn(
    'flex h-9 w-full items-center gap-2 rounded-md px-2 text-sm transition-colors',
    isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground',
    className
  );

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ className?: string; children?: React.ReactNode }>;
    return React.cloneElement(child, {
      className: cn(baseClassName, child.props.className),
    });
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={baseClassName}>
      {children}
    </button>
  );
}

function SidebarTrigger({ className }: { className?: string }) {
  const { toggle } = useSidebar();
  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        'text-muted-foreground hover:bg-accent hover:text-foreground inline-flex h-8 w-8 items-center justify-center rounded-md border transition-colors',
        className
      )}
      aria-label="Toggle sidebar"
    >
      <Menu className="h-4 w-4" />
    </button>
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
};
