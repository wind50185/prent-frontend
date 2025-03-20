import React from "react";
import { Container, Row } from "react-bootstrap";
import RentCard from "./RentCard";

const RentList = ( { md = 4 } ) => {
  const rents = Array.from({ length: 12 }).map((_, idx) => ({
    href: "/rent/1",
    title: "豬豬屋｜新落成新裝潢",
    image: "../rent_images/rent-banner.jpg",
    type: "公寓",
    size: 12,
    floor: 4,
    location: "台北市中正區重慶南路一段122號",
    owner: "王先生",
    date: "2024.1.5",
    price: "16,000",
  }));

  return (
    <div className="container">
      <Row xs={1} md={md} className="g-3">
        {rents.map((Rent, idx) => (
          <RentCard key={idx} {...Rent} />
        ))}
      </Row>
    </div>
  );
};

export default RentList;
