"use client";

import React, { useState, useEffect } from "react";
import { SERVICE_HOME } from "@/config/api-path";
import { API_SERVER } from "@/config/api-path";

import ServiceCarousels from "./_components/service_carousels";
import CarouselCards from "../_components/carousel_cards";
import ServiceHomeCard from "./_components/service_home_card";
import Totop from "../_components/totop";

import { BsBoxSeam } from "react-icons/bs";
import { LiaBroomSolid } from "react-icons/lia";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import Link from "next/link";

export default function ServicePage() {
  const [listData, setListData] = useState({
    allCategory: [],
    category1: [],
    category2: [],
    category3: [],
  });

  useEffect(() => {
    fetch(SERVICE_HOME)
      .then((r) => r.json())
      .then((obj) => {
        setListData(obj);
      })
      .catch(console.warn);
  }, []);

  return (
    <>
      <Totop />
      <div className="container">
        <div className="service_intro p-4">
          <h2 className="service_intro_title">租客服務</h2>
          <p className="service_intro_text mb-4">
            租豬幫為您打造全方位服務，提供搬家清運、清潔消毒、水電修繕等服務，讓您在城市中找到最貼心的依靠，輕鬆展開新生活。
          </p>
          <Link href="#service_match">
            <button className="service_intro_btn rounded-3 py-3 px-4">
              立即媒合 →
            </button>
          </Link>
        </div>
      </div>
      <ServiceCarousels />
      <section id="service_match" className="service_match py-4 mb-4">
        <div className="container">
          <h2 className="service_match_title text-center mb-4">快速媒合</h2>
          <div className="row mb-3">
            <div className="col-4">
              <Link
                href="/service/pro?category=1"
                className="text-decoration-none"
              >
                <div className="service_match_item text-center align-content-center rounded-4 px-2 py-4">
                  <BsBoxSeam className="service_match_icon mb-3" />
                  <h3 className="service_match_category mb-0">搬家/清運</h3>
                </div>
              </Link>
            </div>
            <div className="col-4">
              <Link
                href="/service/pro?category=2"
                className="text-decoration-none"
              >
                <div className="service_match_item text-center align-content-center rounded-4 px-2 py-4">
                  <LiaBroomSolid className="service_match_icon mb-3" />
                  <h3 className="service_match_category mb-0">清潔/消毒</h3>
                </div>
              </Link>
            </div>
            <div className="col-4">
              <Link
                href="/service/pro?category=3"
                className="text-decoration-none"
              >
                <div className="service_match_item text-center align-content-center rounded-4 px-2 py-4">
                  <HiOutlineWrenchScrewdriver className="service_match_icon mb-3" />
                  <h3 className="service_match_category mb-0">水電/修繕</h3>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <div className="container">
        <div className="row mb-1">
          <h4 className="service_home_category">搬家 / 清運專家</h4>
        </div>
        <div className="mb-3">
          <CarouselCards
            items={listData.category1}
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
        <div className="row mb-3">
          <p className="text-end service_home_more">
            <Link href="/service/pro?category=1">更多 搬家 / 清運專家 →</Link>
          </p>
        </div>

        <div className="row mb-1">
          <h4 className="service_home_category">清潔 / 消毒專家</h4>
        </div>
        <div className="mb-3">
          <CarouselCards
            items={listData.category2}
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
        <div className="row mb-3">
          <p className="text-end service_home_more">
            <Link href="/service/pro?category=2">更多 清潔 / 消毒專家 →</Link>
          </p>
        </div>

        <div className="row mb-1">
          <h4 className="service_home_category">水電 / 修繕專家</h4>
        </div>
        <div className="mb-3">
          <CarouselCards
            items={listData.category3}
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
        <div className="row mb-3">
          <p className="text-end service_home_more">
            <Link href="/service/pro?category=3">更多 水電 / 修繕專家 →</Link>
          </p>
        </div>
      </div>
    </>
  );
}
