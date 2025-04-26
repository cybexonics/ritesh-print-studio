const express = require("express")
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb")
const cors = require("cors")
const path = require("path")
const Razorpay = require("razorpay")

const razorpayInstance = new Razorpay({
  key_id: "rzp_test_ACwzTcmjQbeIzd",
  key_secret: "1ERxqrq3f15PnA77lBbtbfOD",
})


const uri =
  "mongodb+srv://riteshprintstudio:sanskar19@print-studio.0ougy.mongodb.net/?retryWrites=true&w=majority&appName=print-studio"
const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const app = express()

app.use(express.json())
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

// Serve static HTML file
app.use(express.static(path.join(__dirname)))
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

let db

// Connect to MongoDB once and reuse the connection
async function connectDB() {
  try {
    if (!db) {
      await client.connect()
      db = client.db("print-studio")
      console.log("MongoDB connection established")
    }
  } catch (error) {
    console.error("MongoDB connection failed:", error)
    process.exit(1)
  }
}

// Call the function to connect to the database
connectDB()

// CRUD operations for products

// Create a product
app.post("/products", async (req, res) => {
  try {
    const product = req.body
    await client.connect()
    const db = client.db("print-studio")
    const productsCollection = db.collection("products")
    const result = await productsCollection.insertOne(product)
    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error })
  }
})

// Read all products
app.get("/products", async (req, res) => {
  try {
    await client.connect()
    const db = client.db("print-studio")
    const productsCollection = db.collection("products")
    const products = await productsCollection.find().toArray()
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error })
  }
})

// Read a single product by ID
app.get("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id
    await client.connect()
    const db = client.db("print-studio")
    const productsCollection = db.collection("products")
    const product = await productsCollection.findOne({ _id: new ObjectId(productId) })
    if (product) {
      res.status(200).json(product)
    } else {
      res.status(404).json({ message: "Product not found" })
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error })
  }
})

// Update a product
app.put("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id
    const updatedProduct = req.body

    console.log("Incoming update request:", updatedProduct)

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" })
    }

    // Remove _id field to prevent immutable field error
    delete updatedProduct._id

    const db = client.db("print-studio")
    const productsCollection = db.collection("products")

    const result = await productsCollection.updateOne({ _id: new ObjectId(productId) }, { $set: updatedProduct })

    console.log("Update result:", result)

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.status(200).json({ message: "Product updated successfully!" })
  } catch (error) {
    console.error("Error updating product:", error)
    res.status(500).json({ message: "Error updating product", error })
  }
})

// Delete a product
app.delete("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id
    console.log(productId)
    await client.connect()
    const db = client.db("print-studio")
    const productsCollection = db.collection("products")
    const result = await productsCollection.deleteOne({ _id: new ObjectId(productId) })
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found" })
    }
    res.status(200).json({ message: "Product deleted" })
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error })
  }
})

// CRUD operations for orders

app.post("/orders", async (req, res) => {
  try {
    const { totalAmount, ...rest } = req.body

    // 1. Create Razorpay order
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: totalAmount * 100, // Convert to paise
      currency: "INR",
      receipt: "receipt#" + new Date().getTime(),
    })

    // 2. Store order in DB with Razorpay order ID
    const order = {
      ...rest,
      totalAmount,
      razorpayOrderId: razorpayOrder.id,
      orderDate: new Date(),
      status: "Pending",
    }

    const db = client.db("print-studio")
    const ordersCollection = db.collection("orders")
    const result = await ordersCollection.insertOne(order)

    // 3. Return DB order + Razorpay order info to frontend
    res.status(201).json({
      orderId: result.insertedId,
      razorpayOrderId: razorpayOrder.id,
      razorpayAmount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    })
  } catch (error) {
    console.error("Error creating order:", error)
    res.status(500).json({ message: "Error creating order", error })
  }
})


// Read all orders
app.get("/orders", async (req, res) => {
  try {
    await client.connect()
    const db = client.db("print-studio")
    const ordersCollection = db.collection("orders")
    const orders = await ordersCollection.find().toArray()
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error })
  }
})

// Read a single order by ID
app.get("/orders/:id", async (req, res) => {
  try {
    const orderId = req.params.id
    await client.connect()
    const db = client.db("print-studio")
    const ordersCollection = db.collection("orders")
    const order = await ordersCollection.findOne({ _id: new ObjectId(orderId) })
    if (order) {
      res.status(200).json(order)
    } else {
      res.status(404).json({ message: "Order not found" })
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error })
  }
})

// Update an order
app.put("/orders/:id", async (req, res) => {
  try {
    const orderId = req.params.id
    const updatedOrder = req.body
    await client.connect()
    const db = client.db("print-studio")
    const ordersCollection = db.collection("orders")
    const result = await ordersCollection.updateOne({ _id: new ObjectId(orderId) }, { $set: updatedOrder })
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Order not found" })
    }
    res.status(200).json({ message: "Order updated" })
  } catch (error) {
    res.status(500).json({ message: "Error updating order", error })
  }
})

// Delete an order
app.delete("/orders/:id", async (req, res) => {
  try {
    const orderId = req.params.id
    await client.connect()
    const db = client.db("print-studio")
    const ordersCollection = db.collection("orders")
    const result = await ordersCollection.deleteOne({ _id: new ObjectId(orderId) })
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Order not found" })
    }
    res.status(200).json({ message: "Order deleted" })
  } catch (error) {
    res.status(500).json({ message: "Error deleting order", error })
  }
})

// Get orders by customer email
app.get("/orders/customer/:email", async (req, res) => {
  try {
    const email = req.params.email
    await client.connect()
    const db = client.db("print-studio")
    const ordersCollection = db.collection("orders")
    const orders = await ordersCollection.find({ email: email }).toArray()
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({ message: "Error fetching customer orders", error })
  }
})

// Update order status
app.patch("/orders/:id/status", async (req, res) => {
  try {
    const orderId = req.params.id
    const { status } = req.body

    if (!status) {
      return res.status(400).json({ message: "Status is required" })
    }

    await client.connect()
    const db = client.db("print-studio")
    const ordersCollection = db.collection("orders")

    const result = await ordersCollection.updateOne({ _id: new ObjectId(orderId) }, { $set: { status: status } })

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Order not found" })
    }

    res.status(200).json({ message: "Order status updated" })
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error })
  }
})

// Add these category endpoints after the order endpoints and before the dashboard stats

// CRUD operations for categories

// Create a category
app.post("/categories", async (req, res) => {
  try {
    const category = req.body
    await client.connect()
    const db = client.db("print-studio")
    const categoriesCollection = db.collection("categories")
    const result = await categoriesCollection.insertOne(category)
    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error })
  }
})

// Read all categories
app.get("/categories", async (req, res) => {
  try {
    await client.connect()
    const db = client.db("print-studio")
    const categoriesCollection = db.collection("categories")
    const categories = await categoriesCollection.find().toArray()
    res.status(200).json(categories)
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error })
  }
})

// Read a single category by ID
app.get("/categories/:id", async (req, res) => {
  try {
    const categoryId = req.params.id
    await client.connect()
    const db = client.db("print-studio")
    const categoriesCollection = db.collection("categories")
    const category = await categoriesCollection.findOne({ _id: new ObjectId(categoryId) })
    if (category) {
      res.status(200).json(category)
    } else {
      res.status(404).json({ message: "Category not found" })
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching category", error })
  }
})

// Read products by category slug
app.get("/categories/:slug/products", async (req, res) => {
  try {
    const categorySlug = req.params.slug
    await client.connect()
    const db = client.db("print-studio")
    const productsCollection = db.collection("products")
    const products = await productsCollection.find({ category: categorySlug }).toArray()
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ message: "Error fetching products by category", error })
  }
})

// Update a category
app.put("/categories/:id", async (req, res) => {
  try {
    const categoryId = req.params.id
    const updatedCategory = req.body

    if (!ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" })
    }

    // Remove _id field to prevent immutable field error
    delete updatedCategory._id

    const db = client.db("print-studio")
    const categoriesCollection = db.collection("categories")

    const result = await categoriesCollection.updateOne({ _id: new ObjectId(categoryId) }, { $set: updatedCategory })

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Category not found" })
    }

    res.status(200).json({ message: "Category updated successfully!" })
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error })
  }
})

// Delete a category
app.delete("/categories/:id", async (req, res) => {
  try {
    const categoryId = req.params.id
    await client.connect()
    const db = client.db("print-studio")
    const categoriesCollection = db.collection("categories")
    const result = await categoriesCollection.deleteOne({ _id: new ObjectId(categoryId) })
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Category not found" })
    }
    res.status(200).json({ message: "Category deleted" })
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error })
  }
})

// Dashboard statistics
app.get("/dashboard/stats", async (req, res) => {
  try {
    await client.connect()
    const db = client.db("print-studio")
    const productsCollection = db.collection("products")
    const ordersCollection = db.collection("orders")

    const totalProducts = await productsCollection.countDocuments()
    const totalOrders = await ordersCollection.countDocuments()

    // Calculate total revenue
    const orders = await ordersCollection.find().toArray()
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)

    // Get pending orders count
    const pendingOrders = await ordersCollection.countDocuments({ status: "Pending" })

    res.status(200).json({
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
    })
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard statistics", error })
  }
})

const port = process.env.PORT || 1227
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

process.on("SIGINT", async () => {
  await client.close()
  console.log("MongoDB connection closed")
  process.exit(0)
})

