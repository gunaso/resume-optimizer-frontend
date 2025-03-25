import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { InputTypeWarningDialog } from "../InputTypeWarningDialog"

describe("InputTypeWarningDialog", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    inputType: "file" as const,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders correctly when open", () => {
    render(<InputTypeWarningDialog {...defaultProps} />)
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Change Input Type")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Confirm Change" })
    ).toBeInTheDocument()
  })

  it("does not render when closed", () => {
    render(<InputTypeWarningDialog {...defaultProps} isOpen={false} />)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("shows correct warning text based on input type", () => {
    render(<InputTypeWarningDialog {...defaultProps} inputType="text" />)
    expect(screen.getByText(/file/i)).toBeInTheDocument()
  })

  it("calls onConfirm when confirm button is clicked", () => {
    render(<InputTypeWarningDialog {...defaultProps} />)
    fireEvent.click(screen.getByRole("button", { name: "Confirm Change" }))
    expect(defaultProps.onConfirm).toHaveBeenCalled()
  })

  it("calls onClose when cancel button is clicked", () => {
    render(<InputTypeWarningDialog {...defaultProps} />)
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it("calls onClose when dialog is closed", () => {
    render(<InputTypeWarningDialog {...defaultProps} />)
    fireEvent.click(screen.getByRole("button", { name: "Close" }))
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  // New tests for specific input type warnings
  it("shows warning about switching from text to file", () => {
    render(<InputTypeWarningDialog {...defaultProps} inputType="file" />)

    // Should warn about existing text being lost
    expect(screen.getByText(/text/i)).toBeInTheDocument()
    expect(screen.getByText(/will be lost/i)).toBeInTheDocument()
  })

  it("shows warning about switching from file to text", () => {
    render(<InputTypeWarningDialog {...defaultProps} inputType="text" />)

    // Should warn about uploaded file being removed
    expect(screen.getByText(/file/i)).toBeInTheDocument()
    expect(screen.getByText(/will be removed/i)).toBeInTheDocument()
  })

  // Test for keyboard shortcuts
  it("closes dialog when Escape key is pressed", () => {
    render(<InputTypeWarningDialog {...defaultProps} />)

    // Press Escape
    fireEvent.keyDown(screen.getByRole("dialog"), {
      key: "Escape",
      code: "Escape",
    })

    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it("confirms dialog when Enter key is pressed", () => {
    render(<InputTypeWarningDialog {...defaultProps} />)

    // Press Enter
    fireEvent.keyDown(screen.getByRole("dialog"), {
      key: "Enter",
      code: "Enter",
    })

    expect(defaultProps.onConfirm).toHaveBeenCalled()
  })

  // Test for focus management
  it("focuses on the cancel button by default", () => {
    render(<InputTypeWarningDialog {...defaultProps} />)

    // Cancel button should be focused by default for safety
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus()
  })
})
