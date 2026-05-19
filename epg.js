function fetchEPG(server, username, password) {
    const url = `${server}/xmltv.php?username=${username}&password=${password}`;

    fetch(url)
        .then((response) => response.text())
        .then((data) => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, "text/xml");
            const epgData = document.getElementById("epg-data");

            epgData.innerHTML = "";

            const programmes = xml.getElementsByTagName("programme");

            for (let i = 0; i < programmes.length; i++) {
                const programme = programmes[i];
                const title = programme.getElementsByTagName("title")[0].textContent;
                const start = programme.getAttribute("start");

                const div = document.createElement("div");
                div.textContent = `${title} (${start})`;
                epgData.appendChild(div);
            }
        })
        .catch((error) => {
            console.error("Error fetching EPG:", error);
        });
}