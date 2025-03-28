import React from "react";
import { io } from "socket.io-client";
import { AppContext } from "../context/AppContext";
import { MethodBox } from "./MethodBox";

export const SocketBox: React.FC = () => {
  const { model, prompt } = React.useContext(AppContext)!;
  const [messages, setMessages] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const socket = React.useMemo(() => io("http://localhost:80/chat"), []);

  React.useEffect(() => {
    socket.connect();

    socket.on("connect", () => console.log("Connected to WebSocket server"));
    socket.on("error", (error: string) => setError(error));
    socket.on("completion", (message: string) =>
      setMessages((prev) => [...prev, message])
    );

    return () => {
      socket.disconnect();
      socket.off("connect");
      socket.off("error");
      socket.off("completion");
    };
  }, [socket]);

  const handleSubmit = React.useCallback(() => {
    setMessages([]);
    setError(null);
    socket.emit("prompt", { prompt, model });
  }, [model, prompt, socket]);

  return (
    <MethodBox
      title="WebSocket"
      handleSubmit={handleSubmit}
      disabled={!prompt}
      error={error}
      messages={messages}
    />
  );
};

export default SocketBox;
