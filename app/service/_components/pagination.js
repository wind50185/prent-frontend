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
        {[...Array(totalPages)].map((v, i) => {
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
    </>
  );
}
