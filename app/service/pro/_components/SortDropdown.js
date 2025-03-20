"use client";
import { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";

export default function SortDropdown({
  title = "",
  options = [],
  onChange = () => {},
  selectedValue,
}) {
  const [show, setShow] = useState(false);

  // 找到目前選取的選項，若無則使用預設標題
  const currentOption = options.find(
    (option) => option.value === selectedValue
  ) || { label: title };

  return (
    <Dropdown
      className="d-inline mx-2"
      autoClose="outside"
      show={show}
      onToggle={(nextShow) => setShow(nextShow)}
    >
      <Dropdown.Toggle className="sort-box">
        {currentOption.label}
      </Dropdown.Toggle>
      <Dropdown.Menu className="p-3">
        {options.map((option, index) => (
          <Dropdown.Item
            key={index}
            onClick={() => {
              onChange(option.value);
              setShow(false); // 點擊後關閉下拉選單
            }}
            active={selectedValue === option.value}
            className="sort-drop"
          >
            {option.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
