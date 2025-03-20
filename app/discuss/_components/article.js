"use client";

import Img from 'next/image';
import { Form, Modal} from "react-bootstrap";
import Category from "./category";
import { useEffect, useState } from 'react';
import * as Yup from "yup";

const replySchema = Yup.object().shape({
    reply_content: Yup.string()
        .trim()  // 移除前後空白
        .required("回覆內容不能為空")  // 必須填寫
        .min(1, "回覆內容不能只有空白字元")  // 防止只有空白
});

function Article({id}) {
    const articleID = Number(id);
    const [replyData, setReplyData] = useState({
        dis_id:articleID,
        reply_content:"",
    });
    const [article, setArticle] = useState("");
    const [reply, setReply] = useState([]);
    const [replycount, setReplyCount] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    // 收藏
    const [iscollect, setIsCollect] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    // 時間顯示方式
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
    
        return `${month}月${day}日 ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        const token = localStorage.getItem("ptoken");
        const fetchArticle = async () => {
            try {
                const res = await fetch(`http://localhost:3002/discuss/article/${articleID}`,{
                    method:"GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!res.ok) {
                    const errorMessage = await res.text();
                    throw new Error(`無法獲取文章資料: ${errorMessage}`);
                }
                const data = await res.json();
                // console.log("API 回傳資料:", data);
                setArticle(data.article);
                setReply(Array.isArray(data.reply) ? data.reply : [data.reply]); // 確保將 reply 轉換為陣列
                setReplyCount(data.reply_count);
                setIsCollect(data.collect);
            } catch (err) {
                console.error("API 錯誤:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [articleID]);
    

    const handleReplyChange = (e) => {
        const { name, value } = e.target;
        setReplyData((prev) => ({
            ...prev,
            [name] : value,
        }));
    };

    // 留言
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 驗證
        try {
            await replySchema.validate(replyData, { abortEarly: false });
        } catch (validationError) {
            const errors = validationError.inner.reduce((acc, error) => {
                acc[error.path] = error.message;
                return acc;
            }, {});
                setError(errors.reply_content);
            return;
        }
    
        const token = localStorage.getItem("ptoken");
    
        if (!token) {
            setShowErrorModal(true);
            return;
        }
    
        try {
            const response = await fetch("http://localhost:3002/discuss/reply", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`, 
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify(replyData),
            });

    
            const result = await response.json();
            // console.log("回應資料:", result);
            if (result.message === "回覆成功") {
                window.location.reload()
            } else {
                setError("回覆失敗，請再試一次！");
            }
        } catch (error) {
            console.error("錯誤發生:", error); // 錯誤
            setError("發生錯誤");
        }
    };

    // 收藏
    const handleCollectToggle = async () => {
        const token = localStorage.getItem("ptoken");
        if (!token) {
            setShowErrorModal(true);
            return;
        }

        setIsCollect((prev) => !prev);

        try {
            const method = iscollect ? "DELETE" : "POST";
            const response = await fetch("http://localhost:3002/discuss/collect", {
                method: method,
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ dis_id: articleID }),
            });

        const result = await response.json();
        if (result.success !== true) {
            throw new Error(result.message || "收藏操作失敗");
        }
        } catch (error) {
            console.error("收藏錯誤:", error);
            alert(error.message);
            // 如果失敗，恢復原來的狀態
            setIsCollect((prev) => !prev);
        }
    };

    // 編輯按鈕
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("prent-auth"));
        if (userData) {
            // console.log('userid',userData.member_id);  // 取得使用者的 ID
            setCurrentUserId(userData.member_id);
        }
    }, []);

    // 按讚與否
    const handleReaction = async (reactionType) => {
        const token = localStorage.getItem("ptoken");
        if (!token) {
            setShowErrorModal(true);
            return;
        }
    
        try {
            // 計算新的反應狀態
            const newReaction = article.user_reaction === reactionType ? null : reactionType;
    
            let newDisLike = article.dis_like;
            let newDisDislike = article.dis_dislike;
    
            // 如果反應類型是讚 (1)，並且目前是倒讚，則增加讚並減少倒讚
            if (reactionType === 1) {
                if (article.user_reaction === 0) {
                    newDisLike += 1;
                    newDisDislike -= 1;
                } else if (article.user_reaction === 1) {
                    newDisLike -= 1;
                } else {
                    newDisLike += 1;
                }
            }
            // 如果反應類型是倒讚 (0)，並且目前是讚，則增加倒讚並減少讚
            else if (reactionType === 0) {
                if (article.user_reaction === 1) {
                    newDisLike -= 1;
                    newDisDislike += 1;
                } else if (article.user_reaction === 0) {
                    newDisDislike -= 1;
                } else {
                    newDisDislike += 1;
                }
            }
            // 如果使用者取消反應
            else if (newReaction === null) {
                if (article.user_reaction === 1) {
                    newDisLike -= 1;
                } else if (article.user_reaction === 0) {
                    newDisDislike -= 1;
                }
            }
    
            // 更新本地狀態
            setArticle((prev) => ({
                ...prev,
                user_reaction: newReaction,
                dis_like: newDisLike,
                dis_dislike: newDisDislike,
            }));

            // 輸出反應和新的reaction來檢查
            // console.log("發送的reaction:", newReaction);
    
            // 向後端發送請求更新反應
            const response = await fetch("http://localhost:3002/discuss/reaction", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ dis_id: articleID, reaction: newReaction }),
            });
    
            const result = await response.json();
    
            // 處理後端回應
            if (!response.ok || !result.success) {
                throw new Error(result.message || "更新失敗");
            }
        } catch (error) {
            console.error("更新讚/倒讚失敗:", error);
            alert("操作失敗，請稍後再試");
        }
    };
    
    return (
        <>
        <div>
            <Category />
            <div className="mt-2 ms-2">
                <div className="article_title ms-2">{article?.dis_title}</div>
                <div className="d-flex">
                    <div
                        className="d-flex justify-content-center align-items-center p-3"
                        style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                    >
                        <Img
                            src={article?.img ? `http://localhost:3002/${article?.img}` : "/discuss_images/default.jpg"}
                            className="rounded-circle w-100 h-100"
                            alt="頭貼"
                            height={150}
                            width={150}
                        />
                    </div>
                    <div className="d-flex flex-column ms-3">
                        <span className="article_name d-block mt-4">{article.nick_name}</span>
                        <span className="article_time d-block mb-3">{formatDate(article.dis_setup_time)}</span>
                    </div>
                </div>

                <p className="article_text ms-2 me-2">{article.dis_content}</p>
                <div className="photo-container ms-2">
                    {article.dis_pic && (
                        <Img
                            src={article?.img ? `http://localhost:3002/${article?.dis_pic}` : "/discuss_images/default.jpg"}
                            className="w-100 h-100"
                            alt="文章圖片"
                            height={200}
                            width={200}
                        />
                    )}
                </div>
                <div className="goodbadcollect d-flex justify-content-between ms-2 me-2 pb-3 mb-0 border-bottom">
                    <div className="goodbad d-flex justify-content-between">
                    <div className="d-flex">
                        <button 
                            // className={`btn ${article.user_reaction === 1 ? "btn-primary" : ""}`}
                            className="fa_icon"
                            onClick={() => handleReaction(1)}
                            aria-label="讚"
                        >
                        <div className="d-flex align-items-center">
                        <i className={`bi bi-hand-thumbs-up${article.user_reaction === 1 ? "-fill text-primary" : ""}`} />
                            <span className="ms-2">{article.dis_like}</span>
                        </div>
                        </button>
                        <button 
                            // className={`btn ${article.user_reaction === 0 ? "btn-danger" : ""}`} 
                            className="fa_icon"
                            onClick={() => handleReaction(0)}
                            aria-label="倒讚"
                        >
                        <div className="d-flex align-items-center">
                            <i className={`bi bi-hand-thumbs-down${article.user_reaction === 0 ? "-fill text-primary" : ""}`} />
                            <span className="ms-2">{article.dis_dislike}</span>
                        </div>
                        </button>
                    </div>
                    </div>
                        <button 
                            onClick={handleCollectToggle} 
                            // className={`bi reply_collect_icon ${iscollect ? "bi-heart-fill" : "bi-heart"}`}
                            className="reply_collect_icon"
                            aria-label="收藏"
                        >
                            <i className={`bi ${iscollect ? "bi-heart-fill" : "bi-heart"}`} />
                        </button>

                </div>
                {reply.map((reply, index) =>{
                    return (
                        <div key={index} className="d-flex row border-bottom ms-2 me-2">
                            <div className="col-11 d-flex justify-content-start align-items-center p-3">
                                <Img
                                    src={`http://localhost:3002/${reply?.img}`}
                                    className="comment_photo rounded-circle"
                                    alt="頭貼"
                                    height={60}
                                    width={60}
                                />
                                <div className="d-flex flex-column ms-3">
                                    <span className="re_name">{reply.nick_name}</span>
                                    <p className="re_content">{reply.reply_content}</p>
                                    <span className="re_time mt-2">B{index+1} {formatDate(reply.reply_setup_time)}</span>
                                </div>
                            </div>
                            {reply.member_id === currentUserId && (
                                <div className="col-1 p-3">
                                    <i className="comment_edit bi bi-pencil-fill"></i>
                                </div>
                            )}
                        </div>
                    );
                })}
                <Form onSubmit={handleSubmit}>
                    <div className="textbox">
                        <Form.Control
                            as="textarea"
                            name="reply_content"
                            placeholder="留言..."
                            className="mt-2 mb-3"
                            value={replyData.reply_content}
                            onChange={handleReplyChange}
                        />
                        {/* <i className="bi bi-send-fill send_icon"></i> */}
                        <button type="submit" className="bi bi-send-fill send_icon reply_button"></button>
                    </div>
                </Form>
            </div>
            <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
                <Modal.Body className="text-center p-4">
                    請先登入
                </Modal.Body>
            </Modal>
        </div>
        </>
    );
}

export default Article;