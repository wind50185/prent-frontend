import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import RentMapCard from "./RentMapCard";

const RentMapList = ({ rentals }) => {
  return (
    <Container fluid>
      <Row xs={1} md={1}>
        {rentals.map((rent) => (
          <RentMapCard rent={rent} key={rent.rent_id} />
        ))}
      </Row>
    </Container>
  );
};

export default RentMapList;
