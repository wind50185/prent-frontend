"use client";

import React, { useState, useEffect, useContext } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import { useAuth } from "@/contexts/auth-context";

import Image from "next/image";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import CarouselCards from "@/app/_components/carousel_cards";

export default function StoreDetailPage({ params }) {
  const { auth } = useAuth();
  const member_id = auth?.member_id;
  const token = auth?.token;
  const { pid } = params;
  const productId = Number(pid);
  // console.log("URL 參數 id:", pid, "轉換後的 productId:", productId);
  const [product, setProduct] = useState(null);
  const [hotProducts, setHotProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://localhost:3002/store/list/${productId}`
        );
        if (!res.ok) throw new Error(`無法獲取商品資料: ${await res.text()}`);
        const data = await res.json();
        setProduct(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        console.error("API 錯誤:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchHotProducts = async () => {
      try {
        const res = await fetch(
          `http://localhost:3002/store/?hotProducts=true`
        );
        if (!res.ok) {
          const errorMessage = await res.text();
          throw new Error(`無法獲取熱銷商品: ${errorMessage}`);
        }
        const data = await res.json();
        setHotProducts(data.hotProducts || []); // 設置 hotProducts 狀態
      } catch (err) {
        console.error("API 錯誤:", err);
        setError(err.message);
      }
    };

    fetchHotProducts();
  }, []);

  // 加入購物車函數
  const addToCart = async () => {
    if (!product) return;

    // const token = localStorage.getItem("token");

    if (!token || !member_id) {
      alert(`請先登入`);
      return;
    }

    try {
      const response = await fetch("http://localhost:3002/store/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          member_id,
          product_id: product.product_id,
          amount: quantity,
        }),
      });

      if (!response.ok) {
        throw new Error(`加入購物車失敗: ${await response.text()}`);
      }

      setShowModal(true);
    } catch (error) {
      console.error("加入購物車失敗:", error);
      alert("加入購物車時發生錯誤");
    }
  };

  if (loading) return <p>載入中...</p>;
  if (error) return <p>發生錯誤: {error}</p>;
  if (!product) return <p>找不到商品</p>;

  return (
    <div className="container">
      <Breadcrumb className="store_breadcrumb mt-3">
        <Breadcrumb.Item href="/">首頁</Breadcrumb.Item>
        <Breadcrumb.Item href="/store">商城</Breadcrumb.Item>
        <Breadcrumb.Item active>{product.product_name}</Breadcrumb.Item>
      </Breadcrumb>
      <div className="row">
        {/* 左側商品圖 */}
        <div className="col-lg-5 col-12">
          <div className="product-image-container" style={{ width: "100%" }}>
            <Image
              src={`http://localhost:3002/${product.image_path}`}
              alt={product.product_name}
              className="img-fluid main-product-image"
              width={600}
              height={600}
              style={{ borderRadius: "8px" }}
            />
          </div>
        </div>

        {/* 右側商品詳情 */}
        <div className="col-lg-7 col-12 d-flex flex-column justify-content-between">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              paddingLeft: "20px",
            }}
          >
            <h2
              className="product-title"
              style={{
                fontSize: "32px",
                fontWeight: "200",
              }}
            >
              {product.product_name}
            </h2>
            <p
              className="product-description"
              style={{
                color: "#545454",
                fontSize: "16px",
                lineHeight: "1.6",
                margin: "20px 0",
              }}
            >
              {product.product_desc}
            </p>
            <Card.Text
              style={{ fontSize: "32px", color: "#EC8692", margin: "10px 0" }}
            >
              ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(product.price)}
            </Card.Text>
            <p style={{ color: "#545454", fontSize: "16px" }}>
              <strong>庫存：</strong> {product.amount} 件
            </p>
          </div>

          {/* 按鈕區 */}
          <div
            className="action-container justify-content-end"
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
            }}
          >
            {/* 數量按鈕 */}
            <div className="d-flex align-items-center mb-3">
              <div
                className="quantity-container d-flex justify-content-center"
                style={{
                  backgroundColor: "#F5F5F5",
                  borderRadius: "4px",
                  flex: 1,
                }}
              >
                <Button
                  variant="outline-secondary"
                  onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                  style={{
                    border: "none",
                    color: "black",
                    fontSize: "18px",
                    width: "40px",
                    height: "40px",
                  }}
                >
                  -
                </Button>
                <span
                  style={{
                    margin: "0 10px",
                    fontSize: "18px",
                    alignContent: "center",
                  }}
                >
                  {quantity}
                </span>
                <Button
                  variant="outline-secondary"
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    border: "none",
                    color: "black",
                    fontSize: "18px",
                    width: "40px",
                    height: "40px",
                  }}
                >
                  +
                </Button>
              </div>
              <Button
                variant="outline-secondary"
                style={{
                  marginLeft: "10px",
                  backgroundColor: "white",
                  color: "#545454",
                  borderColor: "#545454",
                  flex: 1,
                  height: "40px",
                }}
              >
                <i className="bi bi-heart"></i> 加入收藏
              </Button>
            </div>

            {/* 加入購物車按鈕 */}
            <Button
              variant="dark"
              style={{
                backgroundColor: "black",
                color: "white",
                width: "100%",
                height: "40px",
              }}
              onClick={() => addToCart(productId)}
            >
              加入購物車
            </Button>
          </div>
        </div>
      </div>

            {/* Modal 彈窗 */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title style={{ color: "#ec9466" }}>加入購物車成功！</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>商品 <strong>{product.product_name}</strong> 已成功加入購物車。</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="dark" onClick={() => setShowModal(false)}>
                  繼續購物
                </Button>
                <Button variant="light" href="/store/cart">
                  前往購物車
                </Button>
              </Modal.Footer>
            </Modal>

      {/* 顯示熱銷商品 */}
      <div className="hot-products mt-5">
        <h4 style={{ color: "#545454", fontSize: "18px", fontWeight: "200" }}>
          熱銷商品
        </h4>
        <CarouselCards
          items={hotProducts} // 使用 hotProducts
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
                  <Card.Title style={{ fontSize: "16px", color: "#545454" }} className="product-body-title">
                    {item.product_name}
                  </Card.Title>
                  <Card.Text style={{ fontSize: "20px", color: "#EC8692" }}>
                    ${new Intl.NumberFormat("en-US").format(item.price)}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          )}
          getLink={(item) => `/store/list/${item.product_id}`}
          getLinkClass={() => "product-link"}
        />
      </div>
    </div>
  );
}
