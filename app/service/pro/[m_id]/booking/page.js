"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import Image from "next/image";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Modal from "react-bootstrap/Modal";

import ServiceCalendar from "./_components/service_calendar";
import ServiceBookingTime from "./_components/service_booking_time";
import Totop from "@/app/_components/totop";

import { localeDateUtil } from "@/utils/localeDateUtil";

import { BsBoxSeam } from "react-icons/bs";
import { LiaBroomSolid } from "react-icons/lia";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { FaRegCircleCheck } from "react-icons/fa6";

import { API_SERVER } from "@/config/api-path";
import { SERVICE_PRO_DETAIL } from "@/config/api-path";

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();

  const [proDetailData, setProDetailData] = useState({
    success: false,
    error: "",
    proData: {},
    category1Data: [],
    category2Data: [],
    category3Data: [],
    serviceSupply: [],
  });

  // 選擇中的狀態們
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // 類別名字對照
  const serviceCategoryNames = {
    1: "搬家/清運",
    2: "清潔/消毒",
    3: "水電/修繕",
  };

  // 一進入頁面就取得該筆專家的資料
  useEffect(() => {
    fetch(`${SERVICE_PRO_DETAIL}/${params.m_id}`)
      .then((r) => r.json())
      .then((result) => {
        setProDetailData(result);
      })
      .catch(console.warn);
  }, [params, router]);

  // 根據類別，可選擇的日期
  const availableDates =
    selectedCategory !== null
      ? proDetailData.serviceSupply
          .filter((supply) => supply.service_category_id === selectedCategory)
          .map((supply) => localeDateUtil(supply.supply_date))
      : [];

  // 根據類別和日期，可選擇的時段
  const availableTimes =
    selectedCategory && selectedDate
      ? proDetailData.serviceSupply.filter(
          (supply) =>
            supply.service_category_id === selectedCategory &&
            localeDateUtil(supply.supply_date) === selectedDate
        )
      : [];

  // 送出預約按鈕
  const handleBooking = async (e) => {
    e.preventDefault();
    const bookingSubmitBTN = document.querySelector("#bookingSubmitBTN");
    bookingSubmitBTN.classList.add("disabled");

    const authData = localStorage.getItem("prent-auth");

    const user = JSON.parse(authData);

    // 根據所選服務類別取對應的服務資料
    let serviceRecord = null;
    if (selectedCategory === 1 && proDetailData.category1Data.length > 0) {
      serviceRecord = proDetailData.category1Data[0];
    } else if (
      selectedCategory === 2 &&
      proDetailData.category2Data.length > 0
    ) {
      serviceRecord = proDetailData.category2Data[0];
    } else if (
      selectedCategory === 3 &&
      proDetailData.category3Data.length > 0
    ) {
      serviceRecord = proDetailData.category3Data[0];
    }

    // 確保所有必要資料都有選取
    if (!serviceRecord || !selectedDate || !selectedTime) {
      alert("請完整選擇服務類別、日期與時段");
      return;
    }

    // 組合要送給後端的資料
    const formData = {
      service_id: serviceRecord.service_id,
      member_id: user.member_id,
      date: selectedDate,
      time: selectedTime.service_time_id,
    };

    fetch(`${API_SERVER}/service/pro/api/${params.m_id}/booking`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((obj) => {
        if (obj.success) {
          handlePendingModalShow();
          setTimeout(() => {
            handlePendingModalClose();
            handleResultModalShow();
            bookingSubmitBTN.classList.remove("disabled");
          }, 500 + Math.random() * 100);
        } else {
          alert(`新增失敗！${obj.errors[0].message}`);
        }
      })
      .catch(console.warn);
  };

  // 建立預約中 Modal 狀態
  const [showPendingModal, setShowPendingModal] = useState(false);
  const handlePendingModalClose = () => setShowPendingModal(false);
  const handlePendingModalShow = () => setShowPendingModal(true);

  // Result Modal 狀態
  const [showResultModal, setShowResultModal] = useState(false);
  const handleResultModalClose = () => setShowResultModal(false);
  const handleResultModalShow = () => setShowResultModal(true);

  const goToMyBooking = () => {
    setShowResultModal(false);
    router.push(`/service/my_booking`);
  };

  const goBackProList = () => {
    setShowResultModal(false);
    router.push(`/service/pro/${params.m_id}`);
  };

  return (
    <>
      <Totop />
      <div className="container">
        <Breadcrumb className="service_breadcrumb mt-3">
          <Breadcrumb.Item href="/">首頁</Breadcrumb.Item>
          <Breadcrumb.Item href="/service">服務</Breadcrumb.Item>
          <Breadcrumb.Item href="/service/pro">專家列表</Breadcrumb.Item>
          <Breadcrumb.Item
            href={`/service/pro/${proDetailData.proData.member_id}`}
          >
            {proDetailData.proData.pro_name}
          </Breadcrumb.Item>
          <Breadcrumb.Item active>預約</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="mb-2">
        {!proDetailData.proData.pro_banner_url ? (
          <div className="skeleton-loader"></div>
        ) : (
          <Image
            className="service_pro_detail_img"
            src={`${API_SERVER}/${proDetailData.proData.pro_banner_url}`}
            alt="專家圖片"
            width={1366}
            height={768}
            priority
          />
        )}
      </div>
      <div className="container">
        <h3 className="service_pro_detail_title mt-4">
          預約 - {proDetailData.proData.pro_name}
        </h3>
        <form>
          <h4 className="service_pro_detail_subtitle mt-4">選擇服務項目</h4>
          {proDetailData.category1Data[0] && (
            <button
              type="button"
              className={`p-3 mb-2 text-center rounded ${
                selectedCategory === 1
                  ? "service_pro_booking_cate_selected"
                  : "service_pro_booking_cate"
              }`}
              onClick={() => {
                setSelectedCategory(1);
                setSelectedDate(null); // 重設日期
              }}
            >
              <p className="mb-0 service_pro_booking_cate_text">
                <BsBoxSeam className="me-2 service_pro_booking_cate_icon" />
                搬家/清運
              </p>
            </button>
          )}
          {proDetailData.category2Data[0] && (
            <button
              type="button"
              className={`p-3 mb-2 text-center rounded ${
                selectedCategory === 2
                  ? "service_pro_booking_cate_selected"
                  : "service_pro_booking_cate"
              }`}
              onClick={() => {
                setSelectedCategory(2);
                setSelectedDate(null);
              }}
            >
              <p className="mb-0 service_pro_booking_cate_text">
                <LiaBroomSolid className="me-2 service_pro_booking_cate_icon" />
                清潔/消毒
              </p>
            </button>
          )}
          {proDetailData.category3Data[0] && (
            <button
              type="button"
              className={`p-3 mb-2 text-center rounded ${
                selectedCategory === 3
                  ? "service_pro_booking_cate_selected"
                  : "service_pro_booking_cate"
              }`}
              onClick={() => {
                setSelectedCategory(3);
                setSelectedDate(null);
              }}
            >
              <p className="mb-0 service_pro_booking_cate_text">
                <HiOutlineWrenchScrewdriver className="me-2 service_pro_booking_cate_icon" />
                水電/修繕
              </p>
            </button>
          )}

          {selectedCategory !== null && (
            <>
              <h4 className="service_pro_detail_subtitle mt-4">選擇預約日期</h4>
              <ServiceCalendar
                availableDates={availableDates}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
              {selectedDate && (
                <>
                  <h4 className="mt-4 service_pro_detail_subtitle">選擇時段</h4>
                  <div className="service_pro_booking_time mb-4">
                    {availableTimes.map((time, index) => (
                      <ServiceBookingTime
                        key={index}
                        time={time.service_time_content
                          .split(":")
                          .slice(0, 2)
                          .join(":")}
                        isSelected={
                          selectedTime &&
                          selectedTime.service_time_content ===
                            time.service_time_content
                        }
                        isSoldOut={time.service_amount === 0}
                        onClick={() => {
                          if (time.service_amount !== 0) {
                            setSelectedTime(time);
                          }
                        }}
                      />
                    ))}
                  </div>
                  {selectedDate && selectedTime && (
                    <button
                      id="bookingSubmitBTN"
                      type="submit"
                      onClick={handleBooking}
                      className="rounded text-center p-3 mb-4 service_pro_booking_next_btn"
                    >
                      送出預約
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </form>
      </div>
      <Modal centered show={showPendingModal} onHide={handlePendingModalClose}>
        <Modal.Body className="p-3">
          <p className="service_pro_booking_modal_info m-0 text-center">
            建立預約中 ...
          </p>
        </Modal.Body>
      </Modal>

      <Modal size="lg" show={showResultModal} onHide={handleResultModalClose}>
        <Modal.Header closeButton>
          <Modal.Title className="service_pro_booking_modal_title">
            <FaRegCircleCheck className="service_pro_booking_modal_title_icon me-2" />
            預約完成！
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-5 py-4">
          <h3 className="service_pro_booking_modal_subtitle">
            您的預約資訊如下：
          </h3>
          <div className="service_pro_booking_modal_content my-5">
            <p>預約專家：{proDetailData?.proData?.pro_name}</p>
            <p>服務項目：{serviceCategoryNames[selectedCategory] || ""}</p>
            <p>
              預約日期：
              {selectedDate}
            </p>
            <p>
              預約時段：
              {selectedTime &&
                selectedTime.service_time_content
                  .split(":")
                  .slice(0, 2)
                  .join(":")}
            </p>
          </div>
          <p className="service_pro_booking_modal_info">
            預約狀態請至【會員中心】—【我的預約】查詢，謝謝！
          </p>
          <div className="d-flex justify-content-evenly mt-5">
            <button
              className="px-4 py-3 rounded-pill service_pro_booking_modal_btn_1"
              onClick={goToMyBooking}
            >
              查看我的預約
            </button>
            <button
              className="px-4 py-3 rounded-pill service_pro_booking_modal_btn_2"
              onClick={goBackProList}
            >
              返回專家頁面
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
