import Link from "next/link";

export default function NotFound() {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                backgroundColor: "#f8f9fa",
                padding: "20px",
            }}
        >
            <h1 style={{ fontSize: "80px", color: "red", margin: "0" }}>404</h1>
            <h2 style={{ fontSize: "24px", margin: "10px 0" }}>Page Not Found</h2>
            <p style={{ color: "#555", maxWidth: "400px" }}>
                Sorry, the page you are looking for does not exist or has been moved.
            </p>

            <div style={{ marginTop: "20px" }}>
                <Link
                    href="/"
                    style={{
                        textDecoration: "none",
                        backgroundColor: "#000000ff",
                        color: "white",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        marginRight: "10px",
                    }}
                >
                    Go Home
                </Link>

                <Link
                    href="/shop"
                    style={{
                        textDecoration: "none",
                        backgroundColor: "#28a745",
                        color: "white",
                        padding: "10px 20px",
                        borderRadius: "8px",
                    }}
                >
                    Visit Shop
                </Link>
            </div>
        </div>
    );
}
