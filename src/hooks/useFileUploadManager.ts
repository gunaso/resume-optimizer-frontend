import {
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react"
import { useFileUploadMutation } from "./useFileUploadMutation"

interface FileManagerProps {
  fileInputRef: React.RefObject<HTMLInputElement>
  onFileSelected: (file: File | null) => void
  initialFile: File | null
}

interface FileManagerResult {
  files: File[]
  isDragging: boolean
  validationError: string | null
  handleFileSelect: () => void
  handleFileDrop: (droppedFiles: File[]) => Promise<void>
  handleFilesChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>
  handleRemoveFile: (index: number) => void
  canAddMoreFiles: () => boolean
  setIsDragging: Dispatch<SetStateAction<boolean>>
}

export const useFileUploadManager = ({
  fileInputRef,
  onFileSelected,
  initialFile,
}: FileManagerProps): FileManagerResult => {
  const [files, setFiles] = useState<File[]>(initialFile ? [initialFile] : [])
  const [isDragging, setIsDragging] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [pendingFileSelection, setPendingFileSelection] = useState<
    File | null | undefined
  >(undefined)

  const { validateFiles, resetError } = useFileUploadMutation()

  // Effect function for handling file selection notifications to parent
  const notifyFileSelection = useCallback(() => {
    if (pendingFileSelection !== undefined) {
      onFileSelected(pendingFileSelection)
      setPendingFileSelection(undefined)
    }
  }, [pendingFileSelection, onFileSelected])

  // Using useEffect to properly handle pendingFileSelection changes
  useEffect(() => {
    if (pendingFileSelection !== undefined) {
      notifyFileSelection()
    }
  }, [pendingFileSelection, notifyFileSelection])

  const handleFileSelect = useCallback(() => {
    if (fileInputRef.current) {
      // Reset the file input value before opening the file dialog
      // This allows re-selection of previously selected files
      fileInputRef.current.value = ""
      fileInputRef.current.click()
    }
  }, [fileInputRef])

  const handleFileDrop = useCallback(
    async (droppedFiles: File[]) => {
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

      try {
        // Validate all files together
        const validation = await validateFiles(uniqueFiles)
        if (!validation.isValid) {
          // Show validation error but don't update files
          setValidationError(validation.error)
          return
        }

        // Update state with combined validated files
        setFiles(uniqueFiles)

        // Set pending file selection instead of calling onFileSelected directly
        if (files.length === 0 && droppedFiles.length === 1) {
          setPendingFileSelection(droppedFiles[0])
        }
      } catch (error) {
        setValidationError(
          error instanceof Error
            ? error.message
            : "Unknown error validating files"
        )
      }
    },
    [files, resetError, validateFiles]
  )

  const handleFilesChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        const selectedFiles = Array.from(event.target.files)
        handleFileDrop(selectedFiles)
      }
    },
    [handleFileDrop]
  )

  const handleRemoveFile = useCallback(
    (index: number) => {
      // Update state by filtering out the removed file
      setFiles((currentFiles) => {
        const updatedFiles = currentFiles.filter((_, i) => i !== index)

        // Reset file input to allow re-selecting the same file
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }

        // If we're removing the last file, also notify parent component
        if (updatedFiles.length === 0) {
          // Use the pending mechanism instead of direct call
          setPendingFileSelection(null)
        }

        return updatedFiles
      })
    },
    [fileInputRef]
  )

  // Check if we can add more files (less than 3 images and no PDFs)
  const canAddMoreFiles = useCallback(() => {
    const hasPdf = files.some((file) => file.type === "application/pdf")
    const isImageOnly = files.every((file) => file.type.startsWith("image/"))

    // Can add more if there are no files, or if there are only images (< 3) and no PDFs
    return files.length === 0 || (isImageOnly && files.length < 3 && !hasPdf)
  }, [files])

  return {
    files,
    isDragging,
    validationError,
    handleFileSelect,
    handleFileDrop,
    handleFilesChange,
    handleRemoveFile,
    canAddMoreFiles,
    setIsDragging,
  }
}
