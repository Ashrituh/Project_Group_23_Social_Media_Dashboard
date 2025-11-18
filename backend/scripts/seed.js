require('dotenv').config();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function main() {
  try {
    // sample user
    const email = process.env.SEED_USER_EMAIL || 'seeduser@example.com';
    const firstName = process.env.SEED_FIRST_NAME || 'Seed';
    const lastName = process.env.SEED_LAST_NAME || 'User';
    const password = process.env.SEED_USER_PASSWORD || 'password123';

    // check if user exists
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    let userId;

    if (existing.rows.length > 0) {
      userId = existing.rows[0].user_id;
      console.log('Seed user already exists with user_id=', userId);
    } else {
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      const result = await pool.query(
        `INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING user_id`,
        [firstName, lastName, email, password_hash]
      );
      userId = result.rows[0].user_id;
      console.log('Created seed user with user_id=', userId);
    }

    // create some mock social accounts for the user
    const platforms = ['twitter', 'instagram', 'facebook'];

    for (const p of platforms) {
      // check if exists
      const r = await pool.query(
        `SELECT * FROM social_accounts WHERE user_id = $1 AND platform = $2 LIMIT 1`,
        [userId, p]
      );
      if (r.rows.length === 0) {
        await pool.query(
          `INSERT INTO social_accounts (user_id, platform, username, access_token, refresh_token, token_expires_at)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            userId,
            p,
            `${p}_user`,
            `mock_${p}_access_${Date.now()}`,
            `mock_${p}_refresh_${Date.now()}`,
            new Date(Date.now() + 60 * 60 * 1000),
          ]
        );
        console.log(`Inserted mock account for ${p}`);
      } else {
        console.log(`Account for ${p} already exists`);
      }
    }

    // generate a token for quick testing
    const secret = process.env.JWT_SECRET || 'secret123';
    const token = jwt.sign({ user_id: userId }, secret, { expiresIn: '7d' });

    console.log('\n=== SEED COMPLETE ===');
    console.log('Use this token for testing (stores in localStorage as key "token"):');
    console.log(token);
    console.log('Login with email:', email, 'and password:', process.env.SEED_USER_PASSWORD || password);

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

main();
