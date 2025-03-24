import { RefreshCw } from "lucide-react"
import React from "react"

import ProfilePictureUpload from "@/components/ProfilePictureUpload"
import { useCvForm } from "@/context/CvFormContext"
import FileUpload from "@/components/FileUpload"
import { Button } from "@/components/ui/button"
import UrlInput from "@/components/UrlInput"

const UploadStep: React.FC = () => {
  const { state, dispatch, resetForm } = useCvForm()
  const { cvFile, jobUrl, profilePicture } = state

  const handleFileSelected = (file: File) => {
    dispatch({ type: "SET_CV_FILE", payload: file })
  }

  const handleUrlSubmit = (url: string) => {
    dispatch({ type: "SET_JOB_URL", payload: url })
  }

  const handleProfilePictureSelected = (file: File) => {
    dispatch({ type: "SET_PROFILE_PICTURE", payload: file })
  }

  return (
    <div className="step-container">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">
          Upload Your Resume & Job Posting
        </h2>
        {(cvFile || jobUrl || profilePicture) && (
          <Button
            variant="outline"
            size="sm"
            onClick={resetForm}
            className="gap-2 text-muted-foreground hover:text-destructive"
          >
            <RefreshCw className="h-4 w-4" />
            Restart
          </Button>
        )}
      </div>
      <p className="text-muted-foreground mb-8">
        We'll analyze both to create a tailored resume that highlights your
        relevant experience.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-base font-medium mb-3">Upload Resume</h3>
          <FileUpload
            onFileSelected={handleFileSelected}
            initialFile={cvFile}
          />
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-base font-medium mb-3">Job Posting URL</h3>
            <UrlInput onUrlSubmit={handleUrlSubmit} initialUrl={jobUrl} />
          </div>

          <ProfilePictureUpload
            onImageSelected={handleProfilePictureSelected}
            initialImage={profilePicture}
          />
        </div>
      </div>
    </div>
  )
}

export default UploadStep
