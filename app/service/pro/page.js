"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SERVICE_PRO_LIST } from "@/config/api-path";
import { API_SERVER } from "@/config/api-path";

// ----- 專家列表卡片 -----
import ServiceProCard from "../_components/service_pro_card";
// ----- to top btn -----
import Totop from "@/app/_components/totop";

// ----- 分頁＆麵包屑元件 -----
import PaginationComponent from "../_components/pagination";
import Breadcrumb from "react-bootstrap/Breadcrumb";

// ----- 搜尋和排序 -----
import FilterDropdown from "./_components/FilterDropdown";
import RangeDropdown from "./_components/RangeDropdown";
import SortDropdown from "./_components/SortDropdown";
import SearchBar from "./_components/SearchBar";

// ----- 關鍵字搜尋防止太頻繁的 fetch -----
import debounce from "lodash.debounce";

// ----- icon -----
// import { FaRegStar } from "react-icons/fa6";
import { FaStar } from "react-icons/fa6";
import { MdClose } from "react-icons/md";

// ----- 主功能 start -----
export default function ProPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [listData, setListData] = useState({
    perPage: 0,
    page: 0,
    totalPages: 0,
    totalRows: 0,
    rows: [],
  });

  // 搜尋 & 篩選 & 排序 state
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [minRating, setMinRating] = useState(1);
  const [maxRating, setMaxRating] = useState(5);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState([]);
  const [sortBy, setSortBy] = useState("default");

  // 取得目前分頁
  const page = Number(searchParams.get("page")) || 1;
  // 更新 URL 查詢字串的 helper
  const updateQuery = (newParams) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        params.delete(key);
        value.forEach((v) => {
          params.append(key, v);
        });
      } else {
        params.set(key, value);
      }
    });
    router.push(`?${params.toString()}`);
  };

  // 組合所有篩選條件，呼叫後端 API 取得資料
  const fetchData = async () => {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      if (searchTerm) params.append("keyword", searchTerm);

      // 價格區間
      params.append("minPrice", minPrice);
      params.append("maxPrice", maxPrice);

      // 評分區間
      params.append("minRating", minRating);
      params.append("maxRating", maxRating);

      // 服務類型，若有多個選項則各自加入
      if (selectedServiceTypes.length > 0) {
        selectedServiceTypes.forEach((type) => {
          params.append("category", type);
        });
      }
      // 排序方式（預設不加入）
      if (sortBy && sortBy !== "default") {
        params.append("sortBy", sortBy);
      }
      const url = `${SERVICE_PRO_LIST}?${params.toString()}`;
      const res = await fetch(url);
      const data = await res.json();

      // 若搜尋結果不足一頁但目前 page 大於 1，則自動導回第一頁
      if (data.totalRows < data.perPage && page > 1) {
        updateQuery({ page: "1" });
        setListData(data);
      } else {
        setListData(data);
      }
    } catch (error) {
      console.warn(error);
    }
  };

  // 當搜尋或篩選參數改變時 debounce 後重新呼叫 fetchData
  useEffect(() => {
    const debouncedFetch = debounce(() => {
      fetchData();
    }, 300);
    debouncedFetch();
    return () => debouncedFetch.cancel();
  }, [
    searchTerm,
    page,
    minPrice,
    maxPrice,
    minRating,
    maxRating,
    selectedServiceTypes,
    sortBy,
  ]);

  // 元件初次載入時，從 URL 解析參數並初始化 state
  useEffect(() => {
    const keyword = searchParams.get("keyword") || "";
    setSearchTerm(keyword);

    const qMinPrice = searchParams.get("minPrice") || 0;
    const qMaxPrice = searchParams.get("maxPrice") || 5000;
    setMinPrice(Number(qMinPrice));
    setMaxPrice(Number(qMaxPrice));

    const qMinRating = searchParams.get("minRating") || 1;
    const qMaxRating = searchParams.get("maxRating") || 5;
    setMinRating(Number(qMinRating));
    setMaxRating(Number(qMaxRating));

    const qServiceTypes = searchParams.getAll("category");
    setSelectedServiceTypes(qServiceTypes.length > 0 ? qServiceTypes : []);

    const qSortBy = searchParams.get("sortBy") || "default";
    setSortBy(qSortBy);

    fetchData();
  }, [searchParams]);

  // 處理搜尋關鍵字改變時，同步更新 URL 與 state
  const handleSearchChange = (e) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);
    updateQuery({ page: "1", keyword: newTerm });
  };

  // 處理價格區間改變
  const handlePriceChange = (newMin, newMax) => {
    setMinPrice(newMin);
    setMaxPrice(newMax);
    updateQuery({ page: "1", minPrice: newMin, maxPrice: newMax });
  };

  // 處理評分區間改變
  const handleRatingChange = (newMin, newMax) => {
    setMinRating(newMin);
    setMaxRating(newMax);
    updateQuery({ page: "1", minRating: newMin, maxRating: newMax });
  };

  // 處理服務類型的變動（多選）
  const handleServiceTypeChange = (selected) => {
    setSelectedServiceTypes(selected);
    updateQuery({ page: "1", category: selected });
  };

  // 處理排序方式變更
  const handleSortChange = (selectedSort) => {
    setSortBy(selectedSort);
    updateQuery({ page: "1", sortBy: selectedSort });
  };

  // 服務類型的名稱對照
  const serviceTypeMapping = {
    1: "搬家/清運",
    2: "清潔/消毒",
    3: "水電/修繕",
  };

  return (
    <>
      {/* <pre>{JSON.stringify(listData, null, 4)}</pre> */}
      <Totop />
      <div className="container">
        <Breadcrumb className="service_breadcrumb mt-3">
          <Breadcrumb.Item href="/">首頁</Breadcrumb.Item>
          <Breadcrumb.Item href="/service">服務</Breadcrumb.Item>
          <Breadcrumb.Item active>專家列表</Breadcrumb.Item>
        </Breadcrumb>

        {/* // TODO: 手機版RWD */}
        <div className="mb-2 service_sort">
          <div className="gap-2 mb-2 service_sort_left">
            <RangeDropdown
              title="價格區間"
              min={0}
              max={5000}
              unit="元"
              step={100}
              onChange={handlePriceChange}
              value={[minPrice, maxPrice]}
            />
            <RangeDropdown
              title="評分區間"
              min={1}
              max={5}
              unit=<FaStar />
              step={1}
              onChange={handleRatingChange}
              value={[minRating, maxRating]}
            />

            <FilterDropdown
              title="服務類型"
              name="service_type"
              options={[
                { label: "搬家/清運", value: 1 },
                { label: "清潔/消毒", value: 2 },
                { label: "水電/修繕", value: 3 },
              ]}
              type="checkbox"
              onChange={handleServiceTypeChange}
              selectedValues={selectedServiceTypes}
            />
          </div>
          <div className="d-flex align-items-center gap-2">
            <SearchBar value={searchTerm} onChange={handleSearchChange} />
            <SortDropdown
              title="排序方式"
              options={[
                { label: "預設排序", value: "default" },
                { label: "價格由低到高", value: "price_asc" },
                { label: "價格由高到低", value: "price_desc" },
                { label: "評分由低到高", value: "rating_asc" },
                { label: "評分由高到低", value: "rating_desc" },
              ]}
              onChange={handleSortChange}
              selectedValue={sortBy}
            />
          </div>
        </div>
        {/* 顯示目前選擇的篩選條件 */}
        <div className="d-flex gap-2 mb-3 flex-wrap">
          {selectedServiceTypes.length > 0 && (
            <span className="filter-pill">
              服務類型：
              {selectedServiceTypes
                .map((type) => serviceTypeMapping[type] || type)
                .join(", ")}
              <MdClose
                onClick={() => {
                  setSelectedServiceTypes([]);
                  updateQuery({ page: "1", category: [] });
                }}
                className="filter-close-icon"
              />
            </span>
          )}
          {(minPrice !== 0 || maxPrice !== 5000) && (
            <span className="filter-pill">
              價格：{minPrice} - {maxPrice} 元
              <MdClose
                onClick={() => {
                  setMinPrice(0);
                  setMaxPrice(5000);
                  updateQuery({ page: "1", minPrice: 0, maxPrice: 5000 });
                }}
                className="filter-close-icon"
              />
            </span>
          )}
          {(minRating !== 1 || maxRating !== 5) && (
            <span className="filter-pill">
              評分：{minRating} - {maxRating} 星
              <MdClose
                onClick={() => {
                  setMinRating(1);
                  setMaxRating(5);
                  updateQuery({ page: "1", minRating: 1, maxRating: 5 });
                }}
                className="filter-close-icon"
              />
            </span>
          )}
          {(selectedServiceTypes.length > 0 ||
            minPrice !== 0 ||
            maxPrice !== 5000 ||
            minRating !== 1 ||
            maxRating !== 5) && (
            <button
              onClick={() => {
                // 重置所有篩選狀態
                setSearchTerm("");
                setMinPrice(0);
                setMaxPrice(5000);
                setMinRating(1);
                setMaxRating(5);
                setSelectedServiceTypes([]);
                setSortBy("default");
                updateQuery({
                  page: "1",
                  keyword: "",
                  minPrice: 0,
                  maxPrice: 5000,
                  minRating: 1,
                  maxRating: 5,
                  category: [],
                  sortBy: "default",
                });
              }}
              className="btn btn-light"
            >
              清除篩選
            </button>
          )}
        </div>
        <div className="row">
          <p className="service_search_result_text">
            共 {listData.totalRows} 筆結果・第 {listData.page} 頁 / 共{" "}
            {listData.totalPages} 頁
          </p>
        </div>
        {/* 檢查 listData.rows 是否為有效陣列 */}
        {Array.isArray(listData.rows) && listData.rows.length > 0 ? (
          listData.rows.map((v, i) => {
            // 從 rows2 過濾出對應該會員的所有服務
            const memberServices = listData.rows2.filter(
              (service) => service.member_id === v.member_id
            );

            // 將服務依照選擇的服務類型過濾 (若有)
            let filteredServices = memberServices;
            if (selectedServiceTypes.length > 0) {
              filteredServices = filteredServices.filter(
                (service) =>
                  selectedServiceTypes.includes(
                    String(service.service_category_id)
                  ) ||
                  selectedServiceTypes.includes(service.service_category_id)
              );
            }
            // 再根據價格區間過濾服務
            const priceFilteredServices = filteredServices.filter(
              (service) =>
                service.service_price_main >= minPrice &&
                service.service_price_main <= maxPrice
            );

            // 若沒有符合的服務就不顯示該會員（或可設定預設值）
            if (priceFilteredServices.length === 0) return null;

            // 取得符合價格區間中最低的價格
            const minServicePrice = Math.min(
              ...priceFilteredServices.map(
                (service) => service.service_price_main
              )
            );

            // 顯示所有服務類型的 icon，可根據需求改成只顯示符合條件的服務類型
            const hasCategory1 = memberServices.some(
              (service) => service.service_category_id === 1
            );
            const hasCategory2 = memberServices.some(
              (service) => service.service_category_id === 2
            );
            const hasCategory3 = memberServices.some(
              (service) => service.service_category_id === 3
            );

            return (
              <Link
                key={i}
                href={`/service/pro/${v.member_id}`}
                className="service_pro_link"
              >
                <ServiceProCard
                  src={`${API_SERVER}/${v.pro_banner_url}`}
                  pro_name={v.pro_name}
                  pro_intro={v.pro_intro}
                  pro_star={v.pro_star}
                  hasCategory1={hasCategory1}
                  hasCategory2={hasCategory2}
                  hasCategory3={hasCategory3}
                  price={minServicePrice}
                />
              </Link>
            );
          })
        ) : (
          <p>目前沒有符合條件的專家，請檢查並重新輸入搜尋關鍵字。</p>
        )}

        <PaginationComponent
          currentPage={page}
          totalPages={listData.totalPages}
        />
      </div>
    </>
  );
}
