import React, { useState, useRef, useEffect } from "react";
import FilterDropdown from "./FilterDropdown";
import RangeDropdown from "./RangeDropdown";
import SortDropdown from "./SortDropdown";
import RangeSlider from "./RangeSlider";
import SearchBar from "./SearchBar";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";

const FilterBar = () => {
  // 新增篩選選項
  // const [products, setProducts] = useState([]);
  const [location, setLocation] = useState("");
  const [buildingType, setBuildingType] = useState("");
  const [pet, setPet] = useState("");
  const [elevator, setElevator] = useState("");
  const [sortOrder, setSortOrder] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
  

  const [filters, setFilters] = useState({
    location: null,
    buildingType: null,
    pet: null,
    elevator: null,
  });

  // 根據篩選條件向後端請求租屋資料
  const fetchRent = async (sortOrder) => {
    const queryParams = new URLSearchParams();

    if (location) queryParams.append("location", location);
    if (buildingType) queryParams.append("buildingType", buildingType);
    if (pet) queryParams.append("pet", pet);
    if (elevator) queryParams.append("elevator", elevator);
    if (sortOrder) queryParams.append("sortOrder", sortOrder);
    if (searchQuery) queryParams.append("search", searchQuery);

    if (filters.location) {
      queryParams.location = filters.location;
    }
    if (filters.buildingType) {
      queryParams.buildingType = filters.buildingType;
    }
    if (filters.pet) {
      queryParams.pet = filters.pet;
    }
    if (filters.elevator) {
      queryParams.elevator = filters.elevator;
    }

    try {
      const response = await fetch(
        `http://localhost:3002/rent/api?${queryParams.toString()}`
      );
      if (response.ok) {
        const data = await response.json();
        // console.log(data);
        
        // setRent(data); // 儲存商品資料
      } else {
        console.error("Failed to fetch products:", response.status);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSearch = () => {
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
    <div className="container-lg p-3">
      {/* 滑動提示 (僅手機顯示) */}
      <div className="d-md-none text-center text-muted fz12">
        <i className="bi bi-arrow-left-right"></i> 滑動篩選條件
      </div>

      <div className="row align-items-center">
        {/* Swiper 篩選條件 */}
        <div className="col-lg-7 p-3">
          {/* 左右陰影 (提升可滑動感) */}
          {/* <div className="position-absolute top-0 bottom-0 start-0 w-5 bg-gradient-start d-md-none"></div>
          <div className="position-absolute top-0 bottom-0 end-0 w-5 bg-gradient-end d-md-none"></div> */}
          <div className="container-fluid">
            <Swiper
              touchStartPreventDefault={false}
              ref={swiperRef} // 綁定 Swiper 參考
              style={{ overflow: "visible" }}
              effect="coverflow"
              // modules={[Navigation]}
              spaceBetween={20}
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
                  onClose={enableSwiper}
                  onChange={(selectedLocation) => {
                    setLocation(selectedLocation);
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      location: selectedLocation,
                    }));
                  }} // 更新篩選條件
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
                  name="building-type"
                  options={[
                    { label: "公寓", value: "1" },
                    { label: "社區", value: "2" },
                    { label: "電梯大樓", value: "3" },
                    { label: "透天厝", value: "4" },
                  ]}
                  onOpen={disableSwiper}
                  onClose={enableSwiper}
                  onChange={(selectedBuildingType) => {
                    setBuildingType(selectedBuildingType);
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      buildingType: selectedBuildingType,
                    }));
                  }} // 更新篩選條件
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
                  placeholder="輸入關鍵字..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onSearch={handleSearch}
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
                    fetchRent(selectedSortOrder); // 根據選擇的排序方式重新獲取商品
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
