import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";

export default function FilterDropdown({ title, options, name, onChange }) {
  const [selectedValue, setSelectedValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 當選項被選擇時，更新狀態並觸發回調
  const handleRadioChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
    onChange(value);
    setIsDropdownOpen(false);
  };

  return (
    <Dropdown
      className="d-inline mx-2"
      show={isDropdownOpen}
      onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
      autoClose="outside"
    >
      <Dropdown.Toggle className="my-btn">{title}</Dropdown.Toggle>
      <Dropdown.Menu className="p-3">
        <Form>
          {options.map((option, index) => (
            <Form.Check
              key={index}
              label={option.label}
              name={name}
              type="radio"
              id={`${name}-${index}`}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={handleRadioChange}
            />
          ))}
        </Form>
      </Dropdown.Menu>
    </Dropdown>
  );
}
