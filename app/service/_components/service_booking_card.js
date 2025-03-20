"use client";

import Image from "next/image";
import Link from "next/link";

import { LuCalendarDays } from "react-icons/lu";
import { BsPencilSquare } from "react-icons/bs";
import { ImCancelCircle } from "react-icons/im";
import { BsChatLeftText } from "react-icons/bs";

import { BsBoxSeam } from "react-icons/bs";
import { LiaBroomSolid } from "react-icons/lia";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";

export default function ServiceBookingCard({
  imgSrc = "",
  proLinkHref = "",
  pro_name = "",
  category_id = 0,
  category_name = "",
  date = "",
  time = "",
}) {
  return (
    <>
      <div className="service_pro_booking_card rounded p-3 mb-3">
        <div className="service_pro_booking_card_state mb-2 mb-lg-0">
          <div className="service_pro_booking_card_state_icon me-2"></div>
          <p className="service_pro_booking_card_state_text m-0">預約成功</p>
        </div>
        <div className="service_pro_booking_card_pro mb-3 mb-md-4 mb-lg-0">
          <div className="service_pro_booking_card_img me-3">
            <Image
              src={imgSrc}
              alt="專家圖片"
              width={1366}
              height={768}
              className="responsive_img"
            />
          </div>
          <div className="service_pro_booking_card_pro_content">
            <div className="service_pro_booking_card_pro_name">
              <Link href={proLinkHref}>{pro_name}</Link>
            </div>
            <div className="service_pro_booking_card_pro_service">
              <span className="service_pro_booking_card_pro_service_icon">
                {category_id === 1 && <BsBoxSeam className="me-1" />}
                {category_id === 2 && <LiaBroomSolid className="me-1" />}
                {category_id === 3 && (
                  <HiOutlineWrenchScrewdriver className="me-1" />
                )}
              </span>
              <p className="service_pro_booking_card_pro_service_name m-0">
                {category_name}
              </p>
            </div>
          </div>
        </div>
        <div className="service_pro_booking_card_time mb-3 mb-lg-0">
          <span className="service_pro_booking_card_time_icon">
            <LuCalendarDays className="me-2" />
          </span>
          <p className="service_pro_booking_card_pro_time_text m-0">
            {date} {time}
          </p>
        </div>
        <div className="service_pro_booking_card_options">
          <div className="service_pro_booking_card_options_btn ">
            <div className="service_pro_booking_card_options_btn_icon">
              <BsPencilSquare className="me-2 me-md-1" />
            </div>
            <p className="service_pro_booking_card_options_text m-0">編輯</p>
          </div>
          <div className="service_pro_booking_card_options_btn">
            <div className="service_pro_booking_card_options_btn_icon">
              <ImCancelCircle className="me-2 me-md-1" />
            </div>
            <p className="service_pro_booking_card_options_text m-0">
              取消預約
            </p>
          </div>
          <div className="service_pro_booking_card_options_btn">
            <div className="service_pro_booking_card_options_btn_icon">
              <BsChatLeftText className="me-2 me-md-1" />
            </div>
            <p className="service_pro_booking_card_options_text m-0">
              聯絡專家
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
