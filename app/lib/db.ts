// export const products = [
//     {
//         id: 1,
//         name: "Classic T-Shirt",
//         price: 59.99,
//         description: "A comfortable and stylish classic t-shirt made from 100% cotton.",
//         features: ["100% Cotton", "Breathable fabric", "Machine washable"],
//         images: [
//             "https://res.cloudinary.com/dxd3jzvmq/image/upload/v1740213528/cld-sample-5.jpg",
//             "/product/tshirt2-3.jpg?height=400&width=300",
//             "/product/tshirt2-4.jpg?height=400&width=300",
//         ],
//         category: "t-shirt",
//         sizes: ["XS", "S", "M", "L", "XL"],
//         customizable:true,
//     },
//     {
//         id: 2,
//         name: "Mouse Pad",
//         price: 99.99,
//         description: "A smooth surface mouse pad with anti-slip rubber base.",
//         features: ["Waterproof coating", "Non-slip base", "Smooth tracking surface"],
//         images: ["/product/pad.jpg?height=400&width=300"],
//         category: "mouse-pad",
//         customizable:true,
//     },
//     {
//         id: 3,
//         name: "Heart Cup",
//         price: 299.99,
//         description: "A cute heart-shaped cup perfect for coffee lovers.",
//         features: ["Ceramic material", "Dishwasher safe", "Heart-shaped handle"],
//         images: ["/product/cup.jpg?height=400&width=300"],
//         category: "cups",
//         customizable:true,
//     },
//     {
//         id: 4,
//         name: "Cup",
//         price: 249.99,
//         description: "A premium quality cup for hot and cold beverages.",
//         features: ["Durable ceramic", "Microwave safe", "Available in various colors"],
//         images: ["/product/cup-2.jpg?height=400&width=300"],
//         category: "cups",
//         customizable:true,
//     },
//     {
//         id: 5,
//         name: "T-Shirt",
//         price: 89.99,
//         description: "A trendy t-shirt with a modern fit and soft fabric.",
//         features: ["Soft and lightweight", "Unisex fit", "Multiple color options"],
//         images: [
//             "/product/tshirt-1.jpg?height=400&width=300",
//             "/product/tshirt-1-black.jpg?height=400&width=300",
//             "/product/tshirt-1-white.jpg?height=400&width=300"
//         ],
//         category: "t-shirt",
//         customizable:true,
//         sizes: ["XS", "S", "M", "L", "XL"],
//     },
//     {
//         id: 6,
//         name: "Magic Pillow",
//         price: 299.99,
//         description: "A reversible sequin pillow that changes color with a swipe.",
//         features: ["Reversible sequins", "Soft fabric", "Great for decoration"],
//         images: ["/product/magic.jpg?height=400&width=300"],
//         category: "pillow",
//         customizable:true,
//     },
//     {
//         id: 7,
//         name: "Velvet Pillow",
//         price: 69.99,
//         description: "A luxurious velvet pillow for ultimate comfort.",
//         features: ["Plush velvet fabric", "Soft and cozy", "Available in different colors"],
//         images: ["/Product/2.jpg?height=400&width=300"],
//         category: "pillow",
//         customizable:true,
//     },
//     {
//         id: 8,
//         name: "Hoodies",
//         price: 49.99,
//         description: "A warm and stylish hoodie, perfect for chilly weather.",
//         features: ["Fleece lined", "Adjustable hood", "Front pocket"],
//         images: [
//             "/product/hodies.jpg?height=400&width=300",
//             "/product/hodies-black.jpg?height=400&width=300",
//             "/product/hodies-blue.jpg?height=400&width=300"
//         ],
//         category: "pillow",
//         customizable:true,
//         sizes: ["XS", "S", "M", "L", "XL"],
//     },
//     {
//         id: 9,
//         name: "Water Bottle",
//         price: 49.99,
//         description: "A durable and eco-friendly water bottle.",
//         features: ["BPA-free", "Leak-proof cap", "Multiple sizes available"],
//         images: ["/product/bottol.jpg?height=400&width=300"],
//         category: "other",
//         customizable:true,
//         sizes:["500 ml", "1L"],
//     },
//     {
//         id: 10,
//         name: "T-Shirt",
//         price: 49.99,
//         description: "A casual t-shirt available in various colors.",
//         features: ["Soft and breathable", "Comfort fit", "Different sizes available"],
//         images: [
//             "/product/tshirt-3.jpg?height=400&width=300",
//             "/product/tshirt-3-black.jpg?height=400&width=300",
//             "/product/tshirt-3-grey.jpg?height=400&width=300"
//         ],
//         category: "t-shirt",
//         customizable:true,
//         sizes: ["XS", "S", "M", "L", "XL"],
//     }
// ];

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    features: string[];
    images: string[];
    category: string;
    customizable: boolean;
    sizes?: string[];
  }

export const products = async () => {
  const res = await fetch("https://ritesh-print-studio.vercel.app/products");
  const data = await res.json();
  if (!products || products.length === 0) {
    console.error("No products available for export.");
    return;
  }
  return data;
};
