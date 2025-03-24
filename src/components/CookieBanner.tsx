import { useState, useEffect } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAcceptedCookies = localStorage.getItem("cookiesAccepted")
    if (!hasAcceptedCookies) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true")
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t shadow-lg transition-transform duration-300 ease-in-out",
        isVisible ? "transform translate-y-0" : "transform translate-y-full"
      )}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">
            We use cookies to improve your experience on our site. By continuing
            to use our site, you consent to our use of cookies in accordance
            with our Cookie Policy.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8"
            onClick={() => setIsVisible(false)}
          >
            Decline
          </Button>
          <Button size="sm" className="text-xs h-8" onClick={acceptCookies}>
            Accept Cookies
          </Button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-full text-muted-foreground hover:bg-muted transition-colors"
            aria-label="Close cookie banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CookieBanner
