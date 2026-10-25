'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot, Send, X, AlertTriangle, Sparkles, User, Minimize2 } from 'lucide-react'

interface Message {
  id: string
  sender: 'user' | 'ai'
  text: string
  isEmergency?: boolean
}

export function VitaGuideChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: '👋 Hello! I am **VitaGuide**, your smart AI health assistant. I can help with general health education, appointment prep, explaining terms, or summarizing records.\n\n*Note: I do not provide medical diagnoses or prescriptions.*',
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input
    if (!query.trim() || loading) return

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: query }
    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/vitaguide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      })
      const data = await res.json()
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply || 'Sorry, I am having trouble responding right now.',
        isEmergency: data.isEmergency,
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: 'ai', text: 'An error occurred. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-sky-600 to-teal-600 text-white rounded-full shadow-lg shadow-sky-600/30 hover:scale-105 transition-all font-medium text-sm"
        >
          <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          <span>Ask VitaGuide AI</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 h-[500px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-3 bg-gradient-to-r from-sky-600 to-teal-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-none">VitaGuide AI</h3>
                <p className="text-[10px] text-sky-100 mt-0.5">Health Assistant & Guidance</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-md transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-950 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5 ${m.isEmergency ? 'bg-red-600' : 'bg-sky-600'}`}>
                    {m.isEmergency ? <AlertTriangle className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[85%] whitespace-pre-wrap leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-sky-600 text-white rounded-br-none'
                      : m.isEmergency
                      ? 'bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-200 rounded-bl-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
                {m.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 items-center text-slate-400 text-xs">
                <Bot className="w-4 h-4 animate-bounce text-sky-600" />
                <span>VitaGuide is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-1.5 overflow-x-auto text-[11px] whitespace-nowrap scrollbar-none">
            <button
              onClick={() => handleSend('How do I prepare for my doctor appointment?')}
              className="px-2 py-1 bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 rounded-full hover:bg-sky-100 transition-colors"
            >
              📋 Appointment Prep
            </button>
            <button
              onClick={() => handleSend('What is CBC in blood test?')}
              className="px-2 py-1 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded-full hover:bg-teal-100 transition-colors"
            >
              💡 Explain CBC Term
            </button>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="p-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask health or app questions..."
              className="flex-1 text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500 dark:bg-slate-800 dark:text-white"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
