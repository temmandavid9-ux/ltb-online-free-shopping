import Link from "next/link";

export default async function OrderConfirmationPage(props: any) {
  // This bypasses the strict Next.js 15 Promise requirement
  const params = await props.params;
  const orderId = params.orderId;

  return (
    <div style={{ padding: "50px", textAlign: "center", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "2rem", color: "#16a34a" }}>Thank You!</h1>
      <p>Your order has been placed successfully.</p>
      <div style={{ margin: "20px 0", padding: "10px", background: "#f3f4f6", display: "inline-block" }}>
        <strong>Order ID:</strong> {orderId}
      </div>
      <br />
      <Link href="/" style={{ color: "#2563eb", textDecoration: "underline" }}>
        Return Home
      </Link>
    </div>
  );
}