function downloadTemplate() {
    window.location.href = "/download-template";
}

function uploadFile() {
    const formData = new FormData(document.getElementById("uploadForm"));
    fetch("/upload-csv", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById("result").innerHTML = `<p style="color:red">${data.error}</p>`;
        } else {
            document.getElementById("result").innerHTML = `<p>${data.message}</p>`;
            processCSV(formData);
        }
    });
}

function processCSV(formData) {
    fetch("/process-csv", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById("result").innerHTML = `<p style="color:red">${data.error}</p>`;
        } else {
            document.getElementById("result").innerHTML = `<p>Download your sorted groups <a href="${data.fileUrl}">here</a></p>`;
        }
    });
}
