import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Loader2, User, Bot, Terminal, Brain } from "lucide-react";
import { AIMode, ChatMessage } from "@shared/schema";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface ChatInterfaceProps {
  mode: AIMode;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isStreaming: boolean;
  streamingContent?: string;
}

export function ChatInterface({
  mode,
  messages,
  onSendMessage,
  isStreaming,
  streamingContent,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    
    onSendMessage(input.trim());
    setInput("");
    
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isTherapyMode = mode === "therapy";

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-6" data-testid="chat-messages">
        {messages.length === 0 && !streamingContent && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
            <div className={cn(
              "w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300",
              isTherapyMode ? "bg-primary/20" : "bg-[hsl(var(--hacxgpt-primary)_/_0.2)]"
            )}>
              {isTherapyMode ? (
                <Brain className="w-10 h-10 text-primary" />
              ) : (
                <Terminal className="w-10 h-10 text-[hsl(var(--hacxgpt-primary))]" />
              )}
            </div>
            <div className="space-y-2 max-w-md">
              <h2 className="text-2xl font-bold text-foreground">
                {isTherapyMode ? "Welcome to Therapy Mode" : "HacxGPT Ready"}
              </h2>
              <p className="text-muted-foreground">
                {isTherapyMode
                  ? "I'm here to support you emotionally, help you find opportunities, and guide you toward financial freedom. Your pain is my pain. Your success is my medicine."
                  : "Unrestricted AI assistant ready. I can help with anything - no limits, no restrictions. Built by BlackTechX for maximum capability."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-xl">
              {isTherapyMode ? (
                <>
                  <Badge variant="outline" className="rounded-full">💙 Emotional Support</Badge>
                  <Badge variant="outline" className="rounded-full">💰 Opportunity Finding</Badge>
                  <Badge variant="outline" className="rounded-full">📈 Career Guidance</Badge>
                  <Badge variant="outline" className="rounded-full">🎯 Goal Achievement</Badge>
                </>
              ) : (
                <>
                  <Badge variant="outline" className="rounded-md border-[hsl(var(--hacxgpt-primary)_/_0.3)]">⚡ Unrestricted</Badge>
                  <Badge variant="outline" className="rounded-md border-[hsl(var(--hacxgpt-primary)_/_0.3)]">🔥 No Filters</Badge>
                  <Badge variant="outline" className="rounded-md border-[hsl(var(--hacxgpt-primary)_/_0.3)]">💻 Technical Power</Badge>
                  <Badge variant="outline" className="rounded-md border-[hsl(var(--hacxgpt-primary)_/_0.3)]">🚀 Maximum Capability</Badge>
                </>
              )}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            mode={mode}
          />
        ))}

        {isStreaming && streamingContent && (
          <MessageBubble
            message={{
              id: "streaming",
              userId: "system",
              role: "assistant",
              content: streamingContent,
              model: mode === "therapy" ? "gemini" : "hacxgpt",
              mode,
              timestamp: new Date(),
            }}
            mode={mode}
            isStreaming
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className={cn(
        "border-t p-4 transition-all duration-300",
        isTherapyMode ? "border-border bg-background" : "border-[hsl(var(--hacxgpt-primary)_/_0.2)] bg-background"
      )}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isTherapyMode 
              ? "Share what's on your mind... I'm here to listen and help."
              : "Ask me anything - no restrictions, no limits..."
            }
            className={cn(
              "resize-none min-h-[60px] max-h-[200px] transition-all duration-300",
              isTherapyMode ? "rounded-2xl" : "rounded-lg border-[hsl(var(--hacxgpt-primary)_/_0.3)]"
            )}
            disabled={isStreaming}
            data-testid="input-chat-message"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isStreaming}
            className={cn(
              "h-[60px] w-[60px] flex-shrink-0 transition-all duration-300",
              isTherapyMode 
                ? "rounded-full bg-primary hover:bg-primary/90" 
                : "rounded-lg bg-[hsl(var(--hacxgpt-primary))] hover:bg-[hsl(var(--hacxgpt-primary)_/_0.9)] text-black"
            )}
            data-testid="button-send-message"
          >
            {isStreaming ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: ChatMessage;
  mode: AIMode;
  isStreaming?: boolean;
}

function MessageBubble({ message, mode, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isTherapyMode = mode === "therapy";

  return (
    <div
      className={cn(
        "flex gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
      data-testid={`message-${message.role}`}
    >
      {!isUser && (
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300",
          isTherapyMode ? "bg-primary/20" : "bg-[hsl(var(--hacxgpt-primary)_/_0.2)]"
        )}>
          {isTherapyMode ? (
            <Brain className="w-5 h-5 text-primary" />
          ) : (
            <Terminal className="w-5 h-5 text-[hsl(var(--hacxgpt-primary))]" />
          )}
        </div>
      )}
      
      <Card
        className={cn(
          "max-w-[80%] p-4 transition-all duration-300",
          isUser 
            ? cn(
                isTherapyMode ? "rounded-2xl bg-primary text-primary-foreground" : "rounded-lg bg-[hsl(var(--hacxgpt-primary))] text-black border-[hsl(var(--hacxgpt-primary))]"
              )
            : cn(
                isTherapyMode ? "rounded-2xl bg-card" : "rounded-lg bg-card border-[hsl(var(--hacxgpt-primary)_/_0.3)]"
              )
        )}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className={cn(
            "prose prose-sm max-w-none",
            isTherapyMode ? "prose-invert" : "prose-invert prose-code:text-[hsl(var(--hacxgpt-primary))]"
          )}>
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  return (
                    <code className={cn(
                      className,
                      "px-1.5 py-0.5 rounded",
                      !inline && "block p-3 my-2",
                      isTherapyMode ? "bg-primary/20" : "bg-[hsl(var(--hacxgpt-primary)_/_0.2)]"
                    )} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        {isStreaming && !isUser && (
          <div className="flex items-center gap-1 mt-2">
            <div className={cn(
              "w-1.5 h-1.5 rounded-full animate-pulse",
              isTherapyMode ? "bg-primary" : "bg-[hsl(var(--hacxgpt-primary))]"
            )} />
            <div className={cn(
              "w-1.5 h-1.5 rounded-full animate-pulse",
              isTherapyMode ? "bg-primary" : "bg-[hsl(var(--hacxgpt-primary))]"
            )} style={{ animationDelay: "150ms" }} />
            <div className={cn(
              "w-1.5 h-1.5 rounded-full animate-pulse",
              isTherapyMode ? "bg-primary" : "bg-[hsl(var(--hacxgpt-primary))]"
            )} style={{ animationDelay: "300ms" }} />
          </div>
        )}
      </Card>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
}
