import React from "react"

import { useCvForm } from "@/context/CvFormContext"
import JobDetailsReview from "@/components/JobDetailsReview"
import RestartButton from "@/components/RestartButton"

const JobDetailsStep: React.FC = () => {
  const { state, dispatch } = useCvForm()
  const { jobUrl, jobDetails, aiInstructions } = state

  const handleInstructionsChange = (instructions: string) => {
    dispatch({ type: "SET_AI_INSTRUCTIONS", payload: instructions })
  }

  const handleJobDetailsChange = (details: string) => {
    dispatch({ type: "SET_JOB_DETAILS", payload: details })
  }

  return (
    <div className="relative">
      <div className="absolute top-0 right-0">
        <RestartButton />
      </div>
      <JobDetailsReview
        jobUrl={jobUrl}
        jobDetails={jobDetails}
        onInstructionsChange={handleInstructionsChange}
        onJobDetailsChange={handleJobDetailsChange}
        aiInstructions={aiInstructions}
      />
    </div>
  )
}

export default JobDetailsStep
