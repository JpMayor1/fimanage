const ReportSkeleton = () => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 md:space-y-6 animate-pulse">
      {/* Header Section Skeleton */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 md:p-6">
        <div className="h-8 bg-white/10 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div className="h-3 bg-white/10 rounded w-1/4 mb-2"></div>
              <div className="h-5 bg-white/10 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4"
          >
            <div className="h-4 bg-white/10 rounded w-1/3 mb-3"></div>
            <div className="h-7 bg-white/10 rounded w-2/3"></div>
          </div>
        ))}
      </div>

      {/* Period Statistics Skeleton */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 md:p-6">
        <div className="h-6 bg-white/10 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-3 bg-white/10 rounded w-1/3 mb-2"></div>
              <div className="h-6 bg-white/10 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Breakdown Skeleton */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 md:p-6">
        <div className="h-6 bg-white/10 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="p-3 rounded-lg bg-white/5 border border-white/10"
            >
              <div className="h-3 bg-white/10 rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-white/10 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Overdue Items Skeleton */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 md:p-6">
        <div className="h-6 bg-white/10 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i}>
              <div className="h-4 bg-white/10 rounded w-1/3 mb-3"></div>
              <div className="space-y-2">
                {[1, 2].map((j) => (
                  <div
                    key={j}
                    className="p-2 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="h-4 bg-white/10 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-white/10 rounded w-2/3 mb-1"></div>
                    <div className="h-3 bg-white/10 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Sources Skeleton */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 md:p-6">
        <div className="h-6 bg-white/10 rounded w-1/3 mb-4"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
            >
              <div className="flex items-center gap-2.5 flex-1">
                <div className="h-6 w-6 bg-white/10 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-white/10 rounded w-1/3 mb-2"></div>
                  <div className="flex items-center gap-3">
                    <div className="h-3 bg-white/10 rounded w-20"></div>
                    <div className="h-3 bg-white/10 rounded w-20"></div>
                  </div>
                </div>
              </div>
              <div className="h-5 bg-white/10 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Summary Skeleton */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 md:p-6">
        <div className="h-6 bg-white/10 rounded w-1/4 mb-4"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
            >
              <div className="h-4 bg-white/10 rounded w-32"></div>
              <div className="flex gap-4">
                <div className="h-4 bg-white/10 rounded w-20"></div>
                <div className="h-4 bg-white/10 rounded w-20"></div>
                <div className="h-4 bg-white/10 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Expense Summary Skeleton */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 md:p-6">
        <div className="h-6 bg-white/10 rounded w-1/3 mb-4"></div>
        <div className="space-y-2 max-h-96">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
            >
              <div className="flex-1">
                <div className="h-4 bg-white/10 rounded w-32 mb-2"></div>
                <div className="flex items-center gap-3">
                  <div className="h-3 bg-white/10 rounded w-24"></div>
                  <div className="h-3 bg-white/10 rounded w-24"></div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 bg-white/10 rounded-full"></div>
                <div className="h-4 bg-white/10 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportSkeleton;

