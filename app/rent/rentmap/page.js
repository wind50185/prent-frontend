"use client";

import { useEffect, useState, useCallback } from "react";
import "../../styles/_rent.scss";
import { Container, Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Link from "next/link";
import RentMapList from "../_components/RentalMapList";
import {
  GoogleMap,
  Marker,
  useLoadScript,
  InfoWindow,
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "calc(100vh - 72px)",
};

const center = {
  lat: 25.03341261406992, // 台北市中心點
  lng: 121.50011594236436,
};

export default function RentMapPage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey, // 需填入自己的 API Key
  });

  const [rentals, setRentals] = useState([]);
  const [filteredRentals, setFilteredRentals] = useState([]);
  const [map, setMap] = useState(null); // 用來存 map 實例
  const [selectedRental, setSelectedRental] = useState(null); // 儲存選中的租屋資訊

  useEffect(() => {
    fetch("http://localhost:3002/rent/api")
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((rental, index) => ({
          ...rental,
          id: rental.id || `rental-${index}`, // 確保每個租屋都有唯一 ID
          lat: Number(rental.lat),
          lng: Number(rental.lng),
        }));
        setRentals(formattedData);
        setFilteredRentals(formattedData);
      })
      .catch((error) => console.error("Error loading rent.json:", error));
  }, []);

  // 監聽地圖變化，篩選租屋資料
  const updateRentalsInView = useCallback(() => {
    if (!map) return;

    const bounds = map.getBounds();
    if (!bounds) return;

    const filtered = rentals.filter((rental) =>
      bounds.contains({ lat: rental.lat, lng: rental.lng })
    );

    setFilteredRentals(filtered);
  }, [map, rentals]);

  const formattedPrice = selectedRental
    ? selectedRental.price.toLocaleString("en-US")
    : "無價格資料";

  return (
    <Container fluid className="h-100">
      <Row>
        {/* 左側 Google 地圖 */}
        <Col sm={9} className="map-container">
          {loadError && <p>地圖載入失敗</p>}
          {!isLoaded ? (
            <p>地圖載入中...</p>
          ) : (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={18}
              center={center}
              onLoad={(mapInstance) => setMap(mapInstance)}
              onIdle={updateRentalsInView}
            >
              {filteredRentals.map((rental, index) => {
                if (
                  typeof rental.lat !== "number" ||
                  typeof rental.lng !== "number" ||
                  isNaN(rental.lat) ||
                  isNaN(rental.lng)
                ) {
                  console.warn("無效的租屋位置:", rental);
                  return null;
                }

                return (
                  <Marker
                    key={rental.id || `${rental.lat}-${rental.lng}-${index}`} // 確保唯一 key
                    position={{ lat: rental.lat, lng: rental.lng }}
                    title={rental.address}
                    onClick={() => setSelectedRental(rental)} // 點擊標記時顯示租屋資訊
                  />
                );
              })}

              {/* 顯示選中的租屋資訊 */}
              {selectedRental && (
                <InfoWindow
                  href={`/rent/${selectedRental.rent_id}`}
                  position={{
                    lat: selectedRental.lat,
                    lng: selectedRental.lng,
                  }}
                  onCloseClick={() => setSelectedRental(null)} // 關閉資訊窗
                >
                  <Link href={`/rent/${selectedRental.rent_id}`}>
                    <Card style={{ width: "18rem" }}>
                      <Card.Img
                        variant="top"
                        src={`http://localhost:3002/${selectedRental.rent_img_url}`}
                        alt={selectedRental.rent_name}
                      />
                      <Card.Body>
                        <Card.Title className="text-center">
                          {selectedRental.rent_name}
                        </Card.Title>
                        <Card.Text>
                          <div className="container-fluid fz14">
                            <Row xs="auto">
                              <Col>
                                <i className="bi bi-house"></i>{" "}
                                {selectedRental.building_type}
                              </Col>
                              <Col>{selectedRental.sqm}坪</Col>
                              <Col>{selectedRental.floor}樓</Col>
                            </Row>
                            <Row xs="auto d-flex justify-content-center">
                              <Col>
                                <span className="fz32 fw-bold">
                                  {formattedPrice}
                                </span>
                                <span className="fz12">/月</span>
                              </Col>
                            </Row>
                          </div>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Link>
                </InfoWindow>
              )}
            </GoogleMap>
          )}
        </Col>

        {/* 右側租屋列表 */}
        <Col sm={3} className="p-2 overflow-y-auto">
          <RentMapList rentals={filteredRentals} />
        </Col>
      </Row>
    </Container>
  );
}
