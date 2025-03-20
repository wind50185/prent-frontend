import React, { useState, useEffect } from "react";
import { Carousel, Row, Col, Button } from "react-bootstrap";
import { useParams } from "next/navigation";
import { RENT_IMG } from "@/config/api-path";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../styles/_rent.scss";
import "leaflet/dist/leaflet.css";

export default function RentCarousel() {
  const params = useParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [images, setImages] = useState([]);
  const imagesPerBatch = 4;
  const carouselHeight = 520;

  useEffect(() => {
    fetch(`${RENT_IMG}/${params.rent_id}`)
      .then((response) => response.json())
      .then((result) => {
        if (result.success && Array.isArray(result.data)) {
          const sortedImages = result.data.sort((a, b) => b.rent_is_primary - a.rent_is_primary);
          const filteredImages = sortedImages.map((item) => item.rent_img_url);
          setImages(filteredImages);
        }
      })
      .catch((error) => console.error("Error fetching images:", error));
  }, [params.rent_id]);

  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };

  const nextBatch = () => {
    if (startIndex + 1 + imagesPerBatch <= images.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const prevBatch = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  return (
    <Row className="g-0">
      <Col md={9} className="p-0 pe-1">
        <Carousel fade activeIndex={activeIndex} onSelect={handleSelect}>
          {images.map((img, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block w-100"
                src={`http://localhost:3002/${img}`}
                alt={`Image-${index}`}
                height={carouselHeight}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </Col>

      <Col md={3} className="p-0 d-flex flex-column" style={{ maxWidth: "25%" }}>
        <div
          className="right-image-container position-relative"
          style={{
            height: `${carouselHeight}px`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow: "hidden",
            justifyContent: images.length < 4 ? "flex-start" : "space-between",
          }}
        >
          {images.slice(startIndex, startIndex + imagesPerBatch).map((img, index) => (
            <div
              key={startIndex + index}
              className="image-container small-image mb-1"
              style={{
                width: "100%",
                maxHeight: `${carouselHeight / 4}px`,
              }}
            >
              <img
                src={`http://localhost:3002/${img}`}
                alt={`Thumbnail-${startIndex + index}`}
                className={`full-image ${activeIndex === startIndex + index ? "selected" : ""}`}
                onClick={() => setActiveIndex(startIndex + index)}
                style={{
                  cursor: "pointer",
                  border: activeIndex === startIndex + index ? "3px solid #ec8692" : "none",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          ))}

          {images.length > 4 && (
            <>
              <Button
                onClick={prevBatch}
                className="position-absolute top-0 start-50 translate-middle-x"
                disabled={startIndex === 0}
              >
                <i className="bi bi-chevron-compact-up"></i>
              </Button>
              <Button
                onClick={nextBatch}
                className="position-absolute bottom-0 start-50 translate-middle-x"
                disabled={startIndex + imagesPerBatch >= images.length}
              >
                <i className="bi bi-chevron-compact-down"></i>
              </Button>
            </>
          )}
        </div>
      </Col>
    </Row>
  );
}
