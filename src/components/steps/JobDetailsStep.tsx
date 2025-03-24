import React from "react"

import { useCvForm } from "@/context/CvFormContext"
import JobDetailsReview from "@/components/JobDetailsReview"

const JobDetailsStep: React.FC = () => {
  const { state, dispatch } = useCvForm()
  const { jobUrl, aiInstructions } = state

  const handleInstructionsChange = (instructions: string) => {
    dispatch({ type: "SET_AI_INSTRUCTIONS", payload: instructions })
  }

  return (
    <JobDetailsReview
      jobUrl={jobUrl}
      onInstructionsChange={handleInstructionsChange}
      aiInstructions={aiInstructions}
    />
  )
}

export default JobDetailsStep
