import { AuthContextProvider } from "@/contexts/auth-context";
import { CartProvider } from "@/contexts/cart-context";
import "./styles/globals.scss";
import Footer from "./_components/footer";
import Navbar from "./_components/navbar";
import "bootstrap-icons/font/bootstrap-icons.css";
import Loading from "./_components/Loading";

export const metadata = {
  title: "租豬幫",
  description:
    "「租豬幫」讓租屋變得更輕鬆！無論是學生、上班族或家庭，我們提供各式房源，包含套房、公寓、整層出租等，滿足不同需求。透過智能篩選，一鍵找到符合預算、地點及設備的理想住所，並且即時更新最新房源，確保租客掌握最佳選擇。安全驗證機制讓租賃更安心，避免黑心房東與詐騙問題。現在就來 租豬幫，輕鬆找到你的理想家！",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <AuthContextProvider>
      <CartProvider>
        <html lang="zh">
          <head></head>
          <body
            id="Top"
            style={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Navbar />
            <main style={{ flexGrow: 1 }}>
              <Loading />
              {children}
            </main>
            <Footer />
            <script
              src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
              defer
            ></script>
          </body>
        </html>
      </CartProvider>
    </AuthContextProvider>
  );
}
