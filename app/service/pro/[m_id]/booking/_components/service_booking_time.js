"use client";

import React, { useState, useEffect } from "react";

export default function ServiceBookingTime({
  time = "",
  isSelected = false,
  isSoldOut = false,
  onClick = () => {},
}) {
  return (
    <>
      <button
        type="button"
        className={`p-3 mb-1 text-center rounded ${
          isSoldOut
            ? "service_pro_booking_btn_sold_out"
            : isSelected
            ? "service_pro_booking_btn_selected"
            : "service_pro_booking_btn"
        }`}
        disabled={isSoldOut}
        onClick={onClick}
      >
        <p className="mb-0 service_pro_booking_cate_text">{time}</p>
      </button>
    </>
  );
}
