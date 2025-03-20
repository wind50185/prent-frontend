"use client";
import { API_SERVER } from "@/config/api-path";
// import React, { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import Image from "next/image";

export default function ServiceCarousels() {
  return (
    <>
      <Carousel fade>
        <Carousel.Item>
          <Image
            src={`${API_SERVER}/uploads/service_images/carousel_01.jpg`}
            alt="專家圖片輪播"
            width={1920}
            height={600}
            className="service_carousel_img"
          />
        </Carousel.Item>
        <Carousel.Item>
          <Image
            src={`${API_SERVER}/uploads/service_images/carousel_02.jpg`}
            alt="專家圖片輪播"
            width={1920}
            height={600}
            className="service_carousel_img"
          />
        </Carousel.Item>
        <Carousel.Item>
          <Image
            src={`${API_SERVER}/uploads/service_images/carousel_03.jpg`}
            alt="專家圖片輪播"
            width={1920}
            height={600}
            className="service_carousel_img"
          />
        </Carousel.Item>
      </Carousel>
    </>
  );
}
