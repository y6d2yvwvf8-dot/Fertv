function login() {
    const server = document.getElementById("server").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

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

            if (!Array.isArray(data)) {
                throw new Error("Invalid response format: Channels not found");
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
            alert("Failed to load channels. Please check your credentials or server URL.");
        });
}