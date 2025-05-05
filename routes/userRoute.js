const express = require("express");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authMiddleware = require("../middlewares/authMiddleware");
const { generateAccessToken, generateRefreshToken } = require("../utils/generatetokens");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, phone, email, password, isAdmin } = req.body;
  try {
    const existingUser = await userModel.findOne({ email: email });
    const existingUserByPh = await userModel.findOne({ phone: phone });
    if (existingUser && existingUserByPh) {
      return res.status(400).json({ error: true, msg: "User Already Exist!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await userModel.create({
      name: name,
      email: email,
      phone: phone,
      password: hashedPassword,
      isAdmin: isAdmin,
    });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      process.env.JWT_SECRET_KEY
    );

    return res.status(201).json({
      user: result,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({ error: true, msg: "Server Error" });
  }
});

// POST /signin
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ error: true, msg: "User Not Found!" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: true, msg: "Invalid Credentials!" });
    }

    // Generate tokens using the helper functions
    const accessToken = generateAccessToken(existingUser);
    const refreshToken = generateRefreshToken(existingUser);

    // Set the refresh token in HTTP-only cookies (for security)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,// Ensure secure cookie in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration
    });

    // Send the access token in response headers (or body)
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,// Ensure secure cookie in production
      maxAge: 60 * 1000, // 15 minutes expiration
    });

    return res.status(200).json({
      msg: "User Authenticated!",
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      },
      token: accessToken,

    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, msg: "Server Error" });
  }
});

// POST /refresh-token
router.post("/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: true, msg: "Refresh token not found!" });
  }

  try {
    console.log("JWT_REFRESH_KEY used for verification:", process.env.JWT_REFRESH_KEY);
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);

    // Issue a new access token
    const newAccessToken = generateAccessToken({ _id: decoded.id, email: decoded.email });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000, // 15 minutes expiration
    });

    return res.status(200).json({
      msg: "Access token refreshed successfully!",
      token: newAccessToken,
    });

  } catch (error) {
    return res.status(403).json({ error: true, msg: "Invalid or expired refresh token!" });
  }
});


router.post("/logout", (req, res) => {
  // Clear both token and refresh token cookies
  res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' });
  res.clearCookie("refreshToken", { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' });

  res.status(200).json({ msg: "Logged out successfully!" });
});

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    // Check if req.user exists
    console.log("Authenticated User (from middleware): ", req.user);

    // Ensure that req.user is available and has the correct ID
    if (!req.user) {
      console.error("No user attached to request");
      return res.status(404).json({ error: true, msg: "User not found in request!" });
    }

    // Find the user from the database
    const user = await userModel.findById(req.user.id);

    if (!user) {
      console.error("User not found in database for user ID: ", req.user.id);
      return res.status(404).json({ error: true, msg: "User not found in the database!" });
    }

    // Send the user data (profile) as the response
    console.log("User Profile Data: ", {
      name: user.name,
      email: user.email,
      userId: user._id,
      createdAt: user.createdAt,
    });

    res.status(200).json({
      name: user.name,
      email: user.email,
      userId: user._id,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Error in /profile route:", error);
    res.status(500).json({ error: true, msg: "Server Error", error });
  }
});


// router.get("/", async (req, res) => {
//   try {
//     const userList = await userModel.find();
//     if (!userList) {
//       res.status(404).json({ success: false, msg: "User Not Found!" });
//     }
//     res.status(200).send(userList);
//   } catch (error) {
//     return res.status(500).json({ success: false, msg: "Server Error" });
//   }
// });

router.get("/:id", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      res
        .status(404)
        .json({ success: false, msg: "User Not Found With The Given ID!" });
    }
    res.status(200).send(user);
  } catch (error) {
    return res.status(500).json({ success: false, msg: "Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, msg: "User Not Found With The Given ID!" });
    }
    return res
      .status(200)
      .json({ success: true, message: "User Deleted Successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: "Server Error", error: error });
  }
});

router.get("/get/count", async (req, res) => {
  try {
    const userCount = await userModel.countDocuments((count) => count);
    if (!userCount) {
      return res
        .status(404)
        .json({ success: false, message: "Users Not Found!" });
    }
    res.send({
      userCount: userCount,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: "Server Error", error: error });
  }
});

router.put("/:id", async (req, res) => {
  const { name, phone, email } = req.body;

  try {
    const userExist = await userModel.findById(req.params.id);
    if (!userExist) {
      return res
        .status(404)
        .json({ success: false, message: "Users Not Found!" });
    }
    let newPassword;
    if (req.body.password) {
      newPassword = bcrypt.hashSync(req.body.password, 10);
    } else {
      newPassword = userExist.hashedPassword;
    }

    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        name: name,
        phone: phone,
        email: email,
        password: newPassword,
      },
      { new: true }
    );

    if (!user) {
      return res.status(400).send({ msg: "User cannot be updated!" });
    }

    res.send(user);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: "Server Error", error: error });
  }
});

router.put("/changePassword/:id", async (req, res) => {
  const { name, phone, email, password, newPass } = req.body;

  try {
    const userExist = await userModel.findById(req.params.id);
    if (!userExist) {
      return res.status(404).json({ error: true, message: "Users Not Found!" });
    }

    const matchedPassword = await bcrypt.compare(password, userExist.password);
    if (!matchedPassword) {
      res.status(404).json({
        error: true,
        msg: "Invalid Credentials!",
      });
    } else {
      let newPassword;
      if (newPass) {
        newPassword = bcrypt.hashSync(newPass, 10);
      } else {
        newPassword = userExist.hashedPassword;
      }

      const user = await userModel.findByIdAndUpdate(
        req.params.id,
        {
          name: name,
          phone: phone,
          email: email,
          password: newPassword,
        },
        { new: true }
      );

      if (!user) {
        return res.status(400).send({ msg: "User cannot be updated!" });
      }

      res.send(user);
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: "Server Error", error: error });
  }
});


router.post(`/authWithGoogle`, async (req, res) => {
  const { name, phone, email, password, isAdmin } = req.body;

  try {
    const existingUser = await userModel.findOne({ email: email });

    if (!existingUser) {
      const result = await userModel.create({
        name: name,
        email: email,
        phone: phone,
        password: password,
        isAdmin: isAdmin,
      })

      const token = jwt.sign({ email: result.email, id: result._id }, process.env.JWT_SECRET_KEY);

      return res.status(200).send({
        user: result,
        token: token,
        msg: "User Login Successfully!"
      })
    } else {
      const existingUser = await userModel.findOne({ email: email });
      const token = jwt.sign({ email: result.email, id: result._id }, process.env.JWT_SECRET_KEY);
      return res.status(200).send({
        user: existingUser,
        token: token,
        msg: "User Login Successfully!"
      })

    }


  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: "Server Error", error: error });
  }
})

module.exports = router;
