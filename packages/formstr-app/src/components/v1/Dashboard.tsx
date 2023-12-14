import { QuestionsList } from "./QuestionsList";

function Dashboard() {
  return (
    <div style={{ display: "flex", maxWidth: "100vw" }}>
      <div style={{ minWidth: "20%" }}>sidebar</div>
      <div
        style={{
          minWidth: "60%",
          backgroundColor: "#dedede",
          paddingLeft: "2rem",
          paddingRight: "2rem",
          overflow: "scroll",
          height: "calc(100vh-200px)",
        }}
      >
        <QuestionsList />
      </div>
      <div style={{ minWidth: "20%" }}>right sidebar</div>
    </div>
  );
}

export default Dashboard;
