import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { FilePreview } from "../FilePreview"

describe("FilePreview", () => {
  const mockFile = new File(["test"], "test.pdf", { type: "application/pdf" })
  Object.defineProperty(mockFile, "size", { value: 1024 * 1024 }) // 1MB

  const defaultProps = {
    file: mockFile,
    onRemove: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders file information correctly", () => {
    render(<FilePreview {...defaultProps} />)

    expect(screen.getByText("test.pdf")).toBeInTheDocument()
    expect(screen.getByText("1.00 MB")).toBeInTheDocument()
    expect(screen.getByText("Remove")).toBeInTheDocument()
    expect(screen.getByLabelText("Remove file")).toBeInTheDocument()
  })

  it("calls onRemove when remove button is clicked", () => {
    render(<FilePreview {...defaultProps} />)
    const removeButton = screen.getByText("Remove")

    fireEvent.click(removeButton)

    expect(defaultProps.onRemove).toHaveBeenCalled()
  })

  it("disables remove button when disabled prop is true", () => {
    render(<FilePreview {...defaultProps} disabled={true} />)

    expect(screen.getByText("Remove")).toBeDisabled()
  })

  it("truncates long file names", () => {
    const longNameFile = new File(
      ["test"],
      "very_long_file_name_that_should_be_truncated.pdf",
      {
        type: "application/pdf",
      }
    )
    Object.defineProperty(longNameFile, "size", { value: 1024 * 1024 })

    render(<FilePreview {...defaultProps} file={longNameFile} />)
    const fileNameElement = screen.getByText(
      "very_long_file_name_that_should_be_truncated.pdf"
    )

    expect(fileNameElement).toHaveClass("truncate")
    expect(fileNameElement).toHaveClass("max-w-[200px]")
  })

  // New tests for different file types
  it("displays correct icon for PDF files", () => {
    const pdfFile = new File(["test"], "test.pdf", { type: "application/pdf" })
    Object.defineProperty(pdfFile, "size", { value: 1024 * 1024 })

    render(<FilePreview {...defaultProps} file={pdfFile} />)

    // Check that the file icon is present using testId
    const fileIcon = screen.getByTestId("file-icon")
    expect(fileIcon).toBeInTheDocument()
  })

  it("displays correct icon for image files", () => {
    const imageFile = new File(["test"], "test.png", { type: "image/png" })
    Object.defineProperty(imageFile, "size", { value: 1024 * 1024 })

    render(<FilePreview {...defaultProps} file={imageFile} />)

    // Check that the image icon is present using testId
    const fileIcon = screen.getByTestId("file-icon")
    expect(fileIcon).toBeInTheDocument()
  })

  // Test for file size formatting
  it("formats file size correctly for different sizes", () => {
    // Small file (KB range)
    const smallFile = new File(["test"], "small.pdf", {
      type: "application/pdf",
    })
    Object.defineProperty(smallFile, "size", { value: 500 * 1024 }) // 500KB

    const { rerender } = render(
      <FilePreview {...defaultProps} file={smallFile} />
    )
    expect(screen.getByText("0.49 MB")).toBeInTheDocument()

    // Large file (MB range)
    const largeFile = new File(["test"], "large.pdf", {
      type: "application/pdf",
    })
    Object.defineProperty(largeFile, "size", { value: 5 * 1024 * 1024 }) // 5MB

    rerender(<FilePreview {...defaultProps} file={largeFile} />)
    expect(screen.getByText("5.00 MB")).toBeInTheDocument()
  })

  // Test for accessibility features
  it("has an accessible name for the remove button", () => {
    render(<FilePreview {...defaultProps} />)

    const removeButton = screen.getByText("Remove")
    expect(removeButton).toHaveAccessibleName(/remove/i)
  })

  it("provides tooltip or aria-label for truncated file names", () => {
    const longNameFile = new File(
      ["test"],
      "very_long_file_name_that_should_be_truncated.pdf",
      {
        type: "application/pdf",
      }
    )
    Object.defineProperty(longNameFile, "size", { value: 1024 * 1024 })

    render(<FilePreview {...defaultProps} file={longNameFile} />)

    const fileNameElement = screen.getByText(
      "very_long_file_name_that_should_be_truncated.pdf"
    )

    // Check for title attribute or aria-label for accessibility
    expect(fileNameElement).toHaveAttribute(
      "title",
      "very_long_file_name_that_should_be_truncated.pdf"
    )
  })
})
