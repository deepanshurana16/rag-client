// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { Upload, Send, Lightbulb, List } from "lucide-react"
// import axios from "axios"
// import Image from "next/image"
// import ctapage from "../assets/ctapage.png"
// import gemini from "../../assets/geminii.png"
// import Confetti from "react-confetti"

// interface Message {
//   role: "user" | "assistant"
//   content: string
// }

// interface Document {
//   id: string
//   metadata: Record<string, any>
// }

// export default function GoDeskless() {
//   const [file, setFile] = useState<File | null>(null)
//   const [messages, setMessages] = useState<Message[]>([])
//   const [input, setInput] = useState<string>("")
//   const [loading, setLoading] = useState<boolean>(false)
//   const [documents, setDocuments] = useState<Document[]>([])
//   const [showDocuments, setShowDocuments] = useState<boolean>(false)
//   const [uploadSuccess, setUploadSuccess] = useState<boolean>(false)

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const selectedFile = e.target.files[0]
//       const allowedTypes = [
//         "application/pdf",
//         "application/msword",
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//       ]
//       if (allowedTypes.includes(selectedFile.type)) {
//         setFile(selectedFile)
//       } else {
//         alert("Please select a PDF, DOC, or DOCX file.")
//         e.target.value = ""
//       }
//     }
//   }

//   const uploadFile = async () => {
//     if (!file) {
//       alert("Please select a file before uploading.")
//       return
//     }

//     const formData = new FormData()
//     formData.append("file", file)

//     try {
//       setLoading(true)
//       const res = await axios.post("https://f9fc-115-160-222-114.ngrok-free.app/upload/", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       })
//       setMessages([...messages, { role: "assistant", content: res.data.message }])
//       setFile(null)
//       setUploadSuccess(true)
//       setTimeout(() => setUploadSuccess(false), 5000) // Hide confetti after 5 seconds
//     } catch (err: any) {
//       console.error("Error uploading file:", err)
//       setMessages([
//         ...messages,
//         {
//           role: "assistant",
//           content: "Error uploading file: " + (err.response?.data?.detail || err.message || "Unknown error"),
//         },
//       ])
//     } finally {
//       setLoading(false)
//     }
//   }

//   const askQuestion = async () => {
//     if (!input.trim()) return

//     const userMessage = { role: "user" as const, content: input }
//     setMessages([...messages, userMessage, { role: "assistant", content: "" }])
//     setInput("")
//     setLoading(true)

//     try {
//       const res = await axios.post("https://f9fc-115-160-222-114.ngrok-free.app/ask/", {
//         prompt: input,
//       })
//       setMessages((prev) => [...prev.slice(0, -1), { role: "assistant", content: res.data.answer }])
//     } catch (err: any) {
//       console.error("Error fetching response:", err)
//       setMessages((prev) => [
//         ...prev.slice(0, -1),
//         {
//           role: "assistant",
//           content: "Error fetching response: " + (err.response?.data?.detail || err.message || "Unknown error"),
//         },
//       ])
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchInsight = async () => {
//     if (!input.trim()) {
//       alert("Please enter a prompt for insight.")
//       return
//     }

//     setMessages([...messages, { role: "assistant", content: "" }])
//     setLoading(true)

//     try {
//       const res = await axios.post("https://f9fc-115-160-222-114.ngrok-free.app/insights/", {
//         prompt: input,
//       })
//       setMessages((prev) => [...prev.slice(0, -1), { role: "assistant", content: "AI Insight: " + res.data.insight }])
//     } catch (err: any) {
//       console.error("Error fetching insight:", err)
//       setMessages((prev) => [
//         ...prev.slice(0, -1),
//         {
//           role: "assistant",
//           content: "Error fetching insight: " + (err.response?.data?.detail || err.message || "Unknown error"),
//         },
//       ])
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchDocuments = async () => {
//     try {
//       const response = await axios.get("https://f9fc-115-160-222-114.ngrok-free.app/documents/")
//       setDocuments(response.data.documents || [])
//       setShowDocuments(!showDocuments)
//     } catch (err: any) {
//       console.error("Error fetching documents:", err)
//       alert("Error fetching documents: " + (err.response?.data?.detail || err.message || "Unknown error"))
//     }
//   }

//   return (
//     <section className="py-4 sm:py-8 md:py-12 lg:py-16 mt-6">
//       <div className="container mx-auto px-4">
//         <div className="-mx-4 flex flex-wrap">
//           <div className="w-full px-4">
//             <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800 sm:p-6 md:p-8 lg:p-10">
//               <div className="flex h-[calc(90vh-2rem)] flex-col sm:h-[calc(90vh-6rem)] md:h-[calc(90vh-6rem)] lg:h-[calc(90vh-6rem)]">
//                 <header className="mb-4 flex flex-col items-start space-y-2 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
//                   <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
//                     I·S·R·A (Intelligent Support & Resolution Assistant)
//                   </h1>
//                   <div className="flex flex-wrap gap-2">
//                     <button
//                       onClick={fetchInsight}
//                       disabled={loading}
//                       className="flex items-center rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 disabled:opacity-50 sm:px-4 sm:py-2 sm:text-base"
//                     >
//                       <Lightbulb className="mr-1 h-4 w-4 sm:mr-2" /> Get AI Insight
//                     </button>
//                   </div>
//                 </header>

//                 <main className="mb-4 flex-grow overflow-y-auto sm:mb-6">
//                   {messages.length === 0 ? (
//                     <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-700 sm:p-6">
//                       <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white sm:mb-4 sm:text-xl">
//                         Let's try I·S·R·A
//                       </h2>
//                       <p className="mb-2 text-sm text-gray-600 dark:text-gray-300 sm:mb-4 sm:text-base">
//                         To get started, first choose a file and then upload the document.
//                       </p>
//                       <div className="flex flex-col items-start space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
//                         <input
//                           type="file"
//                           onChange={handleFileUpload}
//                           className="w-2/3 sm:w-1/3 text-sm text-gray-500 file:mr-2 file:rounded-full file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 sm:file:mr-4 sm:file:px-4 sm:file:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg border border-blue-500 dark:border-blue-700"
//                         />
//                         {loading ? (
//                           <div className="flex items-center justify-center">
//                             <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
//                           </div>
//                         ) : (
//                           <button
//                             onClick={uploadFile}
//                             disabled={!file}
//                             className="flex w-full sm:w-auto items-center justify-center rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 disabled:opacity-50 sm:px-4 sm:py-2 sm:text-base"
//                           >
//                             <Upload className="mr-1 h-4 w-4 sm:mr-2" /> Upload
//                           </button>
//                         )}
//                       </div>
//                       <h6 className="mt-2 text-xs text-gray-600 underline decoration-indigo-400 dark:text-gray-400 sm:text-sm">
//                         Accepted File Formats: .pdf, .doc, .docx
//                       </h6>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {messages.map((message, index) => (
//                         <div
//                           key={index}
//                           className={`flex items-start ${message.role === "user" ? "justify-end" : "justify-start"}`}
//                         >
//                           {message.role === "assistant" && (
//                             <Image
//                               src={gemini || "/placeholder.svg"}
//                               alt="Assistant"
//                               className="mr-2 h-8 w-8 rounded-full sm:h-10 sm:w-10"
//                             />
//                           )}

//                           <div
//                             className={`max-w-[75%] rounded-lg p-2 sm:p-3 ${
//                               message.role === "user"
//                                 ? "bg-blue-500 text-white"
//                                 : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
//                             }`}
//                           >
//                             {message.content ? (
//                               <p className="text-sm sm:text-base">{message.content}</p>
//                             ) : (
//                               <div className="flex space-x-1">
//                                 <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500"></div>
//                                 <div
//                                   className="h-2 w-2 animate-bounce rounded-full bg-gray-500"
//                                   style={{ animationDelay: "0.2s" }}
//                                 ></div>
//                                 <div
//                                   className="h-2 w-2 animate-bounce rounded-full bg-gray-500"
//                                   style={{ animationDelay: "0.4s" }}
//                                 ></div>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </main>

//                 <footer className="mt-auto">
//                   <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
//                     <textarea
//                       value={input}
//                       onChange={(e) => setInput(e.target.value)}
//                       placeholder="Ask a question about your document..."
//                       rows={1}
//                       className="w-full flex-grow resize-none rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-base"
//                     />
//                     <button
//                       onClick={askQuestion}
//                       disabled={loading || messages.length === 0}
//                       className="flex w-full items-center justify-center rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 disabled:opacity-50 sm:w-auto sm:px-4 sm:py-2 sm:text-base"
//                     >
//                       <Send className="mr-1 h-4 w-4 sm:mr-2" /> Send
//                     </button>
//                   </div>
//                 </footer>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {uploadSuccess && <Confetti />}
//     </section>
//   )
// }

"use client";

import { useState, useCallback } from "react";
import { Upload, Send, Lightbulb } from "lucide-react";
import axios from "axios";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import Confetti from "react-confetti";
import gemini from "../../assets/geminii.png";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Document {
  id: string;
  metadata: Record<string, any>;
}

export default function GoDeskless() {
  const [file, setFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showDocuments, setShowDocuments] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    multiple: false,
  });

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post(
        "https://f9fc-115-160-222-114.ngrok-free.app/upload/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setMessages([{ role: "assistant", content: res.data.message }]);
      setFile(null);
      setUploadSuccess(true);
      setIsUploaded(true);
      setTimeout(() => setUploadSuccess(false), 5000); // Hide confetti after 5 seconds
    } catch (err: any) {
      console.error("Error uploading file:", err);
      setMessages([
        {
          role: "assistant",
          content:
            "Error uploading file: " +
            (err.response?.data?.detail || err.message || "Unknown error"),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const askQuestion = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages([...messages, userMessage, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://f9fc-115-160-222-114.ngrok-free.app/ask/",
        {
          prompt: input,
        },
      );
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "assistant", content: res.data.answer },
      ]);
    } catch (err: any) {
      console.error("Error fetching response:", err);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content:
            "Error fetching response: " +
            (err.response?.data?.detail || err.message || "Unknown error"),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchInsight = async () => {
    if (!input.trim()) {
      alert("Please enter a prompt for insight.");
      return;
    }

    setMessages([...messages, { role: "assistant", content: "" }]);
    setLoading(true);

    try {
      const res = await axios.post(
        "https://f9fc-115-160-222-114.ngrok-free.app/insights/",
        {
          prompt: input,
        },
      );
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "assistant", content: "AI Insight: " + res.data.insight },
      ]);
    } catch (err: any) {
      console.error("Error fetching insight:", err);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content:
            "Error fetching insight: " +
            (err.response?.data?.detail || err.message || "Unknown error"),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(
        "https://f9fc-115-160-222-114.ngrok-free.app/documents/",
      );
      setDocuments(response.data.documents || []);
      setShowDocuments(!showDocuments);
    } catch (err: any) {
      console.error("Error fetching documents:", err);
      alert(
        "Error fetching documents: " +
          (err.response?.data?.detail || err.message || "Unknown error"),
      );
    }
  };

  if (!isUploaded) {
    return (
      <section className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="flex w-full max-w-md flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-lg dark:bg-gray-800">
          <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            Upload Document
          </h1>

          <div
            {...getRootProps()}
            className={`mb-4 cursor-pointer rounded-lg border-2 border-dashed p-6 text-center ${
              isDragActive
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-600"
            }`}
          >
            <input {...getInputProps()} />
            {file ? (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {file.name}
              </p>
            ) : isDragActive ? (
              <p className="text-sm text-blue-500">Drop the file here</p>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Drag and drop a file here, or click to select a file
              </p>
            )}
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
              Supported formats: PDF, DOC, DOCX
            </p>
          </div>
          <button
            onClick={uploadFile}
            disabled={!file || loading}
            className="flex w-full items-center justify-center rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? (
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
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-6 py-4 sm:py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800 sm:p-6 md:p-8 lg:p-10">
              <div className="flex h-[calc(90vh-2rem)] flex-col sm:h-[calc(90vh-6rem)] md:h-[calc(90vh-6rem)] lg:h-[calc(90vh-6rem)]">
                <header className="mb-4 flex flex-col items-start space-y-2 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                    I·S·R·A (Intelligent Support & Resolution Assistant)
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={fetchInsight}
                      disabled={loading}
                      className="flex items-center rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 disabled:opacity-50 sm:px-4 sm:py-2 sm:text-base"
                    >
                      <Lightbulb className="mr-1 h-4 w-4 sm:mr-2" /> Get AI
                      Insight
                    </button>
                  </div>
                </header>

                <main className="mb-4 flex-grow overflow-y-auto sm:mb-6">
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex items-start ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        {message.role === "assistant" && (
                          <Image
                            src={gemini}
                            alt="Assistant"
                            width={32}
                            height={32}
                            className="mr-2 h-8 w-8 rounded-full sm:h-10 sm:w-10"
                          />
                        )}

                        <div
                          className={`max-w-[75%] rounded-lg p-2 sm:p-3 ${
                            message.role === "user"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
                          }`}
                        >
                          {message.content ? (
                            <p className="text-sm sm:text-base">
                              {message.content}
                            </p>
                          ) : (
                            <div className="flex space-x-1">
                              <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500"></div>
                              <div
                                className="h-2 w-2 animate-bounce rounded-full bg-gray-500"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                              <div
                                className="h-2 w-2 animate-bounce rounded-full bg-gray-500"
                                style={{ animationDelay: "0.4s" }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </main>

                <footer className="mt-auto">
                  <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask a question about your document..."
                      rows={1}
                      className="w-full flex-grow resize-none rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-base"
                    />
                    <button
                      onClick={askQuestion}
                      disabled={loading || messages.length === 0}
                      className="flex w-full items-center justify-center rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 disabled:opacity-50 sm:w-auto sm:px-4 sm:py-2 sm:text-base"
                    >
                      <Send className="mr-1 h-4 w-4 sm:mr-2" /> Send
                    </button>
                  </div>
                </footer>
              </div>
            </div>
          </div>
        </div>
      </div>
      {uploadSuccess && <Confetti />}
    </section>
  );
}
