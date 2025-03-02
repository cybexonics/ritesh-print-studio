"use client";

import { useEffect, useState, useRef } from "react";
import Modal from "./ui/modal";

interface OrderDetailsProps {
  id: string;
}

interface CartItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
  color: string;
  size: string;
  customImage?: string;
  customText?: string;
}

interface Order {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  cartItems: CartItem[];
  totalAmount: number;
  status: string;
  orderDate: string;
}

export default function OrderDetails({ id }: OrderDetailsProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        const res = await fetch(`http://localhost:1227/orders/${id}`);
        if (!res.ok) throw new Error("Failed to fetch order details");
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError("Error fetching order details");
      } finally {
        setLoading(false);
      }
    }
    fetchOrderDetails();
  }, [id]);

  // Handle print invoice only
  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
<html>
<head>
  <title>Invoice</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      padding: 20px; 
      margin: 0;
    }
    .invoice-container { 
      max-width: 800px; 
      margin: auto; 
      border: 1px solid #ddd; 
      padding: 30px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .shop-info {
      text-align: center;
      margin-bottom: 30px;
    }
    .shop-name {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .shop-address {
      font-size: 12px;
      color: #666;
      margin-bottom: 5px;
    }
    .shop-contact {
      font-size: 12px;
      color: #666;
    }
    .invoice-header { 
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px; 
      border-bottom: 1px solid #eee;
      padding-bottom: 20px;
    }
    .invoice-title {
      font-size: 20px; 
      font-weight: bold;
    }
    .invoice-number {
      font-size: 14px;
      color: #666;
    }
    .invoice-date {
      font-size: 14px;
      color: #666;
    }
    .customer-info, .billing-info {
      margin-bottom: 20px;
    }
    .info-label {
      font-weight: bold;
      margin-bottom: 5px;
    }
    .customer-details {
      font-size: 14px;
      line-height: 1.5;
    }
    .invoice-items {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    .invoice-items th {
      background-color: #f5f5f5;
      padding: 10px;
      text-align: left;
      font-size: 14px;
      border-bottom: 2px solid #ddd;
    }
    .invoice-items td {
      padding: 10px;
      border-bottom: 1px solid #eee;
      font-size: 14px;
    }
    .invoice-items img { 
      max-width: 60px; 
      max-height: 60px; 
      border-radius: 5px; 
      margin-right: 10px;
      vertical-align: middle;
    }
    .invoice-items .product-name {
      display: inline-block;
      vertical-align: middle;
    }
    .text-right {
      text-align: right;
    }
    .invoice-summary {
      float: right;
      width: 300px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      font-size: 14px;
    }
    .summary-row.total {
      font-size: 18px;
      font-weight: bold;
      border-top: 2px solid #ddd;
      padding-top: 10px;
      margin-top: 10px;
    }
    .footer {
      margin-top: 50px;
      text-align: center;
      font-size: 12px;
      color: #888;
      clear: both;
    }
    @media print {
      body * { visibility: hidden; }
      .invoice-container, .invoice-container * { visibility: visible; }
      .invoice-container { position: absolute; left: 0; top: 0; width: 100%; }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <!-- Shop Information -->
    <div class="shop-info">
      <div class="shop-name">Ritesh Print Studio</div>
      <div class="shop-address">123 Print Avenue, Design District, New York, NY 10001</div>
      <div class="shop-contact">Tel: (555) 123-4567 | Email: info@riteshprint.com | www.riteshprintstudio.com</div>
    </div>
    
    <!-- Invoice Header -->
    <div class="invoice-header">
      <div>
        <div class="invoice-title">INVOICE</div>
        <div class="invoice-number">Invoice #: INV-${new Date().getFullYear()}-${Math.floor(
          1000 + Math.random() * 9000
        )}</div>
        <div class="invoice-date">Date: ${new Date().toLocaleDateString()}</div>
      </div>
    </div>
    
    <!-- Customer Information -->
    <div class="customer-info">
      <div class="info-label">CUSTOMER INFORMATION:</div>
      <div class="customer-details">
        <strong>Name:</strong>  ${order?.firstName} ${order?.lastName}<br>
        <strong>Email:</strong> ${order?.phone}<br>
        <strong>Phone:</strong> ${order?.email}<br>
      </div>
    </div>
    
    <!-- Billing Information -->
    <div class="billing-info">
      <div class="info-label">BILLING/SHIPPING ADDRESS:</div>
      <div class="customer-details">
        ${order?.address || "[Customer Address]"}<br>
        ${order?.city || "[City]"}, ${
          order?.zipCode || "[ZIP]"
        }
      </div>
    </div>
    
    <!-- Invoice Items -->
    <table class="invoice-items">
      <thead>
        <tr>
          <th>Product</th>
          <th>Size</th>
          <th>Quantity</th>
          <th>Price</th>
          <th class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${order?.cartItems
          .map(
            (item) => `
        <tr>
          <td>
            <img src="${item.image}" alt="${item.name}" />
            <span class="product-name">${item.name}</span>
            ${
              item.customText
                ? `<br><small>Custom: ${item.customText}</small>`
                : ""
            }
          </td>
          <td>${item.size || "N/A"}</td>
          <td>${item.quantity}</td>
          <td>$${item.price.toFixed(2)}</td>
          <td class="text-right">$${(item.price * item.quantity).toFixed(
            2
          )}</td>
        </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
    
    <!-- Invoice Summary -->
    <div class="invoice-summary">
      <div class="summary-row total">
        <span>Total:</span>
        <span>$${order?.totalAmount}</span>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      Thank you for your business! If you have any questions about this invoice, please contact us.
    </div>
  </div>
  
  <script>
    
    // Replace template variables with actual data
    document.body.innerHTML = document.body.innerHTML.replace(/\${([^}]*)}/g, function(match, p1) {
      try {
        return eval(p1) || '';
      } catch (e) {
        return '';
      }
    });
    
    // Print and close after a short delay to ensure rendering is complete
    setTimeout(() => {
      window.print();
      // Only close if opened as a popup
      if (window.opener) {
        window.close();
      }
    }, 500);
  </script>
</body>
</html>
        `);
        printWindow.document.close();
      }
    }
  };

  if (loading)
    return <p className="text-center mt-3">Loading order details...</p>;
  if (error) return <p className="text-center mt-3 text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg w-full max-w-3xl mx-auto">
      {/* Printable Invoice Section */}
      <div ref={printRef} className="p-6 bg-gray-100 rounded-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Invoice
        </h2>
        <div className="border-b pb-3 mb-3">
          <p>
            <strong>Customer:</strong> {order?.firstName} {order?.lastName}
          </p>
          <p>
            <strong>Phone:</strong> {order?.phone}
          </p>
          <p>
            <strong>Email:</strong> {order?.email}
          </p>
          <p>
            <strong>Address:</strong> {order?.address}, {order?.city},{" "}
            {order?.zipCode}
          </p>
        </div>

        <p>
          <strong>Status:</strong>{" "}
          <span className="text-blue-600">{order?.status}</span>
        </p>
        <p>
          <strong>Order Date:</strong>{" "}
          {new Date(order?.orderDate || "").toLocaleDateString()}
        </p>

        <div className="border-t pt-3 mt-3">
          <h3 className="text-lg font-semibold mb-2">Items:</h3>
          <div className="overflow-y-auto max-h-60">
            {order?.cartItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 border-b pb-2 mb-2"
              >
                <img
                  src={item.color}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p>
                    {item.quantity} x ${item.price} | Size: {item.size}
                  </p>
                </div>
                <Modal title={"Custem Image"}>
                  {item.customText}
                  <img
                    src={item.customImage}
                    alt={item.name}
                    className="w-100 h-100 object-cover rounded"
                  />
                </Modal>
              </div>
            ))}
          </div>
        </div>

        <p className="text-right text-xl font-bold mt-3">
          Total: $
          {order?.totalAmount
            ? order?.totalAmount
            : order?.cartItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              )}
        </p>
      </div>

      {/* Print Button */}
      <button
        onClick={handlePrint}
        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
      >
        Print Invoice
      </button>
    </div>
  );
}
