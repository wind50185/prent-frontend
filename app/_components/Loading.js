"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
// import loadingGif from "../../public/loading.gif";

const Loading = () => {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname(); // 監聽路由變化

  useEffect(() => {
    // console.log("🚀 路由變更，顯示 Loading");
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
      // console.log("✅ Loading 完成");
    }); // 模擬載入時間

    return () => clearTimeout(timer);
  }, [pathname]); // 監聽路由變更

  if (loading) {
    return (
      <div className="position-absolute top-50 start-50 translate-middle text-center z-3 loading">
        <Image
          src="/loading.gif"
          alt="Loading..."
          width={180}
          height={180}
          // className="d-block"
        ></Image>
        
        <p style={{color:'#ec9466'}}>Loading...</p>
      </div>
    );
  }

  return null;
};

export default Loading;
