"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, ChevronDown, Bot, User } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";

// ---------------------------------------------------------------------------
// Knowledge base — edit this object to change chatbot answers
// ---------------------------------------------------------------------------
const KNOWLEDGE: Array<{ patterns: string[]; answer: string }> = [
    {
        patterns: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "greetings", "start"],
        answer: "Hello! Welcome to **Ethos Habitats**. 👋\n\nI'm here to help you with information about our architecture services, team, projects, and more. How can I assist you today?",
    },
    {
        patterns: ["who are you", "what are you", "chatbot", "bot", "ai"],
        answer: "I'm the Ethos Habitats virtual assistant! I can answer common questions about our studio, services, team, and how to get in touch. For complex enquiries, I'll connect you with our team directly.",
    },
    {
        patterns: ["ethos habitats", "about company", "about you", "who is ethos", "what is ethos", "company"],
        answer: "**Ethos Habitats** is a socially responsible architecture studio based in Chennai, India.\n\nWe design practical, sustainable, and innovative spaces that leave a lasting impression — from residential homes to commercial and public buildings. Our philosophy is rooted in social responsibility, sustainability, and deep collaboration with our clients.",
    },
    {
        patterns: ["services", "what do you do", "offer", "work", "design"],
        answer: "We offer a comprehensive range of architectural services:\n\n• **Architectural Design** — Concept to construction documents\n• **Interior Architecture** — Space planning & material selection\n• **Landscape Design** — Site analysis & planting\n• **3D Visualization** — Renders, VR walkthroughs\n• **Project Management** — End-to-end site supervision\n• **Renovation & Restoration** — Adaptive reuse\n\nWould you like to know more about any specific service?",
    },
    {
        patterns: ["founder", "sidhardh", "sid", "chief architect", "architect"],
        answer: "**Ar. Sidhardh Baji** is the Founder and Chief Architect of Ethos Habitats.\n\nSid holds a bachelor's degree in architecture from Mcgan's Ooty School of Architecture. He has worked on landmark projects including IIT Cube, SIPCOT Industrial Park in Chennai, and the Naida Cave renovation in Daman and Diu.\n\nA design maverick at heart, Sid creates practical, sustainable, and innovative spaces. When he's not designing, you'll find him hiking, exploring restaurants, or buried in a good book or film.",
    },
    {
        patterns: ["krishna", "business", "management", "team"],
        answer: "**Krishna Raj** heads Business Management at Ethos Habitats.\n\nWith killer skills in strategic planning, project management, and business development, Krishna ensures every project is delivered on time and on budget. He's all about building strong client relationships and coaching the team to greatness.",
    },
    {
        patterns: ["address", "location", "where", "office", "find you", "visit"],
        answer: `Our office is located at:\n\n📍 **${COMPANY_INFO.address}**\n\nWe welcome visits by appointment. Feel free to call or WhatsApp us to schedule a meeting!`,
    },
    {
        patterns: ["phone", "call", "number", "contact number", "telephone"],
        answer: `You can reach us by phone:\n\n📞 **${COMPANY_INFO.phones[0]}**\n📞 **${COMPANY_INFO.phones[1]}**\n☎️ **${COMPANY_INFO.phones[2]}**\n\nOr click the WhatsApp button on this page to chat with us directly!`,
    },
    {
        patterns: ["email", "mail", "write", "message"],
        answer: `You can email us at:\n\n✉️ **${COMPANY_INFO.email}**\n\nWe typically respond within 1–2 business days. Alternatively, use the contact form on our Contact page.`,
    },
    {
        patterns: ["whatsapp", "whats app", "chat", "instant", "quick message"],
        answer: "You can chat with us instantly on WhatsApp! Just click the green WhatsApp button on this page, or I can open it for you right now. Type **open whatsapp** to start a WhatsApp conversation with our team.",
    },
    {
        patterns: ["open whatsapp", "message whatsapp", "start whatsapp"],
        answer: "Opening WhatsApp now… 💬",
        action: "whatsapp",
    },
    {
        patterns: ["hours", "timing", "open", "working hours", "business hours", "schedule"],
        answer: "Our office is open:\n\n🕘 **Monday – Saturday: 9:00 AM – 6:00 PM IST**\n\nFor urgent matters, you can always reach us on WhatsApp!",
    },
    {
        patterns: ["project", "portfolio", "work", "examples", "completed"],
        answer: "You can browse our complete portfolio on the **Portfolio** page of this website — featuring our residential, commercial, interior, landscape, and cultural projects.\n\nWould you like to know more about our process or a specific type of project?",
    },
    {
        patterns: ["price", "cost", "fee", "charges", "budget", "quote", "estimate"],
        answer: "Project fees vary depending on the scope, scale, and complexity of the work. We offer transparent, value-based pricing tailored to each project.\n\nFor a free initial consultation and cost estimate, please reach out via our **Contact page** or WhatsApp us directly — we'd love to hear about your project!",
    },
    {
        patterns: ["internship", "intern", "fresher", "student", "apply intern"],
        answer: "We welcome internship applications! 🎓\n\nWe receive a large number of applications and shortlisted candidates will receive a response. Please note we cannot return original work.\n\n**Apply to:** info@ethoshabitats.com\n\nSend your portfolio and a brief introduction.",
    },
    {
        patterns: ["job", "career", "employment", "vacancy", "work with", "hire", "joining"],
        answer: "We're always looking for creative talent! 🏛️\n\nIf you thrive under pressure in a dynamic environment, send us:\n• Cover letter\n• Resume\n• Work samples as PDF (max 5 MB)\n\n**Architects, apply to:** info@ethoshabitats.com",
    },
    {
        patterns: ["collaborator", "partner", "earthscape", "associate"],
        answer: "Ethos Habitats collaborates with specialist studios to deliver the best outcome for every project.\n\n🤝 **Earthscape Studio** — Landscape & Environmental Design\n\nTogether, we bring holistic, multi-disciplinary expertise to each commission.",
    },
    {
        patterns: ["sustainable", "green", "environment", "eco", "responsible"],
        answer: "Social and environmental responsibility is at the core of everything we do at Ethos Habitats.\n\nWe integrate:\n• Passive design strategies\n• Sustainable material selection\n• Biophilic design principles\n• Community-centered planning\n\nSustainability isn't an add-on for us — it's how we design.",
    },
    {
        patterns: ["residential", "house", "home", "villa", "apartment", "flat"],
        answer: "Residential design is one of our core specialties. We design everything from individual homes and villas to apartment complexes — always tailored to your lifestyle, needs, and budget.\n\nReach out to discuss your dream home! 🏠",
    },
    {
        patterns: ["commercial", "office", "retail", "shop", "showroom", "corporate"],
        answer: "We design commercial spaces that are functional, inspiring, and brand-aligned — offices, retail outlets, showrooms, and more.\n\nContact us to explore how we can elevate your commercial space! 🏢",
    },
    {
        patterns: ["thank", "thanks", "thank you", "great", "awesome", "helpful"],
        answer: "You're most welcome! 😊 It's our pleasure to help. If you have more questions or would like to start a project with Ethos Habitats, don't hesitate to reach out.\n\nHave a wonderful day!",
    },
    {
        patterns: ["bye", "goodbye", "see you", "later", "exit"],
        answer: "Goodbye! 👋 Feel free to come back anytime. We look forward to working with you at Ethos Habitats!",
    },
];

const SUGGESTED_QUESTIONS = [
    "What services do you offer?",
    "Tell me about your team",
    "Where are you located?",
    "How can I contact you?",
    "Do you have internship openings?",
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Message {
    id: string;
    role: "user" | "bot";
    text: string;
    action?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function matchAnswer(input: string): { answer: string; action?: string } {
    const lower = input.toLowerCase().trim();
    for (const item of KNOWLEDGE) {
        if (item.patterns.some((p) => lower.includes(p))) {
            return { answer: item.answer, action: (item as any).action };
        }
    }
    return {
        answer:
            "I'm not sure about that one. 🤔 For more detailed help, you can:\n\n• Visit our **Contact** page\n• Call us at **+91-6374042823**\n• WhatsApp us directly using the button below\n\nOr type **whatsapp** to start a WhatsApp conversation!",
    };
}

function formatMessage(text: string): React.ReactNode {
    // Convert **bold** and newlines
    const lines = text.split("\n");
    return lines.map((line, i) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
            <span key={i}>
                {parts.map((p, j) =>
                    p.startsWith("**") && p.endsWith("**") ? (
                        <strong key={j}>{p.slice(2, -2)}</strong>
                    ) : (
                        p
                    )
                )}
                {i < lines.length - 1 && <br />}
            </span>
        );
    });
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function Chatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "0",
            role: "bot",
            text: "Hi there! 👋 I'm the Ethos Habitats assistant. How can I help you today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const [unread, setUnread] = useState(0);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            setUnread(0);
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [open]);

    useEffect(() => {
        if (open) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, open]);

    const handleWhatsApp = useCallback((userMessage?: string) => {
        const text = userMessage
            ? encodeURIComponent(userMessage)
            : encodeURIComponent("Hello! I'd like to know more about Ethos Habitats.");
        window.open(`https://wa.me/${COMPANY_INFO.whatsapp}?text=${text}`, "_blank", "noopener,noreferrer");
    }, []);

    const sendMessage = useCallback(
        (text: string) => {
            if (!text.trim()) return;
            const userMsg: Message = { id: Date.now().toString(), role: "user", text: text.trim() };
            setMessages((prev) => [...prev, userMsg]);
            setInput("");
            setTyping(true);

            setTimeout(() => {
                const { answer, action } = matchAnswer(text);
                const botMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "bot",
                    text: answer,
                    action,
                };
                setMessages((prev) => [...prev, botMsg]);
                setTyping(false);
                if (!open) setUnread((n) => n + 1);
                if (action === "whatsapp") {
                    setTimeout(() => handleWhatsApp(text), 500);
                }
            }, 800);
        },
        [open, handleWhatsApp]
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    return (
        <>
            {/* Floating toggle button */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
                <AnimatePresence>
                    {!open && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => setOpen(true)}
                            aria-label="Open chat"
                            className="relative w-14 h-14 rounded-full bg-gold-500 hover:bg-gold-600 text-obsidian-900 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                        >
                            <MessageCircle size={24} />
                            {unread > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                                    {unread}
                                </span>
                            )}
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Chat window */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] flex flex-col"
                        style={{ height: "520px" }}
                        role="dialog"
                        aria-label="Ethos Habitats chat assistant"
                    >
                        <div className="flex flex-col h-full rounded-xl overflow-hidden shadow-2xl border border-[var(--border)] bg-[var(--bg)]">
                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-3 bg-obsidian-900 dark:bg-obsidian-800 text-cream-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gold-500 flex items-center justify-center shrink-0">
                                        <Bot size={18} className="text-obsidian-900" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold leading-tight">Ethos Habitats</p>
                                        <p className="text-[10px] text-cream-200/60 tracking-wide">Virtual Assistant</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleWhatsApp()}
                                        aria-label="Open WhatsApp"
                                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                                        title="Chat on WhatsApp"
                                    >
                                        {/* WhatsApp icon SVG */}
                                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#25D366]">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setOpen(false)}
                                        aria-label="Close chat"
                                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-cream-200/70 hover:text-cream-100"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        {msg.role === "bot" && (
                                            <div className="w-7 h-7 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center shrink-0 mt-0.5">
                                                <Bot size={14} className="text-gold-500" />
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed rounded-2xl ${msg.role === "user"
                                                    ? "bg-gold-500 text-obsidian-900 rounded-br-sm"
                                                    : "bg-[var(--bg-alt)] text-[var(--text-primary)] border border-[var(--border)] rounded-bl-sm"
                                                }`}
                                        >
                                            {formatMessage(msg.text)}
                                        </div>
                                        {msg.role === "user" && (
                                            <div className="w-7 h-7 rounded-full bg-[var(--bg-alt)] border border-[var(--border)] flex items-center justify-center shrink-0 mt-0.5">
                                                <User size={14} className="text-[var(--text-muted)]" />
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {typing && (
                                    <div className="flex gap-2 justify-start">
                                        <div className="w-7 h-7 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center shrink-0">
                                            <Bot size={14} className="text-gold-500" />
                                        </div>
                                        <div className="px-4 py-3 bg-[var(--bg-alt)] border border-[var(--border)] rounded-2xl rounded-bl-sm">
                                            <span className="flex gap-1 items-center h-4">
                                                {[0, 1, 2].map((i) => (
                                                    <span
                                                        key={i}
                                                        className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-bounce"
                                                        style={{ animationDelay: `${i * 0.15}s` }}
                                                    />
                                                ))}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <div ref={bottomRef} />
                            </div>

                            {/* Suggested questions (show only when few messages) */}
                            {messages.length <= 2 && (
                                <div className="px-4 pb-2">
                                    <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)] mb-2">
                                        Suggested
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {SUGGESTED_QUESTIONS.map((q) => (
                                            <button
                                                key={q}
                                                onClick={() => sendMessage(q)}
                                                className="text-xs px-2.5 py-1 border border-[var(--border)] hover:border-gold-500/60 hover:text-gold-500 text-[var(--text-secondary)] rounded-full transition-colors duration-200"
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Input */}
                            <form
                                onSubmit={handleSubmit}
                                className="px-4 py-3 border-t border-[var(--border)] flex gap-2"
                            >
                                <input
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your message…"
                                    className="flex-1 text-sm bg-transparent outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                                    aria-label="Chat message"
                                    maxLength={300}
                                    autoComplete="off"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || typing}
                                    aria-label="Send message"
                                    className="w-8 h-8 rounded-full bg-gold-500 hover:bg-gold-600 disabled:opacity-40 disabled:cursor-not-allowed text-obsidian-900 flex items-center justify-center transition-colors"
                                >
                                    <Send size={15} />
                                </button>
                            </form>

                            {/* WhatsApp CTA bar */}
                            <div className="px-4 py-2.5 bg-[#075E54] flex items-center justify-between">
                                <span className="text-xs text-white/80">Chat directly with our team</span>
                                <button
                                    onClick={() => handleWhatsApp()}
                                    className="text-xs font-semibold text-[#25D366] hover:text-white transition-colors"
                                >
                                    Open WhatsApp →
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
