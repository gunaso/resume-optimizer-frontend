import { renderHook } from "@testing-library/react"
import { useFileValidation } from "../useFileValidation"

describe("useFileValidation", () => {
  const acceptedFileTypes = ".pdf,.png,.jpg"
  const maxSizeMB = 3

  it("should validate file with correct type and size", async () => {
    const { result } = renderHook(() =>
      useFileValidation(acceptedFileTypes, maxSizeMB)
    )

    const file = new File(["test"], "test.png", { type: "image/png" })
    Object.defineProperty(file, "size", { value: 1024 * 1024 }) // 1MB

    const { isValid, error } = await result.current.validateSingleFile(file)

    expect(isValid).toBe(true)
    expect(error).toBeNull()
  })

  it("should reject file with invalid type", async () => {
    const { result } = renderHook(() =>
      useFileValidation(acceptedFileTypes, maxSizeMB)
    )

    const file = new File(["test"], "test.txt", { type: "text/plain" })

    const { isValid, error } = await result.current.validateSingleFile(file)

    expect(isValid).toBe(false)
    expect(error).toContain("Only PDF and image files")
  })

  it("should reject file exceeding size limit", async () => {
    const { result } = renderHook(() =>
      useFileValidation(acceptedFileTypes, maxSizeMB)
    )

    const file = new File(["test"], "test.png", { type: "image/png" })
    Object.defineProperty(file, "size", { value: 4 * 1024 * 1024 }) // 4MB

    const { isValid, error } = await result.current.validateSingleFile(file)

    expect(isValid).toBe(false)
    expect(error).toContain(`File size should not exceed ${maxSizeMB}MB`)
  })

  it("should reject file without extension", async () => {
    const { result } = renderHook(() =>
      useFileValidation(acceptedFileTypes, maxSizeMB)
    )

    const file = new File(["test"], "test", { type: "image/png" })

    const { isValid, error } = await result.current.validateSingleFile(file)

    expect(isValid).toBe(false)
    expect(error).toContain(`has an unsupported format`)
  })
})
