import React, { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

import { Progress } from "@/components/ui/progress"

const loadingPhrases = [
  "Warming up our systems...",
  "AI is doing its magic...",
  "Optimizing your CV for the job...",
  "Matching your skills to the job requirements...",
  "Crafting the perfect CV...",
  "Analyzing job keywords...",
  "Highlighting your relevant experience...",
  "Making you look awesome on paper...",
  "Teaching the AI about your expertise...",
  "Polishing your professional story...",
]

interface GeneratingCvLoaderProps {
  onComplete?: () => void
}

const GeneratingCvLoader: React.FC<GeneratingCvLoaderProps> = ({
  onComplete,
}) => {
  const [progress, setProgress] = useState(0)
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)

  useEffect(() => {
    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 3

        // Complete when reaching 100%
        if (next >= 100) {
          clearInterval(interval)
          if (onComplete) {
            setTimeout(onComplete, 500)
          }
          return 100
        }

        return next
      })
    }, 200)

    // Cycle through phrases
    const phraseInterval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % loadingPhrases.length)
    }, 3000)

    return () => {
      clearInterval(interval)
      clearInterval(phraseInterval)
    }
  }, [onComplete])

  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center">
      <div className="relative w-24 h-24">
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/10"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </div>
      </div>

      <motion.div
        className="h-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        key={currentPhraseIndex}
      >
        <h3 className="text-xl font-medium">
          {loadingPhrases[currentPhraseIndex]}
        </h3>
      </motion.div>

      <div className="w-full max-w-md">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground mt-2">
          {Math.round(progress)}% complete
        </p>
      </div>
    </div>
  )
}

export default GeneratingCvLoader
