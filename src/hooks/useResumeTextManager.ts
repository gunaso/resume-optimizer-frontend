import {
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react"

interface ResumeTextManagerProps {
  files: File[]
  onFileSelected: (file: File | null) => void
}

interface ResumeTextManagerResult {
  resumeText: string
  showResumeText: boolean
  showTextDialog: boolean
  showRemoveConfirmDialog: boolean
  handleTextInput: () => void
  handleTextSubmit: (text: string) => void
  handleEditResumeText: () => void
  handleRemoveResumeText: () => void
  confirmRemoveResumeText: () => void
  setShowTextDialog: Dispatch<SetStateAction<boolean>>
  setShowRemoveConfirmDialog: Dispatch<SetStateAction<boolean>>
}

export const useResumeTextManager = ({
  files,
  onFileSelected,
}: ResumeTextManagerProps): ResumeTextManagerResult => {
  const [resumeText, setResumeText] = useState("")
  const [showResumeText, setShowResumeText] = useState(false)
  const [showTextDialog, setShowTextDialog] = useState(false)
  const [showRemoveConfirmDialog, setShowRemoveConfirmDialog] = useState(false)
  const [pendingFileSelection, setPendingFileSelection] = useState<
    File | null | undefined
  >(undefined)

  // Effect function for handling file selection notifications to parent
  const notifyFileSelection = useCallback(() => {
    if (pendingFileSelection !== undefined) {
      onFileSelected(pendingFileSelection)
      setPendingFileSelection(undefined)
    }
  }, [pendingFileSelection, onFileSelected])

  // Using useEffect to properly handle pendingFileSelection changes
  useEffect(() => {
    if (pendingFileSelection !== undefined) {
      notifyFileSelection()
    }
  }, [pendingFileSelection, notifyFileSelection])

  const handleTextInput = useCallback(() => {
    if (files.length > 0) {
      // If there are files, we should warn the user that entering text will replace them
      // This would require an additional warning dialog component
      // For now, let's just remove the files and open the dialog
      // In a real implementation, we might want to show a confirmation dialog first
      setPendingFileSelection(null)
    }

    setShowTextDialog(true)
  }, [files])

  const handleTextSubmit = useCallback((text: string) => {
    setResumeText(text)
    setShowResumeText(true)
    setShowTextDialog(false)

    // Create a text blob to mimic a file
    const textBlob = new Blob([text], { type: "text/plain" })
    const textFile = new File([textBlob], "resume.txt", {
      type: "text/plain",
    })

    // Set pending file selection instead of calling onFileSelected directly
    setPendingFileSelection(textFile)
  }, [])

  const handleEditResumeText = useCallback(() => {
    setShowTextDialog(true)
  }, [])

  const handleRemoveResumeText = useCallback(() => {
    setShowRemoveConfirmDialog(true)
  }, [])

  const confirmRemoveResumeText = useCallback(() => {
    setResumeText("")
    setShowResumeText(false)
    setShowRemoveConfirmDialog(false)
    setPendingFileSelection(null)
  }, [])

  return {
    resumeText,
    showResumeText,
    showTextDialog,
    showRemoveConfirmDialog,
    handleTextInput,
    handleTextSubmit,
    handleEditResumeText,
    handleRemoveResumeText,
    confirmRemoveResumeText,
    setShowTextDialog,
    setShowRemoveConfirmDialog,
  }
}
