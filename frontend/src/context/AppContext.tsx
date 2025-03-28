import React, { createContext, useState, useCallback } from "react";

export enum Model {
  GPT_4_TURBO_PREVIEW = "gpt-4-turbo-preview",
  GPT_4 = "gpt-4",
  GPT_3_5_TURBO = "gpt-3.5-turbo",
}

interface AppContextProps {
  model: Model;
  setModel: (model: Model) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [model, setModel] = useState<Model>(Model.GPT_3_5_TURBO);
  const [prompt, setPrompt] = useState("");

  const handleSetModel = useCallback((model: Model) => setModel(model), []);
  const handleSetPrompt = useCallback(
    (prompt: string) => setPrompt(prompt),
    []
  );

  return (
    <AppContext.Provider
      value={{
        model,
        setModel: handleSetModel,
        prompt,
        setPrompt: handleSetPrompt,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
