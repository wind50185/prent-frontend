"use client";

// import React, { useState, useEffect } from "react";
import Image from "next/image";

// import { BsHeart } from "react-icons/bs";
// import { BsHeartFill } from "react-icons/bs";
import { FaStar } from "react-icons/fa6";

export default function ServiceHomeCard({
  src = "",
  pro_name = "",
  pro_star = 0,
  service_price = 0,
}) {
  return (
    <>
      <div className="card border-0 service_home_card">
        {/* <div className="service_home_card_heart">
          <BsHeartFill className="service_home_card_heart_down" />
          <BsHeartFill className="service_home_card_heart_up" />
        </div> */}
        <Image
          src={src}
          width={1366}
          height={768}
          className="rounded-3 responsive_img"
          alt="專家圖片"
        />
        <div className="card-body">
          <h3 className="service_pro_card_title">{pro_name}</h3>
          <p className="d-flex card-text service_pro_card_star align-items-center gap-1">
            {pro_star} <FaStar />
          </p>
          <p className="card-text service_pro_card_price text-center">
            <span className="service_pro_card_price-s align-middle">$</span>
            {service_price.toLocaleString("zh-TW")}
            <span className="service_pro_card_price-s align-middle">起</span>
          </p>
        </div>
      </div>
    </>
  );
}
