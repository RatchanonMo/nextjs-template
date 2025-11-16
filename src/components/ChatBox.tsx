"use client";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
} from "@heroui/react";
import { useRealtime } from "@khaveeai/react";
import { MessageCircle, Mic, MicOff, X } from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatBox() {
  const [inputValue, setInputValue] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const scrollable = useRef<HTMLDivElement>(null);

  const {
    sendMessage,
    isConnected,
    conversation,
    connect,
    toggleMicrophone,
    isMicEnabled,
  } = useRealtime();

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
    <>
      {/* Floating Chat Button */}
      <Button
        isIconOnly
        color="primary"
        radius="full"
        size="lg"
        className="fixed bottom-6 right-6 z-50 shadow-lg"
        onPress={() => setIsVisible(!isVisible)}
      >
        {isVisible ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>

      {/* Chat Box */}
      {isVisible && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] z-40 md:w-[450px] md:h-[600px]">
          <Card shadow="lg" className="h-full flex flex-col rounded-2xl">
            {/* Header */}
            <CardHeader className="flex justify-between items-center pb-2">
              <h2 className="text-xl font-semibold">Chat</h2>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => setIsVisible(false)}
              >
                ✕
              </Button>
            </CardHeader>

            {/* Messages Area */}
            <CardBody className="flex-1 overflow-y-auto px-4">
              <div ref={scrollable}>
                <div className="space-y-4">
                  {conversation
                    .filter((chat) => chat.role === "assistant")
                    .map((message) => (
                      <Fragment key={message.id}>
                        <div className="rounded-2xl px-4 py-2 bg-slate-100 max-w-[80%] break-words">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.text}
                          </ReactMarkdown>
                        </div>
                        <Divider className="mx-auto h-1.5 w-52 rounded-full bg-slate-50" />
                      </Fragment>
                    ))}
                </div>
              </div>
            </CardBody>

            {/* Input Area */}
            <CardFooter className="flex-col gap-2 border-t border-slate-100 pt-3">
              <div className="flex w-full gap-2">
                <Button
                  isIconOnly
                  onPress={toggleMicrophone}
                  isDisabled={!isConnected}
                  color={isMicEnabled ? "danger" : "default"}
                  radius="lg"
                  size="sm"
                  className="min-w-unit-9"
                >
                  {isMicEnabled ? <Mic size={16} /> : <MicOff size={16} />}
                </Button>
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={!isConnected}
                  radius="lg"
                  className="flex-1"
                  size="sm"
                />
                <Button
                  onPress={handleSendMessage}
                  isDisabled={!isConnected || !inputValue.trim()}
                  color="primary"
                  radius="lg"
                  size="sm"
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
      )}
    </>
  );
}
