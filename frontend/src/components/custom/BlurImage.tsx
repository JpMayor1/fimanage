import React, { useState } from "react";

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

const BlurImage: React.FC<BlurImageProps> = ({ className = "", ...props }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative">
      <img
        {...props}
        className={`transition-all duration-500 ease-out ${
          loaded ? "blur-0" : "blur-md brightness-95"
        } ${className}`}
        onLoad={() => setLoaded(true)}
        draggable={props.draggable ?? false}
      />
    </div>
  );
};

export default BlurImage;
