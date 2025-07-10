import Image from "next/image"

interface ResponsiveLogoProps {
  variant?: "white" | "color"
  className?: string
}

export default function ResponsiveLogo({ variant = "white", className = "" }: ResponsiveLogoProps) {
  const desktopSrc = variant === "white" ? "/images/logo.png" : "/images/logo-color.png"
  const mobileSrc = variant === "white" ? "/icon-w.png" : "/icon.png"
  
  return (
    <div className={className}>
      {/* Mobile Logo - Use icon-w.png for white, icon.png for color with max 35px height */}
      <Image
        src={mobileSrc}
        alt="Pooya Pirayesh Luxury Real Estate"
        width={50}
        height={15}
        className="h-auto max-h-[35px] w-auto md:hidden"
      />
      {/* Desktop Logo - Use white or color variant with max 35px height */}
      <Image
        src={desktopSrc}
        alt="Pooya Pirayesh Luxury Real Estate"
        width={variant === "white" ? 110 : 120}
        height={variant === "white" ? 30 : 25}
        className="h-auto max-h-[35px] w-auto hidden md:block"
      />
    </div>
  )
} 