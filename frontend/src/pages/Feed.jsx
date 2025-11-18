import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import "./../styles/Feed.css";

export default function Feed() {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/social/feed", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(data => setFeed(data.feed || []));
  }, []);

  return (
    <div className="feed-container">
      <Sidebar />
      <div className="feed-content">
        <h1>Your Activity Feed</h1>

        {feed.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          feed.map((post, index) => (
            <div className="post" key={index}>
                <h3>{post.platform.toUpperCase()} — @{post.username}</h3>
              <p>{post.content}</p>
              <span>{new Date(post.posted_at).toLocaleString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
