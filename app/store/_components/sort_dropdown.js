import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";

const SortDropdown = ({ title, options, onChange }) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleItemClick = (value) => {
    setSelectedValue(value);  // 更新選擇的排序方式
    onChange(value);          // 觸發回調函數
    setIsDropdownOpen(false); // 關閉下拉選單
  };

  return (
    <Dropdown 
      className="d-inline mx-2" 
      show={isDropdownOpen} 
      onToggle={() => setIsDropdownOpen(!isDropdownOpen)} // 切換開關
      autoClose="outside"
    >
      <Dropdown.Toggle className="sort-box">
        {title} {selectedValue && `: ${options.find(opt => opt.value === selectedValue)?.label}`}
      </Dropdown.Toggle>
      <Dropdown.Menu className="p-3">
        {options.map((option, index) => (
          <Dropdown.Item
            key={index}
            onClick={() => handleItemClick(option.value)}  // 點選時更新選項並觸發回調
            className="sort-drop"
          >
            {option.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default SortDropdown;
