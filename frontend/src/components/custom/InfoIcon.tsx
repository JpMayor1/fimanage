import { useState, useRef, useEffect } from "react";
import { FiHelpCircle } from "react-icons/fi";

interface InfoIconProps {
  info: string;
}

const InfoIcon = ({ info }: InfoIconProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        iconRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !iconRef.current.contains(event.target as Node)
      ) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTooltip]);

  return (
    <div className="relative inline-flex items-center">
      <button
        ref={iconRef}
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowTooltip(!showTooltip);
        }}
        className="text-white/50 hover:text-yellow transition-colors cursor-pointer ml-1"
        aria-label="Show information"
      >
        <FiHelpCircle className="text-xs" />
      </button>
      {showTooltip && (
        <div
          ref={tooltipRef}
          className="absolute left-0 top-6 z-50 w-64 p-3 bg-zinc-800 border border-white/20 rounded-lg shadow-xl text-white text-xs leading-relaxed"
          onClick={(e) => e.stopPropagation()}
        >
          {info}
          <div className="absolute -top-1 left-2 w-2 h-2 bg-zinc-800 border-l border-t border-white/20 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default InfoIcon;

