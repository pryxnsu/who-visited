import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MousePointerClick, Activity, Globe, Users, Monitor, Smartphone, ChevronRight, Github } from 'lucide-react';
import { CONTACT_EMAIL } from '@/lib/constant';

const quickStats = [
  { label: 'Total visits', value: '52,431', icon: Activity },
  { label: 'Unique visitors', value: '11,948', icon: Users },
  { label: 'Setup time', value: '< 1 min', icon: Globe },
];

export default function Home() {
  return (
    <div className="bg-background selection:bg-primary/30 selection:text-primary relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0 flex justify-center overflow-hidden">
        <div className="absolute top-0 left-1/2 h-150 w-250 -translate-x-1/2 opacity-30 mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-size-[34px_34px]" />
      </div>

      <nav className="bg-background/40 fixed top-4 left-1/2 z-50 flex w-[92%] max-w-3xl -translate-x-1/2 items-center justify-between rounded-full border border-white/10 px-3 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.12)] ring-1 ring-white/5 backdrop-blur-2xl transition-all sm:top-6 sm:w-[95%] sm:py-2.5">
        <Link href="/" className="inline-flex items-center gap-2 pl-2 sm:pl-3">
          <span className="text-foreground/90 text-xs font-bold tracking-[0.15em] uppercase sm:text-sm">
            WhoVisited
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-foreground hidden rounded-full sm:flex"
          >
            <Link href="/login">Sign in</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-foreground text-background hover:bg-foreground/90 h-8 rounded-full px-4 text-xs shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all sm:h-9 sm:text-sm"
          >
            <Link href="https://github.com/pryxnsu/who-visited" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
              Github
            </Link>
          </Button>
        </div>
      </nav>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-4 pt-24 sm:px-8 sm:pt-40">
        <main className="flex flex-col items-center text-center">
          <div className="border-primary/20 bg-primary/5 text-primary ring-primary/10 mb-6 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-medium shadow-[inset_0_1px_4px_rgba(0,0,0,0.1)] ring-1 ring-inset sm:mb-8 sm:px-4 sm:py-1.5 sm:text-xs">
            <span className="max-w-50 truncate sm:max-w-none">Track what happens on your website in real-time</span>
            <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />
          </div>

          <h1 className="max-w-4xl text-4xl leading-[1.1] font-black tracking-tight sm:text-5xl lg:text-7xl">
            See exactly who is visiting. <br className="hidden sm:block" />
          </h1>

          <p className="text-muted-foreground mt-5 max-w-2xl text-base leading-relaxed font-medium sm:mt-6 sm:text-lg">
            Drop a single script onto your website. Instantly monitor visitor count, browser usage, and referrers in a
            beautiful, real-time dashboard.
          </p>

          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:mt-7 sm:w-auto sm:flex-row sm:gap-4">
            <Button
              asChild
              className="group bg-primary hover:bg-primary/90 relative h-11 w-full overflow-hidden rounded-full px-6 text-sm transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(var(--primary),0.4)] sm:w-auto"
            >
              <Link href="/login" className="text-primary-foreground inline-flex items-center justify-center gap-2">
                <span className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity group-hover:opacity-100" />
                <MousePointerClick className="h-4 w-4" />
                Get started
              </Link>
            </Button>
          </div>
        </main>

        <section className="relative mt-20 w-full sm:mt-28">
          <div className="rounded-[24px] bg-white p-2 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] ring-1 ring-zinc-200/50 sm:p-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="col-span-1 flex flex-col justify-between rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200 sm:col-span-2 sm:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="flex items-center gap-2 font-mono text-sm font-semibold text-zinc-900">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      Live Traffic
                    </h3>
                    <p className="mt-1 font-mono text-xs text-zinc-400">Active users on site</p>
                  </div>
                  <div className="text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl">124</div>
                </div>

                <div className="relative mt-12 flex h-40 items-end gap-2 sm:gap-3">
                  <div className="absolute inset-0 flex flex-col justify-between border-b border-zinc-100 pb-0">
                    <div className="w-full border-t border-dashed border-zinc-200" />
                    <div className="w-full border-t border-dashed border-zinc-200" />
                    <div className="w-full border-t border-dashed border-zinc-200" />
                  </div>

                  {[40, 60, 50, 85, 65, 95, 100, 55, 75].map((h, i) => (
                    <div
                      key={i}
                      className={`relative z-10 w-full rounded-t-md transition-all duration-500 hover:opacity-100 ${
                        i === 6
                          ? 'bg-linear-to-t from-transparent via-zinc-600 to-zinc-900 opacity-100 shadow-[0_-4px_12px_rgba(0,0,0,0.1)]'
                          : 'bg-linear-to-t from-transparent to-zinc-200 opacity-60 hover:to-zinc-300'
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="col-span-1 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200 sm:p-6">
                <h3 className="mb-6 font-mono text-sm font-semibold text-zinc-900">Activity Feed</h3>
                <div className="space-y-3">
                  <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all">
                    <div className="absolute top-0 left-0 h-full w-1 bg-zinc-900" />
                    <p className="truncate font-mono text-xs font-semibold text-zinc-900">/pricing-page</p>
                    <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-zinc-500">
                      <span className="flex items-center gap-1.5">
                        <Monitor className="h-3 w-3" /> Mac OS
                      </span>
                      <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-bold text-zinc-800">Just now</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-3 transition-all hover:bg-zinc-50">
                    <p className="truncate font-mono text-xs font-medium text-zinc-700">/blog/top-10-tools</p>
                    <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        <Smartphone className="h-3 w-3" /> iOS
                      </span>
                      <span>12s ago</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-3 transition-all hover:bg-zinc-50">
                    <p className="truncate font-mono text-xs font-medium text-zinc-700">/about-us</p>
                    <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        <Monitor className="h-3 w-3" /> Windows
                      </span>
                      <span>45s ago</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-1 grid grid-cols-1 gap-4 sm:col-span-3 sm:grid-cols-3">
                {quickStats.map(item => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-800 ring-1 ring-zinc-200/50 ring-inset">
                        <Icon className="h-5 w-5" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="font-mono text-xs text-zinc-500">{item.label}</p>
                        <p className="mt-0.5 text-2xl font-bold tracking-tight text-zinc-950">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <footer className="border-border/50 mt-16 flex flex-col items-center gap-6 border-t py-6 sm:mt-24 sm:flex-row sm:justify-between sm:py-8">
          <div className="text-muted-foreground flex flex-col items-center gap-2 sm:items-start">
            <p className="text-xs sm:text-sm">&copy; {new Date().getFullYear()} WhoVisited. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs sm:text-sm">
              <Link href="/privacy-policy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href={`mailto:${CONTACT_EMAIL}`} className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>

          <p className="text-muted-foreground text-xs sm:text-sm">
            Built by{' '}
            <Link
              href="https://x.com/pryxnsu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:decoration-primary font-semibold transition-colors"
            >
              Priyanshu
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
