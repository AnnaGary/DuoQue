let profiles = [];
let currentIndex = 0;

const fromUserId = "660d0a1e1234567890abcdef";

const BACKEND_URL = "http://localhost:3000";

async function fetchProfiles() {
  try {
    console.log("Fetching profiles from:", `${BACKEND_URL}/api/profiles`);
    const res = await fetch(`${BACKEND_URL}/api/profiles`);

    if (!res.ok) throw new Error(`Server responded with status ${res.status}`);

    profiles = await res.json();
    console.log("Fetched profiles:", profiles);

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

function showProfile() {
  if (!profiles.length) {
    document.getElementById('profileCard').innerText = "No profiles available.";
    return;
  }

  const p = profiles[currentIndex];
  console.log("Showing profile:", p);

  document.getElementById('profileCard').innerHTML = `
    <h2>@${p.username}</h2>
    <p><strong>Bio:</strong> ${p.bio || 'No bio provided'}</p>
    <p><strong>Hobbies:</strong> ${p.hobbies?.join(', ') || 'None listed'}</p>
    <p><strong>Location:</strong> ${p.location || 'Unknown'}</p>
    <p><small>Joined: ${new Date(p.createdAt).toLocaleDateString()}</small></p>
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

async function likeProfile() {
  const toUserId = profiles[currentIndex]._id;
  try {
    const res = await fetch(`${BACKEND_URL}/api/matches/like`, {
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