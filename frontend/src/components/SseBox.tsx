import React from "react";
import { AppContext } from "../context/AppContext";
import { MethodBox } from "./MethodBox";

export const SseBox: React.FC = () => {
  const { model, prompt } = React.useContext(AppContext)!;
  const [messages, setMessages] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  // Generating new EventSource for testing purposes only
  const handleSubmit = React.useCallback(() => {
    if (!prompt) {
      setError("Prompt is required");
      return;
    }

    setMessages([]);
    setError(null);

    const params = new URLSearchParams();
    Object.entries({ prompt, model }).forEach(
      ([key, value]) => value && params.append(key, value)
    );

    const newEventSource = new EventSource(
      `http://localhost:3000/sse/chat?${params.toString()}`
    );

    newEventSource.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    newEventSource.onerror = (event) => {
      setError("Error occurred while receiving SSE");
      newEventSource.close();
    };
  }, [model, prompt]);

  return (
    <MethodBox
      title="SSE"
      handleSubmit={handleSubmit}
      disabled={!prompt}
      error={error}
      messages={messages}
    />
  );
};
