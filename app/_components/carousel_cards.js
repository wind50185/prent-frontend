"use client";

/* 元件設定 */
/* 適用於裡面要塞的元件是單張卡片 */
/* 
  手機版（寬度 0 - 767 px）：呈現 2 張卡片，第 3 張露出一點點、隱藏左右按鈕
  平版（寬度 768 - 991 px）：呈現 3 張卡片，第 4 張露出一點點
  電腦版（寬度 992 px 以上）：呈現 4 張卡片，第 5 張露出一點點

  css 寫在 globals.scss 的 swiper 區塊
*/

/* 使用說明 */
/*
  1. 安裝 swiper 套件（npm i 即可），在需要的 page.js 頁面 import 本元件
  
  2. 在 page.js 的 export function 之前 定義卡片資料中需要的 props
  * id 為必要，其他項看自己需要哪些 props
  （到時候資料會從資料庫來）

  e.g. 服務卡片需要圖片的 src：
    const services = [
  {
    id: 1,
    src: "/service_images/move_01.jpg",
  },
  {
    id: 2,
    src: "/service_images/move_02.jpg",
  },

  ...

  3. 在 page.js 頁面你要的地方插入本元件
    <CarouselCards
      items={services} <- "service" 名字看上面自己定義的資料陣列是什麼名字
      renderItem={(item) => (
        <ServiceHomeCard src={item.src} />
      )} <- <ServiceHomeCard /> 這段可換成自己的卡片元件及該卡片需要的 props （需在上面資料陣列中定義）
      getLink={(item) => `/service/pro/${item.id}`} <-（選擇性）可填 Link 連結，若不需連結則 ` ` 中留空
      getLinkClass={() => "service_pro_link"} <- （選擇性）可填 css className，若不需則 " " 中留空
    />
*/

import Link from "next/link";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

export default function CarouselCards({
  items = [],
  renderItem = () => {},
  getLink = null,
  getLinkClass = "",
}) {
  if (!items || items.length === 0) {
    return <p>沒有資料可顯示</p>;
  }

  return (
    <>
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        breakpoints={{
          0: {
            slidesPerView: 2.3,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 3.3,
            spaceBetween: 20,
          },
          992: {
            slidesPerView: 4.3,
            spaceBetween: 25,
          },
        }}
        navigation
        onSlideChange={() => {}}
        onSwiper={() => {}}
      >
        {items.map((v, i) => {
          const link = getLink ? getLink(v) : null; // 確認是否提供連結
          const content = renderItem ? renderItem(v) : <p>未提供 renderItem</p>;
          const linkClass = getLinkClass ? getLinkClass(v) : "";
          return (
            <SwiperSlide key={i}>
              {link ? (
                <Link href={link} passHref className={linkClass}>
                  {content}
                </Link>
              ) : (
                content
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
}
