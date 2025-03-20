"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Carousel, Container, Row, Col, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import RentCarousel from "../_components/RentCarousel";
import RentMap from "../_components/RentMap";
import "../../styles/_rent.scss";
import { RENT_ITEM } from "@/config/api-path";
import { FaCat } from "react-icons/fa6";

export default function RentProductPage() {
  // const [rental, setRental] = useState(null); // 改為單筆租屋資料
  // const [loading, setLoading] = useState(true); // 新增載入狀態
  // const [error, setError] = useState(null);   // 新增錯誤狀態

  const params = useParams();
  const [loading, setLoading] = useState(true); // 加入 loading 狀態
  const [rentData, setRentData] = useState({
    rent_id: 0,
    rent_name: "",
    price: "",
    create_time: "",
    address: "",
    sqm: "",
    floor: "",
    pet: "",
    elevator: "",
    description: "",
    lng: "",
    lat: "",
    member_name: "",
    phone: "",
    area: "",
    building_type: "",
  });

  useEffect(() => {
    fetch(`${RENT_ITEM}/${params.rent_id}`) // 讀取 public/json/rent.json
      .then((response) => response.json())
      .then((result) => {
        // console.log("Fetched rentals:", result);

        const {
          rent_id,
          rent_name,
          price,
          create_time,
          address,
          sqm,
          floor,
          pet,
          elevator,
          description,
          lng,
          lat,
          member_name,
          phone,
          area,
          building_type,
        } = result.data;
        setRentData({
          rent_id,
          rent_name,
          price,
          create_time,
          address,
          sqm,
          floor,
          pet,
          elevator,
          description,
          lng,
          lat,
          member_name,
          phone,
          area,
          building_type,
        });
      })
      .catch((error) => console.error("Error loading rent.json:", error));
  }, [params.rent_id]);

  const formattedPrice = rentData.price.toLocaleString();

  const formattedDate = rentData.create_time
    ? new Date(rentData.create_time)
        .toLocaleDateString("zh-TW", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\//g, ".")
    : "無日期";

  return (
    <>
      <div className="container mt-3">
        <Breadcrumb>
          <Breadcrumb.Item href="/">首頁</Breadcrumb.Item>
          <Breadcrumb.Item href="/rent">租屋</Breadcrumb.Item>
          <Breadcrumb.Item active>{rentData.rent_name}</Breadcrumb.Item>
        </Breadcrumb>

        <RentCarousel />
      </div>

      <div className="container">
        <div className="row mb-4">
          <div className="col-12 col-md-8 p-3">
            <h3>{rentData.rent_name}</h3>
            <div className="container-fluid fz18 p-0 mb-3">
              <Row xs="auto">
                <Col>
                  <i className="bi bi-house"></i> {rentData.building_type}
                </Col>
                <Col>{rentData.sqm}坪</Col>
                <Col>{rentData.floor}樓</Col>
              </Row>
              <Row xs="auto">
                <Col className="d-flex align-items-center">
                  <FaCat className="me-2" />
                  {rentData.pet === 0 ? "不可養寵" : "可養寵物"}
                </Col>
                <Col>{rentData.elevator === 0 ? "無電梯" : "有電梯"}</Col>
              </Row>
              <Row xs="auto">
                <Col className="text-over">
                  <i className="bi bi-geo-alt me-2"></i>
                  {rentData.address}
                </Col>
              </Row>
              <Row xs="auto">
                <Col>
                  <i className="bi bi-person me-2"></i>
                  {rentData.member_name}
                </Col>
                <Col>{formattedDate}上架</Col>
              </Row>
              <Row xs="auto d-flex">
                <Col>
                  <span className="fz32 fw-bold">{formattedPrice}</span>
                  <span className="fz12">/月</span>
                </Col>
              </Row>
            </div>
            <h4>屋況介紹</h4>
            <p>{rentData.description}</p>
            <Row>
              <Col md={12} className="mt-3">
                <RentMap
                  lat={rentData.lat}
                  lng={rentData.lng}
                  // address={rental.address}
                />
              </Col>
            </Row>
          </div>
          <div className="col-12 col-md-4 p-3">
            <div className="rent_contact">
              <div className="fz22 text-center mb-2">
                <i className="bi bi-person"></i>聯絡人｜{rentData.member_name}
              </div>
              <div className="d-grid gap-2">
                <button
                  className="btn btn-primary text-white fz22"
                  type="button"
                >
                  <i className="bi bi-telephone-fill"></i>
                  {rentData.phone}
                </button>
                <button
                  className="btn btn-primary text-white fz22"
                  type="button"
                >
                  <i className="bi bi-chat-left-text"></i>
                  開啟對話框
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
