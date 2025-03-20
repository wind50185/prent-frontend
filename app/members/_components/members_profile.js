"use client";

import { useEffect, useState } from "react";
import Img from "next/image";

const proItems = [
    {
        title: "會員姓名：",
        icon: <i className="bi bi-house"></i>,
        key: "member_name",
    },
    {
        title: "電子信箱：",
        icon: <i className="bi bi-envelope"></i>,
        key: "email",
    },
    {
        title: "連絡電話：",
        icon: <i className="bi bi-telephone"></i>,
        key: "phone",
    },
    {
        title: "生日日期：",
        icon: <i className="bi bi-cake2"></i>,
        key: "birth",
    },
    {
        title: "性別：",
        icon: <i className="bi bi-person-raised-hand"></i>,
        key: "gender",
    },
    {
        title: "是否為專家：",
        icon: <i className="bi bi-person-bounding-box"></i>,
        key: "pro_state",
        tobepro: "想成為專家？",
    },
];

function MembersProfile() {
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

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const year = date.getFullYear() ;
        const month = date.getMonth() + 1;
        const day = date.getDate();
    
        return `${year}年 ${month}月 ${day}日`;
    };

    return (
        <>
            <div className="row">
                        <div className="col-4 pt-3">
                            <Img
                                src={`http://localhost:3002/${memberData.img}`}
                                className="comment_photo rounded-circle"
                                alt="頭貼"
                                height={80}
                                width={80}
                            />
                        </div>
                        <div className="col-8 d-flex align-items-center">
                            <span className="members_name">{memberData.nick_name}</span>
                        </div>

                {proItems.map((item) => {
                    let value = memberData[item.key];

                    if(item.key === "gender")
                    {
                        if(value == 1)
                        {
                            value = "男性";
                        }
                        else if(value == 2){
                            value = "女性";
                        }
                        else{
                            value = "不顯示";
                        }
                    }
                    if (item.key === "birth") {
                        value = formatDate(value);
                    }
                    if (item.key === "pro_state") {
                        if(value==0){
                            value = "否";
                        }
                        else{
                            value = "是";
                        }
                    }
                    return (
                        <div className="pt-5 d-flex align-items-center" key={item.title}>
                            {item.icon}
                            <span className="col-2 d-flex justify-content-end">
                                {item.title}
                            </span>
                            <span className="col-3 ps-5">
                                {value}
                            </span>
                            {item.key === "pro_state" && value === "否" && (
                                <span className="members_tobepro">
                                    {item.tobepro}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
}
export default MembersProfile;