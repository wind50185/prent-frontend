"use client";

import "../styles/_rent.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import RentCard from "./_components/RentCard";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import FilterDropdown from "./_components/FilterDropdown";
import RangeDropdown from "./_components/RangeDropdown";
import SortDropdown from "./_components/SortDropdown";
import SearchBar from "./_components/SearchBar";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

// import RangeSlider from "./_components/RangeSlider";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export default function RentPage() {
  const [rent, setRent] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState({
    minPrice: null,
    maxPrice: null,
    location: [],
    buildingType: [],
    pet: 0,
    elevator: 0,
  });

  // 處理 Checkbox 選擇
  const handleCheckboxChange = (category, value) => {
    setFilters((prev) => {
      const newValues = prev[category].includes(value)
        ? prev[category].filter((v) => v !== value) // 取消選擇
        : [...prev[category], value]; // 新增選擇
      return { ...prev, [category]: newValues };
    });
  };

  // 處理 range 篩選
  const handlePriceChange = ([min, max]) => {
    setFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max }));
  };

  // 根據篩選條件向後端請求租屋資料
  const fetchRent = async () => {
    const queryParams = new URLSearchParams();

    if (filters.location.length > 0) {
      queryParams.append("location", filters.location.join(","));
    }
    if (filters.buildingType.length > 0) {
      queryParams.append("buildingType", filters.buildingType.join(","));
    }
    if (filters.pet) {
      queryParams.append("pet", filters.pet);
    }
    if (filters.elevator) {
      queryParams.append("elevator", filters.elevator);
    }
    if (filters.minPrice !== null) {
      queryParams.append("minPrice", filters.minPrice);
    }
    if (filters.maxPrice !== null) {
      queryParams.append("maxPrice", filters.maxPrice);
    }
    if (sortOrder) {
      queryParams.append("sortOrder", sortOrder);
    }
    if (searchQuery) {
      queryParams.append("search", searchQuery);
    }

    try {
      const response = await fetch(
        `http://localhost:3002/rent/api?${queryParams.toString()}`
      );
      if (response.ok) {
        const data = await response.json();
        setRent(data); // 儲存租屋資料
      } else {
        console.error("Failed to fetch rent data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching rent data:", error);
    }
  };

      // 送出篩選條件
  const handleSubmit = () => {
    fetchRent(sortOrder);
  };

  const swiperRef = useRef(null); // Swiper 參考

  // 停止 Swiper 滑動（當開啟 dropdown 時）
  const disableSwiper = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.disable(); // 禁用 Swiper
    }
  };

  // 啟用 Swiper 滑動（當 dropdown 關閉時）
  const enableSwiper = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.enable(); // 啟用 Swiper
    }
  };

  useEffect(() => {
    // 確保 Swiper 初始化並且參考已正確設置
    const swiperInstance = swiperRef.current?.swiper;
    if (swiperInstance) {
      swiperInstance.disable(); // 初始禁用
    }
  }, []);
  

  return (
    <>
      <div className="container-fluid bannerbar">
        <div className="position-relative banner-t">
          <div className="d-flex flex-column align-items-start justify-content-end position-absolute banner-l">
            <div className="text-white title-w z-1">
              <svg width="75%" height="75%" viewBox="0 0 316 364" fill="none">
                <path
                  d="M44.7656 113.735H67.0564C51.8274 204.311 0 207.454 0 207.454C18.4221 193.853 40.2829 157.395 44.7656 113.735ZM102.795 0.643951L134.481 26.7024C133.007 27.9024 130.858 28.5882 128.095 28.6453C125.332 28.7025 121.954 28.2453 118.024 27.1595C111.147 28.7025 103.041 30.2454 93.707 31.8455C84.3731 33.4456 74.6094 34.8742 64.3544 36.0743C41.8181 38.7601 58.5208 37.3315 34.2651 38.8173L33.2826 36.3028C41.4497 33.2741 49.9238 29.674 58.705 25.5595C67.4862 21.445 75.7761 17.159 83.6362 12.7588C91.4963 8.35862 97.8826 4.30127 102.795 0.643951ZM33.5282 87.6768H101.321L114.585 70.0759C120.173 74.6476 124.84 78.4764 128.586 81.6194C132.332 84.7624 135.648 87.7339 138.411 90.6484C137.92 93.1056 135.771 94.3057 132.025 94.3057H35.4932L33.5282 87.6768ZM72.2759 27.1024L96.4703 31.9026V333.083C96.4703 350.798 72.2759 363.77 72.2759 363.77V27.1024ZM93.8298 110.707C105.19 114.078 113.971 117.907 120.173 122.307C126.437 126.707 130.674 131.165 132.946 135.793C135.218 140.365 136.016 144.537 135.341 148.308C134.665 152.08 133.007 155.109 130.367 157.28C127.726 159.509 124.472 160.595 120.603 160.595C116.735 160.595 112.805 158.937 108.813 155.566C108.445 150.651 107.278 145.565 105.436 140.365C103.593 135.165 101.321 130.136 98.7423 125.164C96.2246 120.25 93.5841 115.85 90.9436 111.964L93.7684 110.649L93.8298 110.707ZM31.3175 218.198H287.507L298.069 201.282C302.306 205.683 305.868 209.454 308.754 212.597C311.64 215.74 314.035 218.598 316 221.169C315.325 223.455 313.298 224.598 309.859 224.598H33.2826L31.3175 218.198ZM149.771 26.3024V15.3304L180.352 26.3024H225.609L238.443 10.7016L269.576 31.6169C267.98 33.9027 263.988 35.5028 257.541 36.4743V219.969H228.249V33.3313H178.019V219.969H149.771V26.3024ZM167.579 149.908H242.619V156.709H167.579V149.908ZM168.378 86.4196H241.575V93.4485H168.378V86.4196Z"
                  fill="#EC8692"
                />
              </svg>
            </div>
            <div className="bg-white text-black opacity-75 title-p">
              租屋的旅程中，租豬幫如同默默守護的朋友，為我們篩選每一處溫馨的住所。租豬幫都用心推薦，讓我們在陌生的城市裡找到屬於自己的歸屬感。
            </div>
          </div>
        </div>
      </div>
      <div className="container-lg p-3">
        {/* 滑動提示 (僅手機顯示) */}
        <div className="d-md-none text-center text-muted fz12">
          <i className="bi bi-arrow-left-right"></i> 滑動篩選條件
        </div>

        <div className="row align-items-center">
          {/* Swiper 篩選條件 */}
          <div className="col-lg-7 p-3">
            <div className="container-fluid">
              <div className="row">
                <div className="col-10">
                  <Swiper
                    style={{ overflow: "visible" }}
                    effect="coverflow"
                    // modules={[Navigation]}
                    spaceBetween={25}
                    breakpoints={{
                      0: {
                        slidesPerView: 4.6,
                        spaceBetween: 10,
                      },
                      576: {
                        slidesPerView: 4.6,
                        spaceBetween: 20,
                      },
                      768: {
                        slidesPerView: 8,
                        spaceBetween: 20,
                      },
                      992: {
                        slidesPerView: 8,
                        spaceBetween: 25,
                      },
                    }}
                    // navigation
                    onSlideChange={() => {}}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                  >
                    <SwiperSlide>
                      <FilterDropdown
                        title="地區"
                        type="checkbox"
                        name="location"
                        options={[
                          { label: "中正", value: "1" },
                          { label: "大同", value: "2" },
                          { label: "中山", value: "3" },
                          { label: "松山", value: "4" },
                          { label: "大安", value: "5" },
                          { label: "萬華", value: "6" },
                          { label: "信義", value: "7" },
                          { label: "士林", value: "8" },
                          { label: "北投", value: "9" },
                          { label: "南港", value: "10" },
                          { label: "內湖", value: "11" },
                          { label: "文山", value: "12" },
                        ]}
                        onOpen={disableSwiper}
                        onClose={enableSwiper} // 讓使用者手動關閉，而不是 `onChange` 後自動關閉
                        onChange={(selectedLocation) =>
                          handleCheckboxChange("location", selectedLocation)
                        }
                        checked={filters.location}
                        multiSelect={true} // 支持多選
                      />
                    </SwiperSlide>

                    <SwiperSlide>
                      <RangeDropdown
                        title="租金"
                        min={1000}
                        max={50000}
                        unit="元"
                        step={500}
                        onOpen={disableSwiper}
                        onClose={enableSwiper}
                        onChange={handlePriceChange}
                      />
                    </SwiperSlide>

                    <SwiperSlide>
                      <RangeDropdown
                        title="坪數"
                        min={10}
                        max={100}
                        unit="坪"
                        onOpen={disableSwiper}
                        onClose={enableSwiper}
                      />
                    </SwiperSlide>

                    <SwiperSlide>
                      <RangeDropdown
                        title="樓層"
                        min={1}
                        max={100}
                        unit="樓"
                        onOpen={disableSwiper}
                        onClose={enableSwiper}
                      />
                    </SwiperSlide>

                    <SwiperSlide>
                      <FilterDropdown
                        title="類型"
                        type="checkbox"
                        name="building-type"
                        options={[
                          { label: "公寓", value: "1" },
                          { label: "社區", value: "2" },
                          { label: "電梯大樓", value: "3" },
                          { label: "透天厝", value: "4" },
                        ]}
                        onChange={(selectedBuildingType) =>
                          handleCheckboxChange(
                            "buildingType",
                            selectedBuildingType
                          )
                        }
                        checked={filters.buildingType}
                        multiSelect={true} // 支持多選
                      />
                    </SwiperSlide>

                    <SwiperSlide>
                      <FilterDropdown
                        title="寵物"
                        type="radio"
                        name="pet"
                        options={[
                          { label: "可", value: "1" },
                          { label: "不可", value: "0" },
                        ]}
                        onOpen={disableSwiper}
                        onClose={enableSwiper}
                        onChange={(selectedPet) => {
                          setPet(selectedPet);
                          setFilters((prevFilters) => ({
                            ...prevFilters,
                            pet: selectedPet,
                          }));
                        }} // 更新篩選條件
                      />
                    </SwiperSlide>

                    <SwiperSlide>
                      <FilterDropdown
                        title="電梯"
                        type="radio"
                        name="elevator"
                        options={[
                          { label: "可", value: "1" },
                          { label: "不可", value: "0" },
                        ]}
                        onOpen={disableSwiper}
                        onClose={enableSwiper}
                        onChange={(selectedElevator) => {
                          setElevator(selectedElevator);
                          setFilters((prevFilters) => ({
                            ...prevFilters,
                            elevator: selectedElevator,
                          }));
                        }} // 更新篩選條件
                      />
                    </SwiperSlide>
                  </Swiper>
                </div>
                {/* 送出篩選按鈕 */}
                <div className="text-center col-2">
                  <button className="btn btn-primary" onClick={handleSubmit}>
                    送出篩選
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SearchBar & SortDropdown */}
          <div className="col-lg-5 col-12 p-0 d-flex">
            <div className="container-fluid">
              <div className="row align-items-center">
                <div className="col-lg-3 col-4 text-center">
                  <Link href={"/rent/rentmap"}>地圖找租屋</Link>
                </div>
                <div className="col-lg-5 col-4">
                  <SearchBar
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onSearch={handleSubmit}
                  />
                </div>
                <div className="col-lg-4 col-4">
                  <SortDropdown
                  title="排序方式"
                    options={[
                      { label: "租金由低到高", value: "price_asc" },
                      { label: "坪數由高到低", value: "sqm_desc" },
                      { label: "樓層由低到高", value: "floor_asc" },
                    ]}
                    onChange={(selectedSortOrder) => {
                      setSortOrder(selectedSortOrder);
                      handleSubmit(); // 發送請求
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 租屋結果 */}
      <div className="container-lg">
        <div className="row">
          <p>共 {rent.length} 筆結果</p>
        </div>
        <div className="row mb-4">
          {rent.map((rent) => (
            <div className="col-12 col-sm-6 col-md-3 mb-3" key={rent.rent_id}>
              <RentCard rent={rent} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
