"use client";

import React, { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../styles/_rent.scss";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = { lat: 23.6978, lng: 120.9605 }; // 台灣中心點

export default function RentProductPage({ address }) {
  const [location, setLocation] = useState(null);

  async function fetchCoordinates(address) {
    const apiKey = "輸入金鑰"; // 替換為你的 Google Maps API Key
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apiKey}`
    );
    const data = await response.json();
    if (data.status === "OK" && data.results.length > 0) {
      return data.results[0].geometry.location;
    }
    return null;
  }

  useEffect(() => {
    async function fetchLocation() {
      const loc = await fetchCoordinates(address);
      setLocation(loc || defaultCenter);
    }
    fetchLocation();
  }, [address]);

  return (
    <LoadScript googleMapsApiKey="輸入金鑰">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={location || defaultCenter}
        zoom={15}
      >
        {location && <Marker position={location} />}
      </GoogleMap>
    </LoadScript>
  );
}
