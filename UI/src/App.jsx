import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [typingEffect, setTypingEffect] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate typing effect for AI responses
  const simulateTyping = async (text) => {
    setTypingEffect(true);
    setCurrentResponse("");
    for (let i = 0; i <= text.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 15));
      setCurrentResponse(text.slice(0, i));
    }
    setMessages(prev => [...prev, { type: "ai", text: text, timestamp: new Date().toISOString() }]);
    setCurrentResponse("");
    setTypingEffect(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setFileName(file.name);
      setUploadStatus(null);
      // Add excitement animation
      const dropzone = document.getElementById("dropzone");
      dropzone?.classList.add("animate-pulse");
      setTimeout(() => dropzone?.classList.remove("animate-pulse"), 500);
    } else if (file) {
      alert("✨ Please select a valid PDF file");
      setSelectedFile(null);
      setFileName("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setFileName(file.name);
      setUploadStatus(null);
    } else if (file) {
      alert("✨ Please drop a valid PDF file");
    }
  };

  const uploadPDF = async () => {
    if (!selectedFile) {
      alert("✨ Please select a PDF file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      setUploadStatus("uploading");

      const response = await axios.post(
        "http://localhost:8000/upload-pdf",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000,
        }
      );

      setUploadStatus("success");
      setTimeout(() => setUploadStatus(null), 4000);
      
      setMessages(prev => [...prev, {
        type: "system",
        text: `🎉 PDF "${fileName}" uploaded successfully! Ready to answer your questions.`,
        timestamp: new Date().toISOString()
      }]);
      
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
      setTimeout(() => setUploadStatus(null), 4000);
      alert("❌ Upload failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!question.trim() || loading || typingEffect) return;

    const userQuestion = question.trim();
    
    setMessages(prev => [
      ...prev,
      { type: "user", text: userQuestion, timestamp: new Date().toISOString() },
    ]);
    
    setQuestion("");

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8000/chat",
        { question: userQuestion },
        { timeout: 30000 }
      );

      const answer = response.data.answer || "I couldn't process that request. Please try again.";
      await simulateTyping(answer);
      
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        {
          type: "ai",
          text: error.response?.data?.message || "⚠️ Failed to get response. Please ensure a PDF is uploaded and the server is running.",
          isError: true,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (messages.length > 0 && window.confirm("✨ Clear all messages?")) {
      setMessages([]);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Floating particles background
  const Particles = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            background: `radial-gradient(circle, rgba(139,92,246,0.4), rgba(59,130,246,0.2))`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 8 + 5}s`,
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] relative overflow-hidden">
      <Particles />
      
      {/* Animated Gradient Orbs */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="fixed top-40 right-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="fixed bottom-20 left-1/2 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Header */}
      <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  PDF Chat Assistant
                </h1>
                <p className="text-xs text-purple-200">Intelligent Document Q&A • AI-Powered</p>
              </div>
            </div>
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="group relative px-4 py-2 rounded-xl bg-white/10 hover:bg-red-500/20 backdrop-blur-sm text-white/80 hover:text-red-400 transition-all duration-300 text-sm flex items-center gap-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/0 to-red-500/0 group-hover:from-red-500/20 transition-all"></div>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Chat
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Upload Section - Glassmorphic Card */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl transform transition-all duration-500 hover:translate-y-[-8px]">
              <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  Document Upload
                </h2>
                <p className="text-sm text-purple-200 mt-1">Upload your PDF to start the conversation</p>
              </div>
              
              <div className="p-6">
                {/* Drag & Drop Zone */}
                <div
                  id="dropzone"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer overflow-hidden
                    ${isDragging 
                      ? "border-purple-400 bg-purple-500/20 scale-105" 
                      : fileName 
                        ? "border-green-400 bg-green-500/20" 
                        : "border-white/30 bg-white/5 hover:border-purple-400 hover:bg-purple-500/10 hover:scale-105"
                    }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  {fileName ? (
                    <div className="space-y-3 animate-bounce-in">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="font-semibold text-white text-lg">{fileName}</p>
                      <p className="text-xs text-purple-200">✨ Ready to upload! Click or drag to change</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                        <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="font-medium text-white">Drop your PDF here or click to browse</p>
                      <p className="text-xs text-purple-200">📄 Supports PDF files up to 10MB</p>
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={uploadPDF}
                    disabled={loading || !selectedFile}
                    className={`relative w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group
                      ${!selectedFile 
                        ? "bg-white/5 text-white/30 cursor-not-allowed" 
                        : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-2xl hover:scale-105 active:scale-95"
                      }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {uploadStatus === "uploading" ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Upload PDF
                      </>
                    )}
                  </button>

                  {/* Status Messages */}
                  {uploadStatus === "success" && (
                    <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/50 rounded-xl p-3 text-sm text-green-300 flex items-center gap-2 animate-slide-down">
                      <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      🎉 PDF uploaded successfully! Ready for questions.
                    </div>
                  )}
                  {uploadStatus === "error" && (
                    <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/50 rounded-xl p-3 text-sm text-red-300 flex items-center gap-2 animate-shake">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      ❌ Upload failed. Please try again.
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="bg-white/5 backdrop-blur-sm px-6 py-4 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-purple-200">
                  <span className="flex items-center gap-2">🔒 Secure Processing</span>
                  <span className="flex items-center gap-2">🧠 AI-Powered Answers</span>
                  <span className="flex items-center gap-2">🎯 Context-Aware</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Section - Premium Glass Card */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 flex flex-col h-[650px] overflow-hidden shadow-2xl">
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur-md animate-pulse"></div>
                      <div className="relative w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">✨ Live Conversation</h3>
                      <p className="text-xs text-purple-200">Ask anything about your document</p>
                    </div>
                  </div>
                  {messages.filter(m => m.type === "user").length > 0 && (
                    <div className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-purple-200">
                      💬 {messages.filter(m => m.type === "user").length} questions
                    </div>
                  )}
                </div>
              </div>

              {/* Messages Container */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scroll">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl animate-pulse"></div>
                      <div className="relative w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <svg className="w-10 h-10 text-purple-300 animate-float" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-lg">✨ No messages yet</p>
                      <p className="text-sm text-purple-200">Upload a PDF and start asking questions!</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
                      >
                        <div className={`max-w-[85%] ${msg.type === "user" ? "order-2" : "order-1"}`}>
                          <div className={`rounded-2xl px-4 py-3 ${
                            msg.type === "user" 
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl" 
                              : msg.isError 
                                ? "bg-red-500/20 backdrop-blur-sm border border-red-400/50 text-red-200"
                                : msg.type === "system"
                                  ? "bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/50 text-emerald-200"
                                  : "bg-white/10 backdrop-blur-sm text-white"
                          }`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                          </div>
                          {msg.timestamp && (
                            <p className={`text-xs mt-1 text-purple-300/60 ${msg.type === "user" ? "text-right" : ""}`}>
                              {formatTime(msg.timestamp)}
                            </p>
                          )}
                        </div>
                        {msg.type === "ai" && !msg.isError && (
                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center ml-3 order-2 flex-shrink-0 shadow-xl">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                        )}
                        {msg.type === "user" && (
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3 order-1 flex-shrink-0 shadow-xl">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                    {typingEffect && currentResponse && (
                      <div className="flex justify-start animate-fade-in-up">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 max-w-[85%]">
                          <p className="text-sm leading-relaxed text-white">{currentResponse}<span className="animate-pulse">▊</span></p>
                        </div>
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center ml-3 shadow-xl">
                          <svg className="w-4 h-4 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                      </div>
                    )}
                    {loading && !typingEffect && (
                      <div className="flex justify-start animate-fade-in-up">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                            <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                            <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-sm">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !loading && !typingEffect && sendMessage()}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="✨ Ask a question about your document..."
                      className={`w-full px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border transition-all duration-300 text-white placeholder-purple-200/50 outline-none ${isFocused ? "border-purple-400 shadow-lg shadow-purple-500/20 scale-[1.02]" : "border-white/20"}`}
                      disabled={loading || typingEffect}
                    />
                    {question && (
                      <button
                        onClick={() => setQuestion("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={loading || !question.trim() || typingEffect}
                    className={`relative px-6 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 overflow-hidden group
                      ${!question.trim() || loading || typingEffect
                        ? "bg-white/5 text-white/30 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-2xl hover:scale-105 active:scale-95"
                      }`}
                  >
                    <span>Send</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-purple-200/60 mt-3 text-center">
                  🤖 Powered by Advanced AI • Contextual answers based on your document
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.8);
        }
      `}</style>
    </div>
  );
};

export default App;