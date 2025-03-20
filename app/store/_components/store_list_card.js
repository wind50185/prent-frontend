"use client";
import Image from "next/image";

export default function StoreListCard({ src, product_name, product_price }) {
  
  return (
    <div className="card border border-top-0 rounded-3">
      <Image 
        src={src}
        width={388}
        height={528}
        className="rounded-3 store_responsive_img"
        alt={product_name}
      />
      <div className="card-body">
        <h5 style={{ fontSize: "18px", color: "#545454", fontWeight: "200" }}>
          {product_name}
        </h5>
        <p style={{ fontSize: "20px", color: "#EC8692" }}>{product_price}</p>
      </div>
    </div>
  );
}

      {/* 以下為舊的4格1組的元件
      
      <div className="row mb-4">
    <div className="col-md-3">
      <div className="product-card">
      <Link href={'/store/list/1'} className="store_link">
      <Image
            src={src}
            alt="桌子1"
            width={388}
            height={528}
            className="img-fluid"
          />
          </Link>
          <h5>原木茶几</h5>
          <p>$1,500</p>
          
        </div>
      </div>
      <div className="col-md-3">
        <div className="product-card">
          <Image
            src="/store_images/list_table.webp"
            alt="桌子2"
            width={388}
            height={528}
            className="img-fluid"
          />
          <h5>現代圓桌</h5>
          <p>$2,000</p>
        </div>
      </div>
      <div className="col-md-3">
        <div className="product-card">
          <Image
            src="/store_images/list_table.webp"
            alt="桌子3"
            width={388}
            height={528}
            className="img-fluid"
          />
          <h5>長型餐桌</h5>
          <p>$2,800</p>
        </div>
      </div>
      <div className="col-md-3">
        <div className="product-card">
          <Image
            src="/store_images/list_table.webp"
            alt="桌子4"
            width={388}
            height={528}
            className="img-fluid"
          />
          <h5>折疊桌</h5>
          <p>$1,200</p>
        </div>
    </div>
  </div>

<style jsx>{`
  .promo-banner img {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }

  .product-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
    text-align: center;
    background-color: #fff;
  }

  .product-card img {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }

  .product-card h5 {
    margin-top: 10px;
    font-size: 18px;
    color: #333;
  }

  .product-card p {
    color: #EC8692;
    font-size: 16px;
  }

  .form-select, .form-control {
    border-radius: 5px;
    padding: 8px;
  }

  .row {
    margin-bottom: 1.5rem;
  }
`}</style> */}
    
