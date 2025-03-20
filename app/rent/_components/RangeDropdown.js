import React, { useState } from "react";
import { Range } from "react-range";
import Dropdown from "react-bootstrap/Dropdown";

const RangeDropdown = ({ title, min, max, unit, step = 1, onOpen, onClose, onChange }) => {
  const [values, setValues] = useState([min, max]);

  const handleRangeChange = (newValues) => {
    setValues(newValues);
    onChange(newValues);
  };

  return (
    <Dropdown autoClose="outside" onToggle={(isOpen) => (isOpen ? onOpen() : onClose())}>
      <Dropdown.Toggle className="my-btn">{title}</Dropdown.Toggle>
      <Dropdown.Menu
        className="p-3"
        onTouchStart={(e) => e.stopPropagation()} // 防止 Swiper 攔截拖拉
        onMouseDown={(e) => e.stopPropagation()} // 桌機防止 Swiper 影響
      >
        <div className="range-container">
          <span className="range-value">{values[0]}</span>
          <Range
            step={step}
            min={min}
            max={max}
            values={values}
            onChange={handleRangeChange}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                className="range-track"
                onTouchStart={(e) => e.stopPropagation()} // 防止 Swiper 攔截
                onMouseDown={(e) => e.stopPropagation()} // 防止 Swiper 攔截
                role="presentation"
              >
                {children}
              </div>
            )}
            renderThumb={({ props, index }) => (
              <div
                {...props}
                className="range-thumb"
                role="slider"
                tabIndex="0"
                onTouchStart={(e) => e.stopPropagation()} // 防止 Swiper 攔截
                onMouseDown={(e) => e.stopPropagation()} // 防止 Swiper 攔截
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={values[index]}
                aria-labelledby={title}
                key={`thumb-${index}`} // 添加唯一的 key
              />
            )}
          />
          <span className="range-value">{values[1]} {unit}</span>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default RangeDropdown;
