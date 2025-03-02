const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");

const uri =
  "mongodb+srv://riteshprintstudio:sanskar19@print-studio.0ougy.mongodb.net/?retryWrites=true&w=majority&appName=print-studio";
const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // React app URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

let db;

// Connect to MongoDB once and reuse the connection
async function connectDB() {
  try {
    if (!db) {
      await client.connect();
      db = client.db("print-studio");
      console.log("MongoDB connection established");
    }
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

// Call the function to connect to the database
connectDB();

// CRUD operations for products
// const productsCollection = db.collection("products");
// const ordersCollection = db.collection("orders");

// Create a product
app.post("/products", async (req, res) => {
  try {
    const product = req.body;
    await client.connect();
    const db = client.db("print-studio");
    const productsCollection = db.collection("products");
    const result = await productsCollection.insertOne(product);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
});

// Read all products
app.get("/products", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("print-studio");
    const productsCollection = db.collection("products");
    const products = await productsCollection.find().toArray();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// Read a single product by ID
app.get("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    await client.connect();
    const db = client.db("print-studio");
    const productsCollection = db.collection("products");
    const product = await productsCollection.findOne({ _id: new ObjectId(productId) });
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
});


// Update a product
app.put("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    let updatedProduct = req.body;

    console.log("Incoming update request:", updatedProduct);

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // 🛑 Remove _id field to prevent immutable field error
    delete updatedProduct._id;

    const db = client.db("print-studio");
    const productsCollection = db.collection("products");

    const result = await productsCollection.updateOne(
      { _id: new ObjectId(productId) },
      { $set: updatedProduct }
    );

    console.log("Update result:", result);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully!" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product", error });
  }
});


// Delete a product
app.delete("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(productId)
    await client.connect();
    const db = client.db("print-studio");
    const productsCollection = db.collection("products");
    const result = await productsCollection.deleteOne({ _id: new ObjectId(productId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
});

// CRUD operations for orders

// Create an order
app.post("/orders", async (req, res) => {
  try {
    const order = req.body;
    await client.connect();
    const db = client.db("print-studio");
    const ordersCollection = db.collection("orders");
    const result = await ordersCollection.insertOne(order);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error });
  }
});

// Read all orders
app.get("/orders", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("print-studio");
    const ordersCollection = db.collection("orders");
    const orders = await ordersCollection.find().toArray();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
});

// Read a single order by ID
app.get("/orders/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    await client.connect();
    const db = client.db("print-studio");
    const ordersCollection = db.collection("orders");
    const order = await ordersCollection.findOne({ _id: new ObjectId(orderId) });
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error });
  }
});

// Update an order
app.put("/orders/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    const updatedOrder = req.body;
    await client.connect();
    const db = client.db("print-studio");
    const ordersCollection = db.collection("orders");
    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: updatedOrder }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating order", error });
  }
});

// Delete an order
app.delete("/orders/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    await client.connect();
    const db = client.db("print-studio");
    const ordersCollection = db.collection("orders");
    const result = await ordersCollection.deleteOne({ _id: new ObjectId(orderId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order", error });
  }
});

const port = process.env.PORT || 1227;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on("SIGINT", async () => {
  await client.close();
  console.log("MongoDB connection closed");
  process.exit(0);
});
