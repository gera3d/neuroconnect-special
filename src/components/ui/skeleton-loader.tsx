import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200/80", className)}
      {...props}
    />
  );
}

export function ProviderPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Header Skeleton */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </header>

      {/* Hero Section Skeleton */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
            
            {/* Left Column */}
            <div>
              {/* Trust Badges */}
              <div className="flex gap-2 mb-6">
                <Skeleton className="h-7 w-36 rounded-full" />
                <Skeleton className="h-7 w-28 rounded-full" />
              </div>

              {/* Headline with Photo */}
              <div className="flex gap-6 items-center mb-8">
                {/* Photo */}
                <Skeleton className="h-[175px] w-[140px] rounded-3xl flex-shrink-0" />
                
                {/* Headline */}
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-4/5" />
                </div>
              </div>

              {/* Provider Name */}
              <div className="mb-10 space-y-3">
                <Skeleton className="h-8 w-96" />
                <Skeleton className="h-6 w-48" />
              </div>

              {/* Feature Badges */}
              <div className="grid sm:grid-cols-3 gap-4 mb-10">
                <Skeleton className="h-24 rounded-2xl" />
                <Skeleton className="h-24 rounded-2xl" />
                <Skeleton className="h-24 rounded-2xl" />
              </div>

              {/* Description */}
              <div className="space-y-2 mb-10">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>

            {/* Right Column - CTA Card */}
            <div className="lg:sticky lg:top-24">
              <Skeleton className="h-[600px] w-full rounded-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Sticky CTA Bottom (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden z-40 bg-white border-t border-slate-200 p-4">
        <Skeleton className="h-[500px] w-full rounded-2xl" />
      </div>
    </div>
  );
}
