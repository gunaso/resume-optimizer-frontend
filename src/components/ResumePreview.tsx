import React, { useState } from "react"
import {
  ArrowRight,
  Briefcase,
  UserRound,
  Sparkles,
  Download,
} from "lucide-react"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Template } from "./TemplateSelector"
import { Card } from "@/components/ui/card"
import { MarkdownPreview } from "@/components/MarkdownPreview"

interface ResumePreviewProps {
  template: Template
  cvFile: File
  jobUrl: string
  profilePicture?: File | null
  aiInstructions?: string
  jobDetails?: string
  onDownload: () => void
}

// Mocked AI explanations
const mockAIChanges = [
  {
    id: "skills",
    title: "Skills Highlighted",
    description:
      "Added emphasis on your React proficiency and TypeScript experience to match the job requirements.",
  },
  {
    id: "projects",
    title: "Projects Reordered",
    description:
      "Moved your SaaS platform project to the top, as it directly relates to the company's enterprise SaaS focus.",
  },
  {
    id: "keywords",
    title: "Keywords Added",
    description:
      "Incorporated terms like 'responsive design', 'accessibility', and 'performance optimization' that appear in the job listing.",
  },
  {
    id: "format",
    title: "Format Optimized",
    description:
      "Streamlined your experience section to highlight achievements that demonstrate collaboration skills mentioned in the job description.",
  },
]

const ResumePreview: React.FC<ResumePreviewProps> = ({
  template,
  cvFile,
  jobUrl,
  profilePicture = null,
  aiInstructions = "",
  jobDetails = "",
  onDownload,
}) => {
  const [activeTab, setActiveTab] = useState("preview")
  const fileUrl = cvFile ? URL.createObjectURL(cvFile) : ""
  const profilePictureUrl = profilePicture
    ? URL.createObjectURL(profilePicture)
    : ""

  return (
    <div className="w-full animate-fade-in">
      <div className="bg-card rounded-xl overflow-hidden border shadow-md">
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {profilePicture && (
                <Avatar className="w-10 h-10 border border-muted">
                  <AvatarImage src={profilePictureUrl} alt="Profile picture" />
                  <AvatarFallback>
                    <UserRound className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div>
                <h3 className="font-medium">Your Optimized CV</h3>
                <p className="text-sm text-muted-foreground">
                  {template.name} Template
                </p>
              </div>
            </div>
            <Button onClick={onDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Download CV
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 pt-6">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>CV Preview</span>
              </TabsTrigger>
              <TabsTrigger value="job" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span>Job Details</span>
              </TabsTrigger>
              <TabsTrigger value="changes" className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                <span>AI Changes</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="preview"
            className="p-6 focus-visible:outline-none"
          >
            <div className="aspect-[3/4] max-w-md mx-auto border rounded-md overflow-hidden shadow-sm">
              {cvFile && cvFile.type.startsWith("image/") ? (
                <img
                  src={fileUrl}
                  alt="CV Preview"
                  className="w-full h-full object-contain"
                  onLoad={() => URL.revokeObjectURL(fileUrl)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted/30">
                  <div className="text-center p-4">
                    <div className="flex justify-center mb-4">
                      {profilePicture && (
                        <Avatar className="w-20 h-20 border-2 border-muted">
                          <AvatarImage
                            src={profilePictureUrl}
                            alt="Profile picture"
                            onLoad={() =>
                              URL.revokeObjectURL(profilePictureUrl)
                            }
                          />
                          <AvatarFallback>
                            <UserRound className="h-10 w-10" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                    <img
                      src={template.preview}
                      alt={template.name}
                      className="w-full h-auto max-h-[300px] object-contain mb-4"
                    />
                    <p className="text-sm text-muted-foreground">
                      Your CV has been formatted according to this template
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent
            value="job"
            className="px-6 pb-6 focus-visible:outline-none"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium">Job Details Analysis</h4>
                {jobUrl && (
                  <a
                    href={jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    View Original Posting
                  </a>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Card className="p-5 border shadow-sm">
                    <h3 className="text-xl font-medium mb-2 flex items-center">
                      <span className="bg-primary/10 p-1.5 rounded-full mr-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </span>
                      Job Details
                    </h3>

                    {jobDetails ? (
                      <div className="mt-1 text-sm bg-muted/30 p-3 rounded-md max-h-[400px] overflow-y-auto">
                        <MarkdownPreview content={jobDetails} />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            No detailed job information available.
                          </p>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>

                <div className="space-y-6">
                  {aiInstructions && (
                    <Card className="p-5 border shadow-sm">
                      <h3 className="text-base font-medium mb-3">
                        Your Additional Instructions
                      </h3>
                      <p className="text-sm italic">{aiInstructions}</p>
                    </Card>
                  )}

                  <div className="bg-primary/5 rounded-md p-4 border">
                    <h3 className="font-medium mb-2 flex items-center gap-1">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span>Why Your CV Was Tailored This Way</span>
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Based on the job requirements above, we've customized your
                      CV to emphasize your relevant skills and experience. Check
                      the "AI Changes" tab to see the specific optimizations
                      made to match this position.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="changes"
            className="px-6 pb-6 focus-visible:outline-none"
          >
            <div className="space-y-6">
              <h4 className="text-lg font-medium">Changes Made to Your CV</h4>
              <p className="text-muted-foreground">
                Our AI tailored your CV to highlight the most relevant
                experience and skills for this specific job posting. Here's what
                we optimized:
              </p>

              <div className="space-y-4">
                {mockAIChanges.map((change) => (
                  <div
                    key={change.id}
                    className="border rounded-md p-4 transition-all hover:bg-muted/10"
                  >
                    <h5 className="font-medium flex items-center gap-2 mb-1">
                      <Sparkles className="h-4 w-4 text-primary" />
                      {change.title}
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      {change.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-primary/5 border rounded-md p-4 mt-6">
                <h5 className="font-medium mb-2">Pro Tip</h5>
                <p className="text-sm text-muted-foreground">
                  When applying, reference some of these optimizations in your
                  cover letter to create a consistent narrative between your CV
                  and application.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 px-6 pb-6 text-sm text-muted-foreground text-center">
          <p>
            CV content has been optimized to match the job posting at:{" "}
            <a
              href={jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
            >
              {jobUrl}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResumePreview
