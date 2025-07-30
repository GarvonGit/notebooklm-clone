import { useEffect, useState } from "react";
import ChatBox from "./components/ChatBox";
import PDFViewer from "./components/PDFViewer";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import './App.css';

export default function App() {
  const [pdfText, setPdfText] = useState("");
  const [pdfURL, setPdfURL] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const storedPdfUrl = localStorage.getItem("uploadedPdfUrl");
    if (storedPdfUrl) {
      setPdfURL(storedPdfUrl);
    }
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setUploadProgress(0);

    const objectUrl = URL.createObjectURL(file);
    setPdfURL(objectUrl);
    localStorage.setItem("uploadedPdfUrl", objectUrl); // Persist across refresh

    try {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch("http://localhost:8000/upload-pdf/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setPdfText(data.text);
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Error uploading PDF");
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    localStorage.removeItem("uploadedPdfUrl");
    setPdfURL(null);
    setPdfText("");
  };

  const triggerFileUpload = () => {
    document.getElementById('file-input').click();
  };

  return (
    <div className="app">
      <div className="header">
        <h1>NotebookLM Clone - By Garv Chouhan</h1>
        {pdfURL && <button onClick={resetUpload} className="reset-btn">Reset</button>}
      </div>

      {uploading ? (
        <div className="uploading-container">
          <div className="uploading-card">
            <div className="text-center">
              <div className="spinner-box">
                <div className="outer-ring"></div>
                <div className="inner-ring"></div>
              </div>
              <h2>Uploading PDF</h2>
              <p>Processing your document...</p>
            </div>
            <div>
              <div className="progress-labels">
                <span>Progress</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      ) : !pdfText ? (
        <div className="upload-screen">
          <div className="upload-card">
            <div className="upload-icon-box" onClick={triggerFileUpload}>
              <ArrowUpTrayIcon style={{ width: 40, height: 40, color: "#9333ea" }} />
            </div>
            <h2 className="upload-title" onClick={triggerFileUpload}>Upload PDF to start chatting</h2>
            <p className="upload-desc">Click or drag and drop your file here</p>

            <input
              id="file-input"
              type="file"
              accept="application/pdf"
              onChange={handleUpload}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      ) : (
        <div className="main-view">
          <div className="chat-split">
            <div className="chat-panel">
              <ChatBox pdfText={pdfText} />
            </div>
            <div className="pdf-panel">
              {/* Show PDF viewer using object URL */}
              <iframe
                src={pdfURL}
                title="PDF Viewer"
                width="100%"
                height="100%"
                style={{ border: "none" }}
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}