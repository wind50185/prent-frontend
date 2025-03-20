"use client";
import { useState, useEffect } from "react";
import { Range } from "react-range";
import Dropdown from "react-bootstrap/Dropdown";

export default function RangeDropdown({
  title = "",
  min = 0,
  max = 0,
  unit = "",
  step = 1,
  // 父層可透過 value 控制初始值或變更後的值
  value,
  // 當範圍改變時，回傳 [newMin, newMax]
  onChange = () => {},
}) {
  // 如果有傳入 value 則使用受控模式，否則用內部 state 管理
  const [values, setValues] = useState(value || [min, max]);

  // 當外部受控 value 改變時，更新內部 state
  useEffect(() => {
    if (value) {
      setValues(value);
    }
  }, [value]);

  const handleChange = (newValues) => {
    setValues(newValues);
    // 呼叫父層的 onChange，傳入最小值與最大值
    onChange(newValues[0], newValues[1]);
  };

  return (
    <Dropdown className="d-inline mx-2" autoClose="outside">
      <Dropdown.Toggle className="my-btn">{title}</Dropdown.Toggle>
      <Dropdown.Menu className="p-3">
        <div className="range-container">
          <span className="range-value">{values[0]}</span>
          <Range
            step={step}
            min={min}
            max={max}
            values={values}
            onChange={handleChange}
            renderTrack={({ props, children }) => (
              <div {...props} className="range-track">
                {children}
              </div>
            )}
            renderThumb={({ props }) => (
              <div {...props} className="range-thumb" />
            )}
          />
          <span className="range-value">
            {values[1]} {unit}
          </span>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}
