const DeptSkeleton = () => {
  return (
    <div className="p-1 md:p-2 space-y-2 md:space-y-3 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="w-full rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-3 md:p-4"
        >
          {/* Top Section: Lender, Status and Action Buttons */}
          <div className="flex justify-between items-start mb-2 gap-3">
            <div className="h-4 bg-white/10 rounded w-1/3 flex-1"></div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-16 bg-white/10 rounded-full"></div>
              <div className="h-7 w-16 bg-white/10 rounded-full"></div>
              <div className="h-7 w-16 bg-white/10 rounded-full"></div>
            </div>
          </div>

          {/* Note and Due Date */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="h-3 bg-white/10 rounded w-1/2"></div>
            <div className="h-3 bg-white/10 rounded w-24"></div>
          </div>

          {/* Amount • Remaining • Interest */}
          <div className="flex items-center justify-between gap-2 md:gap-3 flex-wrap">
            <div className="h-6 bg-white/10 rounded-full w-24"></div>
            <div className="h-6 bg-white/10 rounded-full w-24"></div>
            <div className="h-6 bg-white/10 rounded-full w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeptSkeleton;

