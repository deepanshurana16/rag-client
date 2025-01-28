"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Upload, Send, Lightbulb, List } from "lucide-react";
import axios from "axios";
import ctapage from "../../assets/ctapage.png";
import gemini from "../../assets/geminii.png";
import Image from "next/image";



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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        alert("Please select a PDF, DOC, or DOCX file.");
        e.target.value = "";
      }
    }
  };

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post("https://df52-103-226-169-56.ngrok-free.app/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessages([
        ...messages,
        { role: "assistant", content: res.data.message },
      ]);
      setFile(null);
    } catch (err: any) {
      console.error("Error uploading file:", err);
      setMessages([
        ...messages,
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
      const res = await axios.post("https://df52-103-226-169-56.ngrok-free.app/ask/", {
        prompt: input,
      });
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
      const res = await axios.post("https://df52-103-226-169-56.ngrok-free.app/insights/", {
        prompt: input,
      });
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
      const response = await axios.get("https://df52-103-226-169-56.ngrok-free.app/documents/");
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

  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 sm:p-10 lg:p-12">
              <div className="flex h-[70vh] flex-col">
                <header className="mb-6 flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    I·S·R·A (Intelligent Support Resolution Assistant)
                  </h1>
                  <div className="flex space-x-2">
                    <button
                      onClick={fetchInsight}
                      disabled={loading}
                      className="flex items-center rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                    >
                      <Lightbulb className="mr-2 h-4 w-4" /> Get Insight
                    </button>
                    {/* <button
                      onClick={fetchDocuments}
                      disabled={loading}
                      className="flex items-center rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:opacity-50"
                    >
                      <List className="mr-2 h-4 w-4" />{" "}
                      {showDocuments ? "Hide" : "Show"} Documents
                    </button> */}
                  </div>
                </header>

                <main className="mb-6 flex-grow overflow-y-auto">
                  {messages.length === 0 ? (
                    <div className="rounded-lg bg-gray-100 p-6 dark:bg-gray-700">
                      <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
                        Let's try I·S·R·A
                      </h2>
                      <p className="mb-4 text-gray-600 dark:text-gray-300">
                        To get started, please upload a document:
                      </p>
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          className="flex-grow text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <button
                          onClick={uploadFile}
                          disabled={loading || !file}
                          className="flex items-center rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                        >
                          <Upload className="mr-2 h-4 w-4" /> Upload
                        </button>
                      </div>
                      <h6 className="mt-2 text-sm text-gray-600 underline decoration-indigo-400 dark:text-gray-400">
                        Accepted File Formats: .pdf, .doc, .docx
                      </h6>
                    </div>
                  ) : (
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
                              className="mr-2 h-10 w-10 rounded-full"
                            />
                          )}
                          
                          <div
                            className={`max-w-3/4 rounded-lg p-3 ${
                              message.role === "user"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
                            }`}
                          >
                            {message.content ? (
                              <p>{message.content}</p>
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
                  )}
                </main>

                <footer className="mt-auto">
                  <div className="flex items-center space-x-2">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask a question about your document..."
                      rows={1}
                      className="flex-grow resize-none rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      onClick={askQuestion}
                      disabled={loading || messages.length === 0}
                      className="flex items-center rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                    >
                      <Send className="mr-2 h-4 w-4" /> Send
                    </button>
                  </div>
                </footer>
              </div>

              {/* {showDocuments && (
                <aside className="mt-6 rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
                  <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
                    Uploaded Documents
                  </h2>
                  <ul className="space-y-2">
                    {documents.map((doc) => (
                      <li
                        key={doc.id}
                        className="text-sm text-gray-600 dark:text-gray-300"
                      >
                        <strong>ID:</strong> {doc.id}
                        <br />
                        <strong>Metadata:</strong>{" "}
                        {JSON.stringify(doc.metadata)}
                      </li>
                    ))}
                  </ul>
                </aside>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
