"use client";

import Pagination from "react-bootstrap/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaginationComponent({ totalPages }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page")) || 1; // 從 URL 讀取當前頁面，預設為 1
  const [currentPage, setCurrentPage] = useState(pageFromUrl);

  useEffect(() => {
    setCurrentPage(pageFromUrl);
  }, [pageFromUrl]);

  // 切換分頁時，更新 URL query string
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return; // 避免超出範圍
    const params = new URLSearchParams(searchParams);
    params.set("page", page); // 設定新的頁數
    router.push(`?${params.toString()}`, { scroll: false }); // 只更新 URL，不滾動到頂部
  };

  return (
    <Pagination className="justify-content-center">
      <Pagination.First
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
      />
      <Pagination.Prev
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />

      {/* 顯示分頁數字 */}
      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1;
        return (
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </Pagination.Item>
        );
      })}

      <Pagination.Next
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
      <Pagination.Last
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
      />
    </Pagination>
  );
}