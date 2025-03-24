import { UserRound, AlertCircle, Loader2, Camera } from "lucide-react"
import React, { useState, useRef, useEffect } from "react"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProfilePictureUploadProps {
  onImageSelected: (file: File) => void
  maxSizeMB?: number
  initialImage?: File | null
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  onImageSelected,
  maxSizeMB = 5,
  initialImage = null,
}) => {
  const [profileImage, setProfileImage] = useState<File | null>(initialImage)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Create preview URL when initialImage is provided
  useEffect(() => {
    if (initialImage && !previewUrl) {
      setProfileImage(initialImage)
      const newPreviewUrl = URL.createObjectURL(initialImage)
      setPreviewUrl(newPreviewUrl)

      // Cleanup function
      return () => {
        if (newPreviewUrl) URL.revokeObjectURL(newPreviewUrl)
      }
    }
  }, [initialImage])

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0])
    }
  }

  const simulateUpload = async () => {
    setIsUploading(true)

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsUploading(false)
  }

  const validateAndProcessFile = async (file: File) => {
    setError(null)

    // Check file type
    const fileType = file.type
    if (!fileType.startsWith("image/")) {
      setError("Please upload an image file")
      return
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSizeMB) {
      setError(`File size should not exceed ${maxSizeMB}MB`)
      return
    }

    // Create preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    const newPreviewUrl = URL.createObjectURL(file)
    setPreviewUrl(newPreviewUrl)
    setProfileImage(file)

    await simulateUpload()
    onImageSelected(file)
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="w-full mb-6 animate-fade-in">
      <h3 className="text-base font-medium mb-3">Profile Picture (Optional)</h3>
      <div className="flex flex-col items-center">
        <input
          type="file"
          className="sr-only"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileInputChange}
          disabled={isUploading}
        />

        <div className="flex items-center justify-center mb-4">
          <Avatar
            className={cn(
              "w-24 h-24 border-2 border-muted transition-all duration-300",
              profileImage && "border-primary"
            )}
          >
            {previewUrl ? (
              <AvatarImage src={previewUrl} alt="Profile picture" />
            ) : (
              <AvatarFallback className="bg-muted">
                {isUploading ? (
                  <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                ) : (
                  <UserRound className="h-12 w-12 text-muted-foreground" />
                )}
              </AvatarFallback>
            )}
          </Avatar>
        </div>

        <Button
          variant="outline"
          onClick={handleButtonClick}
          className="gap-2 transition-all duration-300 file-upload-button"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : profileImage ? (
            <>
              <Camera className="h-4 w-4" />
              <span>Change Picture</span>
            </>
          ) : (
            <>
              <Camera className="h-4 w-4" />
              <span>Upload Picture</span>
            </>
          )}
        </Button>

        {error && (
          <div className="flex items-center mt-2 text-destructive text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePictureUpload
