import React from "react";
import { Card, Row, Col } from "react-bootstrap";

import Link from "next/link";



const RentalCard = ({ rent }) => {
  const formattedDate = new Date(rent.create_time)
    .toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, "."); // 把 / 轉成 .

    const formattedPrice = rent.price.toLocaleString();

  return (

    <Link href={`/rent/${rent.rent_id}`}>
      <Col className="mb-3">
        <Card>
          <Card.Img
            variant="top"
            src={`http://localhost:3002/${rent.rent_img_url}`}
            alt={rent.rent_name}
          />
          <Card.Body>
            <Card.Title className="text-center fz18 text-over">
              {rent.rent_name}
            </Card.Title>
            <div className="container-fluid fz14">
              <Row xs="auto">
                <Col>
                  <i className="bi bi-house"></i> {rent.building_type}
                </Col>
                <Col>{rent.sqm}坪</Col>
                <Col>{rent.floor}樓</Col>
              </Row>
              <Row xs="auto">
                <Col className="text-over">
                  <i className="bi bi-geo-alt"></i> {rent.address}
                </Col>
              </Row>
              <Row xs="auto">
                <Col>
                  <i className="bi bi-person"></i> {rent.member_name}
                </Col>
                <Col>{formattedDate} 上架</Col>
              </Row>
              <Row xs="auto d-flex justify-content-center">
                <Col>
                  <span className="fz32 fw-bold">{formattedPrice}</span>
                  <span className="fz12">/月</span>
                </Col>
              </Row>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Link>
  );
};

export default RentalCard;
