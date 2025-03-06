const targetLat = 16.820014;
const targetLng = 100.240332;
const radius = 2000; // Set range in meters

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

    const distance = getDistance(userLat, userLng, targetLat, targetLng);
    
    if (distance <= radius) {
        document.getElementById("location").innerHTML = 
        "Current Position: "+userLat+", "+userLng+" "+'<a href="https://www.google.co.th/maps/@'+userLat+","+userLng+","+"15z"+'" target="_blank">(Click to view on Google Maps)</a>'+"<br>User is inside the target area!(Neko with 2km)";
    } else {
        document.getElementById("location").innerHTML = "User is outside the target area.";
    }
}

// Haversine formula to calculate distance in meters
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
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
