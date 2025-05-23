"use client"

import { useState } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Calendar } from "lucide-react"

interface BookShowingButtonProps extends ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "text"
  size?: "default" | "sm" | "lg" | "icon" | "xl"
  showIcon?: boolean
  fullWidth?: boolean
}

export default function BookShowingButton({
  variant = "primary",
  size = "default",
  showIcon = true,
  fullWidth = false,
  className,
  ...props
}: BookShowingButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)

    // This is where you would add the actual booking functionality
    // For now, we'll just simulate a delay
    setTimeout(() => {
      setIsLoading(false)
      // You could add navigation, modal opening, etc. here
    }, 500)
  }

  // Define variant styles
  const variantStyles = {
    primary: "bg-[#4AAEBB] hover:bg-[#3a9aa7] text-white",
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
  const buttonStyles = `
    ${variantStyles[variant]} 
    ${size !== "text" ? sizeStyles[size] : ""} 
    ${fullWidth ? "w-full" : ""} 
    rounded-full font-manrope tracking-tight flex items-center justify-center
    ${className || ""}
  `

  return (
    <Button className={buttonStyles} onClick={handleClick} disabled={isLoading} {...props}>
      {isLoading ? (
        <span className="animate-spin mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </span>
      ) : (
        showIcon && <Calendar className="h-5 w-5 mr-2" />
      )}
      {props.children || "Book a Showing"}
    </Button>
  )
}
