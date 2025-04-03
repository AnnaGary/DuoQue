// swiper.js

let profiles = [];
let currentIndex = 0;

// Fetch profiles from backend
async function fetchProfiles() {
  try {
    const res = await fetch('http://localhost:8080/api/profiles');
    profiles = await res.json();
    showProfile();
  } catch (err) {
    document.getElementById('profileCard').innerText = "Failed to load profiles.";
  }
}

// Show one profile at a time
function showProfile() {
  if (profiles.length === 0) return;
  const p = profiles[currentIndex];
  document.getElementById('profileCard').innerHTML = `
    <h2>${p.name}, ${p.age}</h2>
    <p>${p.bio}</p>
  `;
}

function nextProfile() {
  currentIndex = (currentIndex + 1) % profiles.length;
  showProfile();
}

function prevProfile() {
  currentIndex = (currentIndex - 1 + profiles.length) % profiles.length;
  showProfile();
}

// Start everything
fetchProfiles();