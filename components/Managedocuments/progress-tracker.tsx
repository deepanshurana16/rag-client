"use client"

import { useState, useEffect } from "react"
import { X, Database, CheckCircle, AlertCircle, Clock } from "lucide-react"

// Define the progress data type
interface ProgressData {
  status: "started" | "in_progress" | "completed" | "error"
  message?: string
  processed_rows?: number
  total_rows?: number
  progress_percentage?: number
  time_taken?: string
  error?: string
}

interface ProgressTrackerProps {
  progressData: ProgressData | null
  onClose: () => void
  tableName: string
}

const ProgressTracker = ({ progressData, onClose, tableName }: ProgressTrackerProps) => {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)

  // Start timer when component mounts or when status changes to "started"
  useEffect(() => {
    if (progressData?.status === "started" && !startTime) {
      setStartTime(Date.now())
    }

    // Reset timer if completed or error
    if (progressData?.status === "completed" || progressData?.status === "error") {
      setStartTime(null)
    }
  }, [progressData?.status, startTime])

  // Update elapsed time every second
  useEffect(() => {
    if (!startTime) return

    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => clearInterval(timer)
  }, [startTime])

  // Format seconds to mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Get status color
  const getStatusColor = () => {
    switch (progressData?.status) {
      case "completed":
        return "bg-green-500"
      case "error":
        return "bg-red-500"
      case "in_progress":
      case "started":
      default:
        return "bg-blue-500"
    }
  }

  // Get status icon
  const StatusIcon = () => {
    switch (progressData?.status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "in_progress":
      case "started":
      default:
        return <Database className="h-5 w-5 text-blue-500" />
    }
  }

  // Calculate progress percentage
  const progressPercentage =
    progressData?.progress_percentage ||
    (progressData?.processed_rows && progressData?.total_rows
      ? (progressData.processed_rows / progressData.total_rows) * 100
      : 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <StatusIcon />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Database Crawl {progressData?.status === "completed" ? "Complete" : "Progress"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            aria-label="Close progress tracker"
          >
            <X className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            {progressData?.message || `Processing table: ${tableName}`}
          </p>

          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {progressData?.processed_rows || 0} of {progressData?.total_rows || "?"} rows
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {progressPercentage.toFixed(1)}%
            </span>
          </div>

          <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div className={`h-2.5 rounded-full ${getStatusColor()}`} style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            <span>{progressData?.time_taken || `Elapsed: ${formatTime(elapsedTime)}`}</span>
          </div>

          {progressData?.status === "error" && (
            <div className="text-red-500 mt-2">
              <p className="font-medium">Error: {progressData.error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProgressTracker

