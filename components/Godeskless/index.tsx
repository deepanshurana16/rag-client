"use client"

import type React from "react"

import { useState, useCallback, useEffect, useRef } from "react"
import { Upload, Send, User, Mic, Globe } from "lucide-react"
import axios from "axios"
import { useDropzone } from "react-dropzone"
import stars from "../../assets/starsslate1.png"
import gemini from "../../assets/geminii.png"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Message {
  role: "user" | "assistant"
  content: string
}

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

const GoDeskless = () => {
  const [file, setFile] = useState<File | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [input, setInput] = useState<string>("")
  const [uploadLoading, setUploadLoading] = useState<boolean>(false)
  const [htmlLoading, setHtmlLoading] = useState<boolean>(false)
  const [chatLoading, setChatLoading] = useState<boolean>(false)
  const [isUploaded, setIsUploaded] = useState<boolean>(false)
  const [isDark, setIsDark] = useState<boolean>(true)
  const messageListRef = useRef<HTMLDivElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [ticketId, setTicketId] = useState("")
  const [ticketSubject, setTicketSubject] = useState("")
  const [resolution, setResolution] = useState("")
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const uploadButtonText = uploadLoading ? "Uploading..." : "Upload Document"
  const uploadButtonDisabled = !file || uploadLoading || htmlLoading
  const inputFieldStyle = `w-full resize-none rounded-lg border-2 border-black px-4 py-2 pr-24 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`
  const messageContentStyle = (role: string) =>
    `rounded-lg px-4 py-2 ${
      role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
    }`
  const [url, setUrl] = useState<string>("")

  useEffect(() => {
    const checkForFiles = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get("http://localhost:8000/files/")
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          // Files exist, go directly to chat
          setIsUploaded(true)
          setMessages([{ role: "assistant", content: "Welcome back! Your documents are ready. How can I help you?" }])
        } else {
          // No files, show upload screen
          setIsUploaded(false)
        }
      } catch (error) {
        console.error("Error checking for files:", error)
        setIsUploaded(false)
      } finally {
        setIsLoading(false)
      }
    }
  
    checkForFiles()
  }, [])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    multiple: false,
  })

  const uploadFile = async () => {
    if (!file) return alert("Please select a file before uploading.")

    const formData = new FormData()
    formData.append("file", file)

    try {
      setUploadLoading(true)
      const res = await axios.post("http://127.0.0.1:8000/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setMessages([{ role: "assistant", content: res.data.message }])
      setFile(null)
      setIsUploaded(true)
    } catch (err: any) {
      console.error("Error uploading file:", err)
      setMessages([
        {
          role: "assistant",
          content: "Error uploading file: " + (err.response?.data?.detail || err.message || "Unknown error"),
        },
      ])
    } finally {
      setUploadLoading(false)
    }
  }

  const askQuestion = async () => {
    if (!input.trim()) return

    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setChatLoading(true)

    try {
      const res = await axios.post("http://127.0.0.1:8000/ask/", {
        prompt: input,
      })

      if (res.data.clarification_needed) {
        // Show only clarification message
        const clarificationMessage = {
          role: "assistant",
          content: `Clarification Needed: ${res.data.clarification_needed}`,
        }
        setMessages((prev) => [...prev, clarificationMessage])
      } else {
        const assistantMessage = { role: "assistant", content: res.data.answer }
        setMessages((prev) => [...prev, assistantMessage])
      }
    } catch (err: any) {
      console.error("Error fetching response:", err)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error fetching response: " + (err.response?.data?.detail || err.message || "Unknown error"),
        },
      ])
    } finally {
      setChatLoading(false)
    }
  }

  const fetchInsight = async () => {
    if (!input.trim()) return

    const userMessage = { role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setChatLoading(true)

    try {
      const res = await axios.post("http://127.0.0.1:8000/insights/", {
        prompt: input,
      })
      setMessages((prev) => [...prev, { role: "assistant", content: "AI Insight: " + res.data.insight }])
    } catch (err: any) {
      console.error("Error fetching response:", err)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error fetching response: " + (err.response?.data?.detail || err.message || "Unknown error"),
        },
      ])
    } finally {
      setChatLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!ticketId || !ticketSubject || !resolution) {
      alert("All fields are required")
      return
    }
    setChatLoading(true)
    try {
      await axios.post("http://127.0.0.1:8000/ticket", {
        ticket_id: ticketId,
        ticket_subject: ticketSubject,
        resolution,
      })
      alert("Ticket submitted successfully!")
      setIsModalOpen(false)
      setTicketId("")
      setTicketSubject("")
      setResolution("")
    } catch (error) {
      console.error("Error submitting ticket", error)
      alert("Failed to submit ticket")
      setTicketId("")
      setTicketSubject("")
      setResolution("")
    } finally {
      setChatLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      askQuestion()
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognitionRef.current = recognition
        recognition.lang = "en-US"
        recognition.continuous = true
        recognition.interimResults = false

        recognition.onresult = (event: any) => {
          let transcript = ""
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript + " "
          }
          setInput((prevInput) => prevInput + " " + transcript)
        }

        recognition.onend = () => {
          setIsRecording(false)
        }

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
        }
      } else {
        console.warn("Speech recognition is not supported in this browser.")
      }
    }
  }, [])

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.")
      return
    }

    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      recognitionRef.current.start()
      setIsRecording(true)
    }
  }

  const scrapeHtml = async () => {
    if (!url.trim()) return alert("Please enter a URL before scraping.")

    try {
      setHtmlLoading(true)
      const res = await axios.get(`http://127.0.0.1:8000/scrapehtmlpage/?url=${encodeURIComponent(url)}`)
      setMessages([{ role: "assistant", content: res.data.message }])
      setUrl("")
      setIsUploaded(true)
    } catch (err: any) {
      console.error("Error scraping HTML:", err)
      setMessages([
        {
          role: "assistant",
          content: "Error scraping HTML: " + (err.response?.data?.detail || err.message || "Unknown error"),
        },
      ])
    } finally {
      setHtmlLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-lg dark:text-white">Checking for documents...</p>
        </div>
      </div>
    )
  }

  if (!isUploaded) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex flex-1 flex-col items-center justify-center px-4 pb-20 pt-16 mt-12 sm:mt-16 md:mt-20">
          <div className="w-full max-w-4xl mt-4 sm:mt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* File Upload Section */}
              <div className="flex-1 flex flex-col">
                <div
                  {...getRootProps()}
                  className={`cursor-pointer rounded-lg border-2 border-dashed p-6 sm:p-8 text-center transition-colors flex-grow ${
                    isDragActive
                      ? "border-blue-500 bg-blue-500/10"
                      : file
                        ? "border-green-500 bg-green-500/10"
                        : isDark
                          ? "border-gray-600 hover:border-gray-500"
                          : "border-gray-300 hover:border-gray-400"
                  } ${url ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <input {...getInputProps()} disabled={!!url} />
                  <p className={isDark ? "text-gray-400 mb-8" : "text-gray-600 mb-8"}>
                    {file
                      ? file.name
                      : isDragActive
                        ? "Drop the file here"
                        : "Drag and drop a file, or click to select"}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">Supported formats: PDF, DOC, DOCX</p>
                </div>
                <button
                  onClick={uploadFile}
                  disabled={uploadButtonDisabled || !!url}
                  className="mt-4 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploadLoading ? (
                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Uploading...
                    </div>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      {uploadButtonText}
                    </>
                  )}
                </button>
              </div>

              {/* OR Divider */}
              <div className="flex items-center justify-center my-2 md:my-0">
                <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
                <span className="px-4 text-sm text-gray-500 dark:text-gray-400">OR</span>
                <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
              </div>

              {/* URL Input Section */}
              <div className="flex-1 flex flex-col">
                <div
                  className={`rounded-lg border-2 border-dashed p-6 sm:p-8 text-center transition-colors flex-grow ${
                    url
                      ? "border-green-500 bg-green-500/10"
                      : isDark
                        ? "border-gray-600 hover:border-gray-500"
                        : "border-gray-300 hover:border-gray-400"
                  } ${file ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <p className={isDark ? "text-gray-400 mb-4" : "text-gray-600 mb-4"}>
                    Enter a webpage URL to learn from
                  </p>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={!!file}
                    placeholder="https://godeskless.html"
                    className="w-full bg-transparent text-center focus:outline-none p-2 border-b border-gray-300 dark:border-gray-700"
                  />
                </div>
                <button
                  onClick={scrapeHtml}
                  disabled={htmlLoading || !url.trim() || !!file || uploadLoading}
                  className="mt-4 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {htmlLoading ? (
                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Learning from HTML....
                    </div>
                  ) : (
                    <>
                      <Globe className="mr-2 h-4 w-4" />
                      Learn from HTML
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto pb-20 pt-8" ref={messageListRef} style={{ paddingBottom: "60px" }}>
        <div className="mx-auto mt-8 max-w-2xl space-y-4 px-4 py-8">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <Image
                  src={gemini || "/placeholder.svg"}
                  alt="Assistant"
                  width={24}
                  height={24}
                  className="mr-2 h-4 w-4 rounded-full sm:h-10 sm:w-10"
                />
              )}
              <div
                className={`rounded-lg px-4 py-2 ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
                }`}
              >
                <ReactMarkdown className="prose" remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
              {message.role === "user" && (
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    isDark ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  <User className={`h-5 w-5 ${isDark ? "text-gray-300" : "text-gray-600"}`} />
                </div>
              )}
            </div>
          ))}
          {chatLoading && (
            <div className="flex items-center space-x-2">
              <Image
                src={gemini || "/placeholder.svg"}
                alt="Assistant"
                width={24}
                height={24}
                className="mr-2 h-4 w-4 rounded-full sm:h-10 sm:w-10"
              />
              <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0.2s" }}></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0.4s" }}></div>
            </div>
          )}
        </div>
      </div>
      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-4 py-4 shadow-md dark:bg-black dark:text-white">
        <div className="mx-auto max-w-xl">
          <div className="relative flex items-center">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask anything..."
              className={`${inputFieldStyle} pr-48`}
              rows={1}
              style={{
                minHeight: "44px",
                resize: "none",
                overflowY: "auto",
                maxHeight: "200px",
              }}
            />
            <div className="absolute right-2 flex items-center space-x-2">
              <div className="h-8 w-px bg-gray-300 dark:bg-gray-700 mr-2"></div>
              <button
                onClick={askQuestion}
                disabled={chatLoading || !input.trim()}
                className={`rounded-lg p-2 ${
                  isDark ? "text-gray-400 hover:text-black" : "text-gray-600 hover:text-gray-900"
                } disabled:opacity-50`}
              >
                <Send className="h-5 w-5" />
              </button>
              <button
                onClick={fetchInsight}
                disabled={chatLoading || !input.trim()}
                className={`rounded-lg p-2 ${
                  isDark ? "text-gray-400 hover:text-black" : "text-gray-600 hover:text-gray-900"
                } disabled:brightness-150% hover:brightness-50 hover:filter`}
              >
                <Image src={stars || "/placeholder.svg"} alt="Send" className="h-7 w-7" />
              </button>
              <button onClick={() => setIsModalOpen(true)}>
                <Image src={gemini || "/placeholder.svg"} alt="Gemini" className="h-7 w-7" />
              </button>
              {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-full h-full">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full flex-col">
                    <h2 className="text-xl font-semibold mb-4">Submit Ticket</h2>
                    <input
                      type="text"
                      placeholder="#Ticket ID"
                      value={ticketId}
                      onChange={(e) => setTicketId(e.target.value)}
                      className="w-full mb-2 p-2 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Ticket Subject"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      className="w-full mb-2 p-2 border rounded"
                    />
                    <textarea
                      placeholder="Issue Resolution "
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      className="w-full mb-2 p-2 border rounded"
                    ></textarea>
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => {
                          setIsModalOpen(false)
                          setTicketId("")
                          setTicketSubject("")
                          setResolution("")
                        }}
                        className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        disabled={chatLoading}
                      >
                        {chatLoading ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <button
                onClick={toggleListening}
                className={`flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white transition-all hover:bg-blue-700 ${
                  isRecording ? "animate-pulse" : ""
                } mr-2`}
              >
                <Mic className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoDeskless

