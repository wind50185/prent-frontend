"use client";
import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { localeDateUtil } from "@/utils/localeDateUtil";
import styles from "./service_calendar.module.css";

// 接收 availableDates、selectedDate 與 onDateSelect prop
export default function ServiceCalendar({
  availableDates = [],
  selectedDate,
  onDateSelect,
}) {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  // 定義今天（午夜）以及一個月後的截止日期
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);
  const oneMonthLater = new Date(todayMidnight);
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

  // 產生日曆（包含前後月補齊）
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startWeekDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const calendar = [];
    let week = [];

    // 填充上個月的日期（若第一天不是星期日）
    if (startWeekDay > 0) {
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const prevMonthLastDay = new Date(prevYear, prevMonth + 1, 0);
      const daysInPrevMonth = prevMonthLastDay.getDate();
      for (let i = startWeekDay - 1; i >= 0; i--) {
        week.push(new Date(prevYear, prevMonth, daysInPrevMonth - i));
      }
    }

    // 本月日期
    for (let d = 1; d <= daysInMonth; d++) {
      week.push(new Date(year, month, d));
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }

    // 補齊最後一週
    if (week.length > 0) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      let d = 1;
      while (week.length < 7) {
        week.push(new Date(nextYear, nextMonth, d));
        d++;
      }
      calendar.push(week);
    }

    return calendar;
  };

  const calendar = generateCalendar();

  // 點擊日期：僅允許日期在 availableDates 清單中（且在有效範圍內）才能選取
  const handleDateClick = (date) => {
    const cellDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const cellDateStr = localeDateUtil(cellDate);

    // 若該日期不在可預約日期內，則不更新
    if (!availableDates.includes(cellDateStr)) return;
    onDateSelect(cellDateStr);
  };

  // 切換月份
  const handlePreviousMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    if (
      newDate.getFullYear() < todayMidnight.getFullYear() ||
      (newDate.getFullYear() === todayMidnight.getFullYear() &&
        newDate.getMonth() < todayMidnight.getMonth())
    ) {
      return;
    }
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    if (
      newDate.getFullYear() > oneMonthLater.getFullYear() ||
      (newDate.getFullYear() === oneMonthLater.getFullYear() &&
        newDate.getMonth() > oneMonthLater.getMonth())
    ) {
      return;
    }
    setCurrentDate(newDate);
  };

  const isPrevDisabled =
    currentDate.getFullYear() === todayMidnight.getFullYear() &&
    currentDate.getMonth() === todayMidnight.getMonth();
  const isNextDisabled =
    currentDate.getFullYear() === oneMonthLater.getFullYear() &&
    currentDate.getMonth() === oneMonthLater.getMonth();

  return (
    <div className={`${styles.service_calendar} p-3 rounded mb-4`}>
      <div className={`${styles.service_calendar_year} mb-3`}>
        <IoIosArrowBack
          className={
            isPrevDisabled
              ? styles.service_calendar_year_icon_disabled
              : styles.service_calendar_year_icon
          }
          onClick={!isPrevDisabled ? handlePreviousMonth : undefined}
        />
        <h4 className={`${styles.service_calendar_year_text} m-0 p-0`}>
          {currentDate.getFullYear()} 年 / {currentDate.getMonth() + 1} 月
        </h4>
        <IoIosArrowForward
          className={
            isNextDisabled
              ? styles.service_calendar_year_icon_disabled
              : styles.service_calendar_year_icon
          }
          onClick={!isNextDisabled ? handleNextMonth : undefined}
        />
      </div>
      <div className={styles.service_calendar_date}>
        <div className={styles.service_calendar_week_name}>日</div>
        <div className={styles.service_calendar_week_name}>一</div>
        <div className={styles.service_calendar_week_name}>二</div>
        <div className={styles.service_calendar_week_name}>三</div>
        <div className={styles.service_calendar_week_name}>四</div>
        <div className={styles.service_calendar_week_name}>五</div>
        <div className={styles.service_calendar_week_name}>六</div>
      </div>
      {calendar.map((week, index) => (
        <div key={index} className={styles.service_calendar_date}>
          {week.map((date, i) => {
            const cellDate = new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate()
            );
            const cellTime = cellDate.getTime();
            const todayTime = todayMidnight.getTime();
            const oneMonthLaterTime = oneMonthLater.getTime();
            const cellDateStr = localeDateUtil(cellDate);

            // 判斷是否為今天
            const isToday = cellTime === todayTime;

            // 判斷是否超出可選範圍（小於今天或大於一個月後）
            const isOutOfRange =
              cellTime < todayTime || cellTime > oneMonthLaterTime;

            // 判斷該日期是否在 availableDates 中
            const isAvailable = availableDates.includes(cellDateStr);

            let cellClass = "";
            if (isToday) {
              cellClass = styles.service_calendar_date_btn_today;
            } else if (isOutOfRange) {
              cellClass = styles.service_calendar_date_btn_disabled;
            } else if (!isAvailable) {
              cellClass = styles.service_calendar_date_btn_sold_out;
            } else if (selectedDate === cellDateStr) {
              cellClass = styles.service_calendar_date_btn_selected;
            } else {
              cellClass = styles.service_calendar_date_btn;
            }

            return (
              <button
                key={i}
                type="button"
                className={cellClass}
                onClick={() => handleDateClick(date)}
                disabled={isOutOfRange || !isAvailable}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
