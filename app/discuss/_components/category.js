"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import SearchBar from "@/app/rent/_components/SearchBar";
import Button from "@/app/_components/button";

function Category( {searchTerm, onChange, selectedCategory} ) {
    const router = useRouter();
    const pathname = usePathname(); 
    const showSearch = pathname === "/discuss";
    const showArrow = pathname !== "/discuss";

    const categoryDetails = {
        0: {
            text: "看全部",
            icon: "bi-three-dots",
        },
        1: {
            text: "租屋",
            icon: "bi-house-door",
        },
        2: {
            text: "商城",
            icon: "bi-shop",
        },
        3: {
            text: "服務",
            icon: "bi-wrench",
        }
    };

    const currentCategory = categoryDetails[selectedCategory] || categoryDetails[0];

    // 返回上頁
    const handleCancelClick = () => {
        router.back();
    };

    return (
        <>
            <div className="row border-bottom discuss_cate">
                <div className="col-lg-4 col-12">
                {showArrow && (
                    <button onClick={handleCancelClick} className="article_icon">
                        <i className="bi bi-arrow-left me-4"></i>
                    </button>
                )}
                {showSearch && (
                    <>
                    <i className={`bi ${currentCategory.icon} me-4`}></i>
                    <span className="article_icon">{currentCategory.text}</span>
                    </>
                )}
                </div>
                <div className="col-6 d-flex justify-content-end d-none d-lg-flex">
                    {showSearch && (
                        <SearchBar value={searchTerm} onChange={onChange}/>
                    )}
                </div>
                <div className="col-2 d-flex justify-content-end d-none d-lg-flex">
                    <Link href="/discuss/post">
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

export default Category;