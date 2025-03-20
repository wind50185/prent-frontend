"use client";

import { useState } from "react";
import LeftList from "./_components/left_list";
import DiscussList from "./_components/discuss_list";

export default function DiscussPage() {
    const [selectedCategory, setSelectedCategory] = useState(0);

    // 回調函數，接收子組件傳來的資料
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        
        // console.log("選擇的分類:", category);
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-2 col-12 pe-3">
                    <div className="left_list_fixed">
                        <LeftList selectedCategory={selectedCategory}  // 傳遞選中的分類
                            onCategorySelect={handleCategorySelect}  // 傳遞回調函數 
                        />
                    </div>
                </div>
                <div className="col-lg-8 col-12">
                    <DiscussList selectedCategory={selectedCategory} />
                </div>
            </div>
        </div>
    );
}