import { ArrowRight, RotateCcw } from "lucide-react"
import React from "react"

import { useCvForm } from "@/context/CvFormContext"
import { Button } from "@/components/ui/button"
import { Step } from "@/context/CvFormContext"

const StepNavigationFooter: React.FC = () => {
  const { state, dispatch, validateCurrentStep, resetForm, proceedToNextStep } =
    useCvForm()
  const { currentStep } = state

  const handleBack = () => {
    if (currentStep === Step.Generating) {
      dispatch({ type: "SET_STEP", payload: Step.JobDetailsReview })
      return
    }

    if (currentStep === Step.Preview) {
      return
    }

    dispatch({ type: "PREVIOUS_STEP" })
  }

  const handleNext = () => {
    if (currentStep === Step.Upload) {
      if (!validateCurrentStep()) {
        return
      }

      if (!state.profilePicture) {
        dispatch({ type: "SET_PICTURE_WARNING", payload: true })
        return
      }
    }

    if (currentStep === Step.TemplateSelection && !validateCurrentStep()) {
      return
    }

    if (currentStep === Step.JobDetailsReview) {
      dispatch({ type: "SET_STEP", payload: Step.Generating })
      return
    }

    proceedToNextStep()
  }

  const getButtonText = () => {
    switch (currentStep) {
      case Step.Upload:
        return "Choose Template"
      case Step.TemplateSelection:
        return "Review Job Details"
      case Step.JobDetailsReview:
        return "Generate CV"
      default:
        return "Next"
    }
  }

  return (
    <div className="px-6 py-4 bg-muted/30 border-t flex justify-between">
      {currentStep > Step.Upload &&
      currentStep !== Step.Generating &&
      currentStep !== Step.Preview ? (
        <Button
          variant="outline"
          onClick={handleBack}
          className="transition-all duration-300"
        >
          Back
        </Button>
      ) : (
        <div></div>
      )}

      {currentStep < Step.Generating ? (
        <Button
          onClick={handleNext}
          className="gap-2 transition-all duration-300"
          disabled={!validateCurrentStep()}
        >
          {getButtonText()}
          <ArrowRight className="h-4 w-4" />
        </Button>
      ) : currentStep === Step.Preview ? (
        <Button
          onClick={resetForm}
          className="gap-2 transition-all duration-300"
        >
          <RotateCcw className="h-4 w-4" />
          Generate New CV
        </Button>
      ) : (
        <div></div>
      )}
    </div>
  )
}

export default StepNavigationFooter
