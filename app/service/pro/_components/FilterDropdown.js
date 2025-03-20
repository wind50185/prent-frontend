"use client";
import { useEffect, useState } from "react";

import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";

export default function FilterDropdown({
  title = "",
  options = [],
  type = "",
  name = "",
  onChange = () => {},
  selectedValues = [],
}) {
  const [selected, setSelected] = useState(
    selectedValues.map((v) => v.toString())
  );

  // 當外部 selectedValues 改變時，同步更新
  useEffect(() => {
    setSelected(selectedValues.map((v) => v.toString()));
  }, [selectedValues]);

  const handleCheck = (event) => {
    const { value, checked } = event.target;
    let newSelected;
    if (checked) {
      newSelected = [...selected, value];
    } else {
      newSelected = selected.filter((item) => item !== value);
    }
    setSelected(newSelected);
    if (onChange) {
      onChange(newSelected);
    }
  };
  return (
    <>
      <Dropdown className="d-inline mx-2" autoClose="outside">
        <Dropdown.Toggle className="my-btn">{title}</Dropdown.Toggle>
        <Dropdown.Menu className="p-3">
          <Form>
            {options.map((option, index) => (
              <Form.Check
                key={index}
                label={option.label}
                name={name}
                type={type}
                id={`${name}-${index}`}
                value={option.value}
                checked={selected.includes(option.value.toString())}
                onChange={handleCheck}
              />
            ))}
          </Form>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}
