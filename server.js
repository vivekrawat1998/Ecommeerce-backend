const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const colors = require("colors");
const connectDB = require("./config/db");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 9878;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const categoryRouter = require("./routes/categoryRoute");
const productRouter = require("./routes/productRoute");
const productWeightRouter = require("./routes/productWeightRoute");
const productRAMSRouter = require("./routes/productRAMSRoute");
const productSIZERouter = require("./routes/productSIZERoute");
const userRouter = require("./routes/userRoute");
const cartRouter = require("./routes/cartRoute");
const whishlistRouter = require("./routes/whishlistRoute");
const prodReviewRouter = require("./routes/prodReviewRoute");
const productColorRouter = require("./routes/productColorRoute");
const orderRouter = require("./routes/orderRoute");
const bannerRouter = require("./routes/bannerRoute");
const searchRouter = require("./routes/searchRoute");
const uploadRouter = require("./routes/uploadRoute");
const authJwt = require("./helper/authJwt");
const wishRouter = require("./routes/whishlistRoute")
const { notFound, errorHandler } = require("./helper/errroHandler");

connectDB();

app.use(cors({
  origin: 'http://localhost:5173', // only allow your frontend origin
  credentials: true,               // allow cookies to be sent
}));
app.options("*", cors);
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use(authJwt());

// routes
app.use("/uploads", express.static("uploads"));
app.use("/api/v1/user", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/productWeight", productWeightRouter);
app.use("/api/v1/productRam", productRAMSRouter);
app.use("/api/v1/productSize", productSIZERouter);
app.use("/api/v1/productColor", productColorRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/my-list", whishlistRouter);
app.use("/api/v1/productReviews", prodReviewRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/homeBanner", bannerRouter);
app.use("/api/v1/search", searchRouter);
app.use("/api/v1/wish", wishRouter);
app.use("/api/v1/upload", uploadRouter);

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(
    `Server Running in ${process.env.NODE_MODE} Mode on port ${PORT}`.bgCyan
      .white
  );
});
