let profiles = [];
let currentIndex = 0;

const BACKEND_URL = "http://localhost:3000";
const fromUserId = localStorage.getItem('userId');

// Track liked user IDs in memory (optionally persist in localStorage)
let likedUserIds = new Set(JSON.parse(localStorage.getItem('likedUserIds') || '[]'));

async function fetchProfiles() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/profiles`);
    if (!res.ok) throw new Error(`Server responded with status ${res.status}`);
    profiles = await res.json();

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
  document.getElementById('profileCard').innerHTML = `
    <h2>@${p.username}</h2>
    <p><strong>Bio:</strong> ${p.bio || 'No bio provided'}</p>
    <p><strong>Hobbies:</strong> ${p.hobbies?.join(', ') || 'None listed'}</p>
    <p><strong>Location:</strong> ${p.location || 'Unknown'}</p>
    <p><small>Joined: ${new Date(p.createdAt).toLocaleDateString()}</small></p>
  `;

  const likeBtn = document.getElementById('likeBtn');
  if (likedUserIds.has(p._id)) {
    likeBtn.textContent = "💔 Unlike";
    likeBtn.classList.add("liked");
  } else {
    likeBtn.textContent = "❤️ Like";
    likeBtn.classList.remove("liked");
  }
  likeBtn.disabled = false;
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
  const likeBtn = document.getElementById('likeBtn');

  if (!fromUserId) {
    alert('Please log in to like profiles.');
    return;
  }

  const isLiked = likedUserIds.has(toUserId);

  try {
    const res = await fetch(`${BACKEND_URL}/api/matches/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromUserId, toUserId, unlike: isLiked })
    });

    const data = await res.json();
    console.log(data.message);

    // Update liked state
    if (isLiked) {
      likedUserIds.delete(toUserId);
      likeBtn.textContent = "❤️ Like";
      likeBtn.classList.remove("liked");
    } else {
      likedUserIds.add(toUserId);
      likeBtn.textContent = "💔 Unlike";
      likeBtn.classList.add("liked");
    }

    // Save to localStorage
    localStorage.setItem('likedUserIds', JSON.stringify([...likedUserIds]));
  } catch (err) {
    console.error("Error toggling like:", err);
    alert("Something went wrong.");
  }
}

fetchProfiles();