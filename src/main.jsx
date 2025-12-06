import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./pages/context/ThemeContext.jsx";
import App from "./App.jsx";
import "./index.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>

);