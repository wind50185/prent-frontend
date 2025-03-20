"use client";
import { useRef } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/globals.scss";
import Link from "next/link";
import { API_SERVER } from "@/config/api-path";

export default function Home() {
  const videoRef = useRef(null);

  const handleStoreVideo = () => {
    if (videoRef.current) {
      videoRef.current.src = `${API_SERVER}/uploads/homepage_video/store_alreadycut.mp4`;
      videoRef.current.load();
      videoRef.current.play();
    }
  };

  const handleDiscussVideo = () => {
    if (videoRef.current) {
      videoRef.current.src = `${API_SERVER}/uploads/homepage_video/discuss.mp4`;
      videoRef.current.load();
      videoRef.current.play();
    }
  };

  const handleRentVideo = () => {
    if (videoRef.current) {
      videoRef.current.src = `${API_SERVER}/uploads/homepage_video/rent.mp4`;
      videoRef.current.load();
      videoRef.current.play();
    }
  };

  const handleServiceVideo = () => {
    if (videoRef.current) {
      videoRef.current.src = `${API_SERVER}/uploads/homepage_video/service.mp4`;
      videoRef.current.load();
      videoRef.current.play();
    }
  };

  return (
    <>
      <div className="container-fluid text-center p-home-content position-relative">
        <div className="row d-flex h-50">
          <Link
            href={"/rent"}
            className="col-6 d-flex flex-column align-items-center justify-content-center h-100 position-relative main-top"
            onMouseEnter={handleRentVideo}
          >
            <div className="bg-l position-absolute translate-middle-x">
              <i className="bi bi-house"></i>
              <p>租屋</p>
            </div>
          </Link>
          <Link
            href={"/store"}
            className="col-6 d-flex flex-column align-items-center justify-content-center h-100 position-relative main-top"
            onMouseEnter={handleStoreVideo}
          >
            <div className="bg-r position-absolute translate-middle-x">
              <i className="bi bi-shop"></i>
              <p>商城</p>
            </div>
          </Link>
        </div>
        <div className="row h-50 d-flex">
          <Link
            href={"/service"}
            className="col-6 d-flex flex-column align-items-center justify-content-center h-100 position-relative main-bot"
            onMouseEnter={handleServiceVideo}
          >
            <div className="bg-l position-absolute translate-middle-x">
              <i className="bi bi-box-seam"></i>
              <p>服務</p>
            </div>
          </Link>
          <Link
            href={"/discuss"}
            className="col-6 d-flex flex-column align-items-center justify-content-center h-100 position-relative main-bot"
            onMouseEnter={handleDiscussVideo}
          >
            <div className="bg-r position-absolute translate-middle-x">
              <i className="bi bi-chat-left-text"></i>
              <p>討論</p>
            </div>
          </Link>
        </div>
        <div className="p-video position-absolute top-50 start-50 translate-middle">
          <video
            ref={videoRef}
            src={`${API_SERVER}/uploads/homepage_video/store_alreadycut.mp4`}
            className="w-100"
            autoPlay
            loop
            muted
          >
            <track
              kind="captions"
              src=""
              srcLang="zh-TW"
              label="中文字幕"
              default
            />
          </video>
        </div>
      </div>
      <div className="container-fluid text-center center-text">
        <p className="text-reflect">Rent with Trust,</p> {/* 左側 PRENT */}
        <p className="text-reflect"> Settle with Ease.</p> {/* 右側 PRENT */}
      </div>
    </>
  );
}
