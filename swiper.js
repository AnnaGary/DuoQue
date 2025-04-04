let profiles = [];
let currentIndex = 0;

// Replace with your actual logged-in user ID
const fromUserId = "660d0a1e1234567890abcdef"; // Example

// Fetch profiles from backend
async function fetchProfiles() {
  try {
    const res = await fetch('http://localhost:3000/api/profiles'); // Adjust port if needed
    profiles = await res.json();
    console.log("Profiles fetched:", profiles);

    // Optionally filter out current user
    const filtered = profiles.filter(p => p._id !== fromUserId);
    profiles = filtered;

    if (!profiles.length) {
      document.getElementById('profileCard').innerText = "No profiles available.";
      return;
    }

    showProfile();
  } catch (err) {
    console.error("Fetch error:", err);
    document.getElementById('profileCard').innerText = "Failed to load profiles.";
  }
}

// Show current profile in card
function showProfile() {
  if (!profiles.length) {
    document.getElementById('profileCard').innerText = "No profiles available.";
    return;
  }

  const p = profiles[currentIndex];

  document.getElementById('profileCard').innerHTML = `
    <h2>@${p.username}</h2>
    <p><strong>Bio:</strong> ${p.bio || 'No bio provided'}</p>
    <p><strong>Hobbies:</strong> ${p.hobbies?.join(', ') || 'None listed'}</p>
    <p><strong>Location:</strong> ${p.location || 'Unknown'}</p>
    <p><small>Joined: ${new Date(p.createdAt).toLocaleDateString()}</small></p>
  `;
}

// Navigate right
function nextProfile() {
  currentIndex = (currentIndex + 1) % profiles.length;
  showProfile();
}

// Navigate left
function prevProfile() {
  currentIndex = (currentIndex - 1 + profiles.length) % profiles.length;
  showProfile();
}

// Like profile and POST to backend
async function likeProfile() {
  const toUserId = profiles[currentIndex]._id;

  try {
    const res = await fetch('http://localhost:3000/api/matches/like', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromUserId, toUserId })
    });

    const data = await res.json();
    alert(data.message);
    nextProfile();
  } catch (err) {
    console.error("Error liking profile:", err);
    alert("Something went wrong while liking this profile.");
  }
}

fetchProfiles();