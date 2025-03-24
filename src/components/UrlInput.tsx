import React, { useState, useEffect } from "react"
import { Link, AlertCircle, Loader2, Link2Off, FileText } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dialog,
} from "@/components/ui/dialog"

interface UrlInputProps {
  onUrlSubmit: (url: string) => void
  initialUrl?: string
}

const UrlInput: React.FC<UrlInputProps> = ({
  onUrlSubmit,
  initialUrl = "",
}) => {
  const [url, setUrl] = useState(initialUrl)
  const [error, setError] = useState<string | null>(null)
  const [isValid, setIsValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLinkedIn, setIsLinkedIn] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showTextDialog, setShowTextDialog] = useState(false)
  const [jobText, setJobText] = useState("")
  const [showJobText, setShowJobText] = useState(false)
  const [showInputTypeWarning, setShowInputTypeWarning] = useState(false)
  const [inputTypeToSwitch, setInputTypeToSwitch] = useState<
    "url" | "text" | null
  >(null)

  // Initialize with initial URL if provided
  useEffect(() => {
    if (initialUrl) {
      setUrl(initialUrl)
      validateUrl(initialUrl)
      setIsSubmitted(true)

      // Check if it's a data URL (text input)
      if (initialUrl.startsWith("data:text/plain;base64,")) {
        try {
          const textContent = atob(initialUrl.split(",")[1])
          setJobText(textContent)
          setShowJobText(true)
        } catch (e) {
          console.error("Failed to decode base64 URL")
        }
      } else {
        setShowJobText(false)
      }
    }
  }, [initialUrl])

  const validateUrl = (input: string) => {
    setError(null)
    setIsLinkedIn(false)

    if (!input.trim()) {
      setIsValid(false)
      return
    }

    try {
      // Basic URL validation
      const urlObj = new URL(input)
      if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
        setError("URL must start with http:// or https://")
        setIsValid(false)
        return
      }

      // Check if it's a LinkedIn job posting
      if (
        urlObj.hostname.includes("linkedin.com") &&
        urlObj.pathname.includes("/jobs/")
      ) {
        setIsLinkedIn(true)
        setError(
          "LinkedIn job postings cannot be scraped due to their terms of service"
        )
        setIsValid(false)
        return
      }

      setIsValid(true)
    } catch (e) {
      setError("Please enter a valid URL")
      setIsValid(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setUrl(input)
    validateUrl(input)
    setIsSubmitted(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // If there's job text present and user is trying to submit a URL, show warning
    if (showJobText && url.trim() && isValid) {
      setInputTypeToSwitch("url")
      setShowInputTypeWarning(true)
      return
    }

    if (isValid) {
      setIsLoading(true)

      try {
        // Simulate a network request
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Randomly simulate an error for demonstration
        const cannotScrape = Math.random() < 0.3

        if (cannotScrape) {
          setError(
            "This URL cannot be scraped. The website might be blocking our system."
          )
          setIsLoading(false)
          return
        }

        onUrlSubmit(url)
        setIsSubmitted(true)
        setShowJobText(false)
        setJobText("")
      } catch (err) {
        setError("Failed to process the URL. Please try again.")
      } finally {
        setIsLoading(false)
      }
    } else if (!url.trim()) {
      setError("Please enter a URL")
    }
  }

  const handleTextSubmit = () => {
    if (jobText.trim()) {
      // Create a mock URL with the text content encoded
      const mockUrl = `data:text/plain;base64,${btoa(jobText)}`
      setUrl("")
      setIsValid(false)
      setIsSubmitted(false)
      setShowJobText(true)
      setShowTextDialog(false)
      onUrlSubmit(mockUrl)
    }
  }

  const handleShowTextDialog = () => {
    if ((isValid && url.trim()) || isSubmitted) {
      setInputTypeToSwitch("text")
      setShowInputTypeWarning(true)
    } else {
      setShowTextDialog(true)
    }
  }

  const handleEditJobText = () => {
    setShowTextDialog(true)
  }

  const handleConfirmTypeSwitch = () => {
    setShowInputTypeWarning(false)
    if (inputTypeToSwitch === "url") {
      setShowJobText(false)
      setJobText("")
      // After clearing job text, validate and submit the URL
      if (isValid && url.trim()) {
        // Simulate submitting the form
        handleSubmit(new Event("submit") as unknown as React.FormEvent)
      }
    } else if (inputTypeToSwitch === "text") {
      setUrl("")
      setIsValid(false)
      setIsSubmitted(false)
      setShowTextDialog(true)
    }
  }

  const handleCancelTypeSwitch = () => {
    setShowInputTypeWarning(false)
    setInputTypeToSwitch(null)
  }

  return (
    <div className="w-full mb-6 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Link className="h-4 w-4" />
          </div>
          <Input
            type="text"
            placeholder="Enter job posting URL"
            value={url}
            onChange={handleInputChange}
            className={cn(
              "pl-10 transition-all duration-300",
              isValid && "border-green-500",
              error && "border-destructive",
              isSubmitted && isValid && "bg-green-50"
            )}
            disabled={isLoading}
          />
        </div>

        {error && !showJobText && (
          <Alert variant="destructive" className="py-2">
            <div className="flex items-center gap-2">
              {isLinkedIn ? (
                <Link2Off className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </div>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button
            type="submit"
            className="flex-1 transition-all duration-300 gap-2"
            disabled={!isValid || isLoading || isSubmitted}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analyzing URL...</span>
              </>
            ) : isSubmitted ? (
              "URL Submitted"
            ) : (
              "Submit URL"
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleShowTextDialog}
            className="transition-all duration-300 gap-2"
            disabled={
              isLoading || (isValid && url.trim().length > 0 && !isSubmitted)
            }
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Enter</span> Job Text
          </Button>
        </div>
      </form>

      {/* Display job text when available */}
      {showJobText && (
        <div className="mt-3 bg-muted/30 rounded-lg border p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="font-medium">Job Description Text:</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEditJobText}
              className="h-7 px-2"
            >
              Edit
            </Button>
          </div>
          <div className="max-h-[150px] overflow-y-auto text-sm whitespace-pre-line">
            {jobText}
          </div>
        </div>
      )}

      {/* Dialog for entering job description text */}
      <Dialog open={showTextDialog} onOpenChange={setShowTextDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter Job Description</DialogTitle>
            <DialogDescription>
              Paste or type the job description if you can't provide a URL or if
              the URL can't be scraped.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            placeholder="Job Title: [Position]
Company: [Company Name]
Location: [Location]

About the Role:
[Job description details]

Requirements:
- Requirement 1
- Requirement 2

Responsibilities:
- Responsibility 1
- Responsibility 2"
            className="min-h-[200px]"
          />
          <DialogFooter>
            <Button type="submit" onClick={handleTextSubmit}>
              Submit Job Description
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Warning dialog for switching input types */}
      <Dialog
        open={showInputTypeWarning}
        onOpenChange={setShowInputTypeWarning}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-5 w-5" />
              Change Input Type
            </DialogTitle>
            <DialogDescription>
              You can only have one type of job input at a time. Switching will
              remove your current{" "}
              {inputTypeToSwitch === "url" ? "text input" : "URL"}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelTypeSwitch}
              className="gap-2"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={handleConfirmTypeSwitch}
              className="gap-2"
            >
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UrlInput
