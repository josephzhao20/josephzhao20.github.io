// Function to handle file upload
function handleFileUpload(event) {
    event.preventDefault();

    // Get the file input element
    const fileInput = document.getElementById('fileInput');

    // Get the uploaded file
    const file = fileInput.files[0];

    if (file) {
        // Create a FormData object and append the file to it
        const formData = new FormData();
        formData.append('file', file);

        // Make an AJAX request to send the file to the server for processing
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://script.google.com/macros/s/AKfycbyGjR1h6jvtHYT5hNg_MJoVNNCxuQ9fsSw15UBiy1zv_TcPpGNOWkX4ekN5b9OY888M/exec', true); // Replace 'process_upload.php' with the URL of your server-side script
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // Handle the response from the server
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    alert('File uploaded successfully!'); // You can replace this with your desired success message
                } else {
                    alert('File upload failed. Please try again.'); // You can replace this with your desired error message
                }
            }
        };
        xhr.send(formData);
    } else {
        alert('Please select a file to upload.');
    }
}

// Add an event listener to the upload form
const uploadForm = document.getElementById('uploadForm');
uploadForm.addEventListener('submit', handleFileUpload);
