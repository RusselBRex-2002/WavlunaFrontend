import React from "react";
import axios from "axios";
import Dashboard from "./components/Dashboard";
import Card from "./components/Card";

// const [value, setData] = useState("");
// // const [count, setCount] = useState(0);

// // console.log(data.map((datas) => datas.foodItem));
// // https://wavlunabackend-render.onrender.com/

//   axios
//     .get("https://wavlunabackend-render.onrender.com/sale")
//     .then( async (res) => {
//       await setData(res.data);
//       console.log(value);
//     });

function App() {
  return (
    <div>
      <Card />
    </div>
  );
}

export default App;
