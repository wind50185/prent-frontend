"use client";

import Link from "next/link";
import Button from "@/app/_components/button";

function LeftList({ selectedCategory, onCategorySelect }) {
    const handleCategoryClick = (category) => {
        // 當選擇某個分類時，通知父組件
        
        onCategorySelect(category);
    };

    return (
        <>
        <div className="row left_list_lg">
            <div className="col-lg-12 col-8">
                <ul className="nav flex-lg-column flex-row">
                    <li className="nav-item d-flex align-items-center">
                        <i className="bi bi-three-dots text-primary"></i>
                        <Link className="nav-link" aria-current="page" href="/discuss" onClick={() => handleCategoryClick(0)}>看全部</Link>
                    </li>
                    <li className="nav-item d-flex align-items-center">
                        <i className="bi bi-house text-primary"></i>
                        <Link className="nav-link" aria-current="page" href="/discuss" onClick={() => handleCategoryClick(1)}>租屋</Link>
                    </li>
                    <li className="nav-item d-flex align-items-center">
                        <i className="bi bi-shop text-primary"></i>
                        <Link className="nav-link" aria-current="page" href="/discuss" onClick={() => handleCategoryClick(2)}>商城</Link>
                    </li>
                    <li className="nav-item d-flex align-items-center">
                        <i className="bi bi-wrench text-primary"></i>
                        <Link className="nav-link" aria-current="page" href="/discuss" onClick={() => handleCategoryClick(3)}>服務</Link>
                    </li>
                </ul>
            </div>
            <div className="col-4 d-flex justify-content-end d-flex d-lg-none">
                <Link href="../discuss/post">
                    <Button 
                        className="discuss_post_btn"
                        text="我要發文"
                    />
                </Link>
            </div>
        </div>
        </>
    );
}

export default LeftList;