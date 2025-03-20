"use client";

import { useState } from "react";
import { Form, Modal } from "react-bootstrap";
import * as Yup from "yup";
import Button from "@/app/_components/button";
import SortDropdown from "../_components/sort_dropdown";
import BirthdaySelect from "../_components/birthday_select";
import { useRouter } from "next/navigation";

// 定義 Yup 驗證規則
const validationSchema = Yup.object({
    name: Yup.string().required("*姓名不可為空"),
    email: Yup.string().email("*電子信箱格式錯誤").required("*電子信箱為必填"),
    password: Yup.string()
        .min(6, "*密碼至少 6 碼")
        .required("*密碼為必填"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), ""], "*兩次密碼輸入不一致")
        .required("*確認密碼為必填"),
    phone: Yup.string()
        .matches(/^[0-9]{10}$/, "*手機號碼需為 10 碼數字")
        .required("*手機號碼為必填"),
    nickname: Yup.string().required("*暱稱為必填"),
    gender: Yup.string().required("*請選擇性別"),
    birth: Yup.string().required("*請選擇生日"),
});

export default function ResPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        nickname: "",
        gender: "",
        birth: "",
    });

    const [errors, setErrors] = useState({}); // 存yup錯誤訊息
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");// 存後端回傳錯誤訊息(ex.400之類的)
    const [showPassword, setShowPassword] = useState(false); // 控制密碼顯示/隱藏
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 控制密碼顯示/隱藏

    // 即時驗證
    const validateField = async (name, value) => {
        try {
            if (name === "confirmPassword") {
                // 確認密碼時，讓 Yup 驗證整個 `formData`
                await validationSchema.validateAt(name, { 
                    [name]: value, 
                    password: formData.password, // 確保 Yup 能獲取 `password`
                });
            } else {
                await validationSchema.validateAt(name, { [name]: value });
            }
            setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // 清除錯誤
        } catch (error) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: error.message }));
        }
    };

    // 快速填入資料
    const handleAutoFill1 = () => {
        setFormData({
            name: "王晨晨",
            email: "prent1@gmail.com",
            password: "!cc112233",
            phone: "0900000000",
            nickname: "晨晨",
        });
    };

    const handleAutoFill2 = () => {
        setFormData({
            name: "李歡歡",
            email: "prent2@gmail.com",
            password: "!cc112233",
            phone: "0910000000",
            nickname: "歡歡",
        });
    };

    const handleAutoFill3 = () => {
        setFormData({
            name: "何家家",
            email: "prent3@gmail.com",
            password: "!cc112233",
            phone: "0920000001",
            nickname: "++",
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        validateField(name, value); // 即時驗證
    };

    // 下拉選單處理
    const handleGenderSelect = (value) => {
        setFormData((prev) => ({ ...prev, gender: value }));
        validateField("gender", value);
    };

    const handleBirthdaySelect = (value) => {
        setFormData((prev) => ({ ...prev, birth: value }));
        validateField("birth", value);
    };

    // 送出表單
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // 驗證整個表單
            await validationSchema.validate(formData, { abortEarly: false });
            setErrors({}); // 清空錯誤訊息

            const response = await fetch("http://localhost:3002/members/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            // console.log("回應資料:", result);

            if (response.ok) {
                setShowModal(true);
                setTimeout(() => router.push("/members/login?fromRegister=true"), 2000);
            } else {
                setErrorMessage(result.message || "註冊失敗");
                setShowErrorModal(true);
            }
        } catch (error) {
            // 解析 Yup 錯誤
            const newErrors = {};
            error.inner.forEach((err) => {
                newErrors[err.path] = err.message;
            });
            setErrors(newErrors);
        }
    };

    return (
        <div className="container pt-3 pb-3">
            <div className="row justify-content-center">
                <div className="col-3">
                </div>
                <div className="col-6 post_card d-flex flex-column py-3 px-5 justify-content-center">
                    <div className="row d-flex justify-content-center">
                        <span className="edit_text d-flex justify-content-center pt-4">註冊</span>
                        <div className="col-12 d-flex justify-content-center">
                            <Form onSubmit={handleSubmit}>
                                <Form.Control
                                    type="text"
                                    placeholder="姓名"
                                    className="re_form mt-3"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                                <div className="login_alert">
                                    {errors.name && <div className="text-danger">{errors.name}</div>}
                                </div>

                                <div className="row mt-3 mb-3">
                                    <div className="col-4">
                                        <SortDropdown onGenderSelect={handleGenderSelect} className={errors.gender ? "border_danger" : ""}/>
                                        {/* <div className="login_alert">
                                            {errors.gender && <div className="text-danger">{errors.gender}</div>}
                                        </div> */}
                                    </div>
                                    <div className="col-8">
                                        <BirthdaySelect onBirthdaySelect={handleBirthdaySelect} className={errors.birth ? "border_danger" : ""}/>
                                        {/* <div className="login_alert">
                                            {errors.birth && <div className="text-danger">{errors.birth}</div>}
                                        </div> */}
                                    </div>
                                </div>

                                <Form.Control
                                    type="email"
                                    placeholder="電子信箱"
                                    className="re_form"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <div className="login_alert">
                                    {errors.email && <div className="text-danger">{errors.email}</div>}
                                </div>

                                <div className="d-flex textbox">
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        placeholder="密碼"
                                        className="re_form mt-3"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="eye_button"
                                    >
                                        <i className={showPassword ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"}></i>
                                    </button>
                                </div>
                                <div className="login_alert">
                                    {errors.password && <div className="text-danger">{errors.password}</div>}
                                </div>
                                <div className="d-flex textbox">
                                    <Form.Control
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="確認密碼"
                                        className="re_form mt-3"
                                        name="confirmPassword"
                                        value={formData.confirmPassword || ""}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="eye_button"
                                    >
                                        <i className={showConfirmPassword ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"}></i>
                                    </button>
                                </div>
                                <div className="login_alert">
                                    {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
                                </div>

                                <Form.Control
                                    type="text"
                                    placeholder="手機號碼"
                                    className="re_form mt-3"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                                <div className="login_alert">
                                    {errors.phone && <div className="text-danger">{errors.phone}</div>}
                                </div>

                                <Form.Control
                                    type="text"
                                    placeholder="暱稱"
                                    className="re_form mt-3"
                                    name="nickname"
                                    value={formData.nickname}
                                    onChange={handleChange}
                                />
                                <div className="login_alert">
                                    {errors.nickname && <div className="text-danger">{errors.nickname}</div>}
                                </div>

                                <div className="d-flex justify-content-center p-3">
                                    <Button className="login_btn" text="註冊" type="submit" />
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
                <div className="d-flex col-1 justify-content-end">
                    <button className="auto_fill_btn quick_insert" type="button" onClick={handleAutoFill1} >快速填寫</button>
                </div>
                <div className="d-flex col-1 justify-content-end">
                    <button className="auto_fill_btn quick_insert" type="button" onClick={handleAutoFill2} >快速填寫</button>
                </div>
                <div className="d-flex col-1 justify-content-end">
                    <button className="auto_fill_btn quick_insert" type="button" onClick={handleAutoFill3} >快速填寫</button>
                </div>
            </div>

            {/* 註冊成功 Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Body className="text-center p-4">
                    註冊成功！ 2 秒後跳轉至登入頁面
                </Modal.Body>
            </Modal>
            
            {/* 註冊失敗 Modal */}
            <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
                <Modal.Body className="text-center p-4">
                    {errorMessage}
                </Modal.Body>
            </Modal>
        </div>
    );
}