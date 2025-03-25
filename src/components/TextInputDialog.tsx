import React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TextInputDialogProps } from "@/types/fileUpload"

export const TextInputDialog: React.FC<TextInputDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialText = "",
}) => {
  const [text, setText] = React.useState(initialText)

  React.useEffect(() => {
    setText(initialText)
  }, [initialText])

  const handleSubmit = () => {
    // Validate that text is not empty or just whitespace
    if (!text || !text.trim()) {
      return
    }
    onSubmit(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Ctrl+Enter
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter your resume text</DialogTitle>
          <DialogDescription>
            Paste or type your resume content here. Include sections like
            experience, skills, education, etc.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Experience:
- Position at Company (Date - Date)
- Responsibilities and achievements

Skills:
- Skill 1
- Skill 2

Education:
- Degree, Institution (Year)"
          className="min-h-[200px]"
        />
        <div className="text-xs text-muted-foreground text-right">
          {text.length} characters
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!text || !text.trim()}
          >
            Submit Resume Text
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
