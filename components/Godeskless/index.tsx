"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Upload, Send, User } from "lucide-react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import stars from "../../assets/starsslate1.png";
import gemini from "../../assets/geminii.png";
import Image from "next/image";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const GoDeskless = () => {
  const [file, setFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(true);
  const messageListRef = useRef<HTMLDivElement>(null);

  const uploadButtonText = loading ? "Uploading..." : "Upload Document";
  const uploadButtonDisabled = !file || loading;
  const inputFieldStyle = `w-full resize-none rounded-lg border-2 border-black px-4 py-2 pr-24 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`;
  const messageContentStyle = (role: string) =>
    `rounded-lg px-4 py-2 ${
      role === "user"
        ? "bg-blue-500 text-white"
        : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
    }`;

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

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
    if (!file) return alert("Please select a file before uploading.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://35.90.0.216:8000/upload/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      setMessages([{ role: "assistant", content: res.data.message }]);
      setFile(null);
      setIsUploaded(true);
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
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://35.90.0.216:8000/ask/",
        { prompt: input },
      );
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.answer },
      ]);
    } catch (err: any) {
      console.error("Error fetching response:", err);
      setMessages((prev) => [
        ...prev,
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
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://35.90.0.216:8000/insights/",
        { prompt: input },
      );
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "AI Insight: " + res.data.insight },
      ]);
    } catch (err: any) {
      console.error("Error fetching response:", err);
      setMessages((prev) => [
        ...prev,
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askQuestion();
    }
  };

  // Main UI Return Logic
  if (!isUploaded) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex flex-1 flex-col items-center justify-center px-4 pb-20">
          <div className="w-full max-w-2xl">
            <div
              {...getRootProps()}
              className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                isDragActive
                  ? "border-blue-500 bg-blue-500/10"
                  : isDark
                  ? "border-gray-600 hover:border-gray-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input {...getInputProps()} />
              <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                {file
                  ? file.name
                  : isDragActive
                  ? "Drop the file here"
                  : "Drag and drop a file, or click to select"}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Supported formats: PDF, DOC, DOCX
              </p>
            </div>
            <button
              onClick={uploadFile}
              disabled={uploadButtonDisabled}
              className="mt-4 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
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
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto pb-20 pt-8"
        ref={messageListRef}
        style={{ paddingBottom: "60px" }}
      >
        <div className="mx-auto mt-8 max-w-2xl space-y-4 px-4 py-8">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <Image
                  src={gemini}
                  alt="Assistant"
                  width={24}
                  height={24}
                  className="mr-2 h-4 w-4 rounded-full sm:h-10 sm:w-10"
                />
              )}
              <div className={messageContentStyle(message.role)}>
                <p className="text-sm">{message.content}</p>
              </div>
              {message.role === "user" && (
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    isDark ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  <User
                    className={`h-5 w-5 ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center space-x-2">
              <Image
                src={gemini}
                alt="Assistant"
                width={24}
                height={24}
                className="mr-2 h-4 w-4 rounded-full sm:h-10 sm:w-10"
              />
              <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                style={{ animationDelay: "0.4s" }}
              ></div>
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
              className={inputFieldStyle}
              rows={1}
              style={{ minHeight: "44px" }}
            />
            <div className="absolute right-2 flex space-x-2">
              <button
                onClick={askQuestion}
                disabled={loading || !input.trim()}
                className={`rounded-lg p-2 ${
                  isDark
                    ? "text-gray-400 hover:text-black"
                    : "text-gray-600 hover:text-gray-900"
                } disabled:opacity-50`}
              >
                <Send className="h-5 w-5" />
              </button>
              <button
                onClick={fetchInsight}
                disabled={loading || !input.trim()}
                className={`rounded-lg p-2 ${
                  isDark
                    ? "text-gray-400 hover:text-black"
                    : "text-gray-600 hover:text-gray-900"
                } disabled:brightness-150% hover:brightness-50 hover:filter`}
              >
                <Image src={stars} alt="Send" className="h-7 w-7" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoDeskless;
