import React from "react"

import TemplateSelector from "@/components/TemplateSelector"
import { useCvForm } from "@/context/CvFormContext"
import RestartButton from "@/components/RestartButton"
import { templates } from "@/data/templates"

const TemplateSelectionStep: React.FC = () => {
  const { state, dispatch } = useCvForm()
  const { selectedTemplateId } = state

  const handleTemplateSelect = (templateId: string) => {
    dispatch({ type: "SET_TEMPLATE", payload: templateId })
  }

  return (
    <div className="step-container">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Choose a Template</h2>
        <RestartButton />
      </div>
      <p className="text-muted-foreground mb-8">
        Select a template that best represents your professional identity.
      </p>

      <TemplateSelector
        templates={templates}
        selectedTemplate={selectedTemplateId}
        onSelectTemplate={handleTemplateSelect}
      />
    </div>
  )
}

export default TemplateSelectionStep
