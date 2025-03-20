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

  return (
    <Link href={`/rent/${rent.rent_id}`} className="p-0 my-2">
      <Card style={{ display: "flex", flexDirection: "row" }}>
        {/* 12132 */}
        <Col sm={5}>
          <Card.Img
            variant="top"
            src={`http://localhost:3002/${rent.rent_img_url}`}
            alt={rent.rent_name}
            height={'100%'}
          />
        </Col>
        <Col sm={7}>
          <Card.Body className="p-0">
            <Card.Title className="text-center fz16 text-over pt-2">
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
              <Row xs="auto d-flex justify-content-center">
                <Col>
                  <span className="fz26 fw-bold">{rent.price}</span>
                  <span className="fz12">/月</span>
                </Col>
              </Row>
            </div>
          </Card.Body>
        </Col>
        {/* 21312 */}
      </Card>
    </Link>
  );
};

export default RentalCard;
