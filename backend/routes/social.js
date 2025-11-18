const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");

// helper to add 1 hour
function oneHourFromNow() {
  return new Date(Date.now() + 60 * 60 * 1000); // 1 hour
}

// POST /social/connect  (mock connect)
router.post("/connect", auth, async (req, res) => {
  const { platform, accountName } = req.body;
  const username = accountName;

  if (!platform || !accountName) {
    return res
      .status(400)
      .json({ error: "platform and accountName are required" });
  }

  try {
    const userId = req.user.id;

    // mock tokens (in a real app these would come from OAuth)
    const accessToken = `mock_${platform}_access_${Date.now()}`;
    const refreshToken = `mock_${platform}_refresh_${Date.now()}`;
    const expiresAt = oneHourFromNow(); // access token expires in 1 hour

    const result = await pool.query(
      `INSERT INTO social_accounts 
        (user_id, platform, username, access_token, refresh_token, token_expires_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING account_id, platform, username, connected_at, token_expires_at`,
      [userId, platform, username, accessToken, refreshToken, expiresAt]
    );

    return res.status(201).json({
      message: "Account connected (mock)",
      // note: we do NOT return tokens => more "secure"
      account: result.rows[0],
    });
  } catch (err) {
    console.error("Error connecting social account:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET /social/accounts  (list accounts WITHOUT tokens)
router.get("/accounts", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT account_id, platform, username, connected_at, token_expires_at
       FROM social_accounts
       WHERE user_id = $1
       ORDER BY connected_at DESC`,
      [userId]
    );

    // compute status (active / expired) just for display
    const accounts = result.rows.map((acc) => {
      const isExpired =
        acc.token_expires_at && new Date(acc.token_expires_at) < new Date();
      return {
        ...acc,
        status: isExpired ? "expired" : "active",
      };
    });

    return res.json({ accounts });
  } catch (err) {
    console.error("Error fetching social accounts:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// POST /social/refresh/:accountId   (mock refresh logic)
router.post("/refresh/:accountId", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const accountId = req.params.accountId;

    // make sure this account belongs to the logged-in user
    const { rows } = await pool.query(
      `SELECT account_id, platform, username 
       FROM social_accounts
       WHERE account_id = $1 AND user_id = $2`,
      [accountId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Account not found" });
    }

    const account = rows[0];

    // generate new mock tokens + expiry
    const newAccessToken = `mock_${account.platform}_access_${Date.now()}`;
    const newRefreshToken = `mock_${account.platform}_refresh_${Date.now()}`;
    const newExpiresAt = oneHourFromNow();

    await pool.query(
      `UPDATE social_accounts
       SET access_token = $1,
           refresh_token = $2,
           token_expires_at = $3
       WHERE account_id = $4`,
      [newAccessToken, newRefreshToken, newExpiresAt, accountId]
    );

    return res.json({
      message: "Token refreshed (mock)",
      account: {
        account_id: account.account_id,
        platform: account.platform,
        username: account.username,
        token_expires_at: newExpiresAt,
      },
    });
  } catch (err) {
    console.error("Error refreshing token:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET /social/feed  (mock posts; does NOT use real tokens)
router.get("/feed", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const { rows: accounts } = await pool.query(
      `SELECT account_id, platform, username, token_expires_at
       FROM social_accounts
       WHERE user_id = $1`,
      [userId]
    );

    if (accounts.length === 0) {
      return res.json({ feed: [] });
    }

    const feed = [];

    accounts.forEach((acc) => {
      const isExpired =
        acc.token_expires_at && new Date(acc.token_expires_at) < new Date();

      // even if expired, we still generate mock posts,
      // but you could conditionally skip or auto-refresh here if you want
      feed.push(
        {
          account_id: acc.account_id,
          platform: acc.platform,
          username: acc.username,
          status: isExpired ? "expired" : "active",
          content: `Sample post 1 from ${acc.username} on ${acc.platform}`,
          posted_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        },
        {
          account_id: acc.account_id,
          platform: acc.platform,
          username: acc.username,
          status: isExpired ? "expired" : "active",
          content: `Sample post 2 from ${acc.username} on ${acc.platform}`,
          posted_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        }
      );
    });

    // newest first
    feed.sort((a, b) => new Date(b.posted_at) - new Date(a.posted_at));

    return res.json({ feed });
  } catch (err) {
    console.error("Error building mock feed:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
