"use client";

// import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import styles from "../../styles/store.scss"

const relatedProducts = [
  {
    id: 1,
    name: "原木餐桌 1",
    price: "$1,000",
    image: "/store_images/list_table.webp",
    link: "/product/1",
  },
  {
    id: 2,
    name: "原木椅子 1",
    price: "$800",
    image: "/store_images/list_chair.webp",
    link: "/product/2",
  },
  {
    id: 3,
    name: "原木衣櫃 1",
    price: "$1,200",
    image: "/store_images/list_closet.webp",
    link: "/product/3",
  },
  {
    id: 4,
    name: "原木床架 1",
    price: "$1,500",
    image: "/store_images/list_bed.webp",
    link: "/product/4",
  },
  {
    id: 5,
    name: "原木床架 1",
    price: "$1,500",
    image: "/store_images/list_bed.webp",
    link: "/product/4",
  },
  {
    id: 6,
    name: "原木床架 1",
    price: "$1,500",
    image: "/store_images/list_bed.webp",
    link: "/product/4",
  },
];

export default function StoreListCard() {
  return (
    <>
<div className="related-products mt-5 ">

  <h4 style={{ color: "#545454", fontSize: "18px", fontWeight: "200" }}>
    你可能會喜歡
  </h4>
  <div style={{ position: "relative" }}>
    {/* 左箭頭按鈕 */}
    <button
      style={{
        position: "absolute",
        left: "0",
        top: "50%",
        transform: "translateY(-50%)",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        color: "white",
        border: "none",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1, // 確保按鈕在卡片上方
      }}
      className={window.innerWidth <= 786 ? styles.active : ""}
      onClick={() => {
        const container = document.querySelector(".product-scroll-container");
        container.scrollBy({ left: -300, behavior: "smooth" });
      }}
    >
      &lt;
    </button>

    {/* 商品卡容器 */}
    <div
      className="product-scroll-container"
      style={{
        display: "flex",
        overflowX: "auto",
        scrollBehavior: "smooth",
        paddingBottom: "10px",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE 和 Edge
      }}
    >
      <style>
        {`
          .product-scroll-container::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }
        `}
      </style>
      {relatedProducts.map((product) => (
        <div
          key={product.id}
          style={{
            flex: "0 0 auto",
            width: "250px",
            marginRight: "16px",
          }}
        >
          <Card className="product-card-item">
            <Card.Img
              variant="top"
              src={product.image}
              className="product-img"
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px 8px 0 0",
              }}
            />
            <Card.Body>
              <Card.Title
                style={{
                  fontSize: "18px",
                  color: "#545454",
                  fontWeight: "200",
                }}
              >
                {product.name}
              </Card.Title>
              <Card.Text style={{ fontSize: "20px", color: "#EC8692" }}>
                {product.price}
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>

    {/* 右箭頭按鈕 */}
    <button
      style={{
        position: "absolute",
        right: "0",
        top: "50%",
        transform: "translateY(-50%)",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        color: "white",
        border: "none",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1, // 確保按鈕在卡片上方
      }}
      onClick={() => {
        const container = document.querySelector(".product-scroll-container");
        container.scrollBy({ left: 300, behavior: "smooth" });
      }}
    >
      &gt;
    </button>
  </div>
</div></>
)
}