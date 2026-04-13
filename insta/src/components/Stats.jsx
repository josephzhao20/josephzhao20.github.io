import React from "react";

const Stats = ({ stats }) => {
  if (!stats) return null;

  const Card = ({ title, value }) => (
    <div className="bg-white p-4 rounded-2xl shadow">
      <p className="text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      <Card
        title="Not Following Back"
        value={stats.notFollowingBack.length}
      />
      <Card title="Fans" value={stats.fans.length} />
      <Card title="Mutual" value={stats.mutual.length} />
    </div>
  );
};

export default Stats;
