const express = require("express");
const cors = require("cors")
const pool = require("./db");
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/auth");
const socialRoutes = require("./routes/social");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/social", socialRoutes);


app.get("/", (req, res) => {
    res.send("Backend API is working");
});


app.get("/db-test", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({success: true, time: result.rows[0].now});
    } catch (err){
        console.error(err);
        res.status(500).json({success: false, error: err.message})
    }
});

app.get("/protected", authMiddleware, (req, res) => {
    res. json({
        success: true,
        message: "You accessed a protected route!",
        user: req.user
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});