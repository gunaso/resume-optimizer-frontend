import { Sparkles } from "lucide-react"
import React from "react"

import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"

// Mock job details data since we're not actually scraping the website
const mockJobDetails = {
  title: "Senior Frontend Developer",
  company: "TechInnovate Solutions",
  location: "Remote (US-based)",
  description: `
## About the Role:
We are seeking an experienced Frontend Developer to join our growing team. You'll be responsible for building user interfaces for our enterprise SaaS products, collaborating with designers and backend developers to create intuitive, responsive, and accessible web applications.

## Key Requirements:
- 4+ years of experience with React and modern JavaScript
- Strong understanding of responsive design principles
- Experience with TypeScript, state management libraries
- Knowledge of build systems and performance optimization
- Ability to write clean, maintainable code
  `,
  skills: [
    "React",
    "TypeScript",
    "Responsive Design",
    "JavaScript",
    "CSS/SCSS",
    "Web Accessibility",
    "Performance Optimization",
  ],
  keyPoints: [
    "Enterprise SaaS product focus",
    "Collaborative team environment",
    "Modern tech stack",
    "Remote work position",
  ],
}

interface JobDetailsReviewProps {
  jobUrl: string
  onInstructionsChange: (instructions: string) => void
  aiInstructions: string
}

const JobDetailsReview: React.FC<JobDetailsReviewProps> = ({
  jobUrl,
  onInstructionsChange,
  aiInstructions,
}) => {
  return (
    <div className="w-full animate-fade-in">
      <h2 className="text-2xl font-semibold mb-4">Review Job Details</h2>
      <p className="text-muted-foreground mb-8">
        We've analyzed the job posting. Review the details and add any specific
        instructions for optimizing your resume.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-5 border shadow-sm">
            <h3 className="text-xl font-medium mb-2 flex items-center">
              <span className="bg-primary/10 p-1.5 rounded-full mr-2">
                <Sparkles className="h-4 w-4 text-primary" />
              </span>
              Job Details
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">
                  Position
                </h4>
                <p className="font-medium text-lg">{mockJobDetails.title}</p>
              </div>

              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">
                    Company
                  </h4>
                  <p>{mockJobDetails.company}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">
                    Location
                  </h4>
                  <p>{mockJobDetails.location}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">
                  Description
                </h4>
                <div className="mt-1 text-sm whitespace-pre-line bg-muted/30 p-3 rounded-md">
                  {mockJobDetails.description}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5 border shadow-sm">
            <h3 className="text-base font-medium mb-3">
              Key Skills Identified
            </h3>
            <div className="flex flex-wrap gap-2">
              {mockJobDetails.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5 border shadow-sm">
            <h3 className="text-base font-medium mb-3">Key Points</h3>
            <ul className="space-y-2">
              {mockJobDetails.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                    <Sparkles className="h-3 w-3 text-primary" />
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5 border shadow-sm">
            <h3 className="text-base font-medium mb-3">
              Additional Instructions for AI
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Add any specific instructions or preferences for the AI to
              consider when optimizing your resume.
            </p>
            <Textarea
              value={aiInstructions}
              onChange={(e) => onInstructionsChange(e.target.value)}
              placeholder="E.g., 'Highlight my leadership experience' or 'Focus on my technical skills in React'"
              className="min-h-[150px]"
            />
          </Card>

          <div className="bg-primary/5 rounded-md p-4 border">
            <h3 className="font-medium mb-2 flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>What Happens Next?</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              Our AI will analyze your resume along with this job posting and
              create a tailored version that highlights your most relevant
              skills and experience for this specific position.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-muted-foreground text-center">
        <p>
          Job details extracted from:{" "}
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
  )
}

export default JobDetailsReview
