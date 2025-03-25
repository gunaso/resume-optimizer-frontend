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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarkdownPreview } from "@/components/MarkdownPreview"
import { FileText, Eye } from "lucide-react"

export interface TextInputDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (text: string) => void
  initialText?: string
  title?: string
  description?: string
  placeholder?: string
  submitButtonText?: string
  maxLength?: number
}

export const TextInputDialog: React.FC<TextInputDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialText = "",
  title = "Enter Text",
  description = "Paste or type your content here.",
  placeholder = "",
  submitButtonText = "Submit",
  maxLength = 2000,
}) => {
  const [text, setText] = React.useState(initialText)
  const [activeTab, setActiveTab] = React.useState<string>("edit")

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
    // Submit on Ctrl+Enter or Cmd+Enter (for macOS)
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    if (newText.length <= maxLength) {
      setText(newText)
    }
  }

  const charactersRemaining = maxLength - text.length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl w-[90vw]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="edit"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="edit" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Edit
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
            </TabsList>
            <div className="text-xs text-muted-foreground">
              {text.length}/{maxLength} ({charactersRemaining} remaining)
            </div>
          </div>

          <TabsContent value="edit" className="mt-2">
            <div className="min-h-[300px] max-h-[500px] overflow-y-auto border rounded-md">
              <Textarea
                value={text}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="min-h-[300px] h-full w-full border-0 resize-none"
                style={{ overflow: "auto" }}
                maxLength={maxLength}
              />
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-2">
            <div className="border rounded-md p-4 min-h-[300px] max-h-[500px] overflow-y-auto">
              {text.trim() ? (
                <MarkdownPreview content={text} />
              ) : (
                <div className="text-muted-foreground italic">
                  No content to preview
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!text || !text.trim()}
          >
            {submitButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
