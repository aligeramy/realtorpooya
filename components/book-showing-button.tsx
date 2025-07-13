"use client"

import * as React from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Calendar as CalendarIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface BookShowingButtonProps extends Omit<ButtonProps, "variant" | "size"> {
  variant?: "primary" | "secondary" | "outline" | "text"
  size?: "default" | "sm" | "lg" | "icon" | "xl"
  showIcon?: boolean
  fullWidth?: boolean
  className?: string
  propertyId?: string
}

export default function BookShowingButton({
  variant = "primary",
  size = "default",
  showIcon = true,
  fullWidth = false,
  className,
  propertyId,
  ...props
}: BookShowingButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    const path = propertyId ? `/book-showing?propertyId=${propertyId}` : '/book-showing'
    router.push(path)
  }

  // Define variant styles
  const variantStyles = {
    primary: "bg-[#473729] hover:bg-[#3a9aa7] text-white",
    secondary: "bg-[#f3ecdf] text-[#aa9578] hover:bg-[#e9e0cc]",
    outline: "border-[#aa9578] text-[#aa9578] hover:bg-[#f3ecdf] bg-transparent",
    text: "bg-transparent hover:bg-transparent text-[#aa9578] hover:text-[#473729] p-0",
  }

  // Define size styles
  const sizeStyles = {
    default: "px-6 py-2",
    sm: "px-4 py-1 text-sm",
    lg: "px-8 py-3 text-lg",
    xl: "px-8 py-6 text-lg",
    icon: "p-2",
  }

  // Combine styles
  const buttonStyles = cn(
    variantStyles[variant],
    variant !== "text" ? sizeStyles[size] : "",
    fullWidth ? "w-full" : "",
    "rounded-full font-manrope tracking-tight flex items-center justify-center",
    className
  )

  return (
    <Button className={buttonStyles} onClick={handleClick} {...props}>
      {showIcon && <CalendarIcon className="h-5 w-5 mr-2" />}
      {props.children || "Book a Showing"}
    </Button>
  )
}
