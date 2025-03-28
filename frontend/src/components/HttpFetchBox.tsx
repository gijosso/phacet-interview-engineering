import React from "react";
import { AppContext } from "../context/AppContext";
import { MethodBox } from "./MethodBox";

export const HttpFetchBox: React.FC = () => {
  const { model, prompt } = React.useContext(AppContext)!;
  const [messages, setMessages] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = React.useCallback(async () => {
    if (!prompt) {
      setError("Prompt is required");
      return;
    }

    setMessages([]);
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      setMessages((prevMessages) => [...prevMessages, data.completion]);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [model, prompt]);

  return (
    <MethodBox
      title="HTTP Fetch"
      handleSubmit={handleSubmit}
      disabled={isLoading || !prompt}
      error={error}
      messages={messages}
    />
  );
};

export default HttpFetchBox;
