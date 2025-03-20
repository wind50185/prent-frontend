"use client";

import React, { useEffect, useState } from "react";
import RentalList from "../_components/RentalList"; // 引入租屋列表組件
import "../../styles/_rent.scss";

const App = () => {
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    fetch("/json/rent.json") // 讀取 public/json/rent.json
      .then((response) => response.json())
      .then((data) => setRentals(data))
      .catch((error) => console.error("Error loading rent.json:", error));
  }, []);

  return (
    <div className="container">
      <h1 className="my-4">租屋列表</h1>
      <RentalList rentals={rentals} />
    </div>
  );
};

export default App;
