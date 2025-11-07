"use client";
import { useRealtime } from "@khaveeai/react";
import { useEffect, useRef, useState } from "react";

interface ChatBoxProps {
  onTypingChange?: (isTyping: boolean) => void;
  onNewMessage?: (message: string) => void;
}

export default function ChatBox({
  onTypingChange,
  onNewMessage,
}: ChatBoxProps) {
  const [inputValue, setInputValue] = useState("");
  const scrollable = useRef<HTMLDivElement>(null);

  const { sendMessage, isConnected, conversation, connect } = useRealtime();

  useEffect(() => {
    connect();
  }, []);
  const scrollToBottom = () => {
    const bottomElement = scrollable.current?.lastElementChild;
    bottomElement?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  // Monitor conversation for new assistant messages and trigger VRM reactions
  useEffect(() => {
    scrollToBottom();
    if (conversation.length > 0) {
      const lastMessage = conversation[conversation.length - 1];
      if (lastMessage.role === "assistant" && lastMessage.text) {
        onNewMessage?.(lastMessage.text);
        // Notify parent that typing is done when we get a final message
        if (lastMessage.isFinal) {
          onTypingChange?.(false);
        }
      }
    }
  }, [conversation, onNewMessage, onTypingChange]);

  const handleSendMessage = () => {
    if (inputValue.trim() && isConnected) {
      sendMessage(inputValue);
      setInputValue("");
      // Notify parent that assistant is typing
      onTypingChange?.(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full md:w-1/2 h-1/2 md:h-full p-4">
      <div className="h-full bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Chat</h2>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-6 overflow-y-auto" ref={scrollable}>
          <div className="space-y-4">
            {conversation.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="max-w-xs lg:max-w-md">
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <p
                      className={
                        message.role === "user" ? "text-white" : "text-gray-800"
                      }
                    >
                      {message.text}
                    </p>
                  </div>
                  <p
                    className={`text-xs text-gray-500 mt-1 ${
                      message.role === "user" ? "text-right" : ""
                    }`}
                  >
                    {message.role === "user" ? "You" : "Assistant"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={!isConnected}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSendMessage}
              disabled={!isConnected || !inputValue.trim()}
              className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
          {!isConnected && (
            <p className="text-xs text-red-500 mt-2 text-center">
              Not connected to Khavee service
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
