import { useState } from "react";

interface AdPlaceholderProps {
  position: 'top' | 'sidebar' | 'inline';
  className?: string;
}

const AdPlaceholder = ({ position, className = "" }: AdPlaceholderProps) => {
  const [isEnabled] = useState(true); // Connect to admin settings later

  if (!isEnabled) return null;

  const sizeClasses = {
    top: "h-24 w-full",
    sidebar: "h-64 w-full",
    inline: "h-32 w-full"
  };

  return (
    <div className={`${sizeClasses[position]} ${className} bg-muted/30 border border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center`}>
      <div className="text-center text-muted-foreground text-sm">
        <p className="font-semibold">{position.toUpperCase()} AD SPACE</p>
        <p className="text-xs mt-1">Connect your AdSense code</p>
      </div>
    </div>
  );
};

export default AdPlaceholder;
