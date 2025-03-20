"use client"

import SortDropdown from "../_components/sort_dropdown"
import Img from 'next/image';
import { Form, Modal, Tooltip, OverlayTrigger } from "react-bootstrap";
import Button from "@/app/_components/button";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

export default function PostPage() {
    const [formData, setFormData] = useState({
        member_id: "",
        disclass: "",
        title: "",
        content: "",
        image: null,
    });

    const handleAutoFill1 = () => {
        const newTitle = "我好愛租豬幫";
        setFormData((prev) => ({
            ...prev,
            title: newTitle,
            content: "租豬幫真是一個好地方！",
        }));
        setTitleLength(newTitle.length);
    };

    const handleAutoFill2 = () => {
        const newTitle = "我好愛租豬幫，這網站操作簡潔，物件又非常的多";
        setFormData((prev) => ({
            ...prev,
            title: newTitle,
            content: `租豬幫真的是一個非常棒的地方，讓我來跟你分享一下我的經驗，這個平台真的是解決了我生活中的許多困難，讓我感覺到不僅是便捷，更是有一種溫暖的人情味。尤其是我們這些需要租借東西的人，往往會遇到各種麻煩，比如價錢不透明、物品品質無法保證、甚至是一些讓人不太信任的租賃平台，這些都讓人心情大打折扣。但自從我發現了租豬幫，我真的是感覺眼前一亮，這是一個讓人完全放心的平台，無論是服務、物品的品質，還是平台的操作方式，都讓我覺得很安心。

            首先，租豬幫的界面設計非常簡單直觀，這對我這種平時不太擅長操作各種應用的用戶來說，真的是一大福音。你可以輕鬆找到你需要的物品，無論是生活必需品、工具、還是一些特別的設備，應有盡有，而且種類豐富。你可以根據需求篩選範圍，這樣一來，找東西的時間就能大幅縮短，避免了我過去每次找東西時漫無目的的焦慮感。
            
            更棒的是，租豬幫不僅提供了豐富的物品選擇，還有一個非常關鍵的地方，就是每一個租賃的物品，都會有詳細的描述和真實的圖片，這讓我對商品的了解更加透徹。我不再需要憑空猜測商品的狀況，因為平台會讓你看到真實的狀況。這點真的是做得很用心，讓我感覺到租豬幫對每一位用戶都抱有很高的誠意。
            
            更人性化的是，平台會在物品的頁面上展示出用戶的評價，這就讓我可以更放心地選擇租賃物品。我知道，當其他人有好的租賃體驗時，我也能夠獲得相似的服務。這樣的透明度，也讓我覺得租豬幫非常值得信任，不像某些平台會把物品的真實情況隱瞞起來，甚至讓人感覺被欺騙。這種真誠的態度讓我每次租賃時，都能感覺到如同朋友之間的信任。
            
            再來，租豬幫的租賃流程非常簡單快捷。過去我在其他平台租過東西，常常需要花費很長的時間來溝通、確認物品的狀況，而租豬幫則大大簡化了這些繁瑣的步驟。你只需要選擇所需的物品、設定租借時間、付款，基本上就完成了整個過程。當然，如果在這個過程中有任何問題，租豬幫的客服團隊也總是非常迅速地提供幫助，他們不僅專業，還特別有耐心，每一次解決問題的速度都讓我感覺十分滿意。
            
            最讓我感動的是，租豬幫的價格也非常公道。與其他租賃平台相比，租豬幫的價格往往要實惠不少，尤其是在一些高價物品上，租豬幫給我的價格總是最具競爭力的。這樣的價格讓我無論是短期使用，還是長期租借，都能夠輕鬆負擔，而不會讓我的荷包吃緊。
            
            此外，租豬幫對於物品的保養也非常注重。每一次租賃到的東西，都像新的一樣，這讓我非常驚訝，畢竟在一些租賃平台上，我經常會遇到使用過的物品，甚至有些物品上會有明顯的磨損痕跡。但在租豬幫，我完全不需要擔心這些問題。這些小細節的用心，也正是這個平台讓我成為忠實用戶的原因之一。
            
            最後，說到客戶服務，租豬幫真的做得無可挑剔。每一次遇到問題，我都能夠在短時間內聯繫到客服，並且得到詳細、清晰的解答。這樣的服務讓我覺得不僅是租東西，還像是享受了一次非常愉快的體驗。如果有任何物品或服務上的問題，客服也會非常主動地幫助解決，而不是推卸責任或者讓我等待太長時間。
            
            總的來說，租豬幫真的是一個非常棒的平台，無論是對於物品的多樣性、租賃的便捷性，還是價格的實惠性，都是讓我非常滿意的。而且，最重要的是，這個平台總是讓我感受到一種暖心的服務，這種體貼的用心真的讓人覺得很放心，並且想要繼續支持它。無論你是需要一次性的工具，還是長期的設備，我都強烈推薦你來試試租豬幫，讓它成為你生活中的好幫手！`,
        }));
        setTitleLength(newTitle.length);
    };

    const [memberData, setMemberData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentTime, setCurrentTime] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [titleLength, setTitleLength] = useState(0);

    const router = useRouter();

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();

        return `${month}月${day}日 ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    // 下拉選單處理
    const handleClassSelect = (value) => {
        setFormData((prev) => ({ ...prev, disclass: value }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // 如果是 title，直接使用 value.length 計算字數
        if (name === "title") {
            setTitleLength(value.length); // 更新字數狀態
        }
    
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 圖片預覽
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setImagePreview(imageURL);
            setFormData((prev) => ({
                ...prev,
                image: file,
            }));
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("ptoken");

        if (!token) {
            setError("未登入或無效的 token");
            setLoading(false);
            return;
        }

        const updateTime = () => {
            const now = new Date();
            setCurrentTime(formatDate(now));
        };

        updateTime();
        setInterval(updateTime, 1000);

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
                    setFormData((prev) => ({ ...prev, member_id: result.member_id }));
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

    // 發文
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("ptoken");

        const formDataToSend = new FormData();

        formDataToSend.append('member_id', formData.member_id);
        formDataToSend.append('disclass', formData.disclass);
        formDataToSend.append('title', formData.title);
        formDataToSend.append('content', formData.content);

        if (formData.image) {
            formDataToSend.append('dis_img', formData.image);
        }

        const response = await fetch("http://localhost:3002/discuss/post", {
            method: "POST",
            headers: {"Authorization": `Bearer ${token}`},
            body: formDataToSend,
        });

        const result = await response.json();
        if (response.ok) {
            // console.log("發文成功:", result);
            setShowModal(true);
            setTimeout(() => router.push("/discuss"), 500);
        } else {
            // console.log("發文失敗:", result);
            setErrorMessage(result.message);
            setShowErrorModal(true);
        }
    };

    // 取消發文的處理
    const handleCancelClick = () => {
        router.back();
    };

    return (
        <div className="container post_card_outsider">
            <div className="row justify-content-center">
                <div className="col-lg-2">
                </div>
                <div className="col-lg-8 col-12 post_card d-flex flex-column py-3 px-5">
                    <Form onSubmit={handleSubmit}>
                        <SortDropdown onClassSelect={handleClassSelect} />
                        <div className="row align-items-center mt-3">
                            <div className="col-auto p-3">
                                <Img
                                    src={memberData?.img ? `http://localhost:3002/${memberData?.img}` : "/discuss_images/default.jpg"}
                                    className="rounded-circle"
                                    alt="頭貼"
                                    height={50}
                                    width={50}
                                />
                            </div>
                            <div className="col">
                                <span className="post_name d-block">{memberData?.nick_name}</span>
                                <span className="post_time d-block mt-2">{currentTime}</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-10">
                                <div className="row d-flex">
                                    <div className="col-9">
                                        <Form.Control
                                            type="text"
                                            placeholder="標題"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-3 d-flex justify-content-start align-items-center">
                                        {/* 在這裡顯示字數 */}
                                        <div className={`title-length ${titleLength > 20 ? 'warning' : ''}`}>
                                            ( {titleLength} / 20 )
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="need_know col-2 d-flex justify-content-end align-items-center">
                                <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip id="tooltip" className="custom-tooltip">
                                    <div style={{ textAlign: "left" }}>請維持討論區善良風氣<br />內容限1000字內<br />請小心使用</div></Tooltip>}
                                    >
                                    <span>
                                        <i className="bi bi-exclamation-circle-fill"></i>
                                        <span>發文須知</span>
                                    </span>
                                </OverlayTrigger>
                            </div>
                        </div>
                        <Form.Control
                            as="textarea"
                            placeholder="敘述"
                            className="mt-4 post_textarea"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                        />
                        <div className="row pt-3 mt-auto align-items-center">
                            <div className="post_photo col-1">
                                <label htmlFor="image-upload" className="bi bi-image-fill" style={{ cursor: "pointer", fontSize: "24px" }} />
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: "none" }}
                                />
                            </div>
                            <div className="col-1">
                                {imagePreview && (
                                    <div style={{ width: '100%', height: 0, paddingBottom: '90%' }}>
                                        <Img
                                            src={imagePreview}
                                            alt="預覽圖片"
                                            width={36}
                                            height={36}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="col-10 d-flex justify-content-end">
                                <Button
                                    className="post_cancer"
                                    text="取消"
                                    onClick={handleCancelClick}
                                />
                                <Button
                                    className="post_btn"
                                    text="發文"
                                    type="submit"
                                />
                            </div>
                        </div>
                    </Form>
                </div>
                <div className="d-flex col-1 justify-content-end">
                    <button className="auto_fill_btn quick_insert" type="button" onClick={handleAutoFill1} >快速填寫</button>
                </div>
                <div className="d-flex col-1 justify-content-end">
                    <button className="auto_fill_btn quick_insert" type="button" onClick={handleAutoFill2} >快速填寫</button>
                </div>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Body className="text-center p-4">
                    發文成功！
                </Modal.Body>
            </Modal>
            
            {/* 發文失敗 Modal */}
            <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
                <Modal.Body className="text-center p-4">
                    {errorMessage}
                </Modal.Body>
            </Modal>
        </div>
    );
}