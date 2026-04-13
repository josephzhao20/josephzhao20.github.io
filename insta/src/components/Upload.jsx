import React from "react";

const Upload = ({ onLoad }) => {
  const readFile = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          resolve(JSON.parse(e.target.result));
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsText(file);
    });

  const handleUpload = async () => {
    const followersFile =
      document.getElementById("followers").files[0];

    const followingFile =
      document.getElementById("following").files[0];

    if (!followersFile || !followingFile) {
      alert("Please upload both files");
      return;
    }

    try {
      const followersData = await readFile(followersFile);
      const followingData = await readFile(followingFile);

      onLoad(followersData, followingData);
    } catch {
      alert("Invalid JSON file");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">
        Upload Instagram JSON
      </h2>

      <input id="followers" type="file" className="mb-3" />
      <input id="following" type="file" />

      <button
        onClick={handleUpload}
        className="mt-4 bg-black text-white px-4 py-2 rounded-lg"
      >
        Analyze
      </button>
    </div>
  );
};

export default Upload;
