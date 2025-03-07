"use client"

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Trash2, RefreshCw, FileIcon, X, Upload, Globe } from "lucide-react";
import { useDropzone } from "react-dropzone";

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [htmlLoading, setHtmlLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const fetchFilesInitial = async () => {
    try {
      const response = await axios.get("http://localhost:8000/files/");
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
      showToast("Failed to load files. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchFilesWithToast = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get("http://localhost:8000/files/");
      setFiles(response.data);
      showToast("Files list refreshed successfully", "success");
    } catch (error) {
      console.error("Error fetching files:", error);
      showToast("Failed to load files. Please try again.", "error");
    } finally {
      setRefreshing(false);
    }
  };

  // Delete file
  const deleteFile = async (filename) => {
    try {
      await axios.delete(`http://localhost:8000/files/${filename}`);
      setFiles((prevFiles) => prevFiles.filter((file) => file !== filename));
      showToast(`${filename} has been successfully deleted.`, "success");
    } catch (error) {
      console.error("Error deleting file:", error);
      showToast("Failed to delete file. Please try again.", "error");
    } finally {
      setFileToDelete(null);
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!uploadFile) return;

    setUploadLoading(true);
    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      await axios.post("http://localhost:8000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      showToast(`${uploadFile.name} has been successfully uploaded.`, "success");
      setUploadFile(null);
      // Refresh the file list
      const response = await axios.get("http://localhost:8000/files/");
      setFiles(response.data);
      showToast("Files list refreshed successfully", "success");
    } catch (error) {
      console.error("Error uploading file:", error);
      showToast("Failed to upload file. Please try again.", "error");
    } finally {
      setUploadLoading(false);
    }
  };

  // Handle URL scraping
  const handleUrlScrape = async () => {
    if (!url.trim()) return;
    
    setHtmlLoading(true);
    try {
      await axios.get(`http://127.0.0.1:8000/scrapehtmlpage/?url=${encodeURIComponent(url)}`)
      showToast(`Content from ${url} has been successfully processed.`, "success");
      setUrl("");
      // Refresh the file list
      const response = await axios.get("http://localhost:8000/files/");
      setFiles(response.data);
      showToast("Files list refreshed successfully", "success");
    } catch (error) {
      console.error("Error scraping URL:", error);
      showToast("Failed to process the webpage. Please try again.", "error");
    } finally {
      setHtmlLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setUploadFile(acceptedFiles[0]);
      setUrl(""); 
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  const showToast = (message, type) => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, 3000);
  };

  useEffect(() => {
    fetchFilesInitial();
  }, []);

  // Determine if dark mode (for styling)
  const isDark = typeof window !== "undefined" && 
    window.matchMedia && 
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 flex-col items-center justify-center p-4 md:mt-10 md:p-8">
        {/* Toast Notifications */}
        <div className="fixed right-4 top-10 z-50 mt-10 flex flex-col gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`flex items-center justify-between gap-2 rounded-lg p-4 shadow-lg transition-all duration-300 ${
                toast.type === "error"
                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              }`}
            >
              <span>{toast.message}</span>
              <button
                onClick={() => 
                  setToasts(prevToasts => prevToasts.filter(t => t.id !== toast.id))
                }
                className="rounded-full p-1 hover:bg-black/10 ml-2"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Added extra margin at the top, especially for mobile */}
        <div className="w-full max-w-4xl mt-20 sm:mt-16 md:mt-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Upload and URL Section */}
            <div className="w-full md:w-1/2">
              <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 h-[520px]">
                <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  ➕ Add New Documents 
                  </h2>
                </div>

                {/* Added extra padding at the top to move content down */}
                <div className="flex flex-grow flex-col p-4 pt-2 overflow-auto mt-2">
                  {/* File Upload Section */}
                  <div
                    {...getRootProps()}
                    className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                      isDragActive
                        ? "border-blue-500 bg-blue-500/10"
                        : uploadFile
                          ? "border-green-500 bg-green-500/10"
                          : isDark
                            ? "border-gray-600 hover:border-gray-500"
                            : "border-gray-300 hover:border-gray-400"
                    } ${url ? "opacity-50" : ""}`}
                  >
                    <input {...getInputProps()} disabled={!!url} />
                    <p className={isDark ? "text-gray-400 mb-4" : "text-gray-600 mb-4"}>
                      {uploadFile
                        ? uploadFile.name
                        : isDragActive
                          ? "Drop the file here"
                          : "Drag and drop a file, or click to select"}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">Supported formats: PDF, DOC, DOCX</p>
                  </div>
                  
                  <button
                    onClick={handleFileUpload}
                    disabled={!uploadFile || uploadLoading || !!url}
                    className="mt-5 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {uploadLoading ? (
                      <div className="flex items-center">
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Uploading...
                      </div>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload File
                      </>
                    )}
                  </button>

                  {/* OR Divider */}
                  <div className="flex items-center my-7">
                    <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                    <span className="mx-4 text-sm text-gray-500 dark:text-gray-400">OR</span>
                    <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                  </div>

                  {/* URL Input Section */}
                  <div className="">
                    <p className="text-center mb-3 text-gray-700 dark:text-gray-300">
                      Enter a webpage URL to learn from
                    </p>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => {
                        setUrl(e.target.value);
                        setUploadFile(null); // Reset file when URL is entered
                      }}
                      disabled={!!uploadFile}
                      placeholder="https://godeskless.html"
                      className="w-full bg-transparent text-center focus:outline-none p-2 border-b border-gray-300 dark:border-gray-700"
                    />
                  </div>

                  <button
                    onClick={handleUrlScrape}
                    disabled={!url.trim() || htmlLoading || !!uploadFile}
                    className="mt-5 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
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

            {/* File List Section - adjusted to pull up the border */}
            <div className="w-full md:w-1/2">
              <div className="flex h-[520px] w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    🔍 Uploaded Files
                  </h2>
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

                {/* Modified padding to pull up the border */}
                <div className="flex flex-grow flex-col p-4 pt-4 overflow-hidden">
                  {loading ? (
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((i) => (
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
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                        No files uploaded❗️
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Upload files or scrape web pages to see them listed here.
                      </p>
                    </div>
                  ) : (
                    <div className="h-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 -mt-2">
                      <ul className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto max-h-[380px]">
                        {files.map((file) => (
                          <li
                            key={file}
                            className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          >
                            <div className="flex items-center space-x-3 overflow-hidden">
                              <FileIcon className="h-5 w-5 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                              <span
                                className="truncate font-medium text-gray-800 dark:text-gray-200"
                                title={file}
                              >
                                {file}
                              </span>
                            </div>
                            <button
                              onClick={() => setFileToDelete(file)}
                              className="rounded-full p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                              aria-label={`Delete ${file}`}
                            >
                              <Trash2 size={18} />
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
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Delete file
              </h3>
              <p className="mb-4 text-gray-600 dark:text-gray-300 break-words">
                Are you sure you want to delete "{fileToDelete}"? This action
                cannot be undone.
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
                  className="rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileList;