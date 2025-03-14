'use client'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div>{children}</div>
        <ToastContainer position="bottom-right" autoClose={3000} />
      </body>
    </html>
  )
}
