import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import FileUpload from "../FileUpload"

// Mock the useFileUploadMutation hook
jest.mock("@/hooks/useFileUploadMutation", () => ({
  useFileUploadMutation: () => ({
    isUploading: false,
    uploadError: null,
    uploadProgress: 0,
    upload: jest.fn(),
    validateFiles: jest.fn().mockResolvedValue({ isValid: true, error: null }),
    resetError: jest.fn(),
  }),
}))

describe("FileUpload", () => {
  const mockOnFileSelected = jest.fn()
  const defaultProps = {
    onFileSelected: mockOnFileSelected,
    acceptedFileTypes: ".pdf,.png,.jpg,.jpeg,.webp",
    maxSizeMB: 3,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the FileDropZone when no files are selected", () => {
    render(<FileUpload {...defaultProps} />)
    expect(screen.getByText(/Upload your resume/i)).toBeInTheDocument()
    expect(screen.getByText(/Drag and drop/i)).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /Select Files/i })
    ).toBeInTheDocument()
  })

  it("handles file selection", async () => {
    const { container } = render(<FileUpload {...defaultProps} />)

    // Mock validateFiles to return valid
    jest
      .spyOn(require("@/hooks/useFileUploadMutation"), "useFileUploadMutation")
      .mockImplementation(() => ({
        isUploading: false,
        uploadError: null,
        uploadProgress: 0,
        upload: jest.fn(),
        validateFiles: jest
          .fn()
          .mockResolvedValue({ isValid: true, error: null }),
        resetError: jest.fn(),
      }))

    // Get the hidden file input
    const fileInput = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement
    expect(fileInput).not.toBeNull()

    // Create a test file
    const file = new File(["test"], "test.pdf", { type: "application/pdf" })

    // Trigger file selection
    await waitFor(() => {
      userEvent.upload(fileInput, [file])
    })

    // Now we should see the file preview
    await waitFor(() => {
      expect(screen.getByText("test.pdf")).toBeInTheDocument()
    })
  })

  it("displays an error when there's a validation error", async () => {
    // Mock validateFiles to return an error
    jest
      .spyOn(require("@/hooks/useFileUploadMutation"), "useFileUploadMutation")
      .mockImplementation(() => ({
        isUploading: false,
        uploadError: "Test error message",
        uploadProgress: 0,
        upload: jest.fn(),
        validateFiles: jest
          .fn()
          .mockResolvedValue({ isValid: true, error: null }),
        resetError: jest.fn(),
      }))

    render(<FileUpload {...defaultProps} />)
    expect(screen.getByText("Test error message")).toBeInTheDocument()
  })

  it("shows upload progress when uploading", async () => {
    // Set up mock file
    const mockFile = new File(["test"], "test.pdf", { type: "application/pdf" })

    // Mock useFileUploadMutation for uploading state
    jest
      .spyOn(require("@/hooks/useFileUploadMutation"), "useFileUploadMutation")
      .mockImplementation(() => ({
        isUploading: true,
        uploadError: null,
        uploadProgress: 50,
        upload: jest.fn(),
        validateFiles: jest
          .fn()
          .mockResolvedValue({ isValid: true, error: null }),
        resetError: jest.fn(),
      }))

    // Render with initialFile to show file preview
    render(<FileUpload {...defaultProps} initialFile={mockFile} />)

    // We should see the file and progress indicator
    expect(screen.getByText("test.pdf")).toBeInTheDocument()
    expect(screen.getByText("Uploading...")).toBeInTheDocument()
    expect(screen.getByText("50%")).toBeInTheDocument()
    expect(screen.getByRole("progressbar")).toBeInTheDocument()
  })

  it("shows 'Add More Files' button when less than 3 images are selected", async () => {
    // Set up mock image file
    const mockImageFile = new File(["test"], "test.jpg", { type: "image/jpeg" })
    Object.defineProperty(mockImageFile, "size", { value: 1024 * 1024 })

    // Mock useFileUploadMutation
    jest
      .spyOn(require("@/hooks/useFileUploadMutation"), "useFileUploadMutation")
      .mockImplementation(() => ({
        isUploading: false,
        uploadError: null,
        uploadProgress: 0,
        upload: jest.fn(),
        validateFiles: jest
          .fn()
          .mockResolvedValue({ isValid: true, error: null }),
        resetError: jest.fn(),
      }))

    // Render with initialFile to show file preview
    render(<FileUpload {...defaultProps} initialFile={mockImageFile} />)

    // We should see the add more files button
    expect(screen.getByText("Add More Files")).toBeInTheDocument()
  })

  it("does not show 'Add More Files' button when a PDF is selected", async () => {
    // Set up mock PDF file
    const mockPdfFile = new File(["test"], "test.pdf", {
      type: "application/pdf",
    })
    Object.defineProperty(mockPdfFile, "size", { value: 1024 * 1024 })

    // Mock useFileUploadMutation
    jest
      .spyOn(require("@/hooks/useFileUploadMutation"), "useFileUploadMutation")
      .mockImplementation(() => ({
        isUploading: false,
        uploadError: null,
        uploadProgress: 0,
        upload: jest.fn(),
        validateFiles: jest
          .fn()
          .mockResolvedValue({ isValid: true, error: null }),
        resetError: jest.fn(),
      }))

    // Render with initialFile to show file preview
    render(<FileUpload {...defaultProps} initialFile={mockPdfFile} />)

    // We should NOT see the add more files button
    expect(screen.queryByText("Add More Files")).not.toBeInTheDocument()
  })

  it("adds new files without replacing existing ones", async () => {
    // Set up mock image files
    const mockImageFile1 = new File(["test1"], "image1.jpg", {
      type: "image/jpeg",
    })
    const mockImageFile2 = new File(["test2"], "image2.jpg", {
      type: "image/jpeg",
    })
    Object.defineProperty(mockImageFile1, "size", { value: 1024 * 1024 })
    Object.defineProperty(mockImageFile2, "size", { value: 1024 * 1024 })

    // Mock validation function
    const mockValidateFiles = jest
      .fn()
      .mockResolvedValue({ isValid: true, error: null })

    jest
      .spyOn(require("@/hooks/useFileUploadMutation"), "useFileUploadMutation")
      .mockImplementation(() => ({
        isUploading: false,
        uploadError: null,
        uploadProgress: 0,
        upload: jest.fn(),
        validateFiles: mockValidateFiles,
        resetError: jest.fn(),
      }))

    // Render with initial file
    const { container } = render(
      <FileUpload {...defaultProps} initialFile={mockImageFile1} />
    )

    // Check that the first file is shown
    expect(screen.getByText("image1.jpg")).toBeInTheDocument()

    // Get the file input and simulate adding another file
    const fileInput = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement

    await waitFor(() => {
      userEvent.upload(fileInput, [mockImageFile2])
    })

    // Both files should now be visible
    await waitFor(() => {
      expect(screen.getByText("image1.jpg")).toBeInTheDocument()
      expect(screen.getByText("image2.jpg")).toBeInTheDocument()
    })
  })

  it("allows re-selecting a file after it has been removed", async () => {
    // Set up mock image file
    const mockImageFile = new File(["test1"], "image1.jpg", {
      type: "image/jpeg",
    })
    Object.defineProperty(mockImageFile, "size", { value: 1024 * 1024 })

    // Mock validation function
    const mockValidateFiles = jest
      .fn()
      .mockResolvedValue({ isValid: true, error: null })

    jest
      .spyOn(require("@/hooks/useFileUploadMutation"), "useFileUploadMutation")
      .mockImplementation(() => ({
        isUploading: false,
        uploadError: null,
        uploadProgress: 0,
        upload: jest.fn(),
        validateFiles: mockValidateFiles,
        resetError: jest.fn(),
      }))

    // Render component
    const { container } = render(<FileUpload {...defaultProps} />)

    // Get the file input
    const fileInput = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement

    // First, select a file
    await waitFor(() => {
      userEvent.upload(fileInput, [mockImageFile])
    })

    // Check that the file is shown
    await waitFor(() => {
      expect(screen.getByText("image1.jpg")).toBeInTheDocument()
    })

    // Find and click remove button
    const removeButton = screen.getByLabelText("Remove file")
    fireEvent.click(removeButton)

    // Check that the file was removed
    expect(screen.queryByText("image1.jpg")).not.toBeInTheDocument()

    // Re-select the same file
    await waitFor(() => {
      userEvent.upload(fileInput, [mockImageFile])
    })

    // Check that the file is shown again
    await waitFor(() => {
      expect(screen.getByText("image1.jpg")).toBeInTheDocument()
    })
  })
})
