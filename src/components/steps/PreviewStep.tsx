import React from "react"
import { useCvForm } from "@/context/CvFormContext"
import CVPreview from "@/components/CVPreview"
import { templates } from "@/data/templates"
import { useToast } from "@/hooks/use-toast"

const PreviewStep: React.FC = () => {
  const { state, getSelectedTemplate } = useCvForm()
  const { cvFile, jobUrl, profilePicture, aiInstructions } = state
  const { toast } = useToast()

  const selectedTemplate = getSelectedTemplate(templates)

  const handleDownload = () => {
    toast({
      title: "CV Downloaded",
      description: "Your tailored CV has been downloaded successfully.",
    })
  }

  if (!cvFile || !selectedTemplate) {
    return <div>Missing required data to preview CV</div>
  }

  return (
    <div className="step-container">
      <h2 className="text-2xl font-semibold mb-4">Preview Your CV</h2>
      <p className="text-muted-foreground mb-8">
        Review your optimized CV and download it when you're ready.
      </p>

      <CVPreview
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
