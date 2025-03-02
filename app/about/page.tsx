import Image from "next/image";
import { Button } from "../components/ui/button";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen px-6 md:px-16 lg:px-24 mb-12" style={{ paddingTop: "120px", paddingBottom: "120px" }}>
      {/* Page Header */}
      <h1 className="text-5xl font-extrabold text-gray-900 text-center mb-12">About Fashion Store</h1>

      {/* Hero Section */}
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <Image
            src="/placeholder.svg?height=500&width=700"
            alt="Fashion Store Team"
            width={700}
            height={500}
            className="rounded-lg shadow-lg"
          />
        </div>
        <div>
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Our Story</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Founded in 2010, Fashion Store began as a small boutique with a big dream: to redefine fashion by making 
            high-quality, stylish clothing accessible to everyone. Over the years, we have evolved into a nationwide 
            brand, but our core values remain unchanged.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Our collections blend timeless elegance with modern trends, ensuring that you always step out in confidence.
            Whether your&apos;e looking for classic essentials or statement pieces, we&apos;ve got something for you.
          </p>
          <Button className="bg-black text-white hover:bg-[rgb(20,184,166)] px-6 py-3 text-lg rounded-lg shadow-md transition">
            Explore Our Collection
          </Button>
        </div>
      </div>

      {/* Our Mission & Values */}
      <div className="container mx-auto mt-20 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Our Mission & Values</h2>
        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
          We believe that **fashion is more than clothing—it&apos;s a form of self-expression.** Our mission is to 
          empower individuals with styles that inspire confidence, while upholding sustainability and affordability.
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mt-8">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900">Quality</h3>
            <p className="text-gray-600 mt-2">We ensure premium craftsmanship and durability in every piece.</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900">Affordability</h3>
            <p className="text-gray-600 mt-2">Trendy fashion at prices that make style accessible to all.</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900">Sustainability</h3>
            <p className="text-gray-600 mt-2">We are committed to eco-friendly materials and ethical production.</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900">Customer First</h3>
            <p className="text-gray-600 mt-2">Your satisfaction is our top priority—always.</p>
          </div>
        </div>
      </div>

      {/* Customer Testimonials */}
      <div className="container mx-auto mt-20">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">What Our Customers Say</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <p className="text-lg font-semibold text-gray-700">&quot;The quality of the products is outstanding! 
            I&apos;ve never felt more confident in my outfits.&quot;</p>
            <p className="text-gray-600 mt-2">- Sarah Johnson</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <p className="text-lg font-semibold text-gray-700">&quot;Affordable, stylish, and eco-friendly! I love 
            what this brand stands for.&quot;</p>
            <p className="text-gray-600 mt-2">- Mark Williams</p>
          </div>
        </div>
      </div>

      {/* Call-to-Action */}
      <div className="container mx-auto mt-20 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Join Our Fashion Community</h2>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6">
          Be the first to discover new arrivals, exclusive deals, and style inspiration. Sign up for our newsletter today!
        </p>
        <Button className="bg-black text-white hover:bg-[rgb(20,184,166)] px-6 py-3 text-lg rounded-lg shadow-md transition">
          Subscribe Now
        </Button>
      </div>
    </div>
  );
}
