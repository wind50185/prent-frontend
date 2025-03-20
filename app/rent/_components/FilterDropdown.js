import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import React, { useState } from "react";

const FilterDropdown = ({ title, options, name, onChange, type }) => {
  const [selectedValues, setSelectedValues] = useState([]); // 改成陣列存多選

  // 當選項被選擇時，更新狀態並觸發回調
  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    let updatedValues = [...selectedValues];

    if (event.target.checked) {
      // ✅ 新增選中的值
      updatedValues.push(value);
    } else {
      // ❌ 取消選擇，從陣列中移除該值
      updatedValues = updatedValues.filter((item) => item !== value);
    }

    setSelectedValues(updatedValues);
    onChange(updatedValues); // 傳回所有選中的值
  };

  return (
    <Dropdown autoClose="outside">
      <Dropdown.Toggle className="my-btn">{title}</Dropdown.Toggle>
      <Dropdown.Menu className="p-3 my-btn">
        <Form>
          {options.map((option, index) => (
            <Form.Check
              key={index}
              label={option.label}
              value={option.value}
              name={name}
              type={type} 
              id={`${name}-${index}`}
              checked={selectedValues.includes(option.value)} // ✅ 判斷是否已選
              onChange={handleCheckboxChange} // ✅ 使用新的多選邏輯
            />
          ))}
        </Form>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default FilterDropdown;
