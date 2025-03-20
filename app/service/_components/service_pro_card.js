"use client";

// import React, { useState, useEffect } from "react";
import Image from "next/image";
import { BsBoxSeam } from "react-icons/bs";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { LiaBroomSolid } from "react-icons/lia";
import { FaStar } from "react-icons/fa6";

export default function ServiceProCard({
  src = "",
  pro_name = "",
  pro_star = 0,
  pro_intro = "",
  hasCategory1 = false,
  hasCategory2 = false,
  hasCategory3 = false,
  price = 0,
}) {
  return (
    <>
      <div className="card service_pro_card border-0 mb-4">
        <div className="row gx-4 gy-2">
          <div className="col-md-4 align-content-center">
            <Image
              src={src}
              width={1366}
              height={768}
              className="rounded-3 responsive_img"
              alt="專家圖片"
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h3 className="service_pro_card_title">{pro_name}</h3>
              <p className="d-flex align-items-center gap-1 card-text service_pro_card_star">
                {pro_star} <FaStar />
              </p>
              <p className="card-text service_pro_card_text">{pro_intro}</p>
              <div className="service-pro-icon">
                {hasCategory1 && <BsBoxSeam className="me-3" />}
                {hasCategory2 && <LiaBroomSolid className="me-3" />}
                {hasCategory3 && <HiOutlineWrenchScrewdriver />}
              </div>
              <p className="card-text service_pro_card_price text-end">
                <span className="service_pro_card_price-s align-middle">$</span>{" "}
                {price}{" "}
                <span className="service_pro_card_price-s align-middle">
                  起
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
