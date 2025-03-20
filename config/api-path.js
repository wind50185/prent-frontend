export const API_SERVER = "http://localhost:3002";

// 登入後取得 JWT
// {email, password}
export const LOGIN_JWT = `${API_SERVER}/login-jwt`;

// 服務首頁 - 取得專家列表 GET
export const SERVICE_HOME = `${API_SERVER}/service/api`;

// 服務專家列表 - 取得專家列表 GET
export const SERVICE_PRO_LIST = `${API_SERVER}/service/pro/api`;

// 服務專家詳情頁 - 取得單筆專家資料 GET
export const SERVICE_PRO_DETAIL = `${API_SERVER}/service/pro/api`;

// 租屋詳情頁 - 取得單筆租屋資料 GET
export const RENT_ITEM = `${API_SERVER}/rent/api`;

// 租屋輪播圖 - 取得單筆租屋圖片資料 GET
export const RENT_IMG = `${API_SERVER}/rent/images/api`;
