import React from "react";
import { FormControl, TextField } from "@mui/material";

const PromptInput: React.FC<{
  onPromptChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ onPromptChange }) => {
  return (
    <FormControl sx={{ m: 1, minWidth: 400 }}>
      <TextField
        label="Ask your question"
        aria-label="Ask your question"
        variant="standard"
        focused
        multiline
        rows={4}
        onChange={onPromptChange}
      />
    </FormControl>
  );
};

export default PromptInput;
