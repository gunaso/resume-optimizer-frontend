import React from "react"

import { Step } from "@/context/CvFormContext"

interface StepNavigationProps {
  currentStep: Step
}

const StepNavigation: React.FC<StepNavigationProps> = ({ currentStep }) => {
  const steps = Object.values(Step).filter(
    (value) => typeof value === "number"
  ) as Step[]

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step) => (
          <React.Fragment key={step}>
            <div
              className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-background border-muted text-muted-foreground"
              } transition-all duration-300`}
            >
              <span className="text-sm font-medium">{step + 1}</span>
              {currentStep > step && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary text-primary-foreground rounded-full animate-scale-in">
                  <span className="text-sm font-medium">✓</span>
                </div>
              )}
            </div>
            {step < Step.Preview && (
              <div
                className={`w-16 h-0.5 ${
                  currentStep > step ? "bg-primary" : "bg-muted"
                } transition-all duration-500`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-center mt-2">
        <p className="text-sm font-medium">
          {currentStep === Step.Upload && "Upload CV & Job URL"}
          {currentStep === Step.TemplateSelection && "Select Template"}
          {currentStep === Step.JobDetailsReview && "Review Job Details"}
          {currentStep === Step.Generating && "Generating CV"}
          {currentStep === Step.Preview && "Preview & Download"}
        </p>
      </div>
    </div>
  )
}

export default StepNavigation
