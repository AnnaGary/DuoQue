let profiles = [];
let currentIndex = 0;
const fromUserId = "660d0a1e1234567890abcdef";
const currentUser = localStorage.getItem('username') || "current_user"; // Fallback if not logged in

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
    <button class="report-btn" onclick="openReportModal()">⚠️ Report</button>
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

function openReportModal() {
  if (!profiles.length) return;
  
  const reportModal = document.getElementById('reportModal');
  const reportedUserField = document.getElementById('reportedUser');
  
  // Set the username of the current profile
  reportedUserField.value = profiles[currentIndex].username;
  
  // Reset form and messages
  document.getElementById('reportForm').reset();
  hideMessages();
  
  reportModal.style.display = 'block';
}

function closeReportModal() {
  document.getElementById('reportModal').style.display = 'none';
}

function showMessage(type, message) {
  const successMsg = document.getElementById('successMessage');
  const errorMsg = document.getElementById('errorMessage');
  
  // Hide both messages first
  hideMessages();
  
  if (type === 'success') {
    successMsg.textContent = message;
    successMsg.style.display = 'block';
  } else {
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
  }
}

function hideMessages() {
  document.getElementById('successMessage').style.display = 'none';
  document.getElementById('errorMessage').style.display = 'none';
}

// Submit report function
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('reportForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const reportedUsername = document.getElementById('reportedUser').value;
    const reason = document.getElementById('reportReason').value;
    const details = document.getElementById('reportDetails').value.trim();
    
    // Basic validation
    if (!reason) {
      showMessage('error', 'Please select a reason for your report.');
      return;
    }
    
    // Don't allow self-reporting
    if (reportedUsername.toLowerCase() === currentUser.toLowerCase()) {
      showMessage('error', 'You cannot report yourself.');
      return;
    }
    
    try {
      // Submit the report
      const res = await fetch(`${BACKEND_URL}/api/reports/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: currentUser,
          reportedUsername: reportedUsername,
          reason: reason,
          details: details
        })
      });

      const data = await res.json();
      
      if (data.success) {
        showMessage('success', 'Your report has been submitted successfully.');
        document.getElementById('reportForm').reset();
        
        // Close modal after 2 seconds
        setTimeout(() => {
          closeReportModal();
        }, 2000);
      } else {
        showMessage('error', data.message || 'An error occurred while submitting your report.');
      }
    } catch (err) {
      console.error('Error submitting report:', err);
      showMessage('error', 'An error occurred. Please try again later.');
    }
  });
});

// Close modal when clicking outside of it
window.onclick = function(event) {
  const modal = document.getElementById('reportModal');
  if (event.target === modal) {
    closeReportModal();
  }
};

fetchProfiles();