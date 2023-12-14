import { Outlet } from "react-router-dom";

function App() {
  return (
    <div
      style={{
        padding: "5%",
        paddingBottom: "20%",
        maxWidth: "100%",
      }}
    >
      <Outlet />
    </div> 
  );
}

export default App