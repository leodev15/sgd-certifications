"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

interface ExamTimerProps {
  duration: number // in seconds
  onTimeUp: () => void
  isActive: boolean
}

export function ExamTimer({ duration, onTimeUp, isActive }: ExamTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    if (!isActive) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, onTimeUp])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const isWarning = timeLeft <= 120 // Last 2 minutes
  const isCritical = timeLeft <= 60 // Last minute

  return (
    <div
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-mono text-lg font-bold ${
        isCritical
          ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
          : isWarning
            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
            : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
      }`}
    >
      <Clock className="h-5 w-5" />
      <span>
        {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  )
}
