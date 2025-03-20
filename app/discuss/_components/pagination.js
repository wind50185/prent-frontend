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

    // 計算要顯示的分頁範圍
    const getPageNumbers = () => {
        let startPage = Math.max(1, currentPage - 2); // 保證最小為 1
        let endPage = Math.min(totalPages, currentPage + 2); // 保證最大為 totalPages

        // 如果總頁數少於五頁，顯示所有頁數
        if (totalPages <= 5) {
            startPage = 1;
            endPage = totalPages;
        } else {
            // 調整顯示範圍，保證分頁數字位於中間
            if (currentPage <= 3) {
                endPage = 5;
            } else if (currentPage >= totalPages - 2) {
                startPage = totalPages - 4;
            }
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };

    const pageNumbers = getPageNumbers();

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
            {pageNumbers.map((page) => (
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
    );
}