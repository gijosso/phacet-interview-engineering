import React from "react";
import "./App.css";
import { Container, Grid, TextField } from "@mui/material";
import { debounce } from "lodash";
import { AppProvider, AppContext } from "./context/AppContext";
import ModelSelector from "./components/ModelSelector";
import SocketBox from "./components/SocketBox";
import HttpFetchBox from "./components/HttpFetchBox";
import { SseBox } from "./components/SseBox";
import { LongPollingBox } from "./components/LongPollingBox";

function AppContent() {
  const { setPrompt } = React.useContext(AppContext)!;

  const handlePromptChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPrompt(event.target.value);
    },
    500
  );

  return (
    <div className="App">
      <Container>
        <ModelSelector />
      </Container>
      <Container>
        <TextField
          label="Prompt"
          variant="outlined"
          fullWidth
          onChange={handlePromptChange}
        />
      </Container>
      <Container sx={{ marginTop: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <HttpFetchBox />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <SocketBox />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <SseBox />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <LongPollingBox />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
