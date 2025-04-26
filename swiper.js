let profiles = [];
let currentIndex = 0;
const BACKEND_URL = "http://localhost:3000";

async function fetchProfiles() {
  try {
    const userId = localStorage.getItem('userId');
    const url = userId 
      ? `${BACKEND_URL}/api/profiles?userId=${userId}`
      : `${BACKEND_URL}/api/profiles`;

    const res = await fetch(url);
    profiles = await res.json();
    showProfile();
  } catch (err) {
    document.getElementById('profileCard').innerText = "Failed to load profiles.";
    console.error(err);
  }
}

function showProfile() {
  const p = profiles[currentIndex];
  document.getElementById('profileCard').innerHTML = `
    <h2>@${p.username}</h2>
    <p><strong>Bio:</strong> ${p.bio || 'No bio provided'}</p>
    <p><strong>Hobbies:</strong> ${p.hobbies?.join(', ') || 'None listed'}</p>
    <p><small>Joined: ${new Date(p.createdAt).toLocaleDateString()}</small></p>
  `;

  updateLikeButton(p.liked);
}

function nextProfile() {
  resetLikeButton();
  currentIndex = (currentIndex + 1) % profiles.length;
  showProfile();
}

function resetLikeButton() {
  const likeBtn = document.getElementById('likeBtn');
  likeBtn.textContent = "Like";
  likeBtn.className = "like";
}

function prevProfile() {
  currentIndex = (currentIndex - 1 + profiles.length) % profiles.length;
  showProfile();
}

function updateLikeButton(liked) {
  const likeBtn = document.getElementById('likeBtn');
  if (!localStorage.getItem('userId')) {
    likeBtn.textContent = "Like";
    likeBtn.className = "like";
    return;
  }
  likeBtn.textContent = liked ? '❤️ Unlike' : 'Like';
  likeBtn.className = liked ? 'liked' : 'like';
}

async function likeProfile() {
  const p = profiles[currentIndex];
  const toUserId = p._id;
  const fromUserId = localStorage.getItem('userId');
  const likeBtn = document.getElementById('likeBtn');

  if (!fromUserId) {
    alert("Please log in to like profiles.");
    return;
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/matches/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromUserId, toUserId })
    });

    const data = await res.json();

    // Update button appearance immediately
    likeBtn.textContent = data.liked ? '❤️ Unlike' : 'Like';
    likeBtn.className = data.liked ? 'liked' : 'like';

    // Update profile's liked status locally
    profiles[currentIndex].liked = data.liked;

  } catch (err) {
    console.error("Error liking profile:", err);
    alert("Something went wrong while liking this profile.");
  }
}

fetchProfiles();