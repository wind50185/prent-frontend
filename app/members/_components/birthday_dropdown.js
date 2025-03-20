import React, { useState } from 'react';
import { Dropdown, Button } from 'react-bootstrap';

const BirthdaySelector = () => {
    const currentYear = new Date().getFullYear();

    // 生成年份、月份、日期選項
    const years = Array.from({ length: 100 }, (_, index) => currentYear - index);
    const months = Array.from({ length: 12 }, (_, index) => index + 1);
    const days = Array.from({ length: 31 }, (_, index) => index + 1);

    // 使用State來儲存選擇的生日
    const [selectedBirthday, setSelectedBirthday] = useState("");

    // 處理選擇事件
    const handleSelect = (year, month, day) => {
        setSelectedBirthday(`${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`);
    };

    return (
        <div className="birthday-selector">
        <Dropdown onSelect={(e) => handleSelect(...e.split('-'))}>
            <Dropdown.Toggle variant="secondary" id="birthday-dropdown">
            {selectedBirthday || "選擇生日"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
            {years.map((year) =>
                months.map((month) =>
                days.map((day) => (
                    <Dropdown.Item key={`${year}-${month}-${day}`} eventKey={`${year}-${month}-${day}`}>
                    {`${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`}
                    </Dropdown.Item>
                ))
                )
            )}
            </Dropdown.Menu>
        </Dropdown>

        <Button variant="primary" disabled={!selectedBirthday} style={{ marginTop: '10px' }}>
            提交
        </Button>
        </div>
    );
};

export default BirthdaySelector;