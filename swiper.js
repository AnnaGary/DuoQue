let profiles = [];
let currentIndex = 0;

const fromUserId = localStorage.getItem('userId');

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

  const likeBtn = document.getElementById('likeBtn');
  if (likeBtn) {
    likeBtn.textContent = "❤️ Like";
    likeBtn.classList.remove("liked");
    likeBtn.disabled = false;
  }

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
  const fromUserId = localStorage.getItem('userId');

  if (!fromUserId) {
     alert('Please log in to like profiles.');
    return;
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/matches/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromUserId, toUserId })
    });

    const data = await res.json();
    alert(data.message);

    const likeBtn = document.getElementById('likeBtn');
    likeBtn.textContent = "❤️ Liked";
    likeBtn.classList.add("liked");
    likeBtn.disabled = true;

    nextProfile();
  } catch (err) {
    console.error("Error liking profile:", err);
    alert("Something went wrong while liking this profile.");
  }
}

fetchProfiles();