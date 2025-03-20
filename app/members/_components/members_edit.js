"use client";
import { Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import Button from "../../_components/button";
import { Modal } from "react-bootstrap";
import { useRouter } from "next/navigation";
import * as yup from "yup";

const proItems = [
    { title: "暱稱：", icon: <i className="bi bi-person-heart"></i>, key: "nick_name" },
    { title: "會員姓名：", icon: <i className="bi bi-house"></i>, key: "member_name" },
    { title: "電子信箱：", icon: <i className="bi bi-envelope"></i>, key: "email" },
    { title: "連絡電話：", icon: <i className="bi bi-telephone"></i>, key: "phone" },
    { title: "生日日期：", icon: <i className="bi bi-cake2"></i>, key: "birth" },
    { title: "性別：", icon: <i className="bi bi-person-raised-hand"></i>, key: "gender" },
];

// Yup 驗證 schema
const schema = yup.object().shape({
    nick_name: yup.string().required("*暱稱不能為空"),
    member_name: yup.string().required("*會員姓名不能為空"),
    email: yup.string().email("*請輸入有效的電子郵件").required("*電子信箱不能為空"),
    phone: yup.string()
        .matches(/^[0-9]+$/, "電話只能包含數字")
        .min(10, "*電話號碼至少 10 碼")
        .max(10, "*超過 10 碼")
        .required("連絡電話不能為空"),
});

function MembersEdit({ memberData }) {
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (memberData) {
            setFormData({
                nick_name: memberData.nick_name,
                member_name: memberData.member_name,
                email: memberData.email,
                phone: memberData.phone,
                birth: memberData.birth,
                gender: memberData.gender,
            });
        }
    }, [memberData]);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const year = date.getFullYear() ;
        const month = date.getMonth() + 1;
        const day = date.getDate();
    
        return `${year}年 ${month}月 ${day}日`;
    };

    const token = localStorage.getItem("ptoken");
    if (!token) {
        setMessage("未登入或無效的 token");
        return;
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // 即時驗證
        yup.reach(schema, name)
            .validate(value)
            .then(() => {
                setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
            })
            .catch((err) => {
                setErrors((prevErrors) => ({ ...prevErrors, [name]: err.message }));
            });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            await schema.validate(formData, { abortEarly: false });
            
            // console.log("送出資料:", formData);
            const response = await fetch("http://localhost:3002/members/edit", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.member_name,
                    email: formData.email,
                    phone: formData.phone,
                    nick_name:formData.nick_name,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                if (result.success) {
                    setMessage("編輯成功！");
                    setShowModal(true);
                    setTimeout(() => {
                        setShowModal(false);
                        router.push("/members");
                    }, 1000);
                } else if (result.code === 304) {
                    setMessage("資料無變更");
                    setShowErrorModal(true);
                } else {
                    setMessage(result.error || "編輯失敗");
                    setShowErrorModal(true);
                }
            } else {
                setMessage("伺服器錯誤，請稍後再試");
                setShowErrorModal(true);
            }
        } catch (err) {
            console.error("提交錯誤:", err);
            // Yup 驗證錯誤處理
            if (err.inner) {
                const newErrors = {};
                err.inner.forEach((error) => {
                    newErrors[error.path] = error.message;
            });
            setErrors(newErrors);
        }
        }
    };

    return (
        <div className="row">
            <Form onSubmit={handleSubmit}>
                {proItems.map((item) => {
                    let value = formData[item.key];

                    if(item.key === "gender")
                    {
                        if(value === 1)
                        {
                            value = "男性";
                        }
                        else if(value === 2){
                            value = "女性";
                        }
                        else{
                            value = "不顯示";
                        }
                    }

                    if (item.key === "birth") {
                        value = formatDate(value);
                    }

                    return (
                        <div className="pt-3 d-flex align-items-center" key={item.key}>
                            <span className="pb-3">{item.icon}</span>
                            <span className="col-2 pb-3 d-flex justify-content-end">{item.title}</span>
                            <span className="col-3 ps-5">
                                <Form.Control
                                    type="text"
                                    name={item.key}
                                    value={value || ""}
                                    onChange={handleChange}
                                    className="edit_form"
                                    disabled={item.key === "birth" || item.key === "gender"}
                                />
                                <div className="login_alert">
                                    {errors[item.key] && (
                                        <div className="text-danger">{errors[item.key]}</div>
                                    )}
                                </div>
                            </span>
                        </div>
                    );
                })}
                <div className="row pt-5">
                    <div className="col-6 d-flex justify-content-center">
                        <Button 
                            className="discuss_post_btn"
                            type="submit"
                            text="提交"
                            onClick={handleSubmit}
                        />
                    </div>
                </div>
            </Form>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Body className="text-center p-4">
                    {message}
                </Modal.Body>
            </Modal>
            <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
                <Modal.Body className="text-center p-4 text-danger">
                    {message}
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default MembersEdit;