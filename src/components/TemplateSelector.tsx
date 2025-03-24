import { Check } from "lucide-react"
import React from "react"

import { cn } from "@/lib/utils"

export interface Template {
  id: string
  name: string
  preview: string
  description: string
}

interface TemplateSelectorProps {
  templates: Template[]
  selectedTemplate: string | null
  onSelectTemplate: (templateId: string) => void
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selectedTemplate,
  onSelectTemplate,
}) => {
  return (
    <div className="w-full animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className={cn(
              "template-card animate-scale-in",
              selectedTemplate === template.id && "selected"
            )}
            onClick={() => onSelectTemplate(template.id)}
          >
            <div className="aspect-[3/4] bg-muted relative overflow-hidden">
              <img
                src={template.preview}
                alt={template.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-fade-in">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-base">{template.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {template.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TemplateSelector
