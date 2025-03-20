"use client";
import RentCardList from "@/app/rent/_components/RentCardList"
import StoreListCard from "@/app/store/_components/store_list_card";
import ServiceBookingCard from "@/app/service/_components/service_booking_card";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from 'react';
import Img from "next/image";
import PaginationComponent from "@/app/service/_components/pagination";
import Link from "next/link";
import debounce from "lodash.debounce";

function RightList() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const showclass = pathname.startsWith("/members/collect");
    const [selectedTab, setSelectedTab] = useState("discuss");
    

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

    const fetchCollect = async (pageNum) => {
        const token = localStorage.getItem("ptoken");
        let url = `http://localhost:3002/members/collect?page=${pageNum}`;

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
        if (data?.totalRows < data?.perPage && pageNum > 1) {
            router.push(`?page=1`, undefined, { shallow: true });
            setListData(data);
        } else {
            setListData(data);
        }
    };

    useEffect(() => {
        const debouncedFetch = debounce(() => {
                fetchCollect(page);
        }, 300);
        
        debouncedFetch();
        
        return () => debouncedFetch.cancel();
    }, [searchTerm, page]);

    useEffect(() => {
        fetchCollect(page);
    }, [searchParams]);

    //顯示不同分類圖標
    const getIconClass = (disClass) => {
        switch (disClass) {
            case 1:
                return "bi bi-house";
            case 2:
                return "bi bi-shop";
            case 3:
                return "bi bi-wrench";
        }
    };

    // 收藏
    const handleCollectToggle = async (articleID) => {
        const token = localStorage.getItem("ptoken");
    
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
    
            if (!response.ok) throw new Error("收藏操作失敗，請稍後再試");
    
            const result = await response.json();
            if (!result.success) throw new Error(result.message || "收藏操作失敗");
    
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


    return (
        <>
            <ul className="nav nav-pills mb-3 px-5 d-flex justify-content-between" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="pills-rent-tab" data-bs-toggle="pill" data-bs-target="#pills-rent" type="button" role="tab" aria-controls="pills-home" aria-selected="false">租屋</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="pills-store-tab" data-bs-toggle="pill" data-bs-target="#pills-store" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">商城</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="pills-service-tab" data-bs-toggle="pill" data-bs-target="#pills-service" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">服務</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className={`nav-link ${selectedTab === 'discuss' ? 'active' : ''}`} id="pills-discuss-tab" data-bs-toggle="pill" data-bs-target="#pills-discuss" type="button" role="tab" aria-controls="pills-contact" aria-selected={selectedTab === 'discuss'} onClick={() => setSelectedTab('discuss')}>討論區</button>
                </li>
            </ul>
            <div className="tab-content" id="pills-tabContent">
                {/* <div className="tab-pane fade active show" id="pills-rent" role="tabpanel" aria-labelledby="pills-profile-tab">
                    <div className="row">
                        <RentCardList md={3}/>
                    </div>
                </div> */}
                <div className="tab-pane fade" id="pills-store" role="tabpanel" aria-labelledby="pills-profile-tab">
                    <div className="row mt-2">
                        {/* {store.map((item) => (
                            <div key={item.id} className="col-md-3">
                                <StoreListCard src={item.src} />
                            </div>
                        ))} */}
                    </div>
                </div>
                <div className="tab-pane fade" id="pills-service" role="tabpanel" aria-labelledby="pills-profile-tab">
                    <div className="row">
                        {/* {services.map((item) => (
                            <div key={item.id} className="mb-1">
                                <ServiceBookingCard/>
                            </div>
                        ))} */}
                    </div>
                </div>
                <div className={`tab-pane fade content-wrapper ${selectedTab === 'discuss' ? 'active show' : ''}`} id="pills-discuss" role="tabpanel" aria-labelledby="pills-profile-tab">
                    <div className="row">
                    {Array.isArray(listData.rows) && listData.rows.map((discuss, index) => (
                        <Link key={index} href={`/discuss/article/${discuss.dis_id}`} className="discuss_list_lick">
                            <div className="discuss_list pt-2 pb-2 row border-bottom">
                                <div className="col-10 d-flex flex-column justify-content-between">
                                <div className="d-flex ms-2">
                                    {showclass && (
                                        <div className="d-flex justify-content-center align-items-center me-3 discuss_list_title discuss_list_title_icon">
                                            <i className={`bi ${getIconClass(discuss.dis_class)}`}></i>
                                        </div>
                                    )}
                                    <div className="discuss_list_title">{discuss.dis_title}</div>
                                </div>
                                    <p className="discuss_list_content">{discuss.dis_content}</p>
                                    <div className="discuss_goodbadcollect d-flex justify-content-between ps-2 pe-2">
                                        <div className="discuss_goodbad d-flex justify-content-between">
                                            <div>
                                                <i className="bi bi-hand-thumbs-up"></i>
                                                <span>{discuss.dis_like}</span>
                                            </div>
                                            <div>
                                                <i className="bi bi-hand-thumbs-down"></i>
                                                <span>{discuss.dis_dislike}</span>
                                            </div>
                                            <div>
                                                <i className="bi bi-chat-left-dots"></i>
                                                <span>{discuss.reply_count}</span>
                                            </div>
                                        </div>
                                        <button 
                                            className={`bi list_collect_icon ${discuss?.is_collected ? "bi-heart-fill" : "bi-heart"}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleCollectToggle(discuss.dis_id);
                                            }}
                                        />
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
                </div>
                <div className="row mt-3 fixed_bottom">
                    <PaginationComponent
                    currentPage={page}
                    totalPages={listData.totalPages}
                    />
                </div>
            </div>
        </>
    );
}

export default RightList;