
export default function OrderDetailsPage({ params }) {
    return (
        <div className="container mx-auto py-12">
            <h1 className="text-3xl font-bold">Order Details</h1>
            <p>Order Number: {params.orderNumber}</p>
            {/* We will build the full details here */}
        </div>
    );
}