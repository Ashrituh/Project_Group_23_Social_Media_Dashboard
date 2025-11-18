import React, { useEffect, useState } from "react";
import "./../styles/Integrations.css";

function Integrations() {
  const [accounts, setAccounts] = useState([]);
  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/social/accounts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setAccounts(data.accounts || []);
    } catch (err) {
      console.error("Error fetching accounts:", err);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);
  const connectAccount = async (platform) => {
    const username = prompt(`Enter your ${platform} username:`);

    if (!username) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/social/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          platform: platform,
          accountName: username,
        }),
      });

      const data = await res.json();
      alert(data.message);

      fetchAccounts(); 
    } catch (err) {
      console.error("Error connecting account:", err);
    }
  };

  return (
    <div className="integrations-container">
      <h2 className="integrations-title">Connect Your Social Accounts</h2>

      <div className="platform-buttons">
        <button
          className="platform-btn twitter"
          onClick={() => connectAccount("twitter")}
        >
          Connect Twitter
        </button>

        <button
          className="platform-btn instagram"
          onClick={() => connectAccount("instagram")}
        >
          Connect Instagram
        </button>

        <button
          className="platform-btn facebook"
          onClick={() => connectAccount("facebook")}
        >
          Connect Facebook
        </button>
      </div>

      <h3 className="connected-title">Connected Accounts</h3>

      <div className="accounts-list">
        {accounts.length === 0 ? (
          <p className="no-accounts">No accounts connected yet.</p>
        ) : (
          accounts.map((acc) => (
            <div key={acc.account_id} className="account-card">
              <p className="acc-platform">{acc.platform.toUpperCase()}</p>
              <p className="acc-username">@{acc.username}</p>
              <p className="acc-date">
                Connected at: {new Date(acc.connected_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Integrations;
