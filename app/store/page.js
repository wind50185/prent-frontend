"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Carousel from "react-bootstrap/Carousel";
import Image from "next/image";
import CarouselCards from "../_components/carousel_cards";
import { Card } from "react-bootstrap";

const productCategories = [
  { key: "newProducts", category: "新商品" },
  { key: "discountProducts", category: "優惠商品" },
  { key: "hotProducts", category: "熱銷商品" },
];

export default function StoreHome() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category_id");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const categories = [
    {
      name: "桌子",
      href: "http://localhost:3000/store/list?category=1",
      imgSrc: "/store_images/category_table.jpg",
    },
    {
      name: "椅子",
      href: "http://localhost:3000/store/list?category=2",
      imgSrc: "/store_images/category_chair.jpg",
    },
    {
      name: "衣櫃",
      href: "http://localhost:3000/store/list?category=3",
      imgSrc: "/store_images/category_closet.jpg",
    },
    {
      name: "床架",
      href: "http://localhost:3000/store/list?category=4",
      imgSrc: "/store_images/category_bed.jpg",
    },
  ];

  const [products, setProducts] = useState({
    newProducts: [],
    discountProducts: [],
    hotProducts: [],
  });
    const [filteredProducts, setFilteredProducts] = useState([]); // 額外的分類商品

  useEffect(() => {
    fetch("http://localhost:3002/store")
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setProducts(data);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    const categoryId = searchParams.get("category_id");
      if (categoryId) {
        // 當有 category 參數時，請求該分類的商品
        fetch(`http://localhost:3002/store/list?category_id=${categoryId}`)
          .then((response) => response.json())
          .then((data) => {
            // console.log("Fetched data:", data);
            setFilteredProducts(data);
          })
          .catch((error) => console.error("Error:", error));
      } else {
        setFilteredProducts([]);
      }
    }, [searchParams]);

  return (
    <>
      <Carousel fade>
      <Carousel.Item>
        <div className="container">
        <div className="store_intro p-4">
          <p className="store_intro_text mb-4 text-black">
            遠離家鄉不代表要將就生活，我們專為租屋族挑選輕便耐用、簡單好搭的家具，輕鬆打造理想空間。無論是溫暖的早晨或放鬆的夜晚，都能擁有屬於自己的自在角落。
          </p>
        </div>
      </div>
          <Image
            src={"/store_images/banner_01_1440X670.jpg"}
            alt="商城輪播"
            width={1440}
            height={670}
            className="store_carousel_img"
          />
          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <Image
            src={"/store_images/banner_02_brown_1552X600.jpg"}
            alt="商城輪播"
            width={1440}
            height={670}
            className="store_carousel_img"
          />
          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <Image
            src={"/store_images/banner_03_green_1920X600.jpg"}
            alt="商城輪播"
            width={1440}
            height={670}
            className="store_carousel_img"
          />
          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      <section className="store_match py-4 mb-4">
      <div className="container">
        <h2 className="store_match_title text-center mb-4" style={{ color: "#EC9466" }}>
          商品分類
        </h2>

        <div className="row mb-3">
          {categories.map((category, index) => (
            <div
              className="category-card col-6 col-sm-6 col-md-3"
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <a href={category.href}>
                <div className="store_category_card border-0" style={{ position: "relative" }}>
                  <div>
                    <div style={{ position: "relative" }}>
                      <Image
                        src={category.imgSrc}
                        alt={category.name}
                        width={388}
                        height={528}
                        layout="fixed"
                        className="img-fluid"
                      />

                      {/* 胶囊 */}
                      <div
                        className="category-badge"
                        style={{
                          fontSize: "16px",
                          color: "#000",
                          transition: "all 0.3s ease",
                        }}
                      >
                        {hoveredIndex === index ? "看更多 →" : category.name}
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>


      {/* <pre>{JSON.stringify(products, null, 4)}</pre> */}
      <div className="container">
        {productCategories.map(({ key, category }) => (
          <div
            key={key}
            className="product-category"
            style={{ color: "#EC9466" }}
          >
            <div className="row mb-1">
              <h4 className="store_home_category">{category}</h4>
            </div>

            <div className="mb-3">
              <CarouselCards
                items={products[key]}
                renderItem={(item) => (
                  <div className="product-card" key={item.product_id}>
                    <Card className="product-card-item">
                      <div className="product-img-container">
                        <Card.Img
                          variant="top"
                          src={`http://localhost:3002/uploads/store_images/${item.image_path.replace(
                            "uploads/images/",
                            ""
                          )}`}
                          className="product-img"
                        />
                      </div>
                      <Card.Body className="product-body">
                        <Card.Title
                          style={{ fontSize: "16px", color: "#545454" }}
                          className="product-body-title"
                        >
                          {item.product_name}
                        </Card.Title>
                        <Card.Text
                          style={{ fontSize: "20px", color: "#EC8692" }}
                        >
                          ${new Intl.NumberFormat('en-US').format(item.price)}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </div>
                )}
                getLink={(item) => `/store/list/${item.product_id}`}
                getLinkClass={() => "product-link"}
              />
            </div>

            <div className="row mb-3">
              <p className="text-end store_home_more">
                <a href={`/store/list`}>更多 {category} →</a>
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}