interface UploadResponse {
  success: boolean
  message: string
  fileId?: string
  error?: string
}

// Mock API endpoint for file upload
const API_URL = "https://api.example.com/upload"

export const uploadFiles = async (files: File[]): Promise<UploadResponse> => {
  try {
    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append(`file-${index}`, file)
    })

    // In a real implementation, this would be a real API call
    // For now, we'll simulate a successful response after a delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate a successful response
    return {
      success: true,
      message: "Files uploaded successfully",
      fileId: "mock-file-id-" + Date.now(),
    }

    // Real implementation would be:
    // const response = await fetch(API_URL, {
    //   method: 'POST',
    //   body: formData,
    // });
    // if (!response.ok) {
    //   throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    // }
    // return await response.json();
  } catch (error) {
    return {
      success: false,
      message: "Upload failed",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Function to check if a PDF has more than the allowed number of pages
export const checkPdfPageCount = async (
  file: File,
  maxPages: number = 3
): Promise<{
  valid: boolean
  pageCount?: number
  error?: string
}> => {
  if (file.type !== "application/pdf") {
    return { valid: true } // Not a PDF, so no page count check needed
  }

  // In a real implementation, this would call a backend API to check PDF pages
  // For demo purposes, we'll simulate a delayed response
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Simulate a random page count between 1-5 for testing
  const mockPageCount = Math.floor(Math.random() * 5) + 1

  return {
    valid: mockPageCount <= maxPages,
    pageCount: mockPageCount,
    error:
      mockPageCount > maxPages
        ? `PDF exceeds maximum ${maxPages} pages (has ${mockPageCount} pages)`
        : undefined,
  }
}
