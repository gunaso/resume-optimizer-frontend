import { useReducer, useCallback, useRef } from "react"
import { FileUploadState, FileUploadAction } from "@/types/fileUpload"
import { useFileValidation } from "./useFileValidation"

const initialState: FileUploadState = {
  showInputTypeWarning: false,
  inputTypeToSwitch: null,
  showTextDialog: false,
  file: null,
  uploadProgress: 0,
  error: null,
  isUploading: false,
  isDragging: false,
  showCvText: false,
  cvText: "",
}

function reducer(
  state: FileUploadState,
  action: FileUploadAction
): FileUploadState {
  switch (action.type) {
    case "SET_INPUT_TYPE_WARNING":
      return { ...state, showInputTypeWarning: action.payload }
    case "SET_INPUT_TYPE_TO_SWITCH":
      return { ...state, inputTypeToSwitch: action.payload }
    case "SET_TEXT_DIALOG":
      return { ...state, showTextDialog: action.payload }
    case "SET_FILE":
      return { ...state, file: action.payload }
    case "SET_UPLOAD_PROGRESS":
      return { ...state, uploadProgress: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload }
    case "SET_UPLOADING":
      return { ...state, isUploading: action.payload }
    case "SET_DRAGGING":
      return { ...state, isDragging: action.payload }
    case "SET_SHOW_CV_TEXT":
      return { ...state, showCvText: action.payload }
    case "SET_CV_TEXT":
      return { ...state, cvText: action.payload }
    case "RESET_STATE":
      return initialState
    default:
      return state
  }
}

interface UseFileUploadProps {
  onFileSelected: (file: File) => void
  acceptedFileTypes: string
  maxSizeMB: number
  initialFile?: File | null
}

export const useFileUpload = ({
  onFileSelected,
  acceptedFileTypes,
  maxSizeMB,
  initialFile,
}: UseFileUploadProps) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    file: initialFile || null,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { validateSingleFile } = useFileValidation(acceptedFileTypes, maxSizeMB)

  const handleFileSelect = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [])

  const handleTextInput = useCallback(() => {
    if (state.file) {
      dispatch({ type: "SET_INPUT_TYPE_TO_SWITCH", payload: "text" })
      dispatch({ type: "SET_INPUT_TYPE_WARNING", payload: true })
    } else {
      dispatch({ type: "SET_TEXT_DIALOG", payload: true })
    }
  }, [state.file])

  const handleFileDrop = useCallback(
    async (file: File) => {
      if (state.showCvText) {
        dispatch({ type: "SET_INPUT_TYPE_TO_SWITCH", payload: "file" })
        dispatch({ type: "SET_INPUT_TYPE_WARNING", payload: true })
        return
      }

      const validationResult = await validateSingleFile(file)
      if (!validationResult.isValid) {
        dispatch({ type: "SET_ERROR", payload: validationResult.error })
        return
      }

      dispatch({ type: "SET_FILE", payload: file })
      dispatch({ type: "SET_CV_TEXT", payload: "" })
      dispatch({ type: "SET_SHOW_CV_TEXT", payload: false })
      dispatch({ type: "SET_UPLOADING", payload: true })
      dispatch({ type: "SET_UPLOAD_PROGRESS", payload: 0 })

      // Simulate upload progress
      const interval = setInterval(() => {
        dispatch({
          type: "SET_UPLOAD_PROGRESS",
          payload: Math.min(state.uploadProgress + 10, 90),
        })
      }, 300)

      // Simulate file processing delay
      setTimeout(() => {
        clearInterval(interval)
        dispatch({ type: "SET_UPLOADING", payload: false })
        dispatch({ type: "SET_UPLOAD_PROGRESS", payload: 100 })
        onFileSelected(file)
      }, 1500)
    },
    [state.showCvText, state.uploadProgress, validateSingleFile, onFileSelected]
  )

  const handleTextSubmit = useCallback(
    (text: string) => {
      if (text.trim()) {
        dispatch({ type: "SET_TEXT_DIALOG", payload: false })
        dispatch({ type: "SET_SHOW_CV_TEXT", payload: true })
        dispatch({ type: "SET_FILE", payload: null })
        dispatch({ type: "SET_CV_TEXT", payload: text })

        const blob = new Blob([text], { type: "text/plain" })
        const textFile = new File([blob], "cv-text.txt", { type: "text/plain" })
        onFileSelected(textFile)
      }
    },
    [onFileSelected]
  )

  const handleConfirmTypeSwitch = useCallback(() => {
    dispatch({ type: "SET_INPUT_TYPE_WARNING", payload: false })
    if (state.inputTypeToSwitch === "file") {
      handleFileSelect()
    } else if (state.inputTypeToSwitch === "text") {
      dispatch({ type: "SET_FILE", payload: null })
      dispatch({ type: "SET_TEXT_DIALOG", payload: true })
    }
  }, [state.inputTypeToSwitch, handleFileSelect])

  const handleCancelTypeSwitch = useCallback(() => {
    dispatch({ type: "SET_INPUT_TYPE_WARNING", payload: false })
    dispatch({ type: "SET_INPUT_TYPE_TO_SWITCH", payload: null })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  return {
    state,
    fileInputRef,
    handleFileSelect,
    handleTextInput,
    handleFileDrop,
    handleTextSubmit,
    handleConfirmTypeSwitch,
    handleCancelTypeSwitch,
    dispatch,
  }
}
