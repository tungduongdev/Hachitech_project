import Link from "next/link";

async function getProducts() {
  try {
    // Thêm absolute URL và các option fetch
    const res = await fetch('http://66.42.52.15/api/v1/products', {
      cache: 'no-store',
      next: { revalidate: 0 }, // Luôn lấy dữ liệu mới
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    
    if (!res.ok) {
      console.error('API responded with status:', res.status);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return []; // Trả về mảng rỗng để tránh lỗi render
  }
}

export default async function ProductsPage() {
  const products = await getProducts();
  console.log(products);
  return (
    <main className="main-body">
      <div className="container">
        <section style={{ width: "100%"}} className="product">
          <div className="product-heading">
            <h3>Our Products</h3>
            <p>Check out our latest collection</p>
          </div>
          
          <div className="product-list">
            {products.map((product) => (
              <Link className="product-item" key={product._id} href={`/product/${product._id}`}>
                <div className="product-card">
                  <div className="product-image">
                    <img src={product.imgUrl} alt={product.productName} />
                  </div>
                  <div className="product-info">
                    <h4 className="product-title">{product.productName}</h4>
                    <p className="product-price">${product.price.toLocaleString()}</p>
                    <p className="product-description">{product?.description || "Không có mô tả"}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}