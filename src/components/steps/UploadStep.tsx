import React, { useState, useEffect } from "react"

import ProfilePictureUpload from "@/components/ProfilePictureUpload"
import { useCvForm } from "@/context/CvFormContext"
import RestartButton from "@/components/RestartButton"
import FileUpload from "@/components/FileUpload"
import UrlInput from "@/components/UrlInput"

const UploadStep: React.FC = () => {
  const { state, dispatch, processJobUrl } = useCvForm()
  const { cvFile, jobUrl, jobDetails, profilePicture, isProcessingUrl } = state
  const [resetKey, setResetKey] = useState(0)

  // Monitor changes to form state to detect resets
  useEffect(() => {
    if (!cvFile && !jobUrl && !profilePicture) {
      // Increment reset key to force component remount when form is reset
      setResetKey((prev) => prev + 1)
    }
  }, [cvFile, jobUrl, profilePicture])

  const handleFileSelected = (file: File) => {
    dispatch({ type: "SET_CV_FILE", payload: file })
  }

  const handleUrlSubmit = (url: string) => {
    dispatch({ type: "SET_JOB_URL", payload: url })
  }

  const handleJobDetailsChange = (details: string) => {
    dispatch({ type: "SET_JOB_DETAILS", payload: details })
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
        {(cvFile || jobUrl || profilePicture) && <RestartButton />}
      </div>
      <p className="text-muted-foreground mb-8">
        We'll analyze both to create a tailored resume that highlights your
        relevant experience.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-base font-medium mb-3">Upload Resume</h3>
          <FileUpload
            key={`file-upload-${resetKey}`}
            onFileSelected={handleFileSelected}
            initialFile={cvFile}
          />
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-base font-medium mb-3">Job Posting URL</h3>
            <UrlInput
              key={`url-input-${resetKey}`}
              onUrlSubmit={handleUrlSubmit}
              initialUrl={jobUrl}
              initialJobText={jobDetails}
              onProcessUrl={processJobUrl}
              isProcessingUrl={isProcessingUrl}
              onJobDetailsChange={handleJobDetailsChange}
            />
          </div>

          <ProfilePictureUpload
            key={`profile-picture-${resetKey}`}
            onImageSelected={handleProfilePictureSelected}
            initialImage={profilePicture}
          />
        </div>
      </div>
    </div>
  )
}

export default UploadStep
