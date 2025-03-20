"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import Image from "next/image";
import Breadcrumb from "react-bootstrap/Breadcrumb";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

import { BsBoxSeam } from "react-icons/bs";
import { LiaBroomSolid } from "react-icons/lia";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { LuCalendarDays } from "react-icons/lu";
import { FaStar } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { MdOutlinePhoneAndroid } from "react-icons/md";

import { SERVICE_PRO_DETAIL } from "@/config/api-path";
import { API_SERVER } from "@/config/api-path";

import CarouselCards from "@/app/_components/carousel_cards";
import ServiceHomeCard from "../../_components/service_home_card";
import Totop from "@/app/_components/totop";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

export default function ProDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const [proDetailData, setProDetailData] = useState({
    success: false,
    error: "",
    proData: {},
    category1Data: [],
    category2Data: [],
    category3Data: [],
    serviceSupply: [],
    proCardData: [],
  });

  // 將服務圖片獨立取出
  const allServiceImages = [
    ...proDetailData.category1Data,
    ...proDetailData.category2Data,
    ...proDetailData.category3Data,
  ].filter((item) => item.service_img_url);

  const goToBooking = () => {
    const authData = localStorage.getItem("prent-auth");
    if (!authData) {
      router.push("/members/login");
      return;
    }

    router.push(`/service/pro/${proDetailData?.proData?.member_id}/booking`);
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

  return (
    <>
      <Totop />
      <div className="container">
        <Breadcrumb className="service_breadcrumb mt-3">
          <Breadcrumb.Item href="/">首頁</Breadcrumb.Item>
          <Breadcrumb.Item href="/service">服務</Breadcrumb.Item>
          <Breadcrumb.Item href="/service/pro">專家列表</Breadcrumb.Item>
          <Breadcrumb.Item active>
            {proDetailData.proData.pro_name}
          </Breadcrumb.Item>
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
        {/* <pre>{JSON.stringify(proDetailData, null, 4)}</pre> */}

        <div className="row mb-4">
          <div className="col-12 col-md-8 py-3 pe-3">
            <h3 className="service_pro_detail_title">
              {proDetailData.proData.pro_name}
            </h3>
            <p className="service_pro_detail_star mb-4 align-items-center gap-1">
              {proDetailData.proData.pro_star} <FaStar />
            </p>
            {/* // ----- 提供服務區塊 ----- */}
            <h4 className="service_pro_detail_subtitle">提供服務</h4>
            {proDetailData.category1Data[0] && (
              <div className="service_pro_detail_cate">
                <BsBoxSeam className="me-2 my-1 service_pro_detail_cate_icon" />
                <p className="service_pro_detail_cate_text">搬家/清運</p>
              </div>
            )}
            {proDetailData.category2Data[0] && (
              <div className="service_pro_detail_cate">
                <LiaBroomSolid className="me-2 my-1 service_pro_detail_cate_icon" />
                <p className="service_pro_detail_cate_text">清潔/消毒</p>
              </div>
            )}
            {proDetailData.category3Data[0] && (
              <div className="service_pro_detail_cate mb-3">
                <HiOutlineWrenchScrewdriver className="me-2 my-1 service_pro_detail_cate_icon" />
                <p className="service_pro_detail_cate_text">水電/修繕</p>
              </div>
            )}

            {/* // ----- 專家簡介區塊 ----- */}
            <h4 className="service_pro_detail_subtitle">專家簡介</h4>
            <p className="service_pro_detail_text">
              {proDetailData?.proData.pro_intro}
            </p>

            {/* // ----- 服務簡介區塊 ----- */}
            <h4 className="service_pro_detail_subtitle">服務說明</h4>
            {proDetailData.category1Data[0] && (
              <p className="service_pro_detail_text">
                搬家 / 清運：
                <br />
                {proDetailData?.category1Data[0]?.service_intro}
              </p>
            )}
            {proDetailData.category2Data[0] && (
              <p className="service_pro_detail_text">
                清潔 / 消毒：
                <br />
                {proDetailData?.category2Data[0]?.service_intro}
              </p>
            )}
            {proDetailData.category3Data[0] && (
              <p className="service_pro_detail_text">
                水電 / 修繕：
                <br />
                {proDetailData?.category3Data[0]?.service_intro}
              </p>
            )}

            {/* // ----- 收費方式區塊 ----- */}
            <h4 className="service_pro_detail_subtitle">收費方式</h4>
            {proDetailData.category1Data[0] && (
              <p className="service_pro_detail_text">
                搬家 / 清運：
                <br />
                每車 {proDetailData?.category1Data[0]?.service_price_main}{" "}
                元起，超過 10 公里加收{" "}
                {proDetailData?.category1Data[0]?.service_price_extra} 元 /
                每公里
              </p>
            )}
            {proDetailData.category2Data[0] && (
              <p className="service_pro_detail_text">
                清潔 / 消毒：
                <br />
                每小時 {
                  proDetailData?.category2Data[0]?.service_price_main
                }{" "}
                元起，延長時間加收{" "}
                {proDetailData?.category2Data[0]?.service_price_extra} 元 /
                每小時
              </p>
            )}
            {proDetailData.category3Data[0] && (
              <p className="service_pro_detail_text">
                水電 / 修繕：
                <br />
                單項 {proDetailData?.category3Data[0]?.service_price_main}{" "}
                元起，特殊材料費另計
              </p>
            )}

            {/* // ----- 過往成果區塊 ----- */}
            <h4 className="service_pro_detail_subtitle">過往成果</h4>

            {allServiceImages.length > 0 && (
              <>
                <Swiper
                  style={{
                    "--swiper-navigation-color": "#fff",
                    "--swiper-pagination-color": "#fff",
                  }}
                  loop={true}
                  spaceBetween={10}
                  navigation={true}
                  thumbs={{ swiper: thumbsSwiper }}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="mySwiper2 mb-2"
                >
                  {allServiceImages.map((item, index) => (
                    <SwiperSlide key={index}>
                      <Image
                        src={`${API_SERVER}/${item.service_img_url}`}
                        alt="服務成果圖片"
                        width={1366}
                        height={768}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                <Swiper
                  onSwiper={setThumbsSwiper}
                  loop={true}
                  spaceBetween={10}
                  slidesPerView={2.3}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  breakpoints={{
                    768: { slidesPerView: 3.3 },
                    992: { slidesPerView: 4.3 },
                  }}
                  className="mySwiper"
                >
                  {allServiceImages.map((item, index) => (
                    <SwiperSlide key={index}>
                      <Image
                        src={`${API_SERVER}/${item.service_img_url}`}
                        alt="服務成果圖片"
                        width={1366}
                        height={768}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </>
            )}
          </div>

          {/* // ----- 聯絡人區塊 ----- */}
          <div className="col-12 col-md-4 py-3 ps-3">
            <div className="service_pro_contact">
              <div className="text-center mb-3 d-flex justify-content-center align-items-center">
                {proDetailData?.proData?.img ? (
                  <Image
                    src={`${API_SERVER}/${proDetailData?.proData?.img}`}
                    alt="專家頭貼圖"
                    width={40}
                    height={40}
                    className="me-3 align-text-top rounded-circle"
                  />
                ) : (
                  <CgProfile
                    style={{
                      color: "#ec9466",
                      width: 40,
                      height: 40,
                    }}
                    className="me-3"
                  />
                )}
                <div className="service_pro_contact_name">
                  聯絡人｜{proDetailData?.proData?.member_name?.slice(0, 1)}專家
                </div>
              </div>
              <div className="col-6 col-md-12 service_pro_contact_btn mb-md-2 p-2 text-center">
                <MdOutlinePhoneAndroid className="me-2 align-text-top" />
                {proDetailData?.proData?.phone}
              </div>
              <button
                onClick={goToBooking}
                className="col-6 col-md-12 service_pro_contact_btn p-2 text-center "
              >
                <LuCalendarDays className="me-2 align-text-top" />
                立刻預約
              </button>
            </div>
          </div>
        </div>
        <hr />
        <div className="row mb-2">
          {/* //----- 其他人也看了區塊 ----- */}
          <h3 className="service_pro_detail_others_title">更多精選專家</h3>
        </div>
        {/* <pre>{JSON.stringify(listData, null, 4)}</pre> */}

        <div className="mb-3">
          <CarouselCards
            items={proDetailData.proCardData}
            renderItem={(item) => (
              <ServiceHomeCard
                src={`${API_SERVER}/${item.pro_banner_url}`}
                pro_name={item.pro_name}
                pro_star={item.pro_star}
                service_price={item.service_price_main}
              />
            )}
            getLink={(item) => `/service/pro/${item.member_id}`}
            getLinkClass={() => "service_pro_link"}
          />
        </div>
      </div>
    </>
  );
}
