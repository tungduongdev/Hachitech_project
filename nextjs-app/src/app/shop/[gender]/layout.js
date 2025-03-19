'use client'
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import "@/styles/styles.css"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <div>{children}</div>
        <Footer></Footer>
      </body>
    </html>
  )
}
