export interface FileUploadProps {
  onFileSelected: (file: File) => void
  acceptedFileTypes?: string
  maxSizeMB?: number
  initialFile?: File | null
}

export interface FileDropZoneProps {
  onDrop: (files: File[]) => void
  isDragging: boolean
  isUploading: boolean
  uploadProgress: number
  acceptedFileTypes: string
  maxSizeMB: number
  onFileSelect: () => void
  onTextInput: () => void
  disabled?: boolean
  setIsDragging?: (isDragging: boolean) => void
}

export interface FilePreviewProps {
  file: File
  onRemove: () => void
  disabled?: boolean
}

export interface TextInputDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (text: string) => void
  initialText?: string
}

export interface InputTypeWarningDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  inputType: "file" | "text"
}

export interface FileUploadState {
  showInputTypeWarning: boolean
  inputTypeToSwitch: "file" | "text" | null
  showTextDialog: boolean
  file: File | null
  uploadProgress: number
  error: string | null
  isUploading: boolean
  isDragging: boolean
  showCvText: boolean
  cvText: string
}

export type FileUploadAction =
  | { type: "SET_INPUT_TYPE_WARNING"; payload: boolean }
  | { type: "SET_INPUT_TYPE_TO_SWITCH"; payload: "file" | "text" | null }
  | { type: "SET_TEXT_DIALOG"; payload: boolean }
  | { type: "SET_FILE"; payload: File | null }
  | { type: "SET_UPLOAD_PROGRESS"; payload: number }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_UPLOADING"; payload: boolean }
  | { type: "SET_DRAGGING"; payload: boolean }
  | { type: "SET_SHOW_CV_TEXT"; payload: boolean }
  | { type: "SET_CV_TEXT"; payload: string }
  | { type: "RESET_STATE" }
