import { Upload, AlertCircle, Loader2, FileText, FileIcon } from "lucide-react"
import React, { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dialog,
} from "@/components/ui/dialog"

interface FileUploadProps {
  onFileSelected: (file: File) => void
  acceptedFileTypes?: string
  maxSizeMB?: number
  initialFile?: File | null
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelected,
  acceptedFileTypes = ".pdf,.png,.jpg,.jpeg,.webp",
  maxSizeMB = 3,
  initialFile = null,
}) => {
  const [showInputTypeWarning, setShowInputTypeWarning] = useState(false)
  const [inputTypeToSwitch, setInputTypeToSwitch] = useState<
    "file" | "text" | null
  >(null)
  const [showTextDialog, setShowTextDialog] = useState(false)
  const [file, setFile] = useState<File | null>(initialFile)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [showCvText, setShowCvText] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [cvText, setCvText] = useState("")

  useEffect(() => {
    if (initialFile) {
      setFile(initialFile)
      setShowCvText(false)
    }
  }, [initialFile])

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (showCvText) {
        setInputTypeToSwitch("file")
        setShowInputTypeWarning(true)
      } else {
        validateAndProcessFile(e.dataTransfer.files[0])
      }
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (showCvText) {
        setInputTypeToSwitch("file")
        setShowInputTypeWarning(true)
      } else {
        validateAndProcessFile(e.target.files[0])
      }
    }
  }

  const simulateUpload = async () => {
    setIsUploading(true)
    setUploadProgress(0)

    for (let i = 0; i <= 100; i += 5) {
      setUploadProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    setIsUploading(false)
  }

  const validateAndProcessFile = async (file: File) => {
    setError(null)

    // Convert acceptedFileTypes to array and remove dots
    const acceptedTypes = acceptedFileTypes
      .split(",")
      .map((type) => type.trim().replace(".", ""))

    // Check file extension
    const fileExtension = file.name.split(".").pop()?.toLowerCase()
    if (!fileExtension || !acceptedTypes.includes(fileExtension)) {
      setError(
        `Please upload a file with one of these formats: ${acceptedFileTypes}`
      )
      return
    }

    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSizeMB) {
      setError(`File size should not exceed ${maxSizeMB}MB`)
      return
    }

    setFile(file)
    setCvText("")
    setShowCvText(false)
    await simulateUpload()
    onFileSelected(file)
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (showCvText) {
      setInputTypeToSwitch("file")
      setShowInputTypeWarning(true)
      return
    }

    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleAreaClick = () => {
    if (!file && !isUploading && !showCvText && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleTextSubmit = () => {
    if (cvText.trim()) {
      setShowTextDialog(false)
      setShowCvText(true)
      setFile(null)

      const blob = new Blob([cvText], { type: "text/plain" })
      const textFile = new File([blob], "cv-text.txt", { type: "text/plain" })

      onFileSelected(textFile)
    }
  }

  const handleShowTextDialog = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (file) {
      setInputTypeToSwitch("text")
      setShowInputTypeWarning(true)
    } else {
      setShowTextDialog(true)
    }
  }

  const handleChangeText = () => {
    setShowTextDialog(true)
  }

  const handleConfirmTypeSwitch = () => {
    setShowInputTypeWarning(false)
    if (inputTypeToSwitch === "file" && fileInputRef.current) {
      fileInputRef.current.click()
    } else if (inputTypeToSwitch === "text") {
      setFile(null)
      setShowTextDialog(true)
    }
  }

  const handleCancelTypeSwitch = () => {
    setShowInputTypeWarning(false)
    setInputTypeToSwitch(null)
    if (inputTypeToSwitch === "file" && fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="w-full mb-6 animate-fade-in">
      <div
        className={cn(
          "file-drop-area border-2 border-dashed rounded-lg p-6 transition-all duration-300 cursor-pointer bg-card/50 hover:bg-card/80",
          isDragging && "border-primary bg-primary/5",
          file && !isUploading && "bg-secondary/50",
          isUploading && "bg-primary/5 border-primary",
          showCvText && "bg-secondary/30"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleAreaClick}
      >
        <input
          type="file"
          className="sr-only"
          ref={fileInputRef}
          accept={acceptedFileTypes}
          onChange={handleFileInputChange}
          disabled={isUploading}
        />

        <div className="flex flex-col items-center justify-center text-center">
          {isUploading ? (
            <div className="w-full py-2 space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium">Uploading your resume</p>
                <Progress value={uploadProgress} className="w-full h-2" />
                <p className="text-sm text-muted-foreground">
                  {uploadProgress}% complete
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <p className="text-lg font-medium mb-1">Upload your resume</p>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop your file here or click to browse
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleButtonClick}
                  className="transition-all duration-300 hover:bg-primary/10"
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Select File
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShowTextDialog}
                  className="transition-all duration-300 hover:bg-primary/10"
                  disabled={isUploading}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Enter Resume Text
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Accepted formats: {acceptedFileTypes.replace(/\./g, " ")} (max{" "}
                {maxSizeMB}MB) or text input
              </p>
            </>
          )}

          {file && !isUploading && (
            <div className="w-full py-2">
              <div className="flex items-center justify-between bg-background rounded-lg p-3 border">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <FileIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium truncate max-w-[200px]">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleButtonClick}
                  className="text-xs"
                  disabled={isUploading}
                >
                  Change
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCvText && (
        <div className="mt-3 bg-background rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-medium text-lg">Resume Text:</p>
            <Button variant="ghost" size="sm" onClick={handleChangeText}>
              Edit
            </Button>
          </div>
          <div className="max-h-[150px] overflow-y-auto whitespace-pre-line text-left">
            {cvText}
          </div>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="py-2 mt-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </div>
        </Alert>
      )}

      <Dialog open={showTextDialog} onOpenChange={setShowTextDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter your resume text</DialogTitle>
            <DialogDescription>
              Paste or type your resume content here. Include sections like
              experience, skills, education, etc.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            placeholder="Experience:
- Position at Company (Date - Date)
- Responsibilities and achievements

Skills:
- Skill 1
- Skill 2

Education:
- Degree, Institution (Year)"
            className="min-h-[200px]"
          />
          <DialogFooter>
            <Button type="submit" onClick={handleTextSubmit}>
              Submit Resume Text
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              You can only have one type of resume input at a time. Switching
              will remove your current{" "}
              {inputTypeToSwitch === "file" ? "text input" : "file"}.
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

export default FileUpload
