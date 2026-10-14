"use client";

import React, { useState, useRef, useEffect } from "react";
import { parseJobDescription, ParsedJobData } from "@/lib/jobParser";
import {
  Sparkles,
  Bot,
  X,
  Send,
  Building2,
  Briefcase,
  MapPin,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  ClipboardPaste,
  RotateCcw,
  MessageSquare,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text?: string;
  parsedData?: ParsedJobData;
  timestamp: string;
}

interface JobChatbotProps {
  onApplyJob: (data: ParsedJobData) => void;
}

const SAMPLE_JOB_POST = `Company: Stripe
Job Title: Senior Full-Stack Engineer
Location: San Francisco, CA (Remote)
Job Type: Full-time
Work Mode: Remote
Salary: $150,000 - $185,000 USD
URL: https://stripe.com/jobs/senior-fullstack

About the Role:
We are looking for a Senior Full-Stack Engineer to build reliable financial infrastructure. You will work on developer APIs and customer-facing dashboards.

Requirements:
- 5+ years of experience with React, TypeScript, and Node.js
- Experience building scalable cloud services
- Strong understanding of REST APIs and PostgreSQL`;

export const JobChatbot: React.FC<JobChatbotProps> = ({ onApplyJob }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "👋 Hi there! I'm your **CareerTrack AI Assistant**. Paste any job posting, email, or JD here, and I'll extract all details and automatically fill your application form!",
      timestamp: "Just now",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = (textToSend?: string) => {
    const rawContent = (textToSend || input).trim();
    if (!rawContent) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: rawContent,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    setTimeout(() => {
      // Check if it's a general help query
      if (
        /^(hi|hello|help|who are you|ki koro|kemon acho)/i.test(rawContent) &&
        rawContent.length < 30
      ) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: "I can extract structured job data from any text! Simply paste a full job description (from LinkedIn, Indeed, etc.), and I'll extract Company, Job Title, Salary, Location, and Requirements, then auto-fill your application form with one click. Try clicking **'Paste Sample Job'** below!",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        setIsTyping(false);
        return;
      }

      // Parse the job description
      const parsed = parseJobDescription(rawContent);

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: parsed.jobTitle || parsed.companyName
          ? `🎉 I analyzed your job details and extracted key information! Click below to auto-fill the application form:`
          : `I reviewed your text. Some details were detected, but you can review and fill the rest in the form:`,
        parsedData: parsed,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInput(text);
      }
    } catch {
      // Clipboard access denied or unsupported
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "bot",
        text: "Chat cleared! Paste a new job posting anytime to auto-fill your form.",
        timestamp: "Just now",
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`group relative flex items-center gap-2.5 px-4 py-3 rounded-full text-white font-medium shadow-xl transition-all duration-300 ${
            isOpen
              ? "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
              : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:scale-105 shadow-indigo-500/25 ring-2 ring-indigo-400/30"
          }`}
          title="Open AI Job Assistant"
        >
          {isOpen ? (
            <>
              <X className="w-5 h-5" />
              <span className="text-sm font-semibold">Close Assistant</span>
            </>
          ) : (
            <>
              <div className="relative">
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
              </div>
              <span className="text-sm font-semibold tracking-wide">AI Auto-Fill Bot</span>
            </>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[80vh] flex flex-col rounded-2xl bg-slate-900/95 border border-indigo-500/30 backdrop-blur-2xl shadow-2xl overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="relative p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30">
                <Bot className="w-5 h-5" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-slate-900" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white">CareerTrack AI</h3>
                  <span className="px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] rounded-full font-mono">
                    Auto-Fill
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Paste job post ➔ Instant form fill</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                title="Reset Chat"
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Chips */}
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-950/60 border-b border-slate-800/60 overflow-x-auto text-[11px] no-scrollbar">
            <button
              onClick={() => handleSend(SAMPLE_JOB_POST)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-900/60 transition whitespace-nowrap"
            >
              <Sparkles className="w-3 h-3 text-amber-400" /> Try Sample Job Post
            </button>
            <button
              onClick={handlePasteFromClipboard}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/60 hover:bg-slate-800 transition whitespace-nowrap"
            >
              <ClipboardPaste className="w-3 h-3 text-cyan-400" /> Paste Clipboard
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/20"
                      : "bg-slate-800/90 text-slate-200 border border-slate-700/70 rounded-tl-none shadow"
                  }`}
                >
                  {msg.text && (
                    <div className="whitespace-pre-wrap font-sans">
                      {msg.text}
                    </div>
                  )}

                  {/* Parsed Job Card */}
                  {msg.parsedData && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-indigo-500/40 space-y-2.5 text-left text-xs">
                      {/* Company & Role */}
                      <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2">
                        <div>
                          <div className="font-semibold text-white text-sm flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                            {msg.parsedData.jobTitle || "Job Position"}
                          </div>
                          <div className="text-indigo-300 text-xs flex items-center gap-1.5 mt-0.5">
                            <Building2 className="w-3 h-3 text-slate-400" />
                            {msg.parsedData.companyName || "Company not specified"}
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-medium">
                          Parsed
                        </span>
                      </div>

                      {/* Badges: Location, Work Mode, Job Type */}
                      <div className="flex flex-wrap gap-1.5 text-[11px]">
                        {msg.parsedData.jobLocation && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                            <MapPin className="w-3 h-3 text-rose-400" />
                            {msg.parsedData.jobLocation}
                          </span>
                        )}
                        {msg.parsedData.workMode && (
                          <span className="px-2 py-0.5 rounded-md bg-indigo-950/60 text-indigo-300 border border-indigo-800/50">
                            {msg.parsedData.workMode}
                          </span>
                        )}
                        {msg.parsedData.jobType && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                            {msg.parsedData.jobType}
                          </span>
                        )}
                        {msg.parsedData.salaryRange && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 font-mono">
                            <DollarSign className="w-3 h-3" />
                            {msg.parsedData.salaryRange}
                          </span>
                        )}
                      </div>

                      {/* Skills Detected */}
                      {msg.parsedData.rawHighlights?.skillsDetected &&
                        msg.parsedData.rawHighlights.skillsDetected.length > 0 && (
                          <div className="text-[10px] text-slate-400 pt-1">
                            <span className="text-slate-300 font-medium">Detected Skills:</span>{" "}
                            {msg.parsedData.rawHighlights.skillsDetected.join(", ")}
                          </div>
                        )}

                      {/* CTA Button */}
                      <button
                        onClick={() => {
                          if (msg.parsedData) {
                            onApplyJob(msg.parsedData);
                            setIsOpen(false);
                          }
                        }}
                        className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-medium text-xs shadow-md transition hover:scale-[1.02] cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Auto-Fill & Open Form</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/80 text-indigo-400 text-xs w-fit border border-slate-700">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Extracting job details & salary data...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800">
            <div className="relative flex items-center">
              <textarea
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Paste job details or description here..."
                className="w-full pl-3.5 pr-20 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              />
              <div className="absolute right-2 bottom-2.5 flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePasteFromClipboard}
                  title="Paste from Clipboard"
                  className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-1.5 px-1 text-[10px] text-slate-500">
              <span>Press Enter to analyze</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" /> Powered by Smart Parser
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
