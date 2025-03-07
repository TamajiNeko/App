const radius = 20;
let targetLocations = [];

document.addEventListener("DOMContentLoaded", function () {
    fetch("assets/LocationPreset.xlsx")
        .then(response => response.arrayBuffer())
        .then(data => {
            let workbook = XLSX.read(data, { type: "array" });
            let sheetName = workbook.SheetNames[0];
            let sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

            sheet.slice(1).forEach(row => {
                let placeName = row[0];
                let lat = row[1];
                let lng = row[2];
                if (lat && lng) {
                    targetLocations.push({ placeName, lat, lng });
                }
            });
        })
        .catch(error => console.error("Error loading file:", error));
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(checkProximity, showError, { enableHighAccuracy: true });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function checkProximity(position) {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;

    document.getElementById("info").innerHTML = "Current Position: " + userLat.toFixed(7) + ", " + userLng.toFixed(7) + 
        ' <a href="https://www.google.com/maps?q=' + userLat + "," + userLng + '" target="_blank">(Click to view on Google Maps)</a>';

    let foundProximity = false;
    targetLocations.forEach(location => {
        const distance = getDistance(userLat, userLng, location.lat, location.lng);
        if (distance <= radius) {
            document.getElementById("location").innerHTML = "Status: In area " + distance.toFixed(2)+"m (" + location.placeName + ")";
            foundProximity = true;
        }
    });

    if (!foundProximity) {
        document.getElementById("location").innerHTML = "Status: User is outside the target area.";
    }
}

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function showError(error) {
    console.error("Geolocation error:", error);
}

getLocation()
