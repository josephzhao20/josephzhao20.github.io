import React, { useState } from "react";
import Upload from "./components/Upload";
import Stats from "./components/Stats";
import UserList from "./components/UserList";
import {
  extractFollowers,
  computeStats
} from "./utils/instagram";

export default function App() {
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState("not");

  const handleLoad = (followersData, followingData) => {
    const followers = extractFollowers(
      followersData.relationships_followers
    );

    const following = extractFollowers(
      followingData.relationships_following
    );

    setStats(computeStats(followers, following));
  };

  const renderTab = () => {
    if (!stats) return null;

    if (tab === "not")
      return (
        <UserList
          users={stats.notFollowingBack}
          title="Not Following Back"
        />
      );

    if (tab === "fans")
      return <UserList users={stats.fans} title="Fans" />;

    if (tab === "mutual")
      return (
        <UserList users={stats.mutual} title="Mutual" />
      );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Instagram Follower Checker
        </h1>

        <Upload onLoad={handleLoad} />

        <Stats stats={stats} />

        {stats && (
          <div className="flex gap-3 mt-6">
            <button onClick={() => setTab("not")} className="btn">
              Not Following
            </button>
            <button onClick={() => setTab("fans")} className="btn">
              Fans
            </button>
            <button onClick={() => setTab("mutual")} className="btn">
              Mutual
            </button>
          </div>
        )}

        {renderTab()}
      </div>
    </div>
  );
}
