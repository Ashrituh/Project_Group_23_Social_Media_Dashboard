const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/register", async (req, res) => {
    try{
        const{first_name, last_name, email, password} = req.body;
        if (!first_name || !last_name || !email || !password){
            return res.status(400).json({error: "Fill all fields"});
        }
        const userCheck = await pool.query(
            "SELECT * FROM users WHERE email = $1", [email]
        );

        if(userCheck.rows.length > 0){
            return res.status(400).json({error: "Email already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash =await bcrypt.hash(password, salt);

        const result = await pool.query(
            `INSERT INTO users (first_name, last_name, email, password_hash)
            VALUES ($1, $2, $3, $4) RETURNING user_id, first_name, last_name, email`,
            [first_name, last_name, email, password_hash]
        );
        res.json({success: true, user: result.rows[0]});
    }catch(err){
        console.error(err);
        res.status(500).json({error: "Server error"});
    }
});

router.post("/login", async (req, res) => {
    try{
        const{email, password} = req.body;
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1", [email]
        );
        if (result.rows.length == 0){
            return res.status(400).json({error: "Invalid email or password"});
        }
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if(!isMatch){
            return res.status(400).json({error: "Invalid email or password"});
        }

        const secret = process.env.JWT_SECRET || "secret123";
        const token = jwt.sign({ user_id: user.user_id }, secret, { expiresIn: "1h" });

        res.json({
            success: true,
            token,
            user: {
                user_id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            }
        });
    }catch(err){
        console.error(err);
        res.status(500).json({error: "Server error"});
    }
});

module.exports = router;