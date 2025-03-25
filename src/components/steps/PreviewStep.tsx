import React from "react"

import ResumePreview from "@/components/ResumePreview"
import { useCvForm } from "@/context/CvFormContext"
import RestartButton from "@/components/RestartButton"
import { templates } from "@/data/templates"
import { useToast } from "@/hooks/use-toast"

const PreviewStep: React.FC = () => {
  const { state, getSelectedTemplate } = useCvForm()
  const { cvFile, jobUrl, profilePicture, aiInstructions } = state
  const { toast } = useToast()

  const selectedTemplate = getSelectedTemplate(templates)

  const handleDownload = () => {
    toast({
      title: "Resume Downloaded",
      description: "Your tailored resume has been downloaded successfully.",
    })
  }

  if (!cvFile || !selectedTemplate) {
    return <div>Missing required data to preview resume</div>
  }

  return (
    <div className="step-container">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Preview Your Resume</h2>
        <RestartButton size="default" />
      </div>
      <p className="text-muted-foreground mb-8">
        Review your optimized resume and download it when you're ready.
      </p>

      <ResumePreview
        template={selectedTemplate}
        cvFile={cvFile}
        jobUrl={jobUrl}
        profilePicture={profilePicture}
        aiInstructions={aiInstructions}
        onDownload={handleDownload}
      />
    </div>
  )
}

export default PreviewStep
