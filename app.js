function login() {
    const server = document.getElementById("server").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Enhanced feedback to keep the user informed
    console.log("Attempting login with server:", server);

    // Fetch Channels
    fetchChannels(server, username, password);

    // Fetch EPG
    fetchEPG(server, username, password);
}

function fetchChannels(server, username, password) {
    const url = `${server}/player_api.php?username=${username}&password=${password}&action=get_live_streams`;

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Network Error: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            const channels = document.getElementById("channels");
            channels.innerHTML = "";

            if (!Array.isArray(data) || data.length === 0) {
                channels.innerHTML = "No channels found!";
                return;
            }

            data.forEach((channel) => {
                const div = document.createElement("div");
                div.textContent = `${channel.name} [${channel.stream_id}]`;
                channels.appendChild(div);
            });

            document.getElementById("channel-display").style.display = "block";
        })
        .catch((error) => {
            console.error("Error fetching channels:", error);
            alert(`Failed to load IPTV channels. ${error.message}`);
        });
}

function fetchEPG(server, username, password) {
    const url = `${server}/xmltv.php?username=${username}&password=${password}`;

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Network Error: ${response.status}`);
            }
            return response.text();
        })
        .then((data) => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, "application/xml");
            const epgData = document.getElementById("epg-data");
            epgData.innerHTML = "";

            const programmes = xml.getElementsByTagName("programme");

            Array.from(programmes).forEach((programme) => {
                const title = programme.getElementsByTagName("title")[0]?.textContent || "Untitled";
                const start = programme.getAttribute("start") || "Unknown start time";

                const div = document.createElement("div");
                div.textContent = `${title} (${start})`;
                epgData.appendChild(div);
            });

            console.log("EPG Data Loaded Successfully!");
        })
        .catch((error) => {
            console.error("Error fetching EPG:", error);
            alert("Failed to load EPG data. Please check server or credentials.");
        });
}