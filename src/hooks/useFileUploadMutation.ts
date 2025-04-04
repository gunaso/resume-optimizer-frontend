import { useMutation } from "@tanstack/react-query"
import { uploadFiles } from "@/api/fileService"
import { checkPdfPageCount } from "@/utils/pdfUtils"

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
    try {
      // No files
      if (!files.length) {
        return { isValid: false, error: "No files selected." }
      }

      // Validate file count and type restrictions
      const pdfFiles = files.filter((file) => file.type === "application/pdf")
      const imageFiles = files.filter((file) => file.type.startsWith("image/"))
      const txtFiles = files.filter((file) => file.type === "text/plain")
      const otherFiles = files.filter(
        (file) =>
          !file.type.startsWith("image/") &&
          file.type !== "application/pdf" &&
          file.type !== "text/plain"
      )

      // Check for unsupported file types
      if (otherFiles.length > 0) {
        return {
          isValid: false,
          error:
            "Only PDF and image files (PNG, JPG, JPEG, WEBP) are supported for direct upload.",
        }
      }

      // Special case for manually entered text (single TXT file with name "resume.txt")
      // This allows TXT files created programmatically but not uploaded directly
      const isProgrammaticTxtFile =
        txtFiles.length === 1 &&
        files.length === 1 &&
        files[0].name === "resume.txt"

      // If we have TXT files that aren't from the manual text entry
      if (txtFiles.length > 0 && !isProgrammaticTxtFile) {
        return {
          isValid: false,
          error:
            "TXT files cannot be uploaded directly. Please enter text using the 'Enter Resume Text' option.",
        }
      }

      // For normal file uploads (not programmatic TXT files)
      if (!isProgrammaticTxtFile) {
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
      }

      // Check file size limit (3MB) - this applies to all files including TXT
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
    } catch (error) {
      console.error("Error validating files:", error)
      return {
        isValid: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error validating files",
      }
    }
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
