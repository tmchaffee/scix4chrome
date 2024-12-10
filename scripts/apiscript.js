// This script is run by the plugin to query the ADS API based on
// user input, and return records.
// TODO: add ability to recover citations.

console.log("init")
let docTitle = {};
document.addEventListener('DOMContentLoaded', () => {
    // Request the document title from the background script
    chrome.runtime.sendMessage(
        { from: 'init', subject: 'getTitle' },
        response => {
            if (response.msg.titles.title) {
              docTitle = response.msg.titles;
              document.getElementById('scixtoolbarquery').value = docTitle.title ;
                console.log("Received:", response.msg)
            } else {
                document.getElementById('scixtoolbarquery').value = "Search";
            }
        }
    );
});
    const title = document.getElementById("scixtoolbarquery").value;
    //note to self: DO NOT publish the API key on github
    const apiKey = "API KEY GOES HERE";
 // uncomment for possible CORS workaround
  //  const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const apiBaseUrl = "https://api.adsabs.harvard.edu/v1/search/query";
// uncomment for possible CORS workaround
  //  const apiUrl = proxyUrl + apiBaseUrl;
 // comment out if trying CORS workoaround
  const apiUrl = apiBaseUrl ;

    const query = {
        q: `title:"${title}"`,
        fl: "title,bibcode,author,year",
        rows: 4
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify(query)
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        displayResults(data.response.docs);
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("results").innerHTML = `<p>Error: ${error.message}</p>`;
    }
async function displayResults(results) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    if (results.length === 0) {
        resultsDiv.innerHTML = "<p>No results found.</p>";
        return;
    }

    const list = document.createElement("ul");

    results.forEach(paper => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>${paper.title[0]}</strong><br>
            Authors: ${paper.author.join(", ")}<br>
            Year: ${paper.year}<br>
            Bibcode: ${paper.bibcode}
        `;
        list.appendChild(listItem);
    });

    resultsDiv.appendChild(list);
}
