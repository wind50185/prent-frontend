"use client";

import Link from "next/link";
// import PIcon from "./PIcon_list";

function LeftList() {

    return (
        <ul className="nav flex-column left_list_fixed">
            <li className="nav-item d-flex align-items-center">
                <i className="bi bi-person-fill text-primary"></i>
                <Link className="nav-link" aria-current="page" href="/members">基本資料</Link>
            </li>
            <li className="nav-item d-flex align-items-center">
                <i className="bi bi-pencil-fill text-primary"></i>
                <Link className="nav-link" aria-current="page" href="/members/edit">編輯資料</Link>
            </li>
            <li className="nav-item d-flex align-items-center">
                <i className="bi bi-calendar-check text-primary"></i>
                <Link className="nav-link" aria-current="page" href="/service/my_booking">我的預約</Link>
            </li>
            <li className="nav-item d-flex align-items-center">
                <i className="bi bi-heart-fill text-primary"></i>
                <Link className="nav-link" aria-current="page" href="/members/collect">我的收藏</Link>
            </li>
            <li className="nav-item d-flex align-items-center">
                <i className="bi bi-cart-fill text-primary"></i>
                <Link className="nav-link" aria-current="page" href="/store/cart">我的商品</Link>
            </li>
            <li className="nav-item d-flex align-items-center">
                <i className="bi bi-list-task text-primary"></i>
                <Link className="nav-link" aria-current="page" href="/store/checkout/order">我的訂單</Link>
            </li>
        </ul>
    );
}

export default LeftList;