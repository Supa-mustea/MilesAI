import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChatInterface } from "@/components/chat-interface";
import { AIMode, ChatMessage } from "@shared/schema";

interface ChatPageProps {
  mode: AIMode;
}

export default function ChatPage({ mode }: ChatPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === "stream_chunk") {
        setStreamingContent(prev => prev + data.content);
      } else if (data.type === "stream_complete") {
        const completeMessage: ChatMessage = {
          id: data.messageId,
          userId: "user",
          role: "assistant",
          content: data.fullContent,
          model: mode === "therapy" ? "gemini" : "hacxgpt",
          mode,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, completeMessage]);
        setStreamingContent("");
        setIsStreaming(false);
      } else if (data.type === "error") {
        console.error("WebSocket error:", data.error);
        setIsStreaming(false);
        setStreamingContent("");
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsStreaming(false);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [mode]);

  const handleSendMessage = (content: string) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error("WebSocket not connected");
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      userId: "user",
      role: "user",
      content,
      model: mode === "therapy" ? "gemini" : "hacxgpt",
      mode,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsStreaming(true);
    setStreamingContent("");

    ws.send(JSON.stringify({
      type: "chat_message",
      message: content,
      mode,
    }));
  };

  return (
    <div className="h-full">
      <ChatInterface
        mode={mode}
        messages={messages}
        onSendMessage={handleSendMessage}
        isStreaming={isStreaming}
        streamingContent={streamingContent}
      />
    </div>
  );
}
