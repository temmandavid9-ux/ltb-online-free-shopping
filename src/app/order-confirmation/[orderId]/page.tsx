import Link from "next/link";

export default async function OrderConfirmationPage(props: any) {
  // Next.js 15 requires awaiting params
  const params = await props.params;
  const orderId = params.orderId;

  return (
    <div style={{ padding: "50px", textAlign: "center", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "2rem", color: "#16a34a" }}>Order Confirmed!</h1>
      <p>Thank you for shopping with LTB Brand.</p>
      <div style={{ margin: "20px 0", padding: "10px", background: "#f3f4f6", display: "inline-block" }}>
        <strong>Order ID:</strong> {orderId}
      </div>
      <br /><br />
      <Link href="/" style={{ color: "#2563eb", textDecoration: "underline" }}>
        Return to Home
      </Link>
    </div>
  );
}