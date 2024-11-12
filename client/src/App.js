// client/src/App.js

import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [groupSize, setGroupSize] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileUpload = (e) => setFile(e.target.files[0]);

  const handleSubmit = async () => {
    if (!file || !groupSize) {
      setError("Please upload a file and specify the group size.");
      return;
    }

    setLoading(true);
    setError("");
    setDownloadLink("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("groupSize", groupSize);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setDownloadLink("http://localhost:5000/download");
      } else {
        setError(response.data.message || "An error occurred during processing.");
      }
    } catch (err) {
      setError("Server error: Unable to process the file.");
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Student Grouping Tool</h1>
      <p>1. Download the CSV template, add students and preferences, and upload it.</p>
      <a href="http://localhost:5000/template.csv" download>Download CSV Template</a>
      
      <input type="file" onChange={handleFileUpload} />
      <input
        type="number"
        placeholder="Group Size"
        value={groupSize}
        onChange={(e) => setGroupSize(e.target.value)}
      />
      
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : "Sort Students"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {downloadLink && <a href={downloadLink} download>Download Sorted Groups</a>}
    </div>
  );
}

export default App;
