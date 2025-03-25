import React from "react"

import { useCvForm } from "@/context/CvFormContext"
import GeneratingCvLoader from "@/components/GeneratingCvLoader"
import RestartButton from "@/components/RestartButton"
import { Step } from "@/context/CvFormContext"

const GeneratingStep: React.FC = () => {
  const { dispatch } = useCvForm()

  const handleGenerationComplete = () => {
    dispatch({ type: "SET_STEP", payload: Step.Preview })
  }

  return (
    <div className="relative">
      <div className="absolute top-0 right-0">
        <RestartButton />
      </div>
      <GeneratingCvLoader onComplete={handleGenerationComplete} />
    </div>
  )
}

export default GeneratingStep
