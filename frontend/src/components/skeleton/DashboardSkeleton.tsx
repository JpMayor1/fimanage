const DashboardSkeleton = () => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 md:space-y-6 animate-pulse">
      {/* Alerts Skeleton */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 md:p-6">
        <div className="h-6 bg-white/10 rounded w-1/4 mb-3"></div>
        <div className="h-4 bg-white/10 rounded w-1/2"></div>
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 shadow-md"
          >
            <div className="h-4 bg-white/10 rounded w-1/3 mb-3"></div>
            <div className="h-8 bg-white/10 rounded w-2/3"></div>
          </div>
        ))}
      </div>

      {/* Calendar Skeleton */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 md:p-6">
        <div className="h-6 bg-white/10 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-7 gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-16 bg-white/10 rounded"></div>
          ))}
        </div>
      </div>

      {/* Charts Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Transaction Type Chart Skeleton */}
        <div className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 md:p-6">
          <div className="h-6 bg-white/10 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-white/10 rounded"></div>
        </div>

        {/* Top Sources Skeleton */}
        <div className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 md:p-6">
          <div className="h-6 bg-white/10 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-8 w-8 bg-white/10 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-white/10 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-white/10 rounded w-1/3"></div>
                  </div>
                </div>
                <div className="h-6 bg-white/10 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions Skeleton */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 md:p-6">
        <div className="h-6 bg-white/10 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg bg-white/5"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="h-8 w-8 bg-white/10 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-white/10 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-white/10 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-5 bg-white/10 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;

