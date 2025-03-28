import React, { useCallback, useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { MethodBox } from "./MethodBox";

export const LongPollingBox: React.FC = () => {
  const { model, prompt } = useContext(AppContext)!;
  const [messages, setMessages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(() => {
    setMessages([]);
    setError(null);

    const fetchLongPolling = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/chat/long-polling",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ model, prompt }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch");
        }

        const data = await response.json();
        setMessages((prev) => [...prev, data.completion]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    };

    fetchLongPolling();
  }, [model, prompt]);

  return (
    <MethodBox
      title="Long Polling"
      handleSubmit={handleSubmit}
      disabled={!prompt}
      error={error}
      messages={messages}
    />
  );
};
