"use client";
import Category from "./category";
import Img from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from 'react';
import PaginationComponent from "../_components/pagination";
import debounce from "lodash.debounce";
import { Modal } from "react-bootstrap";

function DiscussList({selectedCategory}) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const showclass = pathname.startsWith("/members/collect");
    const [showErrorModal, setShowErrorModal] = useState(false);

    const [listData, setListData] = useState({
        perPage: 0,
        page: 0,
        totalPages: 0,
        totalRows: 0,
        replytotal: [],
        rows: [],
    })

    const [searchTerm, setSearchTerm] = useState("");
    const page = Number(searchParams.get("page")) || 1;

    const fetchData = async (keyword, pageNum, selectedCategory) => {
        const token = localStorage.getItem("ptoken");
        let url = `http://localhost:3002/discuss?page=${pageNum}`;

        if (keyword) {
            url += `&keyword=${keyword}`;
        }

        if (selectedCategory) {
            url += `&category=${selectedCategory}`;
        }

        // console.log(url);
    
        const res = await fetch(url,
            {
                method:"GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        const data = await res.json();

        // console.log("API 回傳的資料:", data)
    
        // 如果資料小於每頁數量且當前頁大於1，則將頁面重設為第1頁
        if (data.totalRows < data.perPage && pageNum > 1) {
            router.push(
                `?page=1${keyword ? `&keyword=${keyword}` : ""}`,
                undefined,
                { shallow: true }
            );
            setListData(data);
        } else {
            setListData(data);
        }
    };

    // 搜尋 & 分頁
    useEffect(() => {
        const debouncedFetch = debounce(() => {
            fetchData(searchTerm, page);
        }, 300);
    
        debouncedFetch();
    
        return () => debouncedFetch.cancel();
    }, [searchTerm, page]);

    // 一進入頁面時取得資料
    useEffect(() => {
        const keyword = searchParams.get("keyword") || "";
        const category = searchParams.get("category") || selectedCategory;
        fetchData(category, keyword, page);
    }, [selectedCategory, page, searchParams]); 

    // 當搜尋關鍵字變更時更新 URL
    const handleSearchChange = (e) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
    
        if (newSearchTerm === "") {
            router.push(`?page=${page}&category=${selectedCategory}`, undefined, { shallow: true });
        } else {
            router.push(`?page=${page}&category=${selectedCategory}&keyword=${newSearchTerm}`, undefined, {
                shallow: true,
            });
        }
    };

    useEffect(() => {
        fetchData(selectedCategory, page);
    }, [selectedCategory, page]);

    // 收藏
    const handleCollectToggle = async (articleID) => {
        const token = localStorage.getItem("ptoken");
    
        if (!token) {
            setShowErrorModal(true);
            return;
        }
    
        const articleIndex = listData.rows.findIndex((item) => item.dis_id === articleID);
        if (articleIndex === -1) return;
    
        const currentStatus = listData.rows[articleIndex].is_collected;
        const method = currentStatus ? "DELETE" : "POST";
    
        try {
            const response = await fetch("http://localhost:3002/discuss/collect", {
                method: method,
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ dis_id: articleID }),
            });
    
            if (!response.ok) {
                setShowErrorModal(true);
            }
    
            const result = await response.json();
            if (!result.success) {
                setShowErrorModal(true);
            }
    
            setListData((prev) => {
                const newRows = [...prev.rows];
                newRows[articleIndex] = {
                    ...newRows[articleIndex],
                    is_collected: !currentStatus,
                };
                return { ...prev, rows: newRows };
            });
    
        } catch (error) {
            console.error("收藏錯誤:", error);
            alert(error.message);
        }
    };

    const handleCategoryChange = (newCategory) => {
        router.push(`?page=1&category=${newCategory}`, undefined, { shallow: true });
    };

    return (
        <>
        <div className="mb-2">
            <Category value={searchTerm} onChange={handleSearchChange} selectedCategory={selectedCategory}/>
            <div className="row">
            {Array.isArray(listData.rows) && listData.rows.map((discuss, index) => (
                <Link key={index} href={`/discuss/article/${discuss.dis_id}`} className="discuss_list_lick">
                    <div className="discuss_list pt-2 pb-2 row border-bottom">
                        <div className="col-10 d-flex flex-column justify-content-between">
                        <div className="d-flex ms-2">
                            {showclass && (
                                <div className="d-flex justify-content-center align-items-center me-3 discuss_list_title discuss_list_title_icon">
                                    <i className="bi bi-house"></i>
                                </div>
                            )}
                            <div className="discuss_list_title">{discuss.dis_title}</div>
                        </div>
                            <p className="discuss_list_content">{discuss.dis_content}</p>
                            <div className="discuss_goodbadcollect d-flex justify-content-between ps-2 pe-2">
                                <div className="discuss_goodbad d-flex justify-content-between">
                                <div>
                                    <i className={`bi bi-hand-thumbs-up${discuss.user_reaction === 1 ? "-fill text-primary" : ""}`}></i>
                                    <span>{discuss.dis_like}</span>
                                </div>
                                <div>
                                    <i className={`bi bi-hand-thumbs-down${discuss.user_reaction === 0 ? "-fill text-primary" : ""}`}></i>
                                    <span>{discuss.dis_dislike}</span>
                                </div>
                                    <div>
                                        <i className="bi bi-chat-left-dots"></i>
                                        <span>{discuss.reply_count}</span>
                                    </div>
                                </div>
                                <button 
                                    className="heart-button list_collect_icon"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleCollectToggle(discuss.dis_id);
                                    }}
                                >
                                    <i className={`bi ${discuss?.is_collected ? "bi-heart-fill active" : "bi-heart"}`}></i>
                                </button>
                            </div>
                        </div>
                        <div className="col-2" style={{ height: "122.66px" }}>
                            <Img
                                src={discuss.dis_pic ? `http://localhost:3002/${discuss.dis_pic}` : 'http://localhost:3000/discuss_images/default_gray.jpg'}
                                className="w-100 h-100"
                                alt="文章圖片"
                                height={200}
                                width={200}
                            />
                        </div>
                    </div>
                </Link>
            ))}
            </div>
            <div className="row mt-3 fixed_bottom">
                <PaginationComponent
                    currentPage={page}
                    totalPages={listData.totalPages}
                />
            </div>
            <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
                <Modal.Body className="text-center p-4">
                    請先登入
                </Modal.Body>
            </Modal>
        </div>
        </>
    );
}

export default DiscussList;