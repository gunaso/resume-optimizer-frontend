import { checkPdfPageCount } from "@/api/fileService"

interface ValidationResult {
  isValid: boolean
  error: string | null
}

export const useFileValidation = (
  acceptedFileTypes: string,
  maxSizeMB: number
) => {
  const validateFiles = async (files: File[]): Promise<ValidationResult> => {
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

    // Check file size limit
    const oversizedFiles = files.filter(
      (file) => file.size > maxSizeMB * 1024 * 1024
    )
    if (oversizedFiles.length > 0) {
      return {
        isValid: false,
        error: `File size should not exceed ${maxSizeMB}MB. Please compress your file(s).`,
      }
    }

    // Check file extensions against accepted types
    const acceptedExtensions = acceptedFileTypes
      .split(",")
      .map((type) => type.trim().replace(".", "").toLowerCase())

    for (const file of files) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase()
      if (!fileExtension || !acceptedExtensions.includes(fileExtension)) {
        return {
          isValid: false,
          error: `File "${file.name}" has an unsupported format. Please upload files with these formats: ${acceptedFileTypes}`,
        }
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

  const validateSingleFile = async (file: File): Promise<ValidationResult> => {
    if (!file) {
      return { isValid: false, error: "No file selected." }
    }

    return validateFiles([file])
  }

  return { validateFiles, validateSingleFile }
}
