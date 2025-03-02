"use client"

import React, { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { CheckCircle, Truck, Box, Smile } from "lucide-react"

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState("")
  const [orderStatus, setOrderStatus] = useState(null)
  const [trackingData, setTrackingData] = useState(null)

  // Dummy order tracking data for illustration
  const orderTimeline = [
    { stage: "Order Placed", status: "completed", icon: <CheckCircle className="text-green-500" />, date: "2025-02-18" },
    { stage: "Processing", status: "completed", icon: <Box className="text-blue-500" />, date: "2025-02-19" },
    { stage: "Shipped", status: "pending", icon: <Truck className="text-yellow-500" />, date: "2025-02-20" },
    { stage: "Delivered", status: "pending", icon: <Smile className="text-gray-500" />, date: "2025-02-21" },
  ]

  const handleTrackOrder = () => {
    if (orderNumber === "") return

    // Simulate API call to fetch order tracking data
    setTrackingData(orderTimeline)
    setOrderStatus("success")
  }

  return (
    <div className="bg-white min-h-screen px-6 md:px-16 lg:px-24 mb-12 flex flex-col items-center justify-center" style={{ paddingTop: "100px", paddingBottom: "100px" }}>
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Track Your Order</h1>
        
        {/* Order Number Input */}
        <div className="mb-6 flex justify-center">
          <Input
            type="text"
            placeholder="Enter your order number"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="w-96 text-center"
          />
        </div>

        <Button size="lg" onClick={handleTrackOrder} className="mb-6">
          Track Order
        </Button>

        {/* Show Order Timeline */}
        {orderStatus === "success" && trackingData && (
  <div className="mt-8 w-full">
    <h2 className="text-2xl font-semibold mb-6">Order Timeline</h2>

    {/* Timeline Section */}
    <div className="relative">
      {/* Line connecting the timeline - placed behind the timeline items */}
      <div className="absolute left-0 top-8 w-full h-1 bg-blue-700 z-0 sm:block hidden"></div> 

      {/* Flex container for timeline items */}
      <div className="flex justify-between items-center space-x-8 sm:space-x-16 lg:space-x-32 flex-wrap z-[2]">
        {trackingData.map((item, index) => (
          <div key={index} className="flex flex-col items-center space-y-2 sm:space-y-4">
            <div
              className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full ${item.status === "completed" ? "bg-green-500" : item.status === "pending" ? "bg-gray-300" : "bg-yellow-500"}`}
            >
              {item.icon}
            </div>
            <p className="text-sm">{item.stage}</p>
            <p className="text-xs text-gray-600">{item.date}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
)}



        {/* State message when no order has been tracked */}
        {orderStatus === null && (
          <p className="text-xl text-gray-700 mt-6">Enter an order number to start tracking your order.</p>
        )}

        {/* Error message when order tracking fails */}
        {orderStatus === "failed" && (
          <p className="text-red-500 mt-6">Invalid order number. Please try again.</p>
        )}
      </div>
    </div>
  )
}
