"use client"

import List from "../_components/left_list";
import Img from "next/image";
import MembersEdit from "../_components/members_edit";
import { useEffect, useState } from "react";

export default function MembersEditPage() {
    const [memberData, setMemberData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const token = localStorage.getItem("ptoken");
    
        if (!token) {
            setError("未登入或無效的 token");
            setLoading(false);
            return;
        }

        const fetchMemberData = async () => {
            try {
                const response = await fetch("http://localhost:3002/members/profile", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                const result = await response.json();
                    if (response.ok) {
                        setMemberData(result);
                    } else {
                            setError(result.message || "無法取得會員資料");
                        }
                    } catch (error) {
                        setError("error");
                    } finally {
                        setLoading(false);
                    }
                };
    
            fetchMemberData();
        }, []);
    
        if (loading) return <div>載入中...</div>;
        if (error) return <div>{error}</div>;

    return (
    <>
        <div className="container pt-3">
            <div className="row">
                <div className="col-3 left_list_fixed">
                    <List />
                </div>
                <div className="col-9 members_content">
                    <div className="row">
                        <div className="col-4 pt-3">
                            <Img
                                src={`http://localhost:3002/${memberData?.img}`}
                                className="comment_photo rounded-circle"
                                alt="頭貼"
                                height={80}
                                width={80}
                            />
                        </div>
                        <div className="col-8 d-flex align-items-center">
                            <span className="members_name">{memberData.nick_name}</span>
                        </div>
                    </div>
                    <MembersEdit memberData={memberData}/>
                </div>
            </div>
        </div>
    </>
    )
}