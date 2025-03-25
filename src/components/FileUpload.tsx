import { AlertCircle, Upload, FileText, Trash2 } from "lucide-react"
import React, { useRef, useState } from "react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileDropZone } from "@/components/FileDropZone"
import { FilePreview } from "@/components/FilePreview"
import { FileUploadProps } from "@/types/fileUpload"
import { Button } from "@/components/ui/button"
import { useFileUploadMutation } from "@/hooks/useFileUploadMutation"
import { Progress } from "@/components/ui/progress"
import { TextInputDialog } from "@/components/TextInputDialog"
import { MarkdownPreview } from "@/components/MarkdownPreview"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelected,
  acceptedFileTypes = ".pdf,.png,.jpg,.jpeg,.webp",
  maxSizeMB = 3,
  initialFile = null,
}) => {
  const [files, setFiles] = useState<File[]>(initialFile ? [initialFile] : [])
  const [isDragging, setIsDragging] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [showTextDialog, setShowTextDialog] = useState(false)
  const [resumeText, setResumeText] = useState("")
  const [showResumeText, setShowResumeText] = useState(false)
  const [showRemoveConfirmDialog, setShowRemoveConfirmDialog] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    isUploading,
    uploadError,
    uploadProgress,
    upload,
    validateFiles,
    resetError,
  } = useFileUploadMutation()

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      // Reset the file input value before opening the file dialog
      // This allows re-selection of previously selected files
      fileInputRef.current.value = ""
      fileInputRef.current.click()
    }
  }

  const handleFilesChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFiles = Array.from(event.target.files)
      handleFileDrop(selectedFiles)
    }
  }

  const handleFileDrop = async (droppedFiles: File[]) => {
    resetError()
    setValidationError(null)

    // Combine existing files with new ones for validation
    const allFiles = [...files, ...droppedFiles]

    // Find unique files by name to avoid duplicates
    const uniqueFiles = allFiles.reduce((acc: File[], current) => {
      const isDuplicate = acc.some((file) => file.name === current.name)
      if (!isDuplicate) {
        acc.push(current)
      }
      return acc
    }, [])

    // Validate all files together
    const validation = await validateFiles(uniqueFiles)
    if (!validation.isValid) {
      // Show validation error but don't update files
      setValidationError(validation.error)
      return
    }

    // Update state with combined validated files
    setFiles(uniqueFiles)

    // Notify parent component if needed - only notify about the first file
    // This is keeping the existing behavior
    if (files.length === 0 && droppedFiles.length === 1) {
      onFileSelected(droppedFiles[0])
    }
  }

  const handleRemoveFile = (index: number) => {
    // Update state by filtering out the removed file
    setFiles((currentFiles) => {
      const updatedFiles = currentFiles.filter((_, i) => i !== index)

      // Reset file input to allow re-selecting the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      // If we're removing the last file, also notify parent component
      if (updatedFiles.length === 0) {
        // Notify parent that no file is selected
        // This is assuming the parent can handle a null value
        onFileSelected(null as any)
      }

      return updatedFiles
    })
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    try {
      await upload(files)
      // Handle successful upload, possibly clear files or show success
    } catch (error) {
      // Error is already handled by the hook
    }
  }

  const handleRemoveResumeText = () => {
    setShowRemoveConfirmDialog(true)
  }

  const confirmRemoveResumeText = () => {
    setResumeText("")
    setShowResumeText(false)
    setShowRemoveConfirmDialog(false)
    onFileSelected(null as any)
  }

  const handleTextInput = () => {
    if (files.length > 0) {
      // If there are files, we should warn the user that entering text will replace them
      // This would require an additional warning dialog component
      // For now, let's just remove the files and open the dialog
      setFiles([])
      onFileSelected(null as any)
    }

    setShowTextDialog(true)
  }

  const handleTextSubmit = (text: string) => {
    setResumeText(text)
    setShowResumeText(true)
    setShowTextDialog(false)

    // Create a text blob to mimic a file
    const textBlob = new Blob([text], { type: "text/plain" })
    const textFile = new File([textBlob], "resume.txt", { type: "text/plain" })

    // Notify parent component
    onFileSelected(textFile)
  }

  const handleEditResumeText = () => {
    setShowTextDialog(true)
  }

  // Check if we can add more files (less than 3 images and no PDFs)
  const canAddMoreFiles = () => {
    const hasPdf = files.some((file) => file.type === "application/pdf")
    const isImageOnly = files.every((file) => file.type.startsWith("image/"))

    // Can add more if there are no files, or if there are only images (< 3) and no PDFs
    return files.length === 0 || (isImageOnly && files.length < 3 && !hasPdf)
  }

  return (
    <div className="w-full mb-6 animate-fade-in">
      <input
        type="file"
        className="sr-only"
        ref={fileInputRef}
        accept={acceptedFileTypes}
        onChange={handleFilesChange}
        multiple
        disabled={isUploading}
      />

      {files.length === 0 && !showResumeText ? (
        <FileDropZone
          onDrop={handleFileDrop}
          isDragging={isDragging}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          acceptedFileTypes={acceptedFileTypes}
          maxSizeMB={maxSizeMB}
          onFileSelect={handleFileSelect}
          onTextInput={handleTextInput}
          disabled={isUploading}
          setIsDragging={setIsDragging}
        />
      ) : (
        <div className="mt-4 space-y-4">
          {files.map((file, index) => (
            <FilePreview
              key={`${file.name}-${index}`}
              file={file}
              onRemove={() => handleRemoveFile(index)}
              disabled={isUploading}
            />
          ))}

          {showResumeText && (
            <div className="mt-3 bg-muted/30 rounded-lg border p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">Resume Text:</p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveResumeText}
                    className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEditResumeText}
                    className="h-7 px-2"
                  >
                    Edit
                  </Button>
                </div>
              </div>
              <div className="max-h-[150px] overflow-y-auto text-sm">
                <MarkdownPreview content={resumeText} />
              </div>
            </div>
          )}

          {isUploading && (
            <div className="mt-4">
              <div className="flex justify-between mb-2 text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          <div className="flex justify-end mt-4">
            {!showResumeText && canAddMoreFiles() && (
              <Button
                variant="outline"
                onClick={handleFileSelect}
                disabled={isUploading}
                className="flex items-center gap-2 mr-auto"
              >
                <Upload className="h-4 w-4" />
                Add More Files
              </Button>
            )}
            {!showResumeText && files.length === 0 && (
              <Button
                variant="outline"
                onClick={handleTextInput}
                disabled={isUploading}
                className="flex items-center gap-2 mr-2"
              >
                <FileText className="h-4 w-4" />
                Enter Resume Text
              </Button>
            )}
            {!showResumeText && files.length > 0 && (
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload {files.length > 1 ? `(${files.length} files)` : ""}
              </Button>
            )}
          </div>
        </div>
      )}

      {(uploadError || validationError) && (
        <Alert variant="destructive" className="py-2 mt-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {validationError || uploadError}
            </AlertDescription>
          </div>
        </Alert>
      )}

      <TextInputDialog
        isOpen={showTextDialog}
        onClose={() => setShowTextDialog(false)}
        onSubmit={handleTextSubmit}
        initialText={resumeText}
        title="Enter Resume Text"
        description="Paste or type your resume content here. Include sections like experience, skills, education, etc."
        placeholder="Experience:
- Position at Company (Date - Date)
- Responsibilities and achievements

Skills:
- Skill 1
- Skill 2

Education:
- Degree, Institution (Year)"
        submitButtonText="Submit Resume Text"
      />

      <AlertDialog
        open={showRemoveConfirmDialog}
        onOpenChange={setShowRemoveConfirmDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Resume Text</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove your resume text? This action
              cannot be undone and all text will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoveResumeText}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default FileUpload
