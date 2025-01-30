"use client"

import { useState, useCallback } from "react"
import { Send, Bot, User, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useDropzone } from "react-dropzone"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function ChatInterface() {
  const [file, setFile] = useState<File | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isUploaded, setIsUploaded] = useState(false)

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

  const handleUpload = async () => {
    if (!file) return

    setIsLoading(true)
    // Simulating file upload
    setTimeout(() => {
      setIsUploaded(true)
      setIsLoading(false)
      setMessages([
        { role: "assistant", content: `File "${file.name}" has been successfully uploaded. How can I assist you?` },
      ])
    }, 1500)
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulating API call
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content: "This is a simulated response from the AI assistant based on your uploaded document.",
      }
      setMessages((prevMessages) => [...prevMessages, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  if (!isUploaded) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
          <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Upload Document</h1>
          <div
            {...getRootProps()}
            className={`mb-4 cursor-pointer rounded-lg border-2 border-dashed p-6 text-center ${
              isDragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-600"
            }`}
          >
            <input {...getInputProps()} />
            {file ? (
              <p className="text-sm text-gray-600 dark:text-gray-300">{file.name}</p>
            ) : isDragActive ? (
              <p className="text-sm text-blue-500">Drop the file here</p>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Drag and drop a file here, or click to select a file
              </p>
            )}
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">Supported formats: PDF, DOC, DOCX</p>
          </div>
          <Button onClick={handleUpload} disabled={!file || isLoading} className="w-full">
            {isLoading ? (
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Uploading...
              </div>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </>
            )}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <header className="bg-white p-4 shadow dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chat Interface</h1>
      </header>
      <main className="flex-1 overflow-hidden p-4">
        <ScrollArea className="h-full">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex max-w-[80%] items-start rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
                  }`}
                >
                  <Avatar className="mr-3 h-8 w-8">
                    <AvatarImage src={message.role === "assistant" ? "/bot-avatar.png" : "/user-avatar.png"} />
                    <AvatarFallback>{message.role === "assistant" ? <Bot /> : <User />}</AvatarFallback>
                  </Avatar>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center justify-start">
                <div className="flex space-x-2 rounded-lg bg-white p-3 dark:bg-gray-800">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500" style={{ animationDelay: "0.2s" }} />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </main>
      <footer className="bg-white p-4 shadow dark:bg-gray-800">
        <div className="flex items-center space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 resize-none"
            rows={1}
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
            <Send className="mr-2 h-4 w-4" />
            Send
          </Button>
        </div>
      </footer>
    </div>
  )
}

