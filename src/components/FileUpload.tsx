import { AlertCircle, Upload, FileText, Trash2 } from "lucide-react"
import React, { useRef } from "react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileDropZone } from "@/components/FileDropZone"
import { FilePreview } from "@/components/FilePreview"
import { FileUploadProps } from "@/types/fileUpload"
import { Button } from "@/components/ui/button"
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
import { useFileUploadManager, useResumeTextManager } from "@/hooks"
import { useFileUploadMutation } from "@/hooks/useFileUploadMutation"

// Extend the FileUploadProps interface with a patched onFileSelected
// This is needed because the original type does not handle null values
interface ExtendedFileUploadProps
  extends Omit<FileUploadProps, "onFileSelected"> {
  onFileSelected: (file: File | null) => void
}

// Component for displaying resume text with edit/remove controls
const ResumeTextPreview = ({
  text,
  onEdit,
  onRemove,
  disabled,
}: {
  text: string
  onEdit: () => void
  onRemove: () => void
  disabled: boolean
}) => (
  <div className="mt-3 bg-muted/30 rounded-lg border p-3">
    <div className="flex items-center justify-between mb-2">
      <p className="font-medium">Resume Text:</p>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          disabled={disabled}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Remove
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="h-7 px-2"
          disabled={disabled}
        >
          Edit
        </Button>
      </div>
    </div>
    <div className="max-h-[150px] overflow-y-auto text-sm">
      <MarkdownPreview content={text} />
    </div>
  </div>
)

// Component for upload controls (add files, text entry, upload buttons)
const UploadControls = ({
  files,
  showResumeText,
  isUploading,
  canAddMoreFiles,
  onFileSelect,
  onTextInput,
  onUpload,
}: {
  files: File[]
  showResumeText: boolean
  isUploading: boolean
  canAddMoreFiles: boolean
  onFileSelect: () => void
  onTextInput: () => void
  onUpload: () => void
}) => (
  <div className="flex justify-end mt-4">
    {!showResumeText && canAddMoreFiles && (
      <Button
        variant="outline"
        onClick={onFileSelect}
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
        onClick={onTextInput}
        disabled={isUploading}
        className="flex items-center gap-2 mr-2"
      >
        <FileText className="h-4 w-4" />
        Enter Resume Text
      </Button>
    )}
    {(!showResumeText && files.length > 0) || showResumeText ? (
      <Button
        onClick={onUpload}
        disabled={isUploading}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        {showResumeText
          ? "Upload Resume Text"
          : `Upload ${files.length > 1 ? `(${files.length} files)` : ""}`}
      </Button>
    ) : null}
  </div>
)

// Error display component
const ErrorDisplay = ({ error }: { error: string | null }) => {
  if (!error) return null

  return (
    <Alert variant="destructive" className="py-2 mt-2">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-sm">{error}</AlertDescription>
      </div>
    </Alert>
  )
}

// Progress indicator component
const UploadProgress = ({ progress }: { progress: number }) => (
  <div className="mt-4">
    <div className="flex justify-between mb-2 text-sm">
      <span>Uploading...</span>
      <span>{progress}%</span>
    </div>
    <Progress value={progress} />
  </div>
)

// Confirmation dialog for removing resume text
const RemoveConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}) => (
  <AlertDialog open={isOpen} onOpenChange={onClose}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Remove Resume Text</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to remove your resume text? This action cannot
          be undone and all text will be lost.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          Remove
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)

const FileUpload: React.FC<ExtendedFileUploadProps> = ({
  onFileSelected,
  acceptedFileTypes = ".pdf,.png,.jpg,.jpeg,.webp",
  maxSizeMB = 3,
  initialFile = null,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Custom hook for file management
  const {
    files,
    isDragging,
    validationError,
    handleFileSelect,
    handleFileDrop,
    handleFilesChange,
    handleRemoveFile,
    canAddMoreFiles,
    setIsDragging,
  } = useFileUploadManager({
    fileInputRef,
    onFileSelected,
    initialFile,
  })

  // Custom hook for resume text management
  const {
    resumeText,
    showResumeText,
    showTextDialog,
    showRemoveConfirmDialog,
    handleTextInput,
    handleTextSubmit,
    handleEditResumeText,
    handleRemoveResumeText,
    confirmRemoveResumeText,
    setShowTextDialog,
    setShowRemoveConfirmDialog,
  } = useResumeTextManager({
    files,
    onFileSelected,
  })

  // Get upload functionality from a separate hook to avoid calling useFileUploadManager twice
  const { isUploading, uploadError, uploadProgress, upload } =
    useFileUploadMutation()

  // Create a handleUpload function that combines the upload logic
  const handleUpload = async () => {
    try {
      if (files.length > 0) {
        await upload(files)
        // Handle successful upload, possibly clear files or show success
      } else if (showResumeText && resumeText) {
        // Create a text blob
        const textBlob = new Blob([resumeText], { type: "text/plain" })
        const textFile = new File([textBlob], "resume.txt", {
          type: "text/plain",
        })

        // Upload the text file using the same upload function as other files
        await upload([textFile])
      }
    } catch (error) {
      // Just log the error here - the error will be handled by the useFileUploadMutation hook
      console.error("Upload failed:", error)
      // We don't need to do anything else here as the uploadError state from the hook
      // will be updated automatically and displayed via ErrorDisplay
    }
  }

  // Determine the error to show (validation or upload)
  const displayError = validationError || uploadError

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
            <ResumeTextPreview
              text={resumeText}
              onEdit={handleEditResumeText}
              onRemove={handleRemoveResumeText}
              disabled={isUploading}
            />
          )}

          {/* Display error right underneath the last file */}
          {displayError && <ErrorDisplay error={displayError} />}

          {isUploading && <UploadProgress progress={uploadProgress} />}

          <UploadControls
            files={files}
            showResumeText={showResumeText}
            isUploading={isUploading}
            canAddMoreFiles={canAddMoreFiles()}
            onFileSelect={handleFileSelect}
            onTextInput={handleTextInput}
            onUpload={handleUpload}
          />
        </div>
      )}

      {/* Show error in drop zone case too but keep it more generic */}
      {files.length === 0 && !showResumeText && displayError && (
        <ErrorDisplay error={displayError} />
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

      <RemoveConfirmDialog
        isOpen={showRemoveConfirmDialog}
        onClose={() => setShowRemoveConfirmDialog(false)}
        onConfirm={confirmRemoveResumeText}
      />
    </div>
  )
}

export default FileUpload
