import { useMutation } from "@tanstack/react-query"
import { uploadFiles, checkPdfPageCount } from "@/api/fileService"

interface FileUploadMutationResult {
  isUploading: boolean
  uploadError: string | null
  uploadProgress: number
  upload: (files: File[]) => Promise<void>
  validateFiles: (
    files: File[]
  ) => Promise<{ isValid: boolean; error: string | null }>
  resetError: () => void
}

export const useFileUploadMutation = (): FileUploadMutationResult => {
  const { mutateAsync, isPending, error, reset } = useMutation({
    mutationFn: uploadFiles,
  })

  const validateFiles = async (
    files: File[]
  ): Promise<{ isValid: boolean; error: string | null }> => {
    // No files
    if (!files.length) {
      return { isValid: false, error: "No files selected." }
    }

    // Validate file count and type restrictions
    const pdfFiles = files.filter((file) => file.type === "application/pdf")
    const imageFiles = files.filter((file) => file.type.startsWith("image/"))
    const otherFiles = files.filter(
      (file) =>
        !file.type.startsWith("image/") && file.type !== "application/pdf"
    )

    // Check for unsupported file types
    if (otherFiles.length > 0) {
      return {
        isValid: false,
        error: "Only PDF and image files (PNG, JPG, JPEG, WEBP) are supported.",
      }
    }

    // Check if there's a mix of PDF and image files
    if (pdfFiles.length > 0 && imageFiles.length > 0) {
      return {
        isValid: false,
        error:
          "You can upload either images or a PDF file, but not both at the same time.",
      }
    }

    // Check PDF count restriction (only 1 PDF allowed)
    if (pdfFiles.length > 1) {
      return {
        isValid: false,
        error: "You can only upload 1 PDF file at a time.",
      }
    }

    // Check image count restriction (max 3 images)
    if (imageFiles.length > 3) {
      return {
        isValid: false,
        error: "You can only upload a maximum of 3 images.",
      }
    }

    // Check file size limit (3MB)
    const maxSizeMB = 3
    const oversizedFiles = files.filter(
      (file) => file.size > maxSizeMB * 1024 * 1024
    )
    if (oversizedFiles.length > 0) {
      return {
        isValid: false,
        error: `File size should not exceed ${maxSizeMB}MB. Please compress your file(s).`,
      }
    }

    // If there's a PDF file, check page count
    if (pdfFiles.length === 1) {
      const pdfValidation = await checkPdfPageCount(pdfFiles[0])
      if (!pdfValidation.valid) {
        return {
          isValid: false,
          error: pdfValidation.error || "PDF validation failed",
        }
      }
    }

    return { isValid: true, error: null }
  }

  const upload = async (files: File[]): Promise<void> => {
    const validation = await validateFiles(files)

    if (!validation.isValid) {
      throw new Error(validation.error || "File validation failed")
    }

    await mutateAsync(files)
  }

  return {
    isUploading: isPending,
    uploadError:
      error instanceof Error ? error.message : error ? String(error) : null,
    uploadProgress: isPending ? 50 : 0, // Simplified progress indication
    upload,
    validateFiles,
    resetError: reset,
  }
}
