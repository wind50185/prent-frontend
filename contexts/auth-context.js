"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const emptyAuth = {
    member_id: 0,
    email: "",
    nickname: "",
    img: "",
    member_name:"",
    token: "",
};

const storageKey = "prent-auth";

export function AuthContextProvider({ children }) {
    const [auth, setAuth] = useState({ ...emptyAuth });

    // 1. 登入: login()
    const login = async (email, password) => {
        try {
        const r = await fetch("http://localhost:3002/members/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: {
            "Content-Type": "application/json",
            },
        });
        const result = await r.json();
        
        if (result.success) {
            // console.log(result.data);
            //檢查token
            const token = result.data.token;
            // console.log("登入成功，獲取的 token:", token);

            // 儲存 token 並更新 auth 狀態
            localStorage.setItem(storageKey, JSON.stringify(result.data));
            localStorage.setItem("ptoken", result.data.token);
            // console.log("getItem\n",localStorage.getItem(storageKey),"原本storage\n",localStorage.token);
            setAuth(result.data);
            return true;
        } else {
            // 登入失敗
            return false;
        }
        } catch (ex) {
        console.error("登入錯誤:", ex);
        return false;
        }
    };

  // 2. 登出: logout()
  const logout = () => {
    localStorage.removeItem(storageKey);
    localStorage.removeItem("ptoken");    // 清除 ptoken
    setAuth({ ...emptyAuth });
    // console.log("auth",auth.token, "localstorage的token",localStorage.token);
  };

  // 3. 登入者的資料: auth

  // 4. 取得已登入的 token: getAuthHeader()
  const getAuthHeader = () => {
    if (!auth.member_id) return {};
    return {
      Authorization: `Bearer ${auth.token}`,
    };
  };

  useEffect(() => {
    const str = localStorage.getItem(storageKey);
    try {
      const data = JSON.parse(str);
      if (data) setAuth(data);
    } catch (ex) {("伺服器錯誤");}
  }, []);
  return (
    <AuthContext.Provider value={{ auth, login, logout, getAuthHeader }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;