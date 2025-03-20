"use client";

import Pagination from "react-bootstrap/Pagination";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaginationComponent({ totalPages, currentPage }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 切換分頁時，更新 URL query string
  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page); // 設定新的頁數
    router.push(`?${params.toString()}`); // 更新網址
  };

  // 顯示分頁數字
  const getVisiblePages = () => {
    const pages = [];
    const maxVisiblePages = 5; // 最大顯示頁數
    const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfMaxVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <>
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
        {getVisiblePages().map((page) => (
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </Pagination.Item>
        ))}

        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </>
  );
}
