import "./App.css";
import Snowfall from "react-snowfall";
import Weather from "./Component/Weather";
const App = () => {
  return (
    <div className="App">
      <Snowfall snowflakeCount={200} />

      <h1 style={{ color: "black", marginBottom: 20 }}>App Weather</h1>
      <Weather />
    </div>
  );
};

export default App;
