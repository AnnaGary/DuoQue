let profiles = [];
let currentIndex = 0;
const BACKEND_URL = "http://localhost:3000";

async function fetchProfiles() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/profiles`);
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

  updateLikeButton(p._id); // Refresh button state
}

function nextProfile() {
  currentIndex = (currentIndex + 1) % profiles.length;
  showProfile();
}

function prevProfile() {
  currentIndex = (currentIndex - 1 + profiles.length) % profiles.length;
  showProfile();
}

async function updateLikeButton(toUserId) {
  const fromUserId = localStorage.getItem('userId');
  const likeBtn = document.getElementById('likeBtn');

  if (!fromUserId) {
    likeBtn.textContent = "Like";
    likeBtn.className = "like";
    return;
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/users/profile?username=${localStorage.getItem('username')}`);
    const user = await res.json();

    const liked = user.matches.some(match => {
      // Handle if match.userId is a string or an object
      return (
        match.userId === toUserId ||
        (typeof match.userId === 'object' && match.userId._id === toUserId)
      );
    });

    likeBtn.classList.remove('like', 'liked');
    likeBtn.textContent = liked ? '❤️' : 'Like';
    likeBtn.classList.add(liked ? 'liked' : 'like');

  } catch (err) {
    console.error("Error checking like status:", err);
  }
}

async function likeProfile() {
  const toUserId = profiles[currentIndex]._id;
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

    likeBtn.classList.remove('like', 'liked');
    likeBtn.textContent = data.liked ? '❤️' : 'Unlike';
    likeBtn.classList.add(data.liked ? 'liked' : 'like');

  } catch (err) {
    console.error("Error liking profile:", err);
    alert("Something went wrong while liking this profile.");
  }
}

fetchProfiles();