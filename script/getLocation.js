        // Target area settings
        const radius = 2000; // 2 kilometers in meters
        let targetLocations = [];

        // Fetch and process the Excel file when the page is loaded
        document.addEventListener("DOMContentLoaded", function () {
            fetch("assets/LocationPreset.xlsx")
                .then(response => response.arrayBuffer()) // Read as binary
                .then(data => {
                    let workbook = XLSX.read(data, { type: "array" });
                    let sheetName = workbook.SheetNames[0]; // Get first sheet
                    let sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

                    // Extract target locations from the Excel sheet
                    sheet.slice(1).forEach(row => {
                        let lat = row[1];  // Assuming Latitude is in column B
                        let lng = row[2];  // Assuming Longitude is in column C
                        if (lat && lng) {
                            targetLocations.push({ lat, lng });
                        }
                    });

                    console.log("Target locations loaded:", targetLocations);

                    // Start geolocation tracking
                    getLocation();
                })
                .catch(error => console.error("Error loading file:", error));  // Handle errors
        });

        // Get the user's current location
        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.watchPosition(checkProximity, showError, { enableHighAccuracy: true });
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        }

        // Check if the user is within the specified range of any target location
        function checkProximity(position) {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            // Display user's current position
            document.getElementById("info").innerHTML = "Current Position: " + userLat + ", " + userLng + 
                ' <a href="https://www.google.com/maps?q=' + userLat + "," + userLng + '" target="_blank">(Click to view on Google Maps)</a>';

            // Loop through target locations and check the distance
            let foundProximity = false;
            targetLocations.forEach(location => {
                const distance = getDistance(userLat, userLng, location.lat, location.lng);
                if (distance <= radius) {
                    foundProximity = true;
                }
            });

            // Show status based on proximity check
            if (foundProximity) {
                document.getElementById("location").innerHTML = "Status: User is inside the target area!";
            } else {
                document.getElementById("location").innerHTML = "Status: User is outside the target area.";
            }
        }

        // Calculate distance between two coordinates using the Haversine formula
        function getDistance(lat1, lon1, lat2, lon2) {
            const R = 6371e3; // Earth's radius in meters
            const dLat = (lat2 - lat1) * (Math.PI / 180);
            const dLon = (lon2 - lon1) * (Math.PI / 180);

            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                      Math.sin(dLon / 2) * Math.sin(dLon / 2);

            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c; // Distance in meters
        }

        // Error handling for geolocation
        function showError(error) {
            console.error("Geolocation error:", error);
        }