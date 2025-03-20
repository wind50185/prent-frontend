"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import FilterDropdown from "../_components/filter_dropdown";
import SearchBar from "../_components/search_bar";
import SortDropdown from "../_components/sort_dropdown";
import StoreListCard from "../_components/store_list_card";
import Pagination from "../_components/pagination";
import Link from "next/link";
import { MdClose } from "react-icons/md";

export default function StoreListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: null,
    color: null,
  });
    const [totalPages, setTotalPages] = useState(0); // 總頁數
    const [currentPage, setCurrentPage] = useState(1); // 當前頁碼
  

  // 讀取 URL 中的查詢參數
  const page = Number(searchParams.get("page")) || 1;
  const keyword = searchParams.get("search") || "";
  // 根據篩選條件向後端請求商品資料
  const fetchProducts = async (keyword, pageNum) => {
    const queryParams = new URLSearchParams();

    if (category) queryParams.append("category", category);
    if (color) queryParams.append("color", color);
    if (sortOrder) queryParams.append("sortOrder", sortOrder);
    if (keyword) queryParams.append("search", keyword);
    queryParams.append("page", pageNum);

    try {
      const res = await fetch(
        `http://localhost:3002/store/list?${queryParams.toString()}`
      );
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products); // 儲存商品資料
        setTotalPages(data.totalPages); // 儲存總頁數
        setCurrentPage(data.currentPage); // 儲存當前頁數
      } else {
        console.error("Failed to fetch products:", res.status);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // 當查詢參數改變時，更新頁面
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl && categoryFromUrl !== category) {
      setCategory(categoryFromUrl);
    }

    fetchProducts(keyword, page);
  }, [searchParams, category, color, sortOrder, keyword, page]);

  // 當搜尋框更新時更新 URL
  const handleSearchChange = (e) => {
    const newSearchQuery = e.target.value;
    setSearchQuery(newSearchQuery);

    // 更新 URL query
    if (newSearchQuery === "") {
      router.push(`?page=${page}`, undefined, { shallow: true });
    } else {
      router.push(`?page=${page}&search=${newSearchQuery}`, undefined, {
        shallow: true,
      });
    }
  };

  // 清除所有篩選條件
  const clearFilters = () => {
    setCategory("");
    setColor("");
    setSearchQuery("");
    setSortOrder("");
    setFilters({ category: null, color: null });
  };

  return (
    <>
      <div className="container">
        <div className="mb-3">
          <Breadcrumb className="store_breadcrumb mt-3 mb-2 ms-2">
            <Breadcrumb.Item href="/">首頁</Breadcrumb.Item>
            <Breadcrumb.Item href="/store">商城</Breadcrumb.Item>
            <Breadcrumb.Item active>家具列表</Breadcrumb.Item>
          </Breadcrumb>
          {/* 篩選區 */}
          <div className="d-flex align-items-center gap-2">
            {/* 分類篩選 */}
            <FilterDropdown
              title="分類"
              name="category"
              options={[
                { label: "桌子", value: "1" },
                { label: "椅子", value: "2" },
                { label: "衣櫃", value: "3" },
                { label: "床架", value: "4" },
                { label: "全部", value: "" },
              ]}
              onChange={(selectedCategories) => {
                setCategory(selectedCategories);
                setFilters((prevFilters) => ({
                  ...prevFilters,
                  category: selectedCategories || null,
                }));
                // 更新 URL 中的 category 查詢參數
                router.push(
                  `/store/list?page=1`,
                  undefined,
                  { shallow: true }
                );
              }} // 更新篩選條件
            />

            {/* 顏色篩選 */}
            <FilterDropdown
              title="顏色"
              name="color"
              options={[
                { label: "黑色", value: "1" },
                { label: "白色", value: "2" },
                { label: "棕色", value: "3" },
                { label: "米色", value: "4" },
                { label: "全部", value: "" },
              ]}
              onChange={(selectedColors) => {
                setColor(selectedColors);
                setFilters((prevFilters) => ({
                  ...prevFilters,
                  color: selectedColors || null,
                }));
                // 更新 URL 中的 color 查詢參數
                router.push(
                  `?category=${category}&color=${selectedColors}&page=${page}${searchQuery ? `&search=${searchQuery}` : ""}`,
                  undefined,
                  { shallow: true }
                );
              }} // 更新篩選條件
            />

            {/* 顯示選中的篩選條件 */}
            <div className="d-flex gap-2">
              {filters.category && (
                <span className="filter-pill">
                  {`分類: ${
                    ["1", "2", "3", "4"].find((val) => val === filters.category)
                      ? ["桌子", "椅子", "衣櫃", "床架"][
                          ["1", "2", "3", "4"].indexOf(filters.category)
                        ]
                      : "未知分類"
                  }`}
                  <MdClose
                    onClick={() => {
                      setCategory("");
                      setFilters((prevFilters) => ({
                        ...prevFilters,
                        category: "",
                      }));
                      // 清除篩選條件並更新 URL
                      router.push(
                        `?page=${page}${searchQuery ? `&search=${searchQuery}` : ""}`,
                        undefined,
                        { shallow: true }
                      );
                    }}
                    className="filter-close-icon"
                  />
                </span>
              )}

              {filters.color && (
                <span className="filter-pill">
                  {`顏色: ${
                    ["1", "2", "3", "4", "5"].find(
                      (val) => val === filters.color
                    )
                      ? ["黑色", "白色", "棕色", "米色", "其他"][
                          ["1", "2", "3", "4", "5"].indexOf(filters.color)
                        ]
                      : "未知顏色"
                  }`}
                  <MdClose
                    onClick={() => {
                      setColor("");
                      setFilters((prevFilters) => ({
                        ...prevFilters,
                        color: "",
                      }));
                      // 清除篩選條件並更新 URL
                      router.push(
                        `?page=${page}${searchQuery ? `&search=${searchQuery}` : ""}`,
                        undefined,
                        { shallow: true }
                      );
                    }}
                    className="filter-close-icon"
                  />
                </span>
              )}
            </div>

            {/* 根據篩選條件數量動態調整“清除篩選”按鈕的位置 */}
            {(filters.category || filters.color) && (
              <button onClick={clearFilters} className="btn btn-light">
                清除篩選
              </button>
            )}

            <div className="ms-auto d-flex align-items-center gap-2">
              <SearchBar value={searchQuery} onChange={handleSearchChange} />
              <SortDropdown
                title="排序方式"
                options={[
                  { label: "價格由低到高", value: "price_asc" },
                  { label: "價格由高到低", value: "price_desc" },
                  { label: "上架由新到舊", value: "created_at_desc" },
                ]}
                onChange={(selectedSortOrder) => {
                  setSortOrder(selectedSortOrder);
                  fetchProducts(searchQuery, page);
                }}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <p>共 {products.length} 筆結果</p>
        </div>

        <div className="row mb-4">
          {products.map((product) => (
            <div
              className="col-12 col-sm-6 col-md-3 mb-3"
              key={product.product_id}
            >
              <Link
                href={`/store/list/${product.product_id}`}
                className="store_list_link"
              >
                <StoreListCard
                  src={`http://localhost:3002/uploads/store_images/${product.image_path.replace(
                    "uploads/images/",
                    ""
                  )}`}
                  product_name={product.product_name}
                  product_price={`$${new Intl.NumberFormat("en-US").format(
                    product.price
                  )}`}
                />
              </Link>
            </div>
          ))}
        </div>
        {/* 分頁 */}
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </>
  );
}