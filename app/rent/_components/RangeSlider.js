"use client"; // 確保這是 Client Component

import React, { useState } from "react";
// import Slider from "@mui/material/Slider";
import Dropdown from "react-bootstrap/Dropdown";

const RangeSlider = ({ min = 0, max = 100, unit = "", step = 1, disableSwiper, enableSwiper }) => {
  const [value, setValue] = useState([min, max]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Dropdown
      autoClose="outside"
      onToggle={(isOpen) => (isOpen ? disableSwiper() : enableSwiper())}
    >
      <Dropdown.Toggle className="my-btn">選擇範圍</Dropdown.Toggle>
      <Dropdown.Menu
        className="p-3"
        style={{ minWidth: "300px" }}
        onTouchStart={(e) => e.stopPropagation()} // ✅ 防止 Swiper 攔截
        onMouseDown={(e) => e.stopPropagation()} // ✅ 防止 Swiper 攔截
      >
        <div className="d-flex justify-content-between">
          <span>{value[0]} {unit}</span>
          <span>{value[1]} {unit}</span>
        </div>

        {/* ✅ 修正: 加入必要的 ARIA 屬性，並且確保 `tabIndex` */}
        <div
          role="slider"
          tabIndex="0"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value[0]} // ✅ 設定當前數值，避免 ESLint 報錯
          onTouchStart={(e) => e.stopPropagation()} // ✅ 防止 Swiper 攔截
          onMouseDown={(e) => e.stopPropagation()} // ✅ 防止 Swiper 攔截
          style={{ padding: "10px 0" }}
        >
          {/* <Slider
            value={value}
            onChange={handleChange}
            min={min}
            max={max}
            step={step}
            valueLabelDisplay="auto"
            disableSwap // ✅ 確保 thumb 不會交叉
          /> */}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default RangeSlider;
