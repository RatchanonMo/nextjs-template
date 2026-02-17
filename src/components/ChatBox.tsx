"use client";
import { useRealtime } from "@khaveeai/react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatBox() {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const { conversation, connect, chatStatus } = useRealtime();

  const assistantMessages = conversation.filter(
    (chat) => chat.role === "assistant",
  );
  const lastMessage = assistantMessages[assistantMessages.length - 1];

  useEffect(() => {
    // connect();
  }, []);

  useEffect(() => {
    if (lastMessage && chatStatus === "ready") {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10);

      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setShouldRender(false), 500);
      }, 5000);

      return () => clearTimeout(timer);
    } else if (chatStatus === "speaking") {
      setShouldRender(true);
      setIsVisible(true);
    }
  }, [chatStatus, lastMessage]);

  return (
    <div className="">
      {lastMessage && shouldRender && (
        <div
          key={lastMessage.id}
          className={`max-w-xl w-fit mx-auto rounded-3xl py-2 px-4 bg-white text-lg wrap-break-word transition-opacity duration-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {lastMessage.text}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
