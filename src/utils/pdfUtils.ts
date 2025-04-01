import * as pdfjs from "pdfjs-dist"

// Configure the worker source path correctly
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString()

/**
 * Function to check if a PDF has more than the allowed number of pages
 * @param file The PDF file to check
 * @param maxPages Maximum allowed number of pages (default: 3)
 * @returns Object containing validation result, page count, and error message if any
 */
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

  try {
    // Convert the file to an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()

    // Load the PDF document using PDF.js
    const loadingTask = pdfjs.getDocument(arrayBuffer)
    const pdfDocument = await loadingTask.promise

    // Get the number of pages
    const pageCount = pdfDocument.numPages

    // Check if the page count is valid
    const valid = pageCount <= maxPages

    return {
      valid,
      pageCount,
      error: valid
        ? undefined
        : `PDF exceeds maximum ${maxPages} pages (has ${pageCount} pages)`,
    }
  } catch (error) {
    return {
      valid: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error checking PDF page count",
    }
  }
}
