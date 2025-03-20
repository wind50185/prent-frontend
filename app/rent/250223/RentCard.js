import React from "react";
import { Card, Row, Col } from "react-bootstrap";

import Link from "next/link";

const RentalCard = ({ rent }) => {
  return (
    /*
    <Card className="mb-4 shadow-sm">
      <Card.Img variant="top" src={rent.rent_img_url} alt={rent.rent_name} />
      <Card.Body>
        <Card.Title>{rent.rent_name}</Card.Title>
        <Card.Text>
          <strong>地址：</strong> {rent.address} <br />
          <strong>描述：</strong> {rent.description} <br />
          <strong className="text-primary">
            NT$ {rent.price.toLocaleString()} / 月
          </strong>
        </Card.Text>
      </Card.Body>
    </Card>
    */
    <Link href={`/rent/${rent.rent_id}`}>
      <Col className="mb-3">
        <Card>
          <Card.Img
            variant="top"
            src={`/${rent.rent_img_url}`}
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
                <Col>{rent.create_time} 上架</Col>
              </Row>
              <Row xs="auto d-flex justify-content-center">
                <Col>
                  <span className="fz32 fw-bold">{rent.price}</span>
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
