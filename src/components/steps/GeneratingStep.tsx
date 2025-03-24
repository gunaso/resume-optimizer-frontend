import React from "react"
import { useCvForm } from "@/context/CvFormContext"
import GeneratingCvLoader from "@/components/GeneratingCvLoader"
import { Step } from "@/context/CvFormContext"

const GeneratingStep: React.FC = () => {
  const { dispatch } = useCvForm()

  const handleGenerationComplete = () => {
    dispatch({ type: "SET_STEP", payload: Step.Preview })
  }

  return <GeneratingCvLoader onComplete={handleGenerationComplete} />
}

export default GeneratingStep
