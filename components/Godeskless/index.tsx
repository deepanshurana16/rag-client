// "use client"

// import type React from "react"

// import { useState, useCallback, useEffect, useRef } from "react"
// import { Upload, Send, User, Mic, Globe } from "lucide-react"
// import axios from "axios"
// import { useDropzone } from "react-dropzone"
// import stars from "../../assets/starsslate1.png"
// import gemini from "../../assets/geminii.png"
// import Image from "next/image"
// import ReactMarkdown from "react-markdown"
// import remarkGfm from "remark-gfm"

// interface Message {
//   role: "user" | "assistant"
//   content: string
// }

// declare global {
//   interface Window {
//     SpeechRecognition: any
//     webkitSpeechRecognition: any
//   }
// }

// const GoDeskless = () => {
//   const [file, setFile] = useState<File | null>(null)
//   const [messages, setMessages] = useState<Message[]>([])
//   const [isLoading, setIsLoading] = useState<boolean>(true)
//   const [input, setInput] = useState<string>("")
//   const [uploadLoading, setUploadLoading] = useState<boolean>(false)
//   const [htmlLoading, setHtmlLoading] = useState<boolean>(false)
//   const [chatLoading, setChatLoading] = useState<boolean>(false)
//   const [isUploaded, setIsUploaded] = useState<boolean>(false)
//   const [isDark, setIsDark] = useState<boolean>(true)
//   const messageListRef = useRef<HTMLDivElement>(null)
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [ticketId, setTicketId] = useState("")
//   const [ticketSubject, setTicketSubject] = useState("")
//   const [resolution, setResolution] = useState("")
//   const [isRecording, setIsRecording] = useState<boolean>(false)
//   const recognitionRef = useRef<SpeechRecognition | null>(null)
//   const uploadButtonText = uploadLoading ? "Uploading..." : "Upload Document"
//   const uploadButtonDisabled = !file || uploadLoading || htmlLoading
//   const inputFieldStyle = `w-full resize-none rounded-lg border-2 border-black px-4 py-2 pr-24 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`
//   const messageContentStyle = (role: string) =>
//     `rounded-lg px-4 py-2 ${
//       role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
//     }`
//   const [url, setUrl] = useState<string>("")

//   useEffect(() => {
//     const checkForFiles = async () => {
//       try {
//         setIsLoading(true)
//         const response = await axios.get("http://127.0.0.1:8000:8000/files/")
        
//         if (response.data && Array.isArray(response.data) && response.data.length > 0) {
//           // Files exist, go directly to chat
//           setIsUploaded(true)
//           setMessages([{ role: "assistant", content: "Welcome back! Your documents are ready. How can I help you?" }])
//         } else {
//           // No files, show upload screen
//           setIsUploaded(false)
//         }
//       } catch (error) {
//         console.error("Error checking for files:", error)
//         setIsUploaded(false)
//       } finally {
//         setIsLoading(false)
//       }
//     }
  
//     checkForFiles()
//   }, [])

//   const onDrop = useCallback((acceptedFiles: File[]) => {
//     setFile(acceptedFiles[0])
//   }, [])

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: {
//       "application/pdf": [".pdf"],
//       "application/msword": [".doc"],
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
//     },
//     multiple: false,
//   })

//   const uploadFile = async () => {
//     if (!file) return alert("Please select a file before uploading.")

//     const formData = new FormData()
//     formData.append("file", file)

//     try {
//       setUploadLoading(true)
//       const res = await axios.post("http://127.0.0.1:8000/upload/", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       })
//       setMessages([{ role: "assistant", content: res.data.message }])
//       setFile(null)
//       setIsUploaded(true)
//     } catch (err: any) {
//       console.error("Error uploading file:", err)
//       setMessages([
//         {
//           role: "assistant",
//           content: "Error uploading file: " + (err.response?.data?.detail || err.message || "Unknown error"),
//         },
//       ])
//     } finally {
//       setUploadLoading(false)
//     }
//   }

//   const askQuestion = async () => {
//     if (!input.trim()) return

//     const userMessage = { role: "user", content: input }
//     setMessages((prev) => [...prev, userMessage])
//     setInput("")
//     setChatLoading(true)

//     try {
//       const res = await axios.post("http://127.0.0.1:8000/ask/", {
//         prompt: input,
//       })

//       if (res.data.clarification_needed) {
//         // Show only clarification message
//         const clarificationMessage = {
//           role: "assistant",
//           content: `Clarification Needed: ${res.data.clarification_needed}`,
//         }
//         setMessages((prev) => [...prev, clarificationMessage])
//       } else {
//         const assistantMessage = { role: "assistant", content: res.data.answer }
//         setMessages((prev) => [...prev, assistantMessage])
//       }
//     } catch (err: any) {
//       console.error("Error fetching response:", err)
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: "Error fetching response: " + (err.response?.data?.detail || err.message || "Unknown error"),
//         },
//       ])
//     } finally {
//       setChatLoading(false)
//     }
//   }

//   const fetchInsight = async () => {
//     if (!input.trim()) return

//     const userMessage = { role: "user" as const, content: input }
//     setMessages((prev) => [...prev, userMessage])
//     setInput("")
//     setChatLoading(true)

//     try {
//       const res = await axios.post("http://127.0.0.1:8000/insights/", {
//         prompt: input,
//       })
//       setMessages((prev) => [...prev, { role: "assistant", content: "AI Insight: " + res.data.insight }])
//     } catch (err: any) {
//       console.error("Error fetching response:", err)
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: "Error fetching response: " + (err.response?.data?.detail || err.message || "Unknown error"),
//         },
//       ])
//     } finally {
//       setChatLoading(false)
//     }
//   }

//   const handleSubmit = async () => {
//     if (!ticketId || !ticketSubject || !resolution) {
//       alert("All fields are required")
//       return
//     }
//     setChatLoading(true)
//     try {
//       await axios.post("http://127.0.0.1:8000/ticket", {
//         ticket_id: ticketId,
//         ticket_subject: ticketSubject,
//         resolution,
//       })
//       alert("Ticket submitted successfully!")
//       setIsModalOpen(false)
//       setTicketId("")
//       setTicketSubject("")
//       setResolution("")
//     } catch (error) {
//       console.error("Error submitting ticket", error)
//       alert("Failed to submit ticket")
//       setTicketId("")
//       setTicketSubject("")
//       setResolution("")
//     } finally {
//       setChatLoading(false)
//     }
//   }

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault()
//       askQuestion()
//     }
//   }

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
//       if (SpeechRecognition) {
//         const recognition = new SpeechRecognition()
//         recognitionRef.current = recognition
//         recognition.lang = "en-US"
//         recognition.continuous = true
//         recognition.interimResults = false

//         recognition.onresult = (event: any) => {
//           let transcript = ""
//           for (let i = event.resultIndex; i < event.results.length; i++) {
//             transcript += event.results[i][0].transcript + " "
//           }
//           setInput((prevInput) => prevInput + " " + transcript)
//         }

//         recognition.onend = () => {
//           setIsRecording(false)
//         }

//         recognition.onerror = (event: any) => {
//           console.error("Speech recognition error:", event.error)
//         }
//       } else {
//         console.warn("Speech recognition is not supported in this browser.")
//       }
//     }
//   }, [])

//   const toggleListening = () => {
//     if (!recognitionRef.current) {
//       alert("Speech recognition is not supported in this browser.")
//       return
//     }

//     if (isRecording) {
//       recognitionRef.current.stop()
//       setIsRecording(false)
//     } else {
//       recognitionRef.current.start()
//       setIsRecording(true)
//     }
//   }

//   const scrapeHtml = async () => {
//     if (!url.trim()) return alert("Please enter a URL before scraping.")

//     try {
//       setHtmlLoading(true)
//       const res = await axios.get(`http://127.0.0.1:8000/scrapehtmlpage/?url=${encodeURIComponent(url)}`)
//       setMessages([{ role: "assistant", content: res.data.message }])
//       setUrl("")
//       setIsUploaded(true)
//     } catch (err: any) {
//       console.error("Error scraping HTML:", err)
//       setMessages([
//         {
//           role: "assistant",
//           content: "Error scraping HTML: " + (err.response?.data?.detail || err.message || "Unknown error"),
//         },
//       ])
//     } finally {
//       setHtmlLoading(false)
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <div className="flex flex-col items-center">
//           <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
//           <p className="mt-4 text-lg dark:text-white">Checking for documents...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!isUploaded) {
//     return (
//       <div className="flex min-h-screen flex-col">
//         <main className="flex flex-1 flex-col items-center justify-center px-4 pb-20 pt-16 mt-12 sm:mt-16 md:mt-20">
//           <div className="w-full max-w-4xl mt-4 sm:mt-6">
//             <div className="flex flex-col md:flex-row gap-4">
//               {/* File Upload Section */}
//               <div className="flex-1 flex flex-col">
//                 <div
//                   {...getRootProps()}
//                   className={`cursor-pointer rounded-lg border-2 border-dashed p-6 sm:p-8 text-center transition-colors flex-grow ${
//                     isDragActive
//                       ? "border-blue-500 bg-blue-500/10"
//                       : file
//                         ? "border-green-500 bg-green-500/10"
//                         : isDark
//                           ? "border-gray-600 hover:border-gray-500"
//                           : "border-gray-300 hover:border-gray-400"
//                   } ${url ? "opacity-50 pointer-events-none" : ""}`}
//                 >
//                   <input {...getInputProps()} disabled={!!url} />
//                   <p className={isDark ? "text-gray-400 mb-8" : "text-gray-600 mb-8"}>
//                     {file
//                       ? file.name
//                       : isDragActive
//                         ? "Drop the file here"
//                         : "Drag and drop a file, or click to select"}
//                   </p>
//                   <p className="mt-2 text-sm text-gray-500">Supported formats: PDF, DOC, DOCX</p>
//                 </div>
//                 <button
//                   onClick={uploadFile}
//                   disabled={uploadButtonDisabled || !!url}
//                   className="mt-4 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
//                 >
//                   {uploadLoading ? (
//                     <div className="flex items-center">
//                       <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
//                       Uploading...
//                     </div>
//                   ) : (
//                     <>
//                       <Upload className="mr-2 h-4 w-4" />
//                       {uploadButtonText}
//                     </>
//                   )}
//                 </button>
//               </div>

//               {/* OR Divider */}
//               <div className="flex items-center justify-center my-2 md:my-0">
//                 <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
//                 <span className="px-4 text-sm text-gray-500 dark:text-gray-400">OR</span>
//                 <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
//               </div>

//               {/* URL Input Section */}
//               <div className="flex-1 flex flex-col">
//                 <div
//                   className={`rounded-lg border-2 border-dashed p-6 sm:p-8 text-center transition-colors flex-grow ${
//                     url
//                       ? "border-green-500 bg-green-500/10"
//                       : isDark
//                         ? "border-gray-600 hover:border-gray-500"
//                         : "border-gray-300 hover:border-gray-400"
//                   } ${file ? "opacity-50 pointer-events-none" : ""}`}
//                 >
//                   <p className={isDark ? "text-gray-400 mb-4" : "text-gray-600 mb-4"}>
//                     Enter a webpage URL to learn from
//                   </p>
//                   <input
//                     type="url"
//                     value={url}
//                     onChange={(e) => setUrl(e.target.value)}
//                     disabled={!!file}
//                     placeholder="https://godeskless.html"
//                     className="w-full bg-transparent text-center focus:outline-none p-2 border-b border-gray-300 dark:border-gray-700"
//                   />
//                 </div>
//                 <button
//                   onClick={scrapeHtml}
//                   disabled={htmlLoading || !url.trim() || !!file || uploadLoading}
//                   className="mt-4 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
//                 >
//                   {htmlLoading ? (
//                     <div className="flex items-center">
//                       <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
//                       Learning from HTML....
//                     </div>
//                   ) : (
//                     <>
//                       <Globe className="mr-2 h-4 w-4" />
//                       Learn from HTML
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     )
//   }

//   return (
//     <div className="flex h-full flex-col">
//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto pb-20 pt-8" ref={messageListRef} style={{ paddingBottom: "60px" }}>
//         <div className="mx-auto mt-8 max-w-2xl space-y-4 px-4 py-8">
//           {messages.map((message, index) => (
//             <div
//               key={index}
//               className={`flex items-start space-x-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
//             >
//               {message.role === "assistant" && (
//                 <Image
//                   src={gemini || "/placeholder.svg"}
//                   alt="Assistant"
//                   width={24}
//                   height={24}
//                   className="mr-2 h-4 w-4 rounded-full sm:h-10 sm:w-10"
//                 />
//               )}
//               <div
//                 className={`rounded-lg px-4 py-2 ${
//                   message.role === "user"
//                     ? "bg-blue-500 text-white"
//                     : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
//                 }`}
//               >
//                 <ReactMarkdown className="prose" remarkPlugins={[remarkGfm]}>
//                   {message.content}
//                 </ReactMarkdown>
//               </div>
//               {message.role === "user" && (
//                 <div
//                   className={`flex h-8 w-8 items-center justify-center rounded-full ${
//                     isDark ? "bg-gray-700" : "bg-gray-200"
//                   }`}
//                 >
//                   <User className={`h-5 w-5 ${isDark ? "text-gray-300" : "text-gray-600"}`} />
//                 </div>
//               )}
//             </div>
//           ))}
//           {chatLoading && (
//             <div className="flex items-center space-x-2">
//               <Image
//                 src={gemini || "/placeholder.svg"}
//                 alt="Assistant"
//                 width={24}
//                 height={24}
//                 className="mr-2 h-4 w-4 rounded-full sm:h-10 sm:w-10"
//               />
//               <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
//               <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0.2s" }}></div>
//               <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0.4s" }}></div>
//             </div>
//           )}
//         </div>
//       </div>
//       {/* Input */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white px-4 py-4 shadow-md dark:bg-black dark:text-white">
//         <div className="mx-auto max-w-xl">
//           <div className="relative flex items-center">
//             <textarea
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={handleKeyPress}
//               placeholder="Ask anything..."
//               className={`${inputFieldStyle} pr-48`}
//               rows={1}
//               style={{
//                 minHeight: "44px",
//                 resize: "none",
//                 overflowY: "auto",
//                 maxHeight: "200px",
//               }}
//             />
//             <div className="absolute right-2 flex items-center space-x-2">
//               <div className="h-8 w-px bg-gray-300 dark:bg-gray-700 mr-2"></div>
//               <button
//                 onClick={askQuestion}
//                 disabled={chatLoading || !input.trim()}
//                 className={`rounded-lg p-2 ${
//                   isDark ? "text-gray-400 hover:text-black" : "text-gray-600 hover:text-gray-900"
//                 } disabled:opacity-50`}
//               >
//                 <Send className="h-5 w-5" />
//               </button>
//               <button
//                 onClick={fetchInsight}
//                 disabled={chatLoading || !input.trim()}
//                 className={`rounded-lg p-2 ${
//                   isDark ? "text-gray-400 hover:text-black" : "text-gray-600 hover:text-gray-900"
//                 } disabled:brightness-150% hover:brightness-50 hover:filter`}
//               >
//                 <Image src={stars || "/placeholder.svg"} alt="Send" className="h-7 w-7" />
//               </button>
//               <button onClick={() => setIsModalOpen(true)}>
//                 <Image src={gemini || "/placeholder.svg"} alt="Gemini" className="h-7 w-7" />
//               </button>
//               {isModalOpen && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-full h-full">
//                   <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full flex-col">
//                     <h2 className="text-xl font-semibold mb-4">Submit Ticket</h2>
//                     <input
//                       type="text"
//                       placeholder="#Ticket ID"
//                       value={ticketId}
//                       onChange={(e) => setTicketId(e.target.value)}
//                       className="w-full mb-2 p-2 border rounded"
//                     />
//                     <input
//                       type="text"
//                       placeholder="Ticket Subject"
//                       value={ticketSubject}
//                       onChange={(e) => setTicketSubject(e.target.value)}
//                       className="w-full mb-2 p-2 border rounded"
//                     />
//                     <textarea
//                       placeholder="Issue Resolution "
//                       value={resolution}
//                       onChange={(e) => setResolution(e.target.value)}
//                       className="w-full mb-2 p-2 border rounded"
//                     ></textarea>
//                     <div className="flex justify-center space-x-2">
//                       <button
//                         onClick={() => {
//                           setIsModalOpen(false)
//                           setTicketId("")
//                           setTicketSubject("")
//                           setResolution("")
//                         }}
//                         className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         onClick={handleSubmit}
//                         className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                         disabled={chatLoading}
//                       >
//                         {chatLoading ? "Submitting..." : "Submit"}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//               <button
//                 onClick={toggleListening}
//                 className={`flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white transition-all hover:bg-blue-700 ${
//                   isRecording ? "animate-pulse" : ""
//                 } mr-2`}
//               >
//                 <Mic className="h-5 w-5 text-white" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default GoDeskless

"use client"

import type React from "react"
import { useState, useCallback, useEffect, useRef } from "react"
import { Upload, Send, User, Mic, Globe, Copy, Volume2, Check, Settings, Database } from "lucide-react"
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

interface Voice {
  name: string
  voiceURI: string
  lang: string
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
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null)
  const [availableVoices, setAvailableVoices] = useState<Voice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>("")
  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState<boolean>(false)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false)
  const [speakingMessageIndex, setSpeakingMessageIndex] = useState<number | null>(null)
  const [tableName, setTableName] = useState<string>("")
  const [dbCrawlLoading, setDbCrawlLoading] = useState<boolean>(false)
  const [activeUploadTab, setActiveUploadTab] = useState<string>("file")

  useEffect(() => {
    const checkForFiles = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get("http://127.0.0.1:8000/files/")

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

  useEffect(() => {
    if ("speechSynthesis" in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices()
        if (voices.length > 0) {
          const voiceList = voices.map((voice) => ({
            name: voice.name,
            voiceURI: voice.voiceURI,
            lang: voice.lang,
          }))
          setAvailableVoices(voiceList)

          if (!selectedVoice && voiceList.length > 0) {
            setSelectedVoice(voiceList[0].voiceURI)
          }
        }
      }

      loadVoices()

      window.speechSynthesis.onvoiceschanged = loadVoices

      return () => {
        window.speechSynthesis.onvoiceschanged = null
      }
    }
  }, [selectedVoice])

  useEffect(() => {
    // Try to select a preferred voice that sounds more confident and faster
    if (availableVoices.length > 0) {
      // Look for voices that might be faster/more confident (often English voices with names containing these terms)
      const preferredVoiceTerms = ["enhanced", "neural", "premium", "wavenet", "daniel", "samantha", "google"]

      // Try to find a preferred voice
      const preferredVoice = availableVoices.find((voice) =>
        preferredVoiceTerms.some(
          (term) => voice.name.toLowerCase().includes(term.toLowerCase()) && voice.lang.startsWith("en"),
        ),
      )

      // Set the preferred voice if found, otherwise keep the first one
      if (preferredVoice && !selectedVoice) {
        setSelectedVoice(preferredVoice.voiceURI)
      }
    }
  }, [availableVoices, selectedVoice])

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

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedMessageIndex(index)
        setTimeout(() => {
          setCopiedMessageIndex(null)
        }, 2000)
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err)
      })
  }

  const speakMessage = (text: string, index: number) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)

      // Set a slightly faster rate
      utterance.rate = 1.1

      // Set the selected voice if available
      if (selectedVoice) {
        const voices = window.speechSynthesis.getVoices()
        const voice = voices.find((v) => v.voiceURI === selectedVoice)
        if (voice) {
          utterance.voice = voice
        }
      }

      // Set speaking state
      setIsSpeaking(true)
      setSpeakingMessageIndex(index)

      utterance.onend = () => {
        setIsSpeaking(false)
        setSpeakingMessageIndex(null)
      }

      utterance.onerror = () => {
        setIsSpeaking(false)
        setSpeakingMessageIndex(null)
      }

      window.speechSynthesis.speak(utterance)
    } else {
      alert("Text-to-speech is not supported in this browser.")
    }
  }

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      setSpeakingMessageIndex(null)
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

  const handleDatabaseCrawl = async () => {
    if (!tableName.trim()) return alert("Please enter a table name before crawling.")

    try {
      setDbCrawlLoading(true)
      const result = await axios.post("http://127.0.0.1:8000/crawl-database/", {
        table_name: tableName,
      })
      setMessages([
        {
          role: "assistant",
          content: result.data.message,
        },
      ])
      setTableName("")
      setIsUploaded(true)
    } catch (err: any) {
      console.error("Error crawling database:", err)
      setMessages([
        {
          role: "assistant",
          content: "Error crawling database: " + (err.response?.data?.detail || err.message || "Unknown error"),
        },
      ])
    } finally {
      setDbCrawlLoading(false)
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
            <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">➕ Add Data to ISRA</h2>
              </div>

              {/* Tabs Navigation */}
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
                    activeUploadTab === "file"
                      ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                      : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                  onClick={() => setActiveUploadTab("file")}
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload File</span>
                </button>
                <button
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
                    activeUploadTab === "url"
                      ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                      : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                  onClick={() => setActiveUploadTab("url")}
                >
                  <Globe className="h-4 w-4" />
                  <span>Web Page</span>
                </button>
                <button
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
                    activeUploadTab === "database"
                      ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                      : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                  onClick={() => setActiveUploadTab("database")}
                >
                  <Database className="h-4 w-4" />
                  <span>Database</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex flex-grow flex-col p-6">
                {/* File Upload Tab */}
                {activeUploadTab === "file" && (
                  <div className="flex flex-col">
                    <div
                      {...getRootProps()}
                      className={`cursor-pointer rounded-lg border-2 border-dashed p-6 sm:p-8 text-center transition-colors ${
                        isDragActive
                          ? "border-blue-500 bg-blue-500/10"
                          : file
                            ? "border-green-500 bg-green-500/10"
                            : isDark
                              ? "border-gray-600 hover:border-gray-500"
                              : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <input {...getInputProps()} />
                      <p className={isDark ? "text-gray-400 mb-8" : "text-gray-600 mb-8"}>
                        {file
                          ? file.name
                          : isDragActive
                            ? "Drop the file here"
                            : "Drag and drop a file, or click to select"}
                      </p>
                      <p className="mt-2 text-sm text-gray-500">Supported formats: PDF</p>
                    </div>
                    <button
                      onClick={uploadFile}
                      disabled={uploadButtonDisabled}
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
                )}

                {/* URL Input Tab */}
                {activeUploadTab === "url" && (
                  <div className="flex flex-col">
                    <div className="rounded-lg border-2 border-dashed p-6 sm:p-8 text-center transition-colors">
                      <p className={isDark ? "text-gray-400 mb-4" : "text-gray-600 mb-4"}>
                        Enter a webpage URL to learn from
                      </p>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://godeskless.html"
                        className="w-full bg-transparent text-center focus:outline-none p-2 border-b border-gray-300 dark:border-gray-700"
                      />
                    </div>
                    <button
                      onClick={scrapeHtml}
                      disabled={htmlLoading || !url.trim()}
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
                )}

                {/* Database Crawl Tab */}
                {activeUploadTab === "database" && (
                  <div className="flex flex-col">
                    <div className="rounded-lg border-2 border-dashed p-6 sm:p-8 text-center transition-colors">
                      <div className="mb-4 rounded-full bg-blue-100 p-3 dark:bg-blue-900/30 inline-block">
                        <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Database Crawling</h3>
                      <p className="mb-6 text-gray-600 dark:text-gray-300">
                        Extract and process data from a specific database table
                      </p>
                      <div className="w-full max-w-md mx-auto">
                        <label
                          htmlFor="table-input"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left"
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
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleDatabaseCrawl}
                      disabled={dbCrawlLoading || !tableName.trim()}
                      className="mt-4 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {dbCrawlLoading ? (
                        <div className="flex items-center">
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Crawling Database...
                        </div>
                      ) : (
                        <>
                          <Database className="mr-2 h-4 w-4" />
                          Crawl Database
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Voice Settings Modal */}
      {isVoiceSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium dark:text-white">Voice Preferences & Selection</h3>
              <button
                onClick={() => setIsVoiceSettingsOpen(false)}
                className="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 dark:text-gray-300"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <label htmlFor="voice-select" className="block mb-2 text-sm font-medium dark:text-gray-300">
                🗣️ Select Your Preferred Voice:
              </label>
              <p className="block text-sm font-light">
                Pick from a range of available voices to enhance your experience.
              </p>
              <select
                id="voice-select"
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white mt-4"
              >
                {availableVoices.map((voice) => (
                  <option key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
              <label className="block mb-2 text-sm font-medium dark:text-gray-300 mt-4">
                📣 Test Before You Save: <br></br>
              </label>
              <label className="block mb-2 text-sm font-light dark:text-gray-300">
                Once you've found the perfect match, simply hit{" "}
                <b>
                  <u>Save</u>
                </b>
                , and let ISRA speak just the way you like.
              </label>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  if (selectedVoice && availableVoices.length > 0) {
                    const testVoice = availableVoices.find((v) => v.voiceURI === selectedVoice)
                    if (testVoice) {
                      speakMessage("Hey there, This is my voice.", -1)
                    }
                  }
                }}
                className="mr-2 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Test Voice
              </button>
              <button
                onClick={() => setIsVoiceSettingsOpen(false)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

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
              <div className="group">
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
                  }`}
                >
                  <ReactMarkdown className="prose dark:prose-invert" remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                </div>
                {/* Message Actions - Only show for assistant messages */}
                {message.role === "assistant" && (
                  <div className="mt-2 flex justify-end space-x-2">
                    <button
                      onClick={() => copyToClipboard(message.content, index)}
                      className="flex items-center justify-center rounded-md px-2 py-1 text-xs transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Copy to clipboard"
                    >
                      {copiedMessageIndex === index ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => {
                        if (speakingMessageIndex === index) {
                          stopSpeaking()
                        } else {
                          speakMessage(message.content, index)
                        }
                      }}
                      className={`flex items-center justify-center rounded-md px-2 py-1 text-xs transition-all
                        ${
                          speakingMessageIndex === index
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      title={speakingMessageIndex === index ? "Stop speaking" : "Read aloud"}
                    >
                      {speakingMessageIndex === index ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="animate-pulse text-blue-600 dark:text-blue-400"
                        >
                          <rect x="6" y="4" width="4" height="16" />
                          <rect x="14" y="4" width="4" height="16" />
                        </svg>
                      ) : (
                        <Volume2 className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={() => setIsVoiceSettingsOpen(true)}
                      className="flex items-center justify-center rounded-md px-2 py-1 text-xs transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Settings"
                    >
                      <Settings className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                )}
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

