import React from "react"
import { Upload, Loader2, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FileDropZoneProps } from "@/types/fileUpload"

export const FileDropZone: React.FC<FileDropZoneProps> = ({
  onDrop,
  isDragging,
  isUploading,
  uploadProgress,
  acceptedFileTypes,
  maxSizeMB,
  onFileSelect,
  onTextInput,
  disabled = false,
  setIsDragging,
}) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging?.(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging?.(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging?.(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Convert FileList to array and pass all files
      const filesArray = Array.from(e.dataTransfer.files)
      onDrop(filesArray)
    }
  }

  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    callback: () => void
  ) => {
    e.stopPropagation()
    callback()
  }

  return (
    <div
      data-testid="file-drop-zone"
      className={cn(
        "file-drop-area border-2 border-dashed rounded-lg p-6 transition-all duration-300 cursor-pointer bg-card/50 hover:bg-card/80",
        isDragging && "border-primary bg-primary/5",
        isUploading && "bg-primary/5 border-primary"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={onFileSelect}
    >
      <div className="flex flex-col items-center justify-center text-center">
        {isUploading ? (
          <div className="w-full py-2 space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium">Processing your resume</p>
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
              Drag and drop your file(s) here or click to browse
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={(e) => handleButtonClick(e, onFileSelect)}
                className="transition-all duration-300 hover:bg-primary/10"
                disabled={disabled}
              >
                <Upload className="h-4 w-4 mr-2" />
                Select Files
              </Button>
              <Button
                variant="outline"
                onClick={(e) => handleButtonClick(e, onTextInput)}
                className="transition-all duration-300 hover:bg-primary/10"
                disabled={disabled}
              >
                <FileText className="h-4 w-4 mr-2" />
                Enter Resume Text
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Upload up to 3 images or 1 PDF (max 3 pages). Accepted formats:{" "}
              {acceptedFileTypes.replace(/\./g, " ")} (max {maxSizeMB}MB).
            </p>
          </>
        )}
      </div>
    </div>
  )
}
