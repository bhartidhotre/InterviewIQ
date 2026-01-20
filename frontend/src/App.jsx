import { useEffect } from "react";
import api from "./services/api";
function App() {
  useEffect(() => {
    api.get("/").then((res) => {
      console.log(res.data);
    });
  }, []);
  return (
    <div>
      <h1>Smart Interview Platform</h1>
      <p>Interview practice made smart 🚀</p>
    </div>
  )
}

export default App
