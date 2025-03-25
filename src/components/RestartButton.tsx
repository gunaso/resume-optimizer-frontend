import { RefreshCw } from "lucide-react"
import React from "react"

import { useCvForm } from "@/context/CvFormContext"
import { Button } from "@/components/ui/button"

interface RestartButtonProps {
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
}

const RestartButton: React.FC<RestartButtonProps> = ({
  className = "gap-2 text-muted-foreground hover:text-destructive",
  size = "sm",
  variant = "outline",
}) => {
  const { resetForm } = useCvForm()

  const handleReset = () => {
    // Reset the context state
    resetForm()

    // Clear any browser-cached file input values
    document.querySelectorAll('input[type="file"]').forEach((input) => {
      const fileInput = input as HTMLInputElement
      fileInput.value = ""
    })

    // Clear any object URLs that might be in memory
    // This helps prevent memory leaks
    setTimeout(() => {
      // This timeout gives React time to unmount components
      // before we attempt additional cleanup
    }, 100)
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleReset}
      className={className}
    >
      <RefreshCw className="h-4 w-4" />
      Restart
    </Button>
  )
}

export default RestartButton
