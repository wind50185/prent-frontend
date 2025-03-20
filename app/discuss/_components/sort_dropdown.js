import { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";

const SortDropdown = ({onClassSelect, initialValue }) => {
    const [selectedTitle, setSelectedTitle] = useState("看板"); // 預設標題

    const options = [
        { label: "租屋", value: 1 },
        { label: "商城", value: 2 },
        { label: "服務", value: 3 },
    ];

    useEffect(() => {
        if (initialValue) {
            const selectedOption = options.find(option => option.value === initialValue);
            if (selectedOption) {
                setSelectedTitle(selectedOption.label);
            }
        }
    }, [initialValue]);

    const handleSelect = (label, value) => {
        setSelectedTitle(label);
        onClassSelect(value);
    };

    return (
        <Dropdown className="d-inline" autoClose="outside">
            <Dropdown.Toggle className="sort-box">{selectedTitle}</Dropdown.Toggle>
            <Dropdown.Menu className="p-3">
                {options.map((option, index) => (
                    <Dropdown.Item 
                        key={index} 
                        href={option.href} 
                        className="sort-drop"
                        onClick={() => handleSelect(option.label, option.value)}
                    >
                        {option.label}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default SortDropdown;