"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { Row, Col, Table, Card, Button, Container } from "react-bootstrap";
import Image from "next/image";
import { FaTrashCan } from "react-icons/fa6";

const CartItem = ({
  item,
  onRemove,
  onUpdateQuantity,
  onIncrease,
  onDecrease,
}) => {
  const total_price = item.product_price * item.amount;

  return (
    <tr style={{ borderBottom: "1px solid #ddd" }}>
      {/* 商品圖片 */}
      <td  className="text-center align-middle">
        <Image
          // src={item.image}
          src={`http://localhost:3002/uploads/store_images/${item.image_url
            .split("/")
            .pop()}`}
          alt={item.product_name}
          width={80}
          height={80}
          objectFit="cover"
        />
      </td>

      {/* 商品名稱 */}
      <td className="text-center align-middle">
        <h6>{item.product_name}</h6>
      </td>

      {/* 商品數量 */}
      <td className="text-center align-middle">
        <div className="input-group" style={{ width: "120px" }}>
          <button
            className="btn btn-outline-secondary"
            onClick={() => onDecrease(item.cart_id)}
          >
            -
          </button>
          <input
            // type="number"
            value={item.amount}
            min="1"
            // onChange={handleQuantityChange}
            onChange={(e) =>
              onUpdateQuantity(item.cart_id, parseInt(e.target.value, 10))
            }
            className="form-control text-center"
          />
          <button
            className="btn btn-outline-secondary"
            onClick={() => onIncrease(item.cart_id)}
          >
            +
          </button>
        </div>
      </td>

      {/* 商品單價 */}
      <td className="text-center align-middle">${new Intl.NumberFormat().format(item.product_price)}</td>

      {/* 商品小計 */}
      <td className="text-center align-middle">${new Intl.NumberFormat().format(total_price)}</td>

      {/* 操作 */}
      <td className="text-center align-middle">
        <button
          className="btn btn-outline-gray"
          onClick={() => onRemove(item.cart_id)}
        >
          <FaTrashCan />
        </button>
      </td>
    </tr>
  );
};

export default function StoreCart() {
  const { auth } = useAuth();
  // const member_id = auth?.member_id;
  const token = auth?.token;
  // console.log("token from context:", token);
  // const { cart_items, setCartItems, onIncrease, onDecrease, onRemove } =
  //   useCart();
    const {
      cartItems,
      onAdd,
      onIncrease,
      onDecrease,
      onRemove,
      totalQty,
      totalAmount,
      setCartItems,
    } = useCart();
  // const [cartItems, setCartItems] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const steps = ["購物車", "填寫資料", "訂單完成"];

  // 從後端獲取購物車資料
  const fetchCart = async () => {
    try {
      // const member_id = 1;
      // http://localhost:3000/store/cart?member_id=32
      // const res = await fetch(`/store/cart?member_id=${member_id}`, {

      const res = await fetch(`http://localhost:3002/store/cart`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`HTTP 錯誤狀態碼: ${res.status}`);
      }

      const data = await res.json(); // 直接解析 JSON
      // console.log("購物車資料:", data);
      setCartItems(data.cartItems || []);
    } catch (err) {
      // console.error("取得購物車資料時發生錯誤:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCart(); // 頁面載入時取得購物車資料
    }
  }, [token]);

  useEffect(() => {
    if (cartItems === null) {
      fetchCart();
    }
  }, [token]);
  

  // 更新商品數量
  const handleUpdateQuantity = async (cart_id, amount) => {
    try {
      // 更新商品數量到後端
      const res = await fetch(`http://localhost:3002/store/cart/${cart_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });

      if (res.ok) {
        fetchCart();
      } else {
        console.error("更新數量失敗，狀態碼:", res.status);
      }
    } catch (err) {
      console.error("更新商品數量時發生錯誤:", err);
    }
  };

  // 移除商品
  const handleRemoveItem = async (cart_id) => {
    // console.log("刪除 cart_id:", cart_id);
    // console.log("Token:", token);
    try {
      const res = await fetch(`http://localhost:3002/store/cart/${cart_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.cart_id !== cart_id)
        );
      } else {
        console.error("刪除商品失敗");
      }
    } catch (err) {
      console.error("移除商品時發生錯誤:", err);
    }
  };

  // 增加商品數量
  const handleIncrease = async (cart_id) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.cart_id === cart_id) {
        return { ...item, amount: item.amount + 1 }; // 增加數量
      }
      return item;
    });
    setCartItems(updatedCartItems); // 更新前端顯示

    try {
      const res = await fetch(`http://localhost:3002/store/cart/${cart_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: updatedCartItems.find((item) => item.cart_id === cart_id)
            .amount
        }),
      });
      if (!res.ok) {
        console.error("更新數量失敗");
      }
    } catch (err) {
      console.error("更新數量時發生錯誤:", err);
    }
  };

  // 減少商品數量
  const handleDecrease = async (cart_id) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.cart_id === cart_id && item.amount > 1) {
        return { ...item, amount: item.amount - 1 }; // 減少數量，並防止數量小於 1
      }
      return item;
    });
    setCartItems(updatedCartItems); // 更新前端顯示

    try {
      const res = await fetch(`http://localhost:3002/store/cart/${cart_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: updatedCartItems.find((item) => item.cart_id === cart_id)
            .amount,
        }),
      });
      if (!res.ok) {
        console.error("更新數量失敗");
      }
    } catch (err) {
      console.error("更新數量時發生錯誤:", err);
    }
  };

  // 計算總金額
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product_price * item.amount,
      0
    );
  };

  const router = useRouter();
  // 處理結帳
  const handlePayment = () => {
    if (!token) {
      alert("請先登入");
      return;
    }
    // 跳轉到結帳頁面
    router.push("/store/checkout");
  };

  return (
    <Container className="cart-page py-4">
      <h3 className="text-center mb-4">我的商品</h3>

      {/* 步驟導航條 */}
      <div className="stepWrapper d-flex justify-content-center mb-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`stepItem ${currentStep === index + 1 ? "active" : ""}`}
            onClick={() => setCurrentStep(index + 1)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setCurrentStep(index + 1);
              }
            }}
          >
            <div className="stepContainer">
              <div className="stepNumber">{index + 1}</div>
              <span className="stepLabel">{step}</span>
            </div>
          </div>
        ))}
      </div>

      {cartItems.length === 0 ? (
        <p>購物車為空。</p>

      ) : (
        <Row>
          {/* 表格區域 (小螢幕佔 12 格，大螢幕佔 8 格) */}
          <Col xs={12} md={8}>
            <Table responsive className="cart-table">
              <thead>
                <tr style={{ borderBottom: "1px solid #ddd" }}>
                  <th className="text-center">商品圖</th>
                  <th className="text-center" style={{ width: "50%" }}>品名</th>
                  <th className="text-center">數量</th>
                  <th className="text-center">單價</th>
                  <th className="text-center">小計</th>
                  <th className="text-center"></th>
                </tr>
              </thead>
              <tbody className="text-center">
                {/* {myCartItems.map((item) => ( */}
                {cartItems.map((item) => (
                  <CartItem
                    key={item.cart_id}
                    item={item}
                    onRemove={handleRemoveItem}
                    onIncrease={handleIncrease}
                    onDecrease={handleDecrease}
                    onUpdateQuantity={handleUpdateQuantity}
                  />
                ))}
              </tbody>
            </Table>
          </Col>

          {/* 總計框區域 (小螢幕佔 12 格，大螢幕佔 4 格) */}
          <Col xs={12} md={4}>
            <div className="total-box">
              <Card style={{ height: "100%" }}>
                <Card.Body className="d-flex flex-column align-items-start">
                  <h5 className="mb-3">購物車總計</h5>
                  <div className="d-flex justify-content-between w-100 mb-3">
                    <span>總金額</span>
                    <span>${calculateTotal().toLocaleString()}</span>
                  </div>
                  <Button
                    variant="dark"
                    className="w-100"
                    onClick={handlePayment}
                  >
                    去結帳
                  </Button>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
}
