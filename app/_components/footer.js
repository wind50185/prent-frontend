"use client"; // 確保這個元件在 Client Side 運行

import { usePathname } from "next/navigation";
import Link from "next/link";
import PIcon from "./PIcon";

function Footer() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <div className="footer_bg">
      <div className="footer_container container">
        <footer className="d-flex flex-column flex-lg-row align-items-center text-center text-lg-start">
          <div className="footer_div col d-none d-lg-block">
            <h6 className="text-start">頁面</h6>
            <ul className="nav flex-column text-start">
              <li className="footer_text nav-item mb-1">
                <Link href="#" className="nav-link p-0 text-muted">
                  找租屋
                </Link>
              </li>
              <li className="footer_text nav-item mb-1">
                <Link href="#" className="nav-link p-0 text-muted">
                  頁面
                </Link>
              </li>
              <li className="footer_text nav-item mb-1">
                <Link href="#" className="nav-link p-0 text-muted">
                  找服務
                </Link>
              </li>
              <li className="footer_text nav-item mb-1">
                <Link href="#" className="nav-link p-0 text-muted">
                  討論區
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer_div col">
            <h6 className="text-lg-start text-center">認識租豬幫</h6>
            <ul className="nav flex-column text-start d-none d-lg-block">
              <li className="footer_text nav-item mb-1">
                <Link href="#" className="nav-link p-0 text-muted">
                  關於租豬幫
                </Link>
              </li>
              <li className="footer_text nav-item mb-1">
                <Link href="#" className="nav-link p-0 text-muted">
                  加入我們
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer_div col">
            <h6 className="text-lg-start text-center">使用條款</h6>
            <ul className="nav flex-column text-start d-none d-lg-block">
              <li className="footer_text nav-item mb-1">
                <Link href="#" className="nav-link p-0 text-muted">
                  使用條款
                </Link>
              </li>
              <li className="footer_text nav-item mb-1">
                <Link href="#" className="nav-link p-0 text-muted">
                  隱私政策
                </Link>
              </li>
              <li className="footer_text nav-item mb-1">
                <Link href="#" className="nav-link p-0 text-muted">
                  Cookie政策
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer_div col">
            <h6 className="text-lg-start text-center">聯絡我們</h6>
            <ul className="nav flex-column text-start d-none d-lg-block">
              <li className="footer_text nav-item mb-1">
                <Link href="#" className="nav-link p-0 text-muted">
                  地址：台北市大安區復興南路一段390號2樓
                </Link>
              </li>
              <li className="footer_text nav-item mb-1">
                <Link href="#" className="nav-link p-0 text-muted">
                  電話：(02)2222-1111
                </Link>
              </li>
              <li className="footer_text nav-item mb-1">
                <Link href="#" className="nav-link p-0 text-muted">
                  信箱：pigrent@pmail.com
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer_div col d-flex justify-content-center d-none d-lg-block">
            <ul className="nav flex-column">
              <PIcon/>
            </ul>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Footer;
