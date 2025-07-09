// NASA API key
const apiKey = 'reVz81pA5TkgWmLzDonliOD5yetwdCZmaZtYIIhg';

// Find the container where we want to show the images
const gridContainer = document.getElementById('imageGrid');

// Function to fetch images from NASA APOD API
async function fetchNasaImages(startDate, endDate) {
  // Build the API URL with the date range and API key
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;

  try {
    // Fetch data from the API
    const response = await fetch(url);
    // Parse the JSON data
    const data = await response.json();

    // Clear any previous images
    gridContainer.innerHTML = '';

    // Loop through each item in the data (should be 9)
    data.forEach(item => {
      // Create a div for each image or video
      const cell = document.createElement('div');
      cell.className = 'grid-cell';

      // Check if the media is an image
      if (item.media_type === 'image') {
        // Create an image element
        const img = document.createElement('img');
        img.src = item.url;
        img.alt = item.title;
        img.className = 'apod-image';
        cell.appendChild(img);
      } else {
        // If it's not an image (e.g., a video), show a placeholder
        const placeholder = document.createElement('div');
        placeholder.className = 'video-placeholder';
        placeholder.textContent = 'Video: ' + item.title;
        cell.appendChild(placeholder);
      }

      // Add the title below the image or placeholder
      const caption = document.createElement('div');
      caption.className = 'apod-title';
      caption.textContent = item.title;
      cell.appendChild(caption);

      // Add the cell to the grid container
      gridContainer.appendChild(cell);
    });
  } catch (error) {
    // Show an error message if something goes wrong
    gridContainer.innerHTML = `<div class="error">Failed to load images. Please try again later.</div>`;
  }
}

// Helper function to get a date string in YYYY-MM-DD format
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Function to load images for the current date range (default: last 9 days)
function loadDefaultImages() {
  // Get today's date
  const endDate = new Date();
  // Get the date 8 days ago (so we have 9 days total)
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 8);

  // Format dates as YYYY-MM-DD
  const startStr = formatDate(startDate);
  const endStr = formatDate(endDate);

  // Fetch and display the images
  fetchNasaImages(startStr, endStr);
}

// Load images when the page loads
window.addEventListener('DOMContentLoaded', loadDefaultImages);

// OPTIONAL: If you want to load images when the date pickers change, you can add event listeners here
// startInput.addEventListener('change', () => { ... });
// endInput.addEventListener('change', () => { ... });

// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);
