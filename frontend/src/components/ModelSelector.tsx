import React, { useCallback, useContext } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  FormHelperText,
} from "@mui/material";
import { AppContext, Model } from "../context/AppContext";

const ModelSelector: React.FC = () => {
  const { model, setModel } = useContext(AppContext)!;

  const handleModelChange = useCallback(
    (event: SelectChangeEvent) => {
      setModel(event.target.value as Model);
    },
    [setModel]
  );

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="model-select-label">Model</InputLabel>
      <Select
        labelId="model-select-label"
        id="model-select"
        value={model}
        label="Model"
        onChange={handleModelChange}
      >
        <MenuItem value={Model.GPT_4_TURBO_PREVIEW}>
          gpt-4-turbo-preview
        </MenuItem>
        <MenuItem value={Model.GPT_4}>gpt-4</MenuItem>
        <MenuItem value={Model.GPT_3_5_TURBO}>gpt-3.5-turbo</MenuItem>
      </Select>
      <FormHelperText>Choose your ChatGPT model</FormHelperText>
    </FormControl>
  );
};

export default ModelSelector;
