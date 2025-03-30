// Constants for the OpenWeather API
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = "bd5e378503939ddaee76f12ad7a97608";
const weatherContainer = document.getElementById("weather-info");

// Event Listener - Runs when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeDashboard();
});

// Function to initialize the dashboard with essential features
function initializeDashboard() {
  updateClock(); // Set the initial time and date
  setInterval(updateClock, 1000); // Update clock every second
  loadLinks(); // Load saved quick links from local storage
  loadSavedData(); // Load saved dashboard title and notes
  getLocation(); // Fetch the user's location for weather data

  // Event listeners for user interactions
  document
    .getElementById("dashboard-title")
    .addEventListener("input", saveTitle); // Save title to local storage
  document.getElementById("note-area").addEventListener("input", saveNotes); // Save notes to local storage
  document.getElementById("add-link").addEventListener("click", addLink); // Add new quick link
}

// Function to update the current time and date
function updateClock() {
  const now = new Date();
  document.getElementById("clock").innerText = now.toLocaleTimeString();
  document.getElementById("date").innerText = now.toLocaleDateString();
}

// Local Storage Functions - Save and Load Data
function saveTitle() {
  localStorage.setItem("dashboardTitle", this.innerText); // Save the dashboard title
}

function saveNotes() {
  localStorage.setItem("dashboardNotes", this.value); // Save the notes written by the user
}

function loadSavedData() {
  // Load saved dashboard title and notes, or set defaults if not available
  document.getElementById("dashboard-title").innerText =
    localStorage.getItem("dashboardTitle") || "Dashboard";
  document.getElementById("note-area").value =
    localStorage.getItem("dashboardNotes") || "";
}

// Function to add a new quick link
function addLink() {
  const titleInput = document.getElementById("link-title");
  const urlInput = document.getElementById("link-url");
  const title = titleInput.value.trim();
  const url = urlInput.value.trim();

  if (!title || !url) {
    alert("Enter a Title and a URL!"); // Ensure both fields are filled
    return;
  }

  const links = getLinks(); // Retrieve existing links
  links.push({ title, url }); // Add new link to the list
  localStorage.setItem("savedLinks", JSON.stringify(links)); // Save to local storage
  renderLinks(); // Update the displayed links

  titleInput.value = "";
  urlInput.value = ""; // Clear input fields after adding
}

// Function to load quick links from local storage
function loadLinks() {
  renderLinks();
}

// Retrieve saved links from local storage or return an empty array if none exist
function getLinks() {
  return JSON.parse(localStorage.getItem("savedLinks")) || [];
}

// Function to display saved links in the UI
function renderLinks() {
  const linksList = document.getElementById("links-list");
  linksList.innerHTML = ""; // Clear the existing list to re-render it
  const links = getLinks();

  // Loop through each saved link and create an element for it
  links.forEach((link, index) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = link.url;
    a.innerText = link.title;
    a.target = "_blank"; // Open link in a new tab

    // Create a delete button for each link
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "X";
    deleteButton.classList.add("delete-link");
    deleteButton.addEventListener("click", () => removeLink(index));

    li.appendChild(a); // Adds the link to the list item
    li.appendChild(deleteButton); // Adds the delete button to the list item
    linksList.appendChild(li); // Adds the list item to the list
  });
}

// Function to remove a link based on its index
function removeLink(index) {
  const links = getLinks();
  links.splice(index, 1); // Remove the selected link from the array
  localStorage.setItem("savedLinks", JSON.stringify(links)); // Save updated links
  renderLinks(); // Refresh the link list
}

// Function to fetch weather data based on user's latitude and longitude
async function fetchWeather(lat, lon) {
  try {
    const url = `${BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`); // Handle API errors
    }

    const data = await response.json(); // Parse JSON response
    displayWeatherData(data); // Update UI with weather information
  } catch (error) {
    console.error("Error fetching weather data:", error);
    weatherContainer.innerHTML = "<p>Could not load weather data.</p>"; // Display error message in UI
  }
}

// Function to display the weather data in the UI
function displayWeatherData(data) {
  // Destructure the response data to extract necessary values
  const {
    name: cityName,
    sys: { country },
    main: { temp },
    weather,
  } = data;
  const weatherDescription = weather[0].description;
  const feelsLike = data.main.feels_like;
  const weatherIcon = weather[0].icon;

  // Update the weather section in the UI with the retrieved weather data
  weatherContainer.innerHTML = `
        <h3>${cityName}, ${country}</h3>
        <p>${Math.round(temp)}°C, Feels like:${Math.round(
    feelsLike
  )}°C <br>${weatherDescription}</p>
        <img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="Weather icon">
    `;
}

// Function to get the user's location using the browser's Geolocation API
function getLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        fetchWeather(position.coords.latitude, position.coords.longitude), // Fetch weather for user's location
      (error) => {
        console.error("Geolocation error:", error);
        weatherContainer.innerHTML = "<p>Could not get location.</p>"; // Display error if location access fails
      }
    );
  } else {
    weatherContainer.innerHTML =
      "<p>Geolocation is not supported in this browser.</p>"; // Handle browsers without geolocation support
  }
}

// Function to fetch a random image from Unsplash API
const apiKey = "E_1NnPtK1MqmSsNsI_z8Eb_5Gcpbu418ocfgWV1yvsw";
const collectionId = "96625331";
const apiUrl = `https://api.unsplash.com/collections/${collectionId}/photos?client_id=${apiKey}`;

document.getElementById("fetch-image").addEventListener("click", () => {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((images) => {
      if (images.length > 0) {
        const randomImage =
          images[Math.floor(Math.random() * images.length)].urls.small;
        document.body.style.backgroundImage = `url(${randomImage})`;
      } else {
        console.error("No images found in the collection.");
      }
    })
    .catch((error) => console.error("Error fetching image:", error));
});

document.getElementById("fetch-imagebig").addEventListener("click", () => {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((images) => {
      if (images.length > 0) {
        const randomImage =
          images[Math.floor(Math.random() * images.length)].urls.full;
        document.body.style.backgroundImage = `url(${randomImage})`;
      } else {
        console.error("No images found in the collection.");
      }
    })
    .catch((error) => console.error("Error fetching image:", error));
});

const apiKeyNvidia = "GA9LN7COHNH7RD37";
const stockInfoContainer = document.getElementById("nvidia-data");

async function fetchStockPrice() {
  stockInfoContainer.innerHTML = "<p>Fetching Nvidia Stock...</p>";

  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=NVDA&apikey=${apiKeyNvidia}`
    );
    const data = await response.json();
    console.log("API Response:", data); // Logga API-svaret i konsolen

    if (data["Global Quote"] && data["Global Quote"]["05. price"]) {
      const stockPrice = parseFloat(data["Global Quote"]["05. price"]).toFixed(
        2
      );
      const stockSymbol = data["Global Quote"]["01. symbol"];
      const stockChange = data["Global Quote"]["change percent"];
      stockInfoContainer.innerHTML = `${stockSymbol}<p> Pris: $${stockPrice}<br> Change: ${stockChange}</p>`;
    } else {
      stockInfoContainer.innerHTML =
        "<p>Kunde inte hämta aktiekursen. Kontrollera API-nyckeln.</p>";
    }
  } catch (error) {
    console.error("Fel vid hämtning av aktiekurs:", error);
    stockInfoContainer.innerHTML = "<p>Kunde inte hämta aktiekursen.</p>";
  }
}

document.addEventListener("DOMContentLoaded", fetchStockPrice);
