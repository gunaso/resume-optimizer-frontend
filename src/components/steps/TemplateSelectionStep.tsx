import React from "react"

import TemplateSelector from "@/components/TemplateSelector"
import { useCvForm } from "@/context/CvFormContext"
import { templates } from "@/data/templates"

const TemplateSelectionStep: React.FC = () => {
  const { state, dispatch } = useCvForm()
  const { selectedTemplateId } = state

  const handleTemplateSelect = (templateId: string) => {
    dispatch({ type: "SET_TEMPLATE", payload: templateId })
  }

  return (
    <div className="step-container">
      <h2 className="text-2xl font-semibold mb-4">Choose a Template</h2>
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
