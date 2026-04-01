import Link from "next/link";

// 1. THIS IS THE KEY: It tells Next.js NOT to look for other dynamic IDs 
// because we are in a static (output: export) environment.
export const dynamicParams = false; 

// 2. The "Hall Pass" - stays as an empty array for static GitHub Pages.
export function generateStaticParams() {
  return []; 
}

export default async function OrderConfirmationPage(props: any) {
  // In Next.js 15, we must await the params
  const params = await props.params;
  const orderId = params?.orderId || "Order Received";

  return (
    <div style={{ padding: "100px 20px", textAlign: "center", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#16a34a", fontSize: "2.5rem" }}>Success!</h1>
      <p style={{ fontSize: "1.2rem", color: "#666" }}>Your order is being processed.</p>
      
      <div style={{ 
        margin: "30px 0", 
        padding: "15px", 
        background: "#f9fafb", 
        borderRadius: "8px", 
        display: "inline-block", 
        border: "1px solid #e5e7eb" 
      }}>
        <span style={{ fontWeight: "bold" }}>Order ID:</span> {orderId}
      </div>

      <div style={{ marginTop: "30px" }}>
        <Link 
          href="/" 
          style={{ padding: "12px 24px", background: "#000", color: "#fff", borderRadius: "5px", textDecoration: "none" }}
        >
          Back to LTB Home
        </Link>
      </div>
    </div>
  );
}