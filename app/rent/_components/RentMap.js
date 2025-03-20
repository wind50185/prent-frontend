"use client";
import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../styles/_rent.scss";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

export default function RentProductPage({ lat, lng, address }) {
  const defaultCenter = {
    lat: parseFloat(lat) || 25.033964, // 預設為台灣中心
    lng: parseFloat(lng) || 121.564468,
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  return (
    <div>
      {/* 顯示地址 */}
      {address && (
        <p>
          <i className="bi bi-geo-alt-fill"></i> {address}
        </p>
      )}

      {/* 確保地圖已加載後才渲染 GoogleMap */}
      {isLoaded ? (
        <GoogleMap mapContainerStyle={mapContainerStyle} center={defaultCenter} zoom={15}>
          <Marker position={defaultCenter} />
        </GoogleMap>
      ) : (
        <p>載入地圖中...</p>
      )}
    </div>
  );
}
