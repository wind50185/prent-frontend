import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import RentCard from "../_components/RentCard"; // 引入租屋卡片組件

const RentalList = ({ rentals }) => {
  return (
    <Container>
      <Row xs={1} md={4} className="g-3">
        {rentals.map((rent) => (
          <Col key={rent.rent_id}>
            <RentCard rent={rent} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default RentalList;
