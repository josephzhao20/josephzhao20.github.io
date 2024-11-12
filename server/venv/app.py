# server/app.py

from flask import Flask, request, send_file, jsonify
import pandas as pd
import multiprocessing
import time
from server.venv.your_sorting_algorithm import sort_students  # Import your sorting function

app = Flask(__name__)

# Endpoint to provide the CSV template
@app.route("/template.csv")
def template():
    return send_file("template.csv", as_attachment=True)

# Endpoint to handle the file upload and sorting
@app.route("/upload", methods=["POST"])
def upload():
    file = request.files["file"]
    group_size = int(request.form["groupSize"])

    if file:
        # Read uploaded CSV
        df = pd.read_csv(file)
        
        # Run the sorting algorithm with a timeout
        manager = multiprocessing.Manager()
        result = manager.dict()
        process = multiprocessing.Process(
            target=run_with_timeout,
            args=(df, group_size, result)
        )
        process.start()
        process.join(300)  # 5-minute timeout (300 seconds)

        if process.is_alive():
            process.terminate()
            return jsonify({"success": False, "message": "Sorting timed out. Try again."})
        
        # Save the sorted result to a new CSV file
        output_file = "sorted_groups.csv"
        result["df"].to_csv(output_file, index=False)
        return jsonify({"success": True, "downloadLink": "/download"})
    
    return jsonify({"success": False, "message": "No file provided"})

# Endpoint to download the sorted CSV file
@app.route("/download")
def download():
    return send_file("sorted_groups.csv", as_attachment=True)

# Helper function to run the sorting algorithm with result sharing
def run_with_timeout(df, group_size, result):
    sorted_df = sort_students(df, group_size)  # Call your existing function here
    result["df"] = sorted_df

if __name__ == "__main__":
    app.run(debug=True)
