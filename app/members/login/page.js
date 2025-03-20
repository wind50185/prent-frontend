"use client"
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Form, Modal } from "react-bootstrap";
import Button from "@/app/_components/button";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import {  useState } from "react";

// 及時驗證
const schema = yup.object().shape({
    username: yup.string().required("*帳號不能為空"),
    password: yup.string().min(6, "*密碼至少要 6 位數").required("*密碼不能為空"),
});

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
    });

    const handleAutoFill1 = () => {
        setValue("username", "prent1@gmail.com");
        setValue("password", "!cc112233");
    };
    
    const handleAutoFill2 = () => {
        setValue("username", "prent2@gmail.com");
        setValue("password", "!cc112233");
    };

    const onSubmit = async (data) => {
        try {
            const aaa = await login(data.username, data.password);
            // console.log(aaa);
            if(aaa){
                setShowModal(true);

                setTimeout(() => {
                    setShowModal(false);
                    // 登入成功後跳轉頁面
                    router.push("/");
                }, 1500);
            } else{
                setErrorMessage(aaa.message);
                setShowErrorModal(true);
            }
        } catch (error) {
            console.error("登入失敗:", error.message);
            alert("登入失敗: " + error.message);
        }
    };

    return (
    <>
        <div className="container pt-3 pb-3">
            <div className="row justify-content-center">
                <div className="col-2">
                </div>
                <div className="col-8 post_card d-flex flex-column py-3 px-5 justify-content-center">
                    <div className="row d-flex justify-content-center">
                        <span className="login_text d-flex justify-content-center p-5">
                            登入
                        </span>
                        <div className="col-8 mt-2">
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Form.Control
                                    type="text"
                                    placeholder="帳號"
                                    className="login_form"
                                    {...register("username")}
                                />
                                <div className="login_alert">
                                    {errors.username && (
                                        <span className="text-danger">{errors.username.message}</span>
                                    )}
                                </div>
                                <div className="pt-3">
                                    <div className="d-flex textbox">
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            placeholder="密碼"
                                            className="login_form"
                                            {...register("password")}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="eye_button_login"
                                        >
                                            <i className={showPassword ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"}></i>
                                        </button>
                                    </div>
                                    <div className="login_alert d-flex justify-content-between">
                                        {errors.password && (
                                            <span className="text-danger">{errors.password.message}</span>
                                        )}
                                        <div className="forget_password">
                                            <span>忘記密碼</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 d-flex justify-content-center p-5">
                                    <Button 
                                        className="login_btn"
                                        text="登入"
                                        type="submit"
                                    />
                                </div>
                            </Form>
                        </div>
                        <div className="col-8 d-flex justify-content-center login_q_res pb-5">
                            <span>還沒有帳號嗎？</span>
                            <Link href="/members/register" className="text-decoration-none">
                                <span className="login_res">我要註冊</span>
                            </Link>
                        </div>
                        <div className="col-8 row d-flex justify-content-center mt-auto">
                            <div className="col-4"><hr/></div>
                            <div className="col-4 d-flex justify-content-center align-items-center">輕鬆登入</div>
                            <div className="col-4"><hr/></div>
                        </div>
                        <div className="col-8 d-flex justify-content-center pb-5 mt-auto">
                            <i className="login_google bi bi-google"></i>
                        </div>
                    </div>
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
                    登入成功！
                </Modal.Body>
            </Modal>
            
            {/* 失敗 Modal */}
            <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
                <Modal.Body className="text-center text-danger p-4">
                    帳號或密碼錯誤
                </Modal.Body>
            </Modal>
        </div>
    </>
    )
}