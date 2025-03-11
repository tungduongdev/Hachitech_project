'use client'

import React, { useEffect } from 'react'
//import products from '../mockdata.json'
import { getProductsApi } from '../apis/apis'

function Products() {
  const [products, setProducts] = React.useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProductsApi()
        setProducts(response.data)
        console.log(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

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
  )
}

export default Products