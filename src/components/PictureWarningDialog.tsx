import { AlertTriangle, Check, Camera } from "lucide-react"
import React from "react"

import { useCvForm } from "@/context/CvFormContext"
import { Button } from "@/components/ui/button"
import {
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dialog,
} from "@/components/ui/dialog"

const PictureWarningDialog: React.FC = () => {
  const { state, dispatch, proceedToNextStep } = useCvForm()
  const { showPictureWarning } = state

  const handleContinueWithoutPicture = () => {
    dispatch({ type: "SET_PICTURE_WARNING", payload: false })
    proceedToNextStep()
  }

  const handleUploadProfilePicture = () => {
    dispatch({ type: "SET_PICTURE_WARNING", payload: false })
    document
      .querySelector(".file-upload-button")
      ?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <Dialog
      open={showPictureWarning}
      onOpenChange={(open) =>
        dispatch({ type: "SET_PICTURE_WARNING", payload: open })
      }
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            No Profile Picture
          </DialogTitle>
          <DialogDescription>
            A study shows that resumes that contain a professional portrait have
            a higher chance of being noticed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleContinueWithoutPicture}
            className="gap-2"
          >
            <Check className="h-4 w-4" />
            Continue Without Picture
          </Button>
          <Button
            type="button"
            onClick={handleUploadProfilePicture}
            className="gap-2"
          >
            <Camera className="h-4 w-4" />
            Upload Picture
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PictureWarningDialog
