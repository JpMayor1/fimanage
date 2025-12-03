const TransactionSkeleton = () => {
  return (
    <div className="p-1 md:p-2 space-y-2 md:space-y-3 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="w-full rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-3 md:p-4"
        >
          {/* Top Section: Type Badge and Action Buttons */}
          <div className="flex justify-between items-start mb-2 gap-3">
            <div className="h-6 w-24 bg-white/10 rounded-full"></div>
            <div className="flex gap-2">
              <div className="h-7 w-16 bg-white/10 rounded-full"></div>
              <div className="h-7 w-16 bg-white/10 rounded-full"></div>
            </div>
          </div>

          {/* Note (sometimes present) */}
          {i % 2 === 0 && (
            <div className="h-3 bg-white/10 rounded w-2/3 mb-2"></div>
          )}

          {/* Date and Amount */}
          <div className="flex items-center justify-between gap-2">
            <div className="h-3 bg-white/10 rounded w-32"></div>
            <div className="h-7 w-28 bg-white/10 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionSkeleton;

