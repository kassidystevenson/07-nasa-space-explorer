// NASA API key
const apiKey = 'reVz81pA5TkgWmLzDonliOD5yetwdCZmaZtYIIhg';

// Find the container where we want to show the images
const gridContainer = document.getElementById('imageGrid');

// Find the button and date inputs
const getImagesBtn = document.getElementById('getImagesBtn');

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

    // Make sure we only show 9 items (for a 3x3 grid)
    const imagesToShow = data.slice(0, 9);

    // Create a grid container for the cards
    const grid = document.createElement('div');
    grid.className = 'apod-grid';

    // Loop through each item in the data (up to 9)
    imagesToShow.forEach(item => {
      // Create a card for each image or video
      const card = document.createElement('div');
      card.className = 'apod-card';

      // Check if the media is an image
      if (item.media_type === 'image') {
        // Create an image element
        const img = document.createElement('img');
        img.src = item.url;
        img.alt = item.title;
        img.className = 'apod-image';
        card.appendChild(img);
      } else {
        // If it's not an image (e.g., a video), show a placeholder
        const placeholder = document.createElement('div');
        placeholder.className = 'video-placeholder';
        placeholder.textContent = 'Video: ' + item.title;
        card.appendChild(placeholder);
      }

      // Add the title below the image or placeholder
      const caption = document.createElement('div');
      caption.className = 'apod-title';
      caption.textContent = item.title;
      card.appendChild(caption);

      // Add the date below the title
      const dateDiv = document.createElement('div');
      dateDiv.className = 'apod-date';
      dateDiv.textContent = formatDisplayDate(item.date);
      card.appendChild(dateDiv);

      // Add the card to the grid
      grid.appendChild(card);
    });

    // Add the grid to the main container
    gridContainer.appendChild(grid);
  } catch (error) {
    // Show an error message if something goes wrong
    gridContainer.innerHTML = `<div class="error">Failed to load images. Please try again later.</div>`;
  }
}

// Helper function to get a date string in YYYY-MM-DD format
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Function to format date as "Month Day, Year"
function formatDisplayDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

// Function to load images for a given date range
function loadImagesForRange() {
  // Get the values from the date pickers
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Only fetch if both dates are selected
  if (startDate && endDate) {
    fetchNasaImages(startDate, endDate);
  } else {
    // Show a message if dates are missing
    gridContainer.innerHTML = `<div class="error">Please select both start and end dates.</div>`;
  }
}

// When the button is clicked, load images for the selected range
getImagesBtn.addEventListener('click', loadImagesForRange);

// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);
