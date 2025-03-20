"use client"; // 確保這個元件在 Client Side 運行

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import PrentIcon from "./Prent_icon";
import { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import Image from "next/image";
import { Modal } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/cart-context";
import { FaArrowRight } from "react-icons/fa";

const navItems = [
  { href: "/rent", title: "租屋", icon: <i className="bi bi-house"></i> },
  { href: "/store", title: "商城", icon: <i className="bi bi-shop"></i> },
  { href: "/service", title: "服務", icon: <i className="bi bi-box-seam"></i> },
  {
    href: "/discuss",
    title: "討論",
    icon: <i className="bi bi-chat-left-text"></i>,
  },
];

const selectedStyle = {
  color: "#EC8692",
  fontWeight: 500,
  boxShadow: "0 4px 0 0 #EC8692",
};
const defaultStyle = { color: "#EC9466" };
const hoverStyle = {
  color: "#EC8692",
  fontWeight: 500,
  boxShadow: "0 4px 0 0 #EC8692",
};

function Navbar() {
  const pathname = usePathname();
  const { auth, logout } = useAuth();
  const { cartItems, setCartItems } = useCart();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const [showCart, setShowCart] = useState(false);
  const [iconSize, setIconSize] = useState({ width: 170, height: 51 });

  // 獲取購物車內容
  const fetchCartItems = async () => {
    if (!auth.token) return;
    try {
      const response = await fetch("/store", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) throw new Error("載入購物車失敗");

      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // console.log(cartItems);
    if (showCart && cartItems.length === 0) {
      fetchCartItems();
    }
  }, [cartItems, showCart]);

  useEffect(() => {
    const updateSize = () => {
      setIconSize(
        window.innerWidth < 992
          ? { width: 120, height: 51 }
          : { width: 170, height: 51 }
      );
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleAccountClick = () => {
    setShowModal(true);
    setIsOpen(false);
    setTimeout(() => {
      setShowModal(false);
      router.push("/members");
    }, 500);
  };

  return (
    <nav className="nav_dec navbar navbar-expand-lg fixed-top">
      <div className="container-fluid">
        <div style={{ width: 170 }}>
          <Link className="navbar-brand" href="/">
            <PrentIcon width={iconSize.width} height={iconSize.height} />
          </Link>
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div
          className="collapse navbar-collapse nav-font"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 d-flex justify-content-center">
            {navItems.map((item, index) => (
              <li className="nav-item ms-4 me-4" key={item.href}>
                <Link
                  className="nav-link d-flex flex-column align-items-center"
                  href={item.href}
                  style={
                    hoveredIndex === index
                      ? hoverStyle
                      : pathname.includes(item.href)
                      ? selectedStyle
                      : defaultStyle
                  }
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {item.icon}
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="navbar-nav mb-2 mb-lg-0 d-flex justify-content-center">
            <li
              className="nav-item ms-1 me-1 position-relative"
              onMouseEnter={() => setShowCart(true)}
              onMouseLeave={() => setShowCart(false)}
            >
              <Link
                className="nav-link d-flex flex-column align-items-center"
                href="#"
                style={
                  hoveredIndex === navItems.length ? hoverStyle : defaultStyle
                }
              >
                <i className="bi bi-cart"></i>
                <span>購物車</span>
              </Link>

              {showCart && (
                <div
                  className="cart-dropdown position-absolute bg-white p-3 shadow rounded"
                  style={{
                    top: "100%",
                    right: 0,
                    minWidth: "400px",
                    zIndex: 1000,
                    border: "1px solid #ddd",
                  }}
                >
                  {auth.token ? (
                    <>
                      <p className="fw-200">已加入的商品</p>
                      {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                          <div
                            key={item.product_id}
                            className="d-flex justify-content-between border-bottom py-2"
                          >
                            <span>
                              {item.product_name} x {item.amount}
                            </span>
                            <span>${item.product_price * item.amount}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center">
                          <p className="text-muted">購物車沒有商品</p>
                          <button
                            className="gotoshop"
                            onClick={() => {
                              setShowCart(false);
                              router.push("/store");
                            }}
                          >
                            去逛逛<FaArrowRight />
                          </button>
                        </div>
                      )}
                      {cartItems.length > 0 && (
                        <Link
                          href="/store/cart"
                          className="seecart-button"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowCart(false);
                            router.push("/store/cart");
                          }}
                        >
                          查看購物車
                        </Link>
                      )}
                    </>
                  ) : (
                    <p className="text-center text-dark fw-bold">請先登入</p>
                  )}
                </div>
              )}
            </li>
          </ul>
          <ul className="navbar-nav mb-2 mb-lg-0 me-2">
            {auth.token ? (
              <li className="nav-item">
                <a
                  className="nav-link py-0"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(!isOpen);
                  }}
                >
                  <Image
                    src={`http://localhost:3002/${auth.img}`}
                    alt="縮圖"
                    width={54}
                    height={54}
                    style={{ borderRadius: "50%" }}
                  />
                </a>
                {isOpen && (
                  <ul
                    className="dropdown-menu show"
                    aria-labelledby="navbarDropdown"
                    style={{ right: "10px", top: "100%", minWidth: "5%" }}
                  >
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={handleAccountClick}
                      >
                        我的帳號
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="/members/login"
                        onClick={logout}
                      >
                        登出
                      </a>
                    </li>
                  </ul>
                )}
              </li>
            ) : (
              <li className="nav-item ms-1 me-1">
                <Link
                  className="nav-link d-flex flex-column align-items-center"
                  href="/members/login"
                  style={
                    pathname === "/members/login" ? selectedStyle : defaultStyle
                  }
                >
                  <i className="bi bi-person"></i>
                  <span style={{ color: "#EC9466" }}>登入</span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;