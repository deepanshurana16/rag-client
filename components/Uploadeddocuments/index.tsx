// "use client"

// import { useState, useEffect } from "react"
// import axios from "axios"
// import { Trash2, RefreshCw, FileIcon, X } from "lucide-react"

// const FileList = () => {
//   const [files, setFiles] = useState<string[]>([])
//   const [loading, setLoading] = useState<boolean>(true)
//   const [refreshing, setRefreshing] = useState<boolean>(false)
//   const [fileToDelete, setFileToDelete] = useState<string | null>(null)
//   const [toast, setToast] = useState<{ visible: boolean; message: string; type: string }>({
//     visible: false,
//     message: "",
//     type: "success",
//   })

//   // Fetch file list
//   const fetchFiles = async () => {
//     setRefreshing(true)
//     try {
//       const response = await axios.get("http://localhost:8000/files/")
//       setFiles(response.data)
//       showToast("Files refreshed successfully", "success")
//     } catch (error) {
//       console.error("Error fetching files:", error)
//       showToast("Failed to load files. Please try again.", "error")
//     } finally {
//       setLoading(false)
//       setRefreshing(false)
//     }
//   }

//   // Delete file
//   const deleteFile = async (filename: string) => {
//     try {
//       await axios.delete(`http://localhost:8000/files/${filename}`)
//       setFiles((prevFiles) => prevFiles.filter((file) => file !== filename))
//       showToast(`${filename} has been successfully deleted.`, "success")
//     } catch (error) {
//       console.error("Error deleting file:", error)
//       showToast("Failed to delete file. Please try again.", "error")
//     } finally {
//       setFileToDelete(null)
//     }
//   }

//   const showToast = (message: string, type: string) => {
//     setToast({ visible: true, message, type })
//     setTimeout(() => {
//       setToast((prev) => ({ ...prev, visible: false }))
//     }, 3000)
//   }

//   useEffect(() => {
//     fetchFiles()
//   }, [])

//   return (
//     <div className="relative min-h-screen flex items-center justify-center p-4">
//       {/* Toast notification */}
//       {toast.visible && (
//         <div
//           className={`fixed top-4 right-4 z-50 flex items-center gap-2 p-4 rounded-lg shadow-lg transition-all duration-300  mt-18 ${
//             toast.type === "error"
//               ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
//               : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
//           }`}
//         >
//           <span>{toast.message}</span>
//           <button
//             onClick={() => setToast((prev) => ({ ...prev, visible: false }))}
//             className="p-1 rounded-full hover:bg-black/10"
//           >
//             <X size={16} />
//           </button>
//         </div>
//       )}

//       {/* Main card */}
//       <div className="flex flex-col w-full max-w-xl bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
//           <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Uploaded Files</h2>
//           <button
//             onClick={fetchFiles}
//             className={`p-2 rounded-full transition-colors ${
//               refreshing
//                 ? "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
//                 : "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
//             }`}
//             disabled={refreshing}
//             aria-label="Refresh file list"
//           >
//             <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-4">
//           {loading ? (
//             <div className="space-y-3">
//               {[1, 2, 3].map((i) => (
//                 <div
//                   key={i}
//                   className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-pulse"
//                 >
//                   <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600"></div>
//                   <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded flex-1"></div>
//                   <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600"></div>
//                 </div>
//               ))}
//             </div>
//           ) : files.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-8 text-center">
//               <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-3 mb-3">
//                 <FileIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
//               </div>
//               <h3 className="text-lg font-medium text-gray-800 dark:text-white">No files uploaded</h3>
//               <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Upload files to see them listed here.</p>
//             </div>
//           ) : (
//             <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
//               <ul className="divide-y divide-gray-200 dark:divide-gray-700">
//                 {files.map((file) => (
//                   <li
//                     key={file}
//                     className="flex justify-between items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
//                   >
//                     <div className="flex items-center space-x-3 overflow-hidden">
//                       <FileIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
//                       <span className="truncate font-medium text-gray-800 dark:text-gray-200" title={file}>
//                         {file}
//                       </span>
//                     </div>
//                     <button
//                       onClick={() => setFileToDelete(file)}
//                       className="p-2 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 transition-colors"
//                       aria-label={`Delete ${file}`}
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Delete confirmation modal */}
//       {fileToDelete && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete file</h3>
//             <p className="text-gray-600 dark:text-gray-300 mb-4">
//               Are you sure you want to delete "{fileToDelete}"? This action cannot be undone.
//             </p>
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setFileToDelete(null)}
//                 className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => fileToDelete && deleteFile(fileToDelete)}
//                 className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default FileList

"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Trash2, RefreshCw, FileIcon, X } from "lucide-react"

const FileList = () => {
  const [files, setFiles] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [fileToDelete, setFileToDelete] = useState<string | null>(null)
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: string }>({
    visible: false,
    message: "",
    type: "success",
  })

  // Fetch file list
  const fetchFiles = async () => {
    setRefreshing(true)
    try {
      const response = await axios.get("http://localhost:8000/files/")
      setFiles(response.data)
      showToast("Files refreshed successfully", "success")
    } catch (error) {
      console.error("Error fetching files:", error)
      showToast("Failed to load files. Please try again.", "error")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Delete file
  const deleteFile = async (filename: string) => {
    try {
      await axios.delete(`http://localhost:8000/files/${filename}`)
      setFiles((prevFiles) => prevFiles.filter((file) => file !== filename))
      showToast(`${filename} has been successfully deleted.`, "success")
    } catch (error) {
      console.error("Error deleting file:", error)
      showToast("Failed to delete file. Please try again.", "error")
    } finally {
      setFileToDelete(null)
    }
  }

  const showToast = (message: string, type: string) => {
    setToast({ visible: true, message, type })
    setTimeout(() => {
      setToast({ visible: false, message: "", type: "success" })
    }, 3000)
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  return (
    <div className="relative h-screen md:h-[800px] flex items-center justify-center p-4">
      {/* Toast notification */}
      {toast.visible && (
        <div
          className={`fixed top-10 right-4 z-50 flex items-center gap-2 p-4 rounded-lg shadow-lg transition-all duration-300 mt-12 ${
            toast.type === "error"
              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => setToast({ visible: false, message: "", type: "success" })}
            className="p-1 rounded-full hover:bg-black/10"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main card */}
      <div className="flex flex-col w-full max-w-xl bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 h-4/6">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Uploaded Files</h2>
          <button
            onClick={fetchFiles}
            className={`p-2 rounded-full transition-colors ${
              refreshing
                ? "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
            }`}
            disabled={refreshing}
            aria-label="Refresh file list"
          >
            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-grow overflow-y-auto flex flex-col">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-pulse"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded flex-1"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                </div>
              ))}
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center flex-grow">
              <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-3 mb-3">
                <FileIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">No files uploaded</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Upload files to see them listed here.</p>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden h-full overflow-y-auto">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {files.map((file) => (
                  <li
                    key={file}
                    className="flex justify-between items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <FileIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <span className="truncate font-medium text-gray-800 dark:text-gray-200" title={file}>
                        {file}
                      </span>
                    </div>
                    <button
                      onClick={() => setFileToDelete(file)}
                      className="p-2 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 transition-colors"
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

      {/* Delete confirmation modal */}
      {fileToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete file</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to delete "{fileToDelete}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setFileToDelete(null)}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => fileToDelete && deleteFile(fileToDelete)}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileList