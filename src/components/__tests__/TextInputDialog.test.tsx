import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { TextInputDialog } from "../TextInputDialog"

describe("TextInputDialog", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSubmit: jest.fn(),
    initialText: "",
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders correctly when open", () => {
    render(<TextInputDialog {...defaultProps} />)
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Enter your resume text")).toBeInTheDocument()
    expect(screen.getByRole("textbox")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Submit Resume Text" })
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument()
  })

  it("does not render when closed", () => {
    render(<TextInputDialog {...defaultProps} isOpen={false} />)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("handles text input", () => {
    render(<TextInputDialog {...defaultProps} />)
    const input = screen.getByRole("textbox")
    fireEvent.change(input, { target: { value: "New resume text" } })
    expect(input).toHaveValue("New resume text")
  })

  it("submits text when submit button is clicked", () => {
    render(<TextInputDialog {...defaultProps} />)
    const input = screen.getByRole("textbox")
    fireEvent.change(input, { target: { value: "New resume text" } })
    fireEvent.click(screen.getByRole("button", { name: "Submit Resume Text" }))
    expect(defaultProps.onSubmit).toHaveBeenCalledWith("New resume text")
  })

  it("shows initial text", () => {
    render(
      <TextInputDialog {...defaultProps} initialText="Initial resume content" />
    )
    expect(screen.getByRole("textbox")).toHaveValue("Initial resume content")
  })

  it("updates when initialText changes", () => {
    const { rerender } = render(<TextInputDialog {...defaultProps} />)
    expect(screen.getByRole("textbox")).toHaveValue("")

    rerender(
      <TextInputDialog {...defaultProps} initialText="Updated resume content" />
    )
    expect(screen.getByRole("textbox")).toHaveValue("Updated resume content")
  })

  it("calls onClose when dialog is closed", () => {
    render(<TextInputDialog {...defaultProps} />)
    fireEvent.click(screen.getByRole("button", { name: "Close" }))
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  // New test for validation - empty text
  it("prevents submission when text is empty", () => {
    render(<TextInputDialog {...defaultProps} />)

    // Ensure the input is empty
    const input = screen.getByRole("textbox")
    fireEvent.change(input, { target: { value: "" } })

    // Try to submit
    fireEvent.click(screen.getByRole("button", { name: "Submit Resume Text" }))

    // Submission should be prevented
    expect(defaultProps.onSubmit).not.toHaveBeenCalled()
  })

  // Test for whitespace-only validation
  it("prevents submission when text contains only whitespace", () => {
    render(<TextInputDialog {...defaultProps} />)

    const input = screen.getByRole("textbox")
    fireEvent.change(input, { target: { value: "   " } })

    fireEvent.click(screen.getByRole("button", { name: "Submit Resume Text" }))

    expect(defaultProps.onSubmit).not.toHaveBeenCalled()
  })

  // Test for keyboard submission with Ctrl+Enter
  it("submits when Ctrl+Enter is pressed", () => {
    render(<TextInputDialog {...defaultProps} />)

    const input = screen.getByRole("textbox")
    fireEvent.change(input, { target: { value: "Valid text" } })

    // Simulate Ctrl+Enter keydown
    fireEvent.keyDown(input, {
      key: "Enter",
      code: "Enter",
      ctrlKey: true,
    })

    expect(defaultProps.onSubmit).toHaveBeenCalledWith("Valid text")
  })

  // Test for closing with Escape key
  it("closes dialog when Escape key is pressed", () => {
    render(<TextInputDialog {...defaultProps} />)

    // Press Escape
    fireEvent.keyDown(screen.getByRole("dialog"), {
      key: "Escape",
      code: "Escape",
    })

    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  // Test for character count display
  it("displays character count", () => {
    render(<TextInputDialog {...defaultProps} />)

    const input = screen.getByRole("textbox")
    fireEvent.change(input, { target: { value: "This is a sample text" } })

    // Check for character count without being strict about the exact number
    expect(screen.getByText(/characters/i)).toBeInTheDocument()

    // Verify the count is correct (21 characters for "This is a sample text")
    expect(screen.getByText(/21 characters/i)).toBeInTheDocument()
  })
})
