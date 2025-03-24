import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import React from "react"

import TemplateSelectionStep from "@/components/steps/TemplateSelectionStep"
import { CvFormProvider, useCvForm, Step } from "@/context/CvFormContext"
import PictureWarningDialog from "@/components/PictureWarningDialog"
import StepNavigationFooter from "@/components/StepNavigationFooter"
import JobDetailsStep from "@/components/steps/JobDetailsStep"
import GeneratingStep from "@/components/steps/GeneratingStep"
import StepNavigation from "@/components/StepNavigation"
import PreviewStep from "@/components/steps/PreviewStep"
import UploadStep from "@/components/steps/UploadStep"
import { Button } from "@/components/ui/button"

const IndexContent: React.FC = () => {
  const { state } = useCvForm()
  const { currentStep } = state

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.1,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <motion.div
        className="max-w-5xl mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center mb-12"
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Resume Job Optimizer
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Upload your resume, provide a job posting URL, and get a
              professionally tailored resume that highlights your relevant
              skills and experience.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </motion.div>

        <StepNavigation currentStep={currentStep} />

        <motion.div
          className="bg-card rounded-xl border shadow-sm overflow-hidden"
          variants={itemVariants}
        >
          <div className="p-6">
            {currentStep === Step.Upload && <UploadStep />}
            {currentStep === Step.TemplateSelection && (
              <TemplateSelectionStep />
            )}
            {currentStep === Step.JobDetailsReview && <JobDetailsStep />}
            {currentStep === Step.Generating && <GeneratingStep />}
            {currentStep === Step.Preview && <PreviewStep />}
          </div>

          <StepNavigationFooter />
        </motion.div>

        <PictureWarningDialog />
      </motion.div>
    </div>
  )
}

const Index: React.FC = () => {
  return (
    <CvFormProvider>
      <IndexContent />
    </CvFormProvider>
  )
}

export default Index
