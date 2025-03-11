// app/products/page.jsx
import { cookies } from 'next/headers';


async function getProducts() {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;
  console.log('Access token:', token);
  if (!token) {
    throw new Error('Access token not found');
  }
  try {
    // Thêm absolute URL và các option fetch
    const res = await fetch('http://localhost:5000/api/v1/products', {
      cache: 'no-store',
      next: { revalidate: 0 }, // Luôn lấy dữ liệu mới
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!res.ok) {
      console.error('API responded with status:', res.status);
      return []; // Trả về mảng rỗng thay vì ném lỗi
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return []; // Trả về mảng rỗng để tránh lỗi render
  }
}

export default async function ProductsPage() {
  const products = await getProducts();
  
  return (
    <main className="main-body">
      <div className="container">
        <section className="product">
          <div className="product-heading">
            <h3>Our Products</h3>
            <p>Check out our latest collection</p>
          </div>
          <div className="product-list">
            {products.map((product) => (
              <div key={product._id} className="product-item">
                <img src={product.imgUrl} alt={product.name} />
                <h4>{product.productName}</h4>
                <p>${product.price}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}