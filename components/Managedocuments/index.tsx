"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import {
  Trash2,
  RefreshCw,
  FileIcon,
  X,
  Upload,
  Globe,
  CheckCircle,
  AlertCircle,
  Database,
  FileText,
} from "lucide-react"
import { useDropzone } from "react-dropzone"
import Confetti from "react-confetti"
import { useWindowSize } from "react-use"

const FileList = () => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [fileToDelete, setFileToDelete] = useState(null)
  const [deletingFile, setDeletingFile] = useState(null)
  const [uploadFile, setUploadFile] = useState(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [url, setUrl] = useState("")
  const [htmlLoading, setHtmlLoading] = useState(false)
  const [tableName, setTableName] = useState("")
  const [dbCrawlLoading, setDbCrawlLoading] = useState(false)
  const [toasts, setToasts] = useState([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [activeTab, setActiveTab] = useState("file")

  
  const { width, height } = useWindowSize()

  const fetchFilesInitial = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/files/")
      setFiles(response.data)
    } catch (error) {
      console.error("Error fetching files:", error)
      showToast("Failed to load files. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  const fetchFilesWithToast = async () => {
    setRefreshing(true)
    try {
      const response = await axios.get("http://127.0.0.1:8000/files/")
      setFiles(response.data)
      showToast("Files list refreshed successfully", "success")
    } catch (error) {
      console.error("Error fetching files:", error)
      showToast("Failed to load files. Please try again.", "error")
    } finally {
      setRefreshing(false)
    }
  }

  // Delete file
  const deleteFile = async (filename) => {
    setDeletingFile(filename)
    try {
      await axios.delete(`http://127.0.0.1:8000/files/${filename}`)
      setFiles((prevFiles) => prevFiles.filter((file) => file !== filename))
      showToast(`${filename} has been successfully deleted.`, "success")
    } catch (error) {
      console.error("Error deleting file:", error)
      showToast("Failed to delete file. Please try again.", "error")
    } finally {
      setDeletingFile(null)
      setFileToDelete(null)
    }
  }

  // Handle file upload
  const handleFileUpload = async () => {
    if (!uploadFile) return

    setUploadLoading(true)
    const formData = new FormData()
    formData.append("file", uploadFile)

    try {
      await axios.post("http://127.0.0.1:8000/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      showToast(`${uploadFile.name} has been successfully uploaded.`, "success")
      setUploadFile(null)
      // Refresh the file list
      const response = await axios.get("http://127.0.0.1:8000/files/")
      setFiles(response.data)

      // Trigger confetti animation
      triggerConfetti()
    } catch (error) {
      console.error("Error uploading file:", error)
      showToast("Failed to upload file. Please try again.", "error")
    } finally {
      setUploadLoading(false)
    }
  }

  // Handle URL scraping
  const handleUrlScrape = async () => {
    if (!url.trim()) return

    setHtmlLoading(true)
    try {
      await axios.get(`http://127.0.0.1:8000/scrapehtmlpage/?url=${encodeURIComponent(url)}`)
      showToast(`Content from ${url} has been successfully processed.`, "success")
      setUrl("")
      // Refresh the file list
      const response = await axios.get("http://127.0.0.1:8000/files/")
      setFiles(response.data)

      // Trigger confetti animation
      triggerConfetti()
    } catch (error) {
      console.error("Error scraping URL:", error)
      showToast("Failed to process the webpage. Please try again.", "error")
    } finally {
      setHtmlLoading(false)
    }
  }

  // Handle database crawl
  const handleDatabaseCrawl = async () => {
    if (!tableName.trim()) return

    setDbCrawlLoading(true)
    try {
      const result = await axios.post("http://127.0.0.1:8000/crawl-database/", {
        table_name: tableName,
      })
      const { message, time_taken } = result.data
      showToast(`Database table "${tableName}" has been successfully crawled. ${message} in ${time_taken}.`, "success")
      setTableName("")
      // Refresh the file list
      const response = await axios.get("http://127.0.0.1:8000/files/")
      setFiles(response.data)

      // Trigger confetti animation
      triggerConfetti()
    } catch (error) {
      console.error("Error crawling database:", error)
      showToast("Failed to crawl database. Please try again.", "error")
    } finally {
      setDbCrawlLoading(false)
    }
  }

  // Function to trigger confetti animation
  const triggerConfetti = () => {
    setShowConfetti(true)
    setTimeout(() => {
      setShowConfetti(false)
    }, 5000)
  }

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setUploadFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "application/pdf": [".pdf"],
      // "application/msword": [".doc"],
      // "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
  })

  const showToast = (message, type) => {
    const id = Date.now()
    setToasts((prevToasts) => [...prevToasts, { id, message, type }])

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    }, 5000)
  }

  useEffect(() => {
    fetchFilesInitial()
  }, [])

  // Determine if dark mode (for styling)
  const isDark =
    typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches

  // Tab styles
  const getTabStyle = (tab) => {
    return `flex items-center justify-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
      activeTab === tab
        ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
        : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
    }`
  }

  return (
    <div className="flex flex-col min-h-screen">
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} gravity={0.3} />}
      <div className="flex flex-1 flex-col items-center justify-center p-4 md:mt-10 md:p-8">
        {/* Toast Notifications */}
        <div className="fixed right-4 top-10 z-50 mt-10 flex flex-col gap-3">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`flex items-center justify-between rounded-lg px-5 py-4 shadow-md transition-all duration-300 transform translate-x-0 ${
                toast.type === "error"
                  ? "bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-l-4 border-red-500 dark:from-red-900/90 dark:to-red-800/90 dark:text-red-100"
                  : "bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-l-4 border-green-500 dark:from-green-900/90 dark:to-green-800/90 dark:text-green-100"
              }`}
              style={{
                minWidth: "320px",
                maxWidth: "580px",
                width: "auto",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="flex items-center gap-3 flex-1 mr-2">
                {toast.type === "error" ? (
                  <div className="flex-shrink-0 p-1 rounded-full bg-red-200 dark:bg-red-700">
                    <AlertCircle size={16} className="text-red-600 dark:text-red-200" />
                  </div>
                ) : (
                  <div className="flex-shrink-0 p-1 rounded-full bg-green-200 dark:bg-green-700">
                    <CheckCircle size={16} className="text-green-600 dark:text-green-200" />
                  </div>
                )}
                <span className="font-medium break-normal">{toast.message}</span>
              </div>

              <button
                onClick={() => setToasts((prevToasts) => prevToasts.filter((t) => t.id !== toast.id))}
                className="rounded-full p-1.5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex-shrink-0"
                aria-label="Close notification"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        {/* Added extra margin at the top, especially for mobile */}
        <div className="w-full max-w-4xl mt-20 sm:mt-16 md:mt-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Upload and URL Section - Redesigned with tabs */}
            <div className="w-full md:w-1/2">
              <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 h-[520px]">
                <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">➕ Add Files to ISRA</h2>
                </div>

                {/* Tabs Navigation */}
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                  <button
                    className={`flex-1 ${getTabStyle("file")}`}
                    onClick={() => setActiveTab("file")}
                    aria-selected={activeTab === "file"}
                    role="tab"
                  >
                    <FileText size={18} />
                    <span>Upload File</span>
                  </button>
                  <button
                    className={`flex-1 ${getTabStyle("url")}`}
                    onClick={() => setActiveTab("url")}
                    aria-selected={activeTab === "url"}
                    role="tab"
                  >
                    <Globe size={18} />
                    <span>Web Page</span>
                  </button>
                  <button
                    className={`flex-1 ${getTabStyle("database")}`}
                    onClick={() => setActiveTab("database")}
                    aria-selected={activeTab === "database"}
                    role="tab"
                  >
                    <Database size={18} />
                    <span>Database</span>
                  </button>
                </div>

                {/* Tab Content */}
                <div className="flex flex-grow flex-col p-6">
                  {/* File Upload Tab */}
                  {activeTab === "file" && (
                    <div className="flex flex-col h-full">
                      <div
                        {...getRootProps()}
                        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors flex-grow flex flex-col items-center justify-center relative ${
                          isDragActive
                            ? "border-blue-500 bg-blue-500/10"
                            : uploadFile
                              ? "border-green-500 bg-green-500/10"
                              : isDark
                                ? "border-gray-600 hover:border-gray-500"
                                : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <input {...getInputProps()} />

                        {/* Show remove button when file is uploaded */}
                        {uploadFile && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setUploadFile(null)
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                            aria-label="Remove file"
                          >
                            <X className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                          </button>
                        )}

                        <div className="mb-4 rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                          {uploadFile ? (
                            <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                          ) : (
                            <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        <p className={isDark ? "text-gray-400 mb-2" : "text-gray-600 mb-2"}>
                          {uploadFile
                            ? uploadFile.name
                            : isDragActive
                              ? "Drop the file here"
                              : "Drag and drop a file, or click to select"}
                        </p>
                        <p className="text-sm text-gray-500">Supported formats: PDF Files</p>
                      </div>

                      <button
                        onClick={handleFileUpload}
                        disabled={!uploadFile || uploadLoading}
                        className="mt-6 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
                      >
                        {uploadLoading ? (
                          <div className="flex items-center">
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            Uploading...
                          </div>
                        ) : (
                          <>
                            <Upload className="mr-2 h-5 w-5" />
                            Upload File
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* URL Input Tab */}
                  {activeTab === "url" && (
                    <div className="flex flex-col h-full">
                      <div className="flex-grow flex flex-col items-center justify-center">
                        <div className="mb-2 rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                          <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Learn from Web Page</h3>
                        <p className="text-center mb-8 text-gray-600 dark:text-gray-300 max-w-md">
                          Enter a public webpage URL to extract and learn from its content
                        </p>
                        <div className="w-full max-w-md">
                          <label
                            htmlFor="url-input"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          >
                            Web Page URL
                          </label>
                          <input
                            id="url-input"
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://godeskless.html"
                            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            aria-describedby="url-description"
                          />
                          <p id="url-description" className="mt-1 text-sm text-gray-500">
                            The content will be processed and added to your knowledge base
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handleUrlScrape}
                        disabled={!url.trim() || htmlLoading}
                        className="mt-6 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
                      >
                        {htmlLoading ? (
                          <div className="flex items-center">
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            Processing Web Page...
                          </div>
                        ) : (
                          <>
                            <Globe className="mr-2 h-5 w-5" />
                            Learn from Web Page
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Database Crawl Tab */}
                  {activeTab === "database" && (
                    <div className="flex flex-col h-full">
                      <div className="flex-grow flex flex-col items-center justify-center">
                        <div className="mb-2 rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                          <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Crawl Database</h3>
                        <p className="text-center mb-8 text-gray-600 dark:text-gray-300 max-w-md">
                          Extract and Ingest data from the Database
                        </p>
                        <div className="w-full max-w-md">
                          <label
                            htmlFor="table-input"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          >
                            Table Name
                          </label>
                          <input
                            id="table-input"
                            type="text"
                            value={tableName}
                            onChange={(e) => setTableName(e.target.value)}
                            placeholder="Enter table name"
                            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            aria-describedby="table-description"
                          />
                          <p id="table-description" className="mt-1 text-sm text-gray-500">
                            The table data will be processed and added to your knowledge base
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handleDatabaseCrawl}
                        disabled={!tableName.trim() || dbCrawlLoading}
                        className="mt-6 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
                        aria-live="polite"
                      >
                        {dbCrawlLoading ? (
                          <div className="flex items-center">
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            Crawling Database...
                          </div>
                        ) : (
                          <>
                            <Database className="mr-2 h-5 w-5" />
                            Crawl Database
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* File List Section */}
            <div className="w-full md:w-1/2">
              <div className="flex h-[520px] w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 py-3 px-4 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">🔍 ISRA Knowledge Base</h2>
                  <button
                    onClick={fetchFilesWithToast}
                    className={`rounded-full p-2 transition-colors ${
                      refreshing
                        ? "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    }`}
                    disabled={refreshing}
                    aria-label="Refresh file list"
                  >
                    <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
                  </button>
                </div>

                {/* File List Content */}
                <div className="flex flex-grow flex-col p-4 overflow-hidden">
                  {loading ? (
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className="flex animate-pulse items-center gap-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
                        >
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                          <div className="h-4 flex-1 rounded bg-gray-200 dark:bg-gray-600"></div>
                          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                        </div>
                      ))}
                    </div>
                  ) : files.length === 0 ? (
                    <div className="flex flex-grow flex-col items-center justify-center py-8 text-center">
                      <div className="mb-3 rounded-full bg-gray-100 p-3 dark:bg-gray-700">
                        <FileIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white">No files uploaded</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Upload files, scrape web pages, or crawl databases to see them listed here.
                      </p>
                    </div>
                  ) : (
                    <div className="h-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                      <ul className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto max-h-[380px]">
                        {files.map((file) => (
                          <li
                            key={file}
                            className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          >
                            <div className="flex items-center space-x-3 overflow-hidden">
                              <FileIcon className="h-5 w-5 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                              <span className="truncate font-medium text-gray-800 dark:text-gray-200" title={file}>
                                {file}
                              </span>
                            </div>
                            <button
                              onClick={() => setFileToDelete(file)}
                              disabled={deletingFile === file}
                              className={`rounded-full p-2 transition-colors ${
                                deletingFile === file
                                  ? "bg-red-100 text-red-400 cursor-not-allowed dark:bg-red-900/20 dark:text-red-300"
                                  : "text-red-500 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                              }`}
                              aria-label={`Delete ${file}`}
                            >
                              {deletingFile === file ? (
                                <RefreshCw size={18} className="animate-spin" />
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete confirmation modal with text wrapping */}
        {fileToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div
              className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-dialog-title"
            >
              <h3 id="delete-dialog-title" className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Delete file
              </h3>
              <p className="mb-4 text-gray-600 dark:text-gray-300 break-words">
                Are you sure you want to delete "{fileToDelete}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setFileToDelete(null)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => fileToDelete && deleteFile(fileToDelete)}
                  disabled={deletingFile === fileToDelete}
                  className={`rounded-md ${
                    deletingFile === fileToDelete ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                  } px-4 py-2 text-white transition-colors`}
                >
                  {deletingFile === fileToDelete ? (
                    <span className="flex items-center">
                      <RefreshCw size={16} className="mr-2 animate-spin" />
                      Deleting...
                    </span>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FileList

