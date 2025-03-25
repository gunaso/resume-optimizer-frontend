import React, { useEffect, useRef } from "react"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { InputTypeWarningDialogProps } from "@/types/fileUpload"

export const InputTypeWarningDialog: React.FC<InputTypeWarningDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  inputType,
}) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  // Handle keyboard events for the dialog
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onConfirm()
    }
  }

  // Focus the cancel button when dialog opens
  useEffect(() => {
    if (isOpen && cancelButtonRef.current) {
      cancelButtonRef.current.focus()
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertCircle className="h-5 w-5" />
            Change Input Type
          </DialogTitle>
          <DialogDescription>
            You can only have one type of resume input at a time. Switching will
            remove your current {inputType === "file" ? "text input" : "file"}
            {inputType === "file"
              ? " and all text will be lost."
              : " and your uploaded file will be removed."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="gap-2"
            ref={cancelButtonRef}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={onConfirm}
            className="gap-2"
          >
            Confirm Change
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
