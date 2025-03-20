"use client";

import React, { useState, useEffect } from "react";

import List from "@/app/members/_components/left_list";
import ServiceBookingCard from "../_components/service_booking_card";

import { API_SERVER } from "@/config/api-path";
import { localeDateUtil } from "@/utils/localeDateUtil";

export default function MyBookingPage(props) {
  const [myBookingData, setMyBookingData] = useState(null);

  useEffect(() => {
    const authData = localStorage.getItem("ptoken");
    // const m_id = JSON.parse(authData);

    fetch(`${API_SERVER}/service/my_booking/api`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authData}`,
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((obj) => {
        if (obj.success) {
          setMyBookingData(obj);
        }
      })
      .catch(console.warn);
  }, []);

  return (
    <>
      <div className="container pt-3">
        <div className="row">
          {/* 左側選單 */}
          <div className="col-3 left_list_fixed">
            <List />
          </div>

          {/* 右側內容 */}
          <div className="col-9 members_content">
            {myBookingData &&
              myBookingData.rows.map((v, i) => {
                return (
                  <ServiceBookingCard
                    key={i}
                    imgSrc={`${API_SERVER}/${v.pro_banner_url}`}
                    proLinkHref={`/service/pro/${v.pro_mid}`}
                    pro_name={v.pro_name}
                    category_id={v.service_category_id}
                    category_name={v.service_category_name}
                    date={localeDateUtil(v.booking_date)}
                    time={v.service_time_content
                      .split(":")
                      .slice(0, 2)
                      .join(":")}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}
