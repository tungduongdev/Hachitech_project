
import Layout from "@/components/Layout";
import '@/styles/styles.css'
import 'antd/dist/reset.css';
import Head from "next/head";
export const metadata = {
  title: "ecomer app",
  description: "ecomer app",
  keywords: "ecomer app"
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Ecommerse website</title>
      </Head>
      <body>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
