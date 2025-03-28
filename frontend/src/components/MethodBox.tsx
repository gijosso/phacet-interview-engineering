import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { throttle } from "lodash";
import AnimatedText from "./AnimatedText";

interface MethodBoxProps {
  title: string;
  handleSubmit: () => void;
  disabled: boolean;
  error: string | null;
  messages: string[];
}

export const MethodBox: React.FC<MethodBoxProps> = ({
  title,
  handleSubmit,
  disabled,
  error,
  messages,
}) => {
  const hasMessages = messages.length > 0;

  const throttledHandleSubmit = React.useMemo(
    () => throttle(handleSubmit, 2000, { leading: true, trailing: false }),
    [handleSubmit]
  );

  React.useEffect(() => {
    return () => {
      throttledHandleSubmit.cancel();
    };
  }, [throttledHandleSubmit]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "start",
        padding: 3,
        border: `1px solid ${error ? "#f44336" : "#ccc"}`,
        backgroundColor: error ? "#ffe6e6" : "transparent",
        maxWidth: 400,
        margin: "0 auto",
        flexGrow: 1,
        transition:
          "height 0.3s ease, background-color 0.3s ease, border-color 0.3s ease",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <Box>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        <Button
          variant="contained"
          onClick={throttledHandleSubmit}
          disabled={disabled}
          sx={{ marginBottom: 2 }}
        >
          Submit
        </Button>
        {error && (
          <Typography
            variant="body2"
            color="error"
            sx={{ textAlign: "center" }}
          >
            {error}
          </Typography>
        )}
      </Box>
      {hasMessages && (
        <Box
          sx={{
            border: "1px solid #ddd",
            backgroundColor: "#f9f9f9",
            padding: "10px",
            marginTop: "16px",
            textAlign: "center",
            overflow: "hidden",
          }}
        >
          <AnimatedText texts={messages} />
        </Box>
      )}
    </Box>
  );
};
