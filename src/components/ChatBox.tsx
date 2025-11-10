"use client";
import { useRealtime } from "@khaveeai/react";
import { Button, Card, CardBody, CardFooter, CardHeader, Input } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatBox() {
  const [inputValue, setInputValue] = useState("");
  const scrollable = useRef<HTMLDivElement>(null);

  const { sendMessage, isConnected, conversation, connect } = useRealtime();

  const scrollToBottom = () => {
    const bottomElement = scrollable.current?.lastElementChild;
    bottomElement?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    connect();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSendMessage = () => {
    if (inputValue.trim() && isConnected) {
      sendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full md:w-1/2 h-1/2 md:h-full p-5">
      <Card shadow="none" className="h-full flex flex-col rounded-3xl p-4">
        {/* Header */}
        <CardHeader >
          <h2 className="text-xl font-semibold">Chat</h2>
        </CardHeader>

        {/* Messages Area */}
        <CardBody className="flex-1 overflow-y-auto">
          <div ref={scrollable}>
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
                          ? "bg-primary text-primary-foreground"
                          : "bg-default-100"
                      }`}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                       
                      >
                        {message.text}
                      </ReactMarkdown>
                    </div>
                    <p
                      className={`text-xs text-default-500 mt-1 ${
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
        </CardBody>

        {/* Input Area */}
        <CardFooter className="flex-col gap-2 border-t border-slate-100 pt-5">
          <div className="flex w-full gap-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={!isConnected}
              radius="lg"
              className="flex-1"
            />
            <Button
              onPress={handleSendMessage}
              isDisabled={!isConnected || !inputValue.trim()}
              color="primary"
              radius="lg"
            >
              Send
            </Button>
          </div>
          {!isConnected && (
            <p className="text-xs text-danger w-full text-center">
              Not connected to Khavee service
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
