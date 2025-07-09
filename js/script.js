// NASA API key
const apiKey = 'reVz81pA5TkgWmLzDonliOD5yetwdCZmaZtYIIhg';

// Find the container where we want to show the images
const gridContainer = document.getElementById('imageGrid');

// Find the button and date inputs
const getImagesBtn = document.getElementById('getImagesBtn');

// Function to format date as "Month Day, Year"
function formatDisplayDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

// Helper function to get a date string in YYYY-MM-DD format
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Function to fetch only images from NASA APOD API
async function fetchNasaImages(startDate, endDate) {
  // Show a loading message while fetching
  gridContainer.innerHTML = `<div class="loading-message">🔄 Loading space photos…</div>`;

  // Build the API URL with the date range and API key
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;

  try {
    // Fetch data from the API
    const response = await fetch(url);
    // Parse the JSON data
    let data = await response.json();

    // Filter out videos, keep only images
    data = data.filter(item => item.media_type === 'image');

    // Sort by date descending (latest first)
    data.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Only show up to 9 images for the 3x3 grid
    const imagesToShow = data.slice(0, 9);

    // If no images, show a message
    if (imagesToShow.length === 0) {
      gridContainer.innerHTML = `<div class="error">No images found for this date range. Try a different range!</div>`;
      return;
    }

    // Create a grid container for the cards
    const grid = document.createElement('div');
    grid.className = 'apod-grid';

    // Loop through each image and create a card
    imagesToShow.forEach(item => {
      // Create a card for each image
      const card = document.createElement('div');
      card.className = 'apod-card';

      // Create an image element
      const img = document.createElement('img');
      img.src = item.url;
      img.alt = item.title;
      img.className = 'apod-image';
      card.appendChild(img);

      // Add the title below the image
      const caption = document.createElement('div');
      caption.className = 'apod-title';
      caption.textContent = item.title;
      card.appendChild(caption);

      // Add the date below the title
      const dateDiv = document.createElement('div');
      dateDiv.className = 'apod-date';
      dateDiv.textContent = formatDisplayDate(item.date);
      card.appendChild(dateDiv);

      // When the card is clicked, open the modal with details
      card.addEventListener('click', () => openModal(item));

      // Add the card to the grid
      grid.appendChild(card);
    });

    // Add the grid to the main container
    gridContainer.innerHTML = '';
    gridContainer.appendChild(grid);
  } catch (error) {
    // Show an error message if something goes wrong
    gridContainer.innerHTML = `<div class="error">Failed to load images. Please try again later.</div>`;
  }
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

// Load the last 9 days of images by default on page load
window.addEventListener('DOMContentLoaded', () => {
  // Get today's date
  const endDate = new Date();
  // Get the date 8 days ago (so we have 9 days total)
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 8);

  // Format dates as YYYY-MM-DD
  const startStr = formatDate(startDate);
  const endStr = formatDate(endDate);

  // Set the date pickers to these values
  startInput.value = startStr;
  endInput.value = endStr;

  // Fetch and display the images
  fetchNasaImages(startStr, endStr);
});

// Modal elements
const modal = document.getElementById('apodModal');
const modalImg = document.getElementById('apodModalImg');
const modalTitle = document.getElementById('apodModalTitle');
const modalDate = document.getElementById('apodModalDate');
const modalExplanation = document.getElementById('apodModalExplanation');
const modalClose = document.getElementById('apodModalClose');

// Function to open the modal with APOD details
function openModal(item) {
  // Set modal content
  modalImg.src = item.hdurl || item.url;
  modalImg.alt = item.title;
  modalTitle.textContent = item.title;
  modalDate.textContent = formatDisplayDate(item.date);
  modalExplanation.textContent = item.explanation;
  // Show modal
  modal.style.display = 'flex';
}

// Function to close the modal
function closeModal() {
  modal.style.display = 'none';
  modalImg.src = '';
  modalTitle.textContent = '';
  modalDate.textContent = '';
  modalExplanation.textContent = '';
}

// Close modal on close button click
modalClose.addEventListener('click', closeModal);

// Close modal when clicking outside the modal content
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});
