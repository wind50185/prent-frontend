import { useState } from "react";
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { zhTW } from "date-fns/locale";
import { format } from "date-fns";

const BirthdaySelect = ({onBirthdaySelect, className}) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const today = new Date();
    const minSelectableDate = new Date(today.getFullYear() - 100, 0, 1);
    const maxSelectableDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()); // 限制 18 歲以上

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setIsOpen(false);
        if (date) {
            const formattedDate = format(date, "yyyy-MM-dd"); // 格式化為 YYYY-MM-DD
            onBirthdaySelect(formattedDate); // 將格式化後的日期傳遞給父元件
        }
    };

    return (
        <Form.Group className="mb-3 text-color edit_birthcard mx-auto">
                <DatePicker
                    placeholderText="生日"
                    locale={zhTW}
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                        setSelectedDate(date);
                        setIsOpen(false); // 選完日期後關閉日曆
                    }}
                    onChange={handleDateChange}
                    className={`edit_birthcard_detail ps-3 ${className}`}
                    maxDate={maxSelectableDate}
                    minDate={minSelectableDate}
                    showMonthDropdown
                    showYearDropdown
                    scrollableYearDropdown
                    dropdownMode="select"
                />
        </Form.Group>
    );
};

export default BirthdaySelect;