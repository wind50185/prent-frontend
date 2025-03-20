"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./auth-context";

// context套用第1步: 建⽴與導出它
const CartContext = createContext(null);
CartContext.displayName = "CartContext";

export function CartProvider({ children }) {
  //購物車項目
  const [cartItems, setCartItems] = useState([]);
  const { auth, getAuthHeader } = useAuth();

  // 數量增加
  const onIncrease = (cart_id) => {
    const nextItems = cartItems.map((v) => {
      if (v.cart_id === cart_id) {
        return { ...v, count: v.count + 1 };
      } else {
        return v;
      }
    });
    setCartItems(nextItems);
  };

  // 數量減少
  const onDecrease = (cart_id) => {
    const nextItems = cartItems.map((v) => {
      if (v.cart_id === cart_id) {
        return { ...v, count: v.count - 1 };
      } else {
        return v;
      }
    });
    setCartItems(nextItems);
  };

  // 數量0即刪除
  const onRemove = (cart_id) => {
    const nextItems = cartItems.filter((v) => {
      return v.cart_id !== cart_id;
    });
    setCartItems(nextItems);
  };

  // 從商品清單將商品加入購物車，並送到後端
  const onAdd = async (product) => {
    const foundIndex = cartItems.findIndex((v) => v.cart_id === product.cart_id);

    if (foundIndex !== -1) {
      onIncrease(product.cart_id);
    } else {
      const newItem = { ...product, count: 1 };
      const nextItems = [newItem, ...cartItems];
      setCartItems(nextItems);

      // 將商品資料發送到後端 API
      try {
        const response = await fetch(`/store`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            memberId: auth.id,
            productId: product.product_id,
            amount: 1,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "加入購物車失敗");
        }
        // console.log("商品成功加入購物車:", data);

        // 如果更新後端成功，直接更新 localStorage 和 Context
        setCartItems((prevItems) => {
          // 將新增的商品加入購物車
          const updatedItems = [...prevItems, { ...product, count: 1 }];
          localStorage.setItem("cart", JSON.stringify(updatedItems));
          return updatedItems;
        });
      } catch (err) {
        console.error("加入購物車錯誤:", err);
      }
    }
  };

  // 計算總和
  const totalQty = cartItems.reduce((acc, v) => acc + v.count, 0);
  const totalAmount = cartItems.reduce((acc, v) => acc + v.count * v.price, 0);

  // 初次渲染完成後，從後端取出購物車資料
  useEffect(() => {
    if (!auth?.token) return;

    fetch(`http://localhost:3002/store/cart`, {
      headers: {
        ...getAuthHeader(),
      },
    })
      .then((r) => r.json())
      .then((obj) => {
        if (obj?.cartItems) {
          setCartItems(obj.cartItems);
        }
      })
      .catch(console.warn);

    /*
    const savedCart = localStorage.getItem("cart");
    setItems(savedCart ? JSON.parse(savedCart) : []);
    */
  }, [auth, getAuthHeader]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // 提供value屬性傳出到所有的後代元件能獲取
  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        onIncrease,
        onDecrease,
        onRemove,
        onAdd,
        totalQty,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
