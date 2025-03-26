export default function Loading() {
    return (
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="ml-3">Loading product...</p>
        </div>
      </div>
    )
  }
  
  