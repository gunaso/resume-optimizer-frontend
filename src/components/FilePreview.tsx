import React from "react"
import { FileIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FilePreviewProps } from "@/types/fileUpload"

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  onRemove,
  disabled = false,
}) => {
  return (
    <div className="w-full py-2">
      <div className="flex items-center justify-between bg-background rounded-lg p-3 border">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
            <FileIcon
              className="h-5 w-5 text-primary"
              data-testid="file-icon"
            />
          </div>
          <div className="text-left">
            <p
              className="text-sm font-medium truncate max-w-[200px]"
              title={file.name}
            >
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={onRemove}
          className="text-xs"
          disabled={disabled}
          aria-label="Remove file"
        >
          <X className="h-4 w-4 mr-1" />
          Remove
        </Button>
      </div>
    </div>
  )
}
