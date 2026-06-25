"use client";

import { useEffect, useRef, useCallback, useTransition, useState } from "react";
import { cn } from "@/lib/utils";
import {
    FileUp,
    CircleUserRound,
    ArrowUpIcon,
    Paperclip,
    Command,
    XIcon,
    LoaderIcon,
    Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react"

interface UseAutoResizeTextareaProps {
    minHeight: number;
    maxHeight?: number;
}

function useAutoResizeTextarea({
    minHeight,
    maxHeight,
}: UseAutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = useCallback(
        (reset?: boolean) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            if (reset) {
                textarea.style.height = `${minHeight}px`;
                return;
            }

            textarea.style.height = `${minHeight}px`;
            const newHeight = Math.max(
                minHeight,
                Math.min(
                    textarea.scrollHeight,
                    maxHeight ?? Number.POSITIVE_INFINITY
                )
            );

            textarea.style.height = `${newHeight}px`;
        },
        [minHeight, maxHeight]
    );

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${minHeight}px`;
        }
    }, [minHeight]);

    useEffect(() => {
        const handleResize = () => adjustHeight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [adjustHeight]);

    return { textareaRef, adjustHeight };
}

interface CommandSuggestion {
    icon: React.ReactNode;
    label: string;
    description: string;
    prefix: string;
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string;
  showRing?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, containerClassName, showRing = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    
    return (
      <div className={cn(
        "relative",
        containerClassName
      )}>
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "transition-all duration-200 ease-in-out",
            "placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50",
            showRing ? "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" : "",
            className
          )}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {showRing && isFocused && (
          <motion.span 
            className="absolute inset-0 rounded-md pointer-events-none ring-2 ring-offset-0 ring-blue-500/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

interface Message {
    role: "user" | "assistant";
    content: string;
}

// Helper to parse inline markdown formats: **bold**, *italic*, `inline code`
function parseInlineMarkdown(text: string): React.ReactNode[] {
    if (!text) return [];
    
    // Split by bold (**), code (`), and italic (*) delimiters
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
    
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="text-blue-400 font-semibold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={i} className="italic text-white/80">{part.slice(1, -1)}</em>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={i} className="bg-neutral-950/80 px-1.5 py-0.5 rounded font-mono text-xs text-blue-300 border border-neutral-800">{part.slice(1, -1)}</code>;
        }
        return part;
    });
}

// Simple Custom Markdown Formatter for EEE Lab Answers
function formatMessageContent(content: string) {
    if (!content) return null;
    
    const elements: React.ReactNode[] = [];
    const lines = content.split('\n');
    let inCodeBlock = false;
    let codeBlockLines: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Handle code block toggle
        if (line.trim().startsWith('```')) {
            if (inCodeBlock) {
                // End code block
                elements.push(
                    <pre key={`code-${i}`} className="bg-neutral-950/90 border border-neutral-800/80 p-4 rounded-xl font-mono text-xs overflow-x-auto text-blue-300 my-3 leading-relaxed shadow-inner">
                        <code>{codeBlockLines.join('\n')}</code>
                    </pre>
                );
                codeBlockLines = [];
                inCodeBlock = false;
            } else {
                // Start code block
                inCodeBlock = true;
            }
            continue;
        }
        
        if (inCodeBlock) {
            codeBlockLines.push(line);
            continue;
        }
        
        // Handle Blockquotes
        if (line.startsWith('> ')) {
            elements.push(
                <blockquote key={i} className="border-l-4 border-blue-500/50 pl-4 py-1 my-2 bg-blue-500/5 rounded-r-lg text-white/80 italic">
                    {parseInlineMarkdown(line.substring(2))}
                </blockquote>
            );
            continue;
        }
        
        // Handle Headings
        if (line.startsWith('### ')) {
            elements.push(
                <h4 key={i} className="text-sm font-bold text-blue-400 mt-4 mb-2 uppercase tracking-wider">
                    {parseInlineMarkdown(line.substring(4))}
                </h4>
            );
            continue;
        }
        if (line.startsWith('## ')) {
            elements.push(
                <h3 key={i} className="text-base font-bold text-white mt-4 mb-2 border-b border-white/5 pb-1">
                    {parseInlineMarkdown(line.substring(3))}
                </h3>
            );
            continue;
        }
        if (line.startsWith('# ')) {
            elements.push(
                <h2 key={i} className="text-lg font-bold text-white mt-5 mb-3">
                    {parseInlineMarkdown(line.substring(2))}
                </h2>
            );
            continue;
        }
        
        // Handle Unordered Lists
        if (line.startsWith('- ') || line.startsWith('* ')) {
            elements.push(
                <div key={i} className="ml-4 mb-1.5 text-white/90 leading-relaxed flex items-start gap-2">
                    <span className="text-blue-400 select-none mt-2 shrink-0 block w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span className="flex-1">{parseInlineMarkdown(line.substring(2))}</span>
                </div>
            );
            continue;
        }
        
        // Handle Ordered Lists
        const orderedMatch = line.match(/^(\d+)\.\s/);
        if (orderedMatch) {
            const num = orderedMatch[1];
            elements.push(
                <div key={i} className="ml-4 mb-1.5 text-white/90 leading-relaxed flex items-start gap-2">
                    <span className="text-blue-400 font-mono font-bold select-none shrink-0 min-w-[16px] text-right">{num}.</span>
                    <span className="flex-1">{parseInlineMarkdown(line.substring(orderedMatch[0].length))}</span>
                </div>
            );
            continue;
        }
        
        // Handle empty line (adds vertical spacing)
        if (line.trim() === '') {
            elements.push(<div key={i} className="h-2" />);
            continue;
        }
        
        // Handle normal paragraph
        elements.push(
            <p key={i} className="mb-2 text-white/90 leading-relaxed">
                {parseInlineMarkdown(line)}
            </p>
        );
    }
    
    // If the message ends while still in a code block, close it gracefully
    if (inCodeBlock && codeBlockLines.length > 0) {
        elements.push(
            <pre key="code-eof" className="bg-neutral-950/90 border border-neutral-800/80 p-4 rounded-xl font-mono text-xs overflow-x-auto text-blue-300 my-3 leading-relaxed shadow-inner">
                <code>{codeBlockLines.join('\n')}</code>
            </pre>
        );
    }
    
    return elements;
}

export function AnimatedAIChat() {
    const [value, setValue] = useState("");
    const [attachments, setAttachments] = useState<string[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);
    const [showCommandPalette, setShowCommandPalette] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { 
            role: "assistant", 
            content: "Hello! I am your SRM EEE Lab Assistant. I am specialized in Electrical and Electronics Engineering.\n\nAsk me about Kirchhoff's Laws, Thevenin's Theorem, Rectifier circuits, House/Staircase wiring, or any other lab concepts today!" 
        }
    ]);

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const commandPaletteRef = useRef<HTMLDivElement>(null);
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 60,
        maxHeight: 160,
    });

    const commandSuggestions: CommandSuggestion[] = [
        { 
            icon: <FileUp className="w-4 h-4" />, 
            label: "Upload Notes", 
            description: "Simulate uploading files for analysis", 
            prefix: "/upload" 
        },
        { 
            icon: <Sparkles className="w-4 h-4" />, 
            label: "Explain Concept", 
            description: "Get a detailed explanation of an EEE topic", 
            prefix: "/explain" 
        },
        { 
            icon: <Command className="w-4 h-4" />, 
            label: "Generate Quiz", 
            description: "Create a short test on the current topic", 
            prefix: "/quiz" 
        },
    ];

    // Scroll chat to bottom on new messages
    const scrollToBottom = useCallback(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, scrollToBottom]);

    useEffect(() => {
        if (value.startsWith('/') && !value.includes(' ')) {
            setShowCommandPalette(true);
            const matchingSuggestionIndex = commandSuggestions.findIndex(
                (cmd) => cmd.prefix.startsWith(value)
            );
            setActiveSuggestion(matchingSuggestionIndex >= 0 ? matchingSuggestionIndex : -1);
        } else {
            setShowCommandPalette(false);
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const commandButton = document.querySelector('[data-command-button]');
            
            if (commandPaletteRef.current && 
                !commandPaletteRef.current.contains(target) && 
                !commandButton?.contains(target)) {
                setShowCommandPalette(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (showCommandPalette) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveSuggestion(prev => 
                    prev < commandSuggestions.length - 1 ? prev + 1 : 0
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveSuggestion(prev => 
                    prev > 0 ? prev - 1 : commandSuggestions.length - 1
                );
            } else if (e.key === 'Tab' || e.key === 'Enter') {
                e.preventDefault();
                if (activeSuggestion >= 0) {
                    const selectedCommand = commandSuggestions[activeSuggestion];
                    setValue(selectedCommand.prefix + ' ');
                    setShowCommandPalette(false);
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                setShowCommandPalette(false);
            }
        } else if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value.trim()) {
                handleSendMessage();
            }
        }
    };

    const handleSendMessage = async () => {
        const userMsg = value.trim();
        if (!userMsg) return;

        setValue("");
        adjustHeight(true);

        const newMessages = [...messages, { role: "user" as const, content: userMsg }];
        setMessages(newMessages);
        setIsTyping(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages })
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
            } else {
                const data = await response.json();
                setMessages(prev => [...prev, { 
                    role: "assistant", 
                    content: `⚠️ Error: ${data.error || "Failed to generate response."}` 
                }]);
            }
        } catch (error) {
            console.error("Failed to fetch chat response:", error);
            setMessages(prev => [...prev, { 
                role: "assistant", 
                content: "❌ Connection error. Please check your network and try again." 
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleAttachFile = () => {
        const mockFileName = `experiment-schematic-${Math.floor(Math.random() * 1000)}.jpg`;
        setAttachments(prev => [...prev, mockFileName]);
        setMessages(prev => [...prev, {
            role: "assistant",
            content: `📎 Mock file attached: **${mockFileName}**. I have analyzed the schematic image. How can I help you calculate its voltages/currents?`
        }]);
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };
    
    const selectCommandSuggestion = (index: number) => {
        const selectedCommand = commandSuggestions[index];
        setValue(selectedCommand.prefix + ' ');
        setShowCommandPalette(false);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-between bg-transparent text-white p-4 md:p-6 relative overflow-hidden">
            {/* Background glowing effects */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-1/4 w-[350px] h-[350px] bg-blue-500/5 rounded-full mix-blend-normal filter blur-[100px] animate-pulse" />
                <div className="absolute bottom-10 right-1/4 w-[350px] h-[350px] bg-cyan-500/5 rounded-full mix-blend-normal filter blur-[100px] animate-pulse delay-700" />
            </div>

            {/* Scrollable messages container */}
            <div 
                ref={chatContainerRef}
                className="flex-1 w-full max-w-3xl mx-auto overflow-y-auto mb-4 pr-2 space-y-6 scrollbar-thin scrollbar-thumb-white/10"
            >
                {messages.map((msg, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className={cn(
                            "flex w-full gap-4 items-start",
                            msg.role === "user" ? "justify-end" : "justify-start"
                        )}
                    >
                        {msg.role === "assistant" && (
                            <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-500/30 flex items-center justify-center text-[10px] font-bold text-blue-400 shrink-0 shadow-md">
                                EEE
                            </div>
                        )}
                        <div className={cn(
                            "max-w-[80%] rounded-2xl px-4 py-3 text-sm border shadow-lg backdrop-blur-md",
                            msg.role === "user"
                                ? "bg-blue-600/10 border-blue-500/30 text-white rounded-tr-none"
                                : "bg-neutral-900/60 border-neutral-800 text-white/95 rounded-tl-none"
                        )}>
                            {msg.role === "user" ? (
                                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            ) : (
                                <div className="space-y-1">
                                    {formatMessageContent(msg.content)}
                                </div>
                            )}
                        </div>
                        {msg.role === "user" && (
                            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center text-xs font-bold text-neutral-400 shrink-0">
                                U
                            </div>
                        )}
                    </motion.div>
                ))}

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex w-full gap-4 justify-start items-start"
                    >
                        <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-500/30 flex items-center justify-center text-[10px] font-bold text-blue-400 shrink-0">
                            EEE
                        </div>
                        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl rounded-tl-none px-4 py-3 text-sm flex items-center gap-2 text-white/40">
                            <span>Assistant is thinking</span>
                            <TypingDots />
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Bottom input area */}
            <div className="w-full max-w-3xl mx-auto relative">
                {/* Command suggestions palette */}
                <AnimatePresence>
                    {showCommandPalette && (
                        <motion.div 
                            ref={commandPaletteRef}
                            className="absolute left-4 right-4 bottom-full mb-3 backdrop-blur-xl bg-neutral-950/95 rounded-xl z-50 shadow-2xl border border-neutral-800 overflow-hidden"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.15 }}
                        >
                            <div className="py-2">
                                <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Quick Commands</div>
                                {commandSuggestions.map((suggestion, index) => (
                                    <motion.div
                                        key={suggestion.prefix}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-2.5 text-xs transition-colors cursor-pointer",
                                            activeSuggestion === index 
                                                ? "bg-white/10 text-white" 
                                                : "text-white/70 hover:bg-white/5"
                                        )}
                                        onClick={() => selectCommandSuggestion(index)}
                                    >
                                        <div className="text-white/60 shrink-0">{suggestion.icon}</div>
                                        <div className="flex-1">
                                            <div className="font-semibold">{suggestion.label}</div>
                                            <div className="text-[10px] text-white/40">{suggestion.description}</div>
                                        </div>
                                        <div className="text-[10px] font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                            {suggestion.prefix}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Text input box */}
                <motion.div 
                    className="relative backdrop-blur-2xl bg-neutral-900/60 rounded-2xl border border-neutral-800 shadow-2xl"
                    layout
                >
                    <div className="p-3">
                        <Textarea
                            ref={textareaRef}
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value);
                                adjustHeight();
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask a question about KVL, Thevenin, rectifiers, lamps..."
                            containerClassName="w-full"
                            className={cn(
                                "w-full px-3 py-2",
                                "resize-none bg-transparent border-none text-white/90 text-sm focus:outline-none placeholder:text-white/20",
                                "min-h-[50px] max-h-[140px]"
                            )}
                            showRing={false}
                        />
                    </div>

                    {/* Attachments preview */}
                    <AnimatePresence>
                        {attachments.length > 0 && (
                            <motion.div 
                                className="px-4 pb-3 flex gap-2 flex-wrap"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                {attachments.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 text-xs bg-white/[0.04] py-1 px-2.5 rounded-lg text-white/70 border border-white/5"
                                    >
                                        <span>{file}</span>
                                        <button 
                                            onClick={() => removeAttachment(index)}
                                            className="text-white/40 hover:text-white transition-colors"
                                        >
                                            <XIcon className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Bottom controls panel */}
                    <div className="p-3 border-t border-neutral-800/60 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <motion.button
                                type="button"
                                onClick={handleAttachFile}
                                whileTap={{ scale: 0.94 }}
                                className="p-2 text-white/40 hover:text-white/80 rounded-lg transition-colors relative group"
                                title="Attach mock schematic file"
                            >
                                <Paperclip className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                                type="button"
                                data-command-button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowCommandPalette(prev => !prev);
                                }}
                                whileTap={{ scale: 0.94 }}
                                className={cn(
                                    "p-2 text-white/40 hover:text-white/80 rounded-lg transition-colors relative group",
                                    showCommandPalette && "bg-white/10 text-white/80"
                                )}
                                title="View quick commands"
                            >
                                <Command className="w-4 h-4" />
                            </motion.button>
                        </div>
                        
                        <motion.button
                            type="button"
                            onClick={handleSendMessage}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isTyping || !value.trim()}
                            className={cn(
                                "px-4 py-1.5 rounded-lg text-xs font-semibold transition-all",
                                "flex items-center gap-2",
                                value.trim()
                                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                                    : "bg-white/[0.05] text-white/40 cursor-not-allowed"
                            )}
                        >
                            {isTyping ? (
                                <LoaderIcon className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <ArrowUpIcon className="w-3.5 h-3.5" />
                            )}
                            <span>Send</span>
                        </motion.button>
                    </div>
                </motion.div>

                {/* Quick click-to-input shortcuts */}
                <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
                    {commandSuggestions.map((suggestion, index) => (
                        <button
                            key={suggestion.prefix}
                            onClick={() => selectCommandSuggestion(index)}
                            className="flex items-center gap-1.5 px-3 py-1 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-full text-xs text-white/50 hover:text-white/85 transition-all"
                        >
                            {suggestion.icon}
                            <span>{suggestion.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function TypingDots() {
    return (
        <div className="flex items-center ml-1">
            {[1, 2, 3].map((dot) => (
                <motion.div
                    key={dot}
                    className="w-1.5 h-1.5 bg-white/40 rounded-full mx-0.5"
                    initial={{ opacity: 0.3 }}
                    animate={{ 
                        opacity: [0.3, 0.9, 0.3],
                        scale: [0.85, 1.1, 0.85]
                    }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: dot * 0.15,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}
