import { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";

const SortDropdown = ({ onGenderSelect, initialValue, className }) => {
    const [selectedTitle, setSelectedTitle] = useState("性別");

    const options = [
        { label: "男性", value: 1 },
        { label: "女性", value: 2 },
        { label: "不顯示", value: 3 },
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
        onGenderSelect(value);
    };

    return (
        <Dropdown className="" autoClose="outside">
            <Dropdown.Toggle className={`sort-box w-100 text-start ps-3 ${className}`}>
                {selectedTitle}
            </Dropdown.Toggle>
            <Dropdown.Menu className="p-3">
                {options.map((option, index) => (
                    <Dropdown.Item
                        key={index}
                        onClick={() => handleSelect(option.label, option.value)}
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