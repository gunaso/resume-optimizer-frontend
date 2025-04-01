// Remove PDF.js imports and configuration, and define only the API service
interface UploadResponse {
  success: boolean
  message: string
  fileId?: string
  error?: string
}

// API endpoint for file upload
const API_URL = "http://localhost:8000/reader/resume"

export const uploadFiles = async (files: File[]): Promise<UploadResponse> => {
  const formData = new FormData()
  files.forEach((file, index) => {
    formData.append(`file-${index}`, file)
  })

  // Make the real API call
  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    // Parse the response once and store it
    const errorData = await response.json().catch(() => null)

    if (errorData && errorData.error) {
      // Use the error message from the response if available
      throw new Error(errorData.error)
    } else {
      // Fallback error message
      throw new Error(
        `Upload failed: ${response.status} ${response.statusText}`
      )
    }
  }

  return await response.json()
}
