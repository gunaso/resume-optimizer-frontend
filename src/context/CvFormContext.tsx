import React, { createContext, useContext, useReducer, ReactNode } from "react"

import { Template } from "@/components/TemplateSelector"

export enum Step {
  Upload = 0,
  TemplateSelection = 1,
  JobDetailsReview = 2,
  Generating = 3,
  Preview = 4,
}

export interface CvFormState {
  currentStep: Step
  cvFile: File | null
  jobUrl: string
  jobDetails: string
  isProcessingUrl: boolean
  profilePicture: File | null
  selectedTemplateId: string | null
  aiInstructions: string
  showPictureWarning: boolean
  _resetTimestamp: number
}

type CvFormAction =
  | { type: "SET_STEP"; payload: Step }
  | { type: "SET_CV_FILE"; payload: File | null }
  | { type: "SET_JOB_URL"; payload: string }
  | { type: "SET_JOB_DETAILS"; payload: string }
  | { type: "SET_PROCESSING_URL"; payload: boolean }
  | { type: "SET_PROFILE_PICTURE"; payload: File | null }
  | { type: "SET_TEMPLATE"; payload: string | null }
  | { type: "SET_AI_INSTRUCTIONS"; payload: string }
  | { type: "SET_PICTURE_WARNING"; payload: boolean }
  | { type: "RESET_FORM" }
  | { type: "NEXT_STEP" }
  | { type: "PREVIOUS_STEP" }

const initialState: CvFormState = {
  currentStep: Step.Upload,
  cvFile: null,
  jobUrl: "",
  jobDetails: "",
  isProcessingUrl: false,
  profilePicture: null,
  selectedTemplateId: null,
  aiInstructions: "",
  showPictureWarning: false,
  _resetTimestamp: 0,
}

const reducer = (state: CvFormState, action: CvFormAction): CvFormState => {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.payload }
    case "SET_CV_FILE":
      return { ...state, cvFile: action.payload }
    case "SET_JOB_URL":
      return { ...state, jobUrl: action.payload }
    case "SET_JOB_DETAILS":
      return { ...state, jobDetails: action.payload }
    case "SET_PROCESSING_URL":
      return { ...state, isProcessingUrl: action.payload }
    case "SET_PROFILE_PICTURE":
      return { ...state, profilePicture: action.payload }
    case "SET_TEMPLATE":
      return { ...state, selectedTemplateId: action.payload }
    case "SET_AI_INSTRUCTIONS":
      return { ...state, aiInstructions: action.payload }
    case "SET_PICTURE_WARNING":
      return { ...state, showPictureWarning: action.payload }
    case "RESET_FORM":
      return {
        ...initialState,
        currentStep: Step.Upload,
        _resetTimestamp: Date.now(),
      }
    case "NEXT_STEP":
      return {
        ...state,
        currentStep:
          state.currentStep < Step.Preview
            ? ((state.currentStep + 1) as Step)
            : state.currentStep,
      }
    case "PREVIOUS_STEP":
      return {
        ...state,
        currentStep:
          state.currentStep > Step.Upload
            ? ((state.currentStep - 1) as Step)
            : state.currentStep,
      }
    default:
      return state
  }
}

interface CvFormContextProps {
  state: CvFormState
  dispatch: React.Dispatch<CvFormAction>
  getSelectedTemplate: (templates: Template[]) => Template | null
  validateCurrentStep: () => boolean
  proceedToNextStep: () => void
  resetForm: () => void
  processJobUrl: (url: string) => Promise<void>
}

const CvFormContext = createContext<CvFormContextProps | null>(null)

export const CvFormProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const getSelectedTemplate = (templates: Template[]): Template | null => {
    return (
      templates.find((t) => t.id === state.selectedTemplateId) ||
      (templates.length > 0 ? templates[0] : null)
    )
  }

  const validateCurrentStep = (): boolean => {
    switch (state.currentStep) {
      case Step.Upload:
        return Boolean(state.cvFile && (state.jobUrl || state.jobDetails))
      case Step.TemplateSelection:
        return Boolean(state.selectedTemplateId)
      case Step.JobDetailsReview:
        return Boolean(state.jobDetails) // Now requiring job details to proceed
      default:
        return true
    }
  }

  const proceedToNextStep = () => {
    if (validateCurrentStep()) {
      dispatch({ type: "NEXT_STEP" })
    }
  }

  const resetForm = () => {
    dispatch({ type: "RESET_FORM" })
  }

  const processJobUrl = async (url: string) => {
    try {
      dispatch({ type: "SET_PROCESSING_URL", payload: true })

      // Mock API call to process the job URL
      const response = await fetch("/api/process-job-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error("Failed to process job URL")
      }

      const data = await response.json()
      dispatch({ type: "SET_JOB_DETAILS", payload: data.jobDetails })
    } catch (error) {
      console.error("Error processing job URL:", error)
      // Could add error handling state here if needed
    } finally {
      dispatch({ type: "SET_PROCESSING_URL", payload: false })
    }
  }

  return (
    <CvFormContext.Provider
      value={{
        state,
        dispatch,
        getSelectedTemplate,
        validateCurrentStep,
        proceedToNextStep,
        resetForm,
        processJobUrl,
      }}
    >
      {children}
    </CvFormContext.Provider>
  )
}

export const useCvForm = () => {
  const context = useContext(CvFormContext)
  if (!context) {
    throw new Error("useCvForm must be used within a CvFormProvider")
  }
  return context
}
