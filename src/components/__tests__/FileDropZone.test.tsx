import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { FileDropZone } from "../FileDropZone"

describe("FileDropZone", () => {
  const defaultProps = {
    onDrop: jest.fn(),
    onFileSelect: jest.fn(),
    onTextInput: jest.fn(),
    isDragging: false,
    isUploading: false,
    uploadProgress: 0,
    acceptedFileTypes: "pdf, png, jpg",
    maxSizeMB: 3,
    disabled: false,
    setIsDragging: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders correctly", () => {
    render(<FileDropZone {...defaultProps} />)
    expect(screen.getByText(/Upload your resume/i)).toBeInTheDocument()
    expect(screen.getByText(/Drag and drop/i)).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /Select Files/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /Enter Resume Text/i })
    ).toBeInTheDocument()
  })

  it("shows upload progress when uploading", () => {
    render(
      <FileDropZone {...defaultProps} isUploading={true} uploadProgress={50} />
    )
    expect(screen.getByText(/Processing/i)).toBeInTheDocument()
    expect(screen.getByRole("progressbar")).toBeInTheDocument()
    expect(screen.getByText(/50/)).toBeInTheDocument()
  })

  it("applies dragging styles when isDragging is true", () => {
    render(<FileDropZone {...defaultProps} isDragging={true} />)
    const dropZone = screen.getByTestId("file-drop-zone")
    expect(dropZone).toHaveClass("border-primary")
  })

  it("calls onFileSelect when select file button is clicked", () => {
    render(<FileDropZone {...defaultProps} />)
    fireEvent.click(screen.getByRole("button", { name: /Select Files/i }))
    expect(defaultProps.onFileSelect).toHaveBeenCalled()
  })

  it("calls onTextInput when enter text button is clicked", () => {
    render(<FileDropZone {...defaultProps} />)
    fireEvent.click(screen.getByRole("button", { name: /Enter Resume Text/i }))
    expect(defaultProps.onTextInput).toHaveBeenCalled()
  })

  it("is disabled when disabled prop is true", () => {
    render(<FileDropZone {...defaultProps} disabled={true} />)
    expect(
      screen.getByRole("button", { name: /Select Files/i })
    ).toHaveAttribute("disabled")
    expect(
      screen.getByRole("button", { name: /Enter Resume Text/i })
    ).toHaveAttribute("disabled")
  })

  it("shows accepted file types and size limit", () => {
    render(<FileDropZone {...defaultProps} />)
    expect(screen.getByText(/Accepted formats:/i)).toBeInTheDocument()
    expect(screen.getByText(/pdf, png, jpg/i)).toBeInTheDocument()
    expect(screen.getByText(/max/i)).toBeInTheDocument()
    expect(screen.getByText(/3/i)).toBeInTheDocument()
    expect(screen.getByText(/MB/i)).toBeInTheDocument()
  })

  // Add test for drag over event
  it("handles dragOver event correctly", () => {
    render(<FileDropZone {...defaultProps} />)
    const dropZone = screen.getByTestId("file-drop-zone")

    fireEvent.dragOver(dropZone)
    expect(defaultProps.setIsDragging).toHaveBeenCalledWith(true)
  })

  // Add test for drag leave event
  it("handles dragLeave event correctly", () => {
    render(<FileDropZone {...defaultProps} />)
    const dropZone = screen.getByTestId("file-drop-zone")

    fireEvent.dragLeave(dropZone)
    expect(defaultProps.setIsDragging).toHaveBeenCalledWith(false)
  })

  // Add test for drop event
  it("calls onDrop with the array of files when files are dropped", () => {
    render(<FileDropZone {...defaultProps} />)
    const dropZone = screen.getByTestId("file-drop-zone")

    const file1 = new File(["test1"], "test1.pdf", { type: "application/pdf" })
    const file2 = new File(["test2"], "test2.jpg", { type: "image/jpeg" })
    const dataTransfer = {
      files: [file1, file2],
      items: [
        {
          kind: "file",
          type: file1.type,
          getAsFile: () => file1,
        },
        {
          kind: "file",
          type: file2.type,
          getAsFile: () => file2,
        },
      ],
    }

    fireEvent.drop(dropZone, { dataTransfer })

    expect(defaultProps.onDrop).toHaveBeenCalledWith([file1, file2])
    expect(defaultProps.setIsDragging).toHaveBeenCalledWith(false)
  })

  // Add test for click on the entire drop zone
  it("calls onFileSelect when clicking anywhere in the drop zone", () => {
    render(<FileDropZone {...defaultProps} />)
    const dropZone = screen.getByTestId("file-drop-zone")

    fireEvent.click(dropZone)

    expect(defaultProps.onFileSelect).toHaveBeenCalled()
  })
})

// Helper function to create drag events
function createDragEvent(type: string, files: File[] = []) {
  return {
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
    type,
    dataTransfer: {
      files: files.length ? files : [],
    },
  } as unknown as React.DragEvent<HTMLDivElement>
}
