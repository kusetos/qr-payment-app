import Hello from "@/compontents/Hello";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>My Next.js Sample</title>
      </Head>
      <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Welcome to Next.js + TypeScript 🚀</h1>
        <Hello name="World" />
      </main>
    </>
  );
}
