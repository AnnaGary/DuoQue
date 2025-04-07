document.addEventListener('DOMContentLoaded', function () {
    const hobbyItems = document.querySelectorAll('.hobby-item');
    const submitButton = document.getElementById('submit-button');
    const bioInput = document.getElementById('bio-input');
    
    // Check if user is logged in
    const username = localStorage.getItem('username');
    if (!username) {
        alert('Session expired. Please sign in again.');
        window.location.href = '/login.html';
        return;
    }
    
    // Load user data when page loads
    loadUserData(username);
    
    if (submitButton) {
        submitButton.addEventListener('click', async function(e) {
            e.preventDefault();
            
            // Get selected hobbies
            const selectedHobbies = [];
            const selectedMainItems = document.querySelectorAll('.hobby-item.selected');
            
            selectedMainItems.forEach(item => {
                const buttonText = item.querySelector('button')?.textContent.trim();
                if (buttonText) {
                    selectedHobbies.push(buttonText);
                }
                
                const subcategoryId = item.getAttribute('onclick');
                if (subcategoryId) {
                    const match = subcategoryId.match(/toggleSelection\(this,\s*'([^']+)'/);
                    if (match && match[1]) {
                        const subId = match[1];
                        const subItems = document.querySelectorAll(`#${subId} .hobby-item.selected button`);
                        
                        subItems.forEach(subItem => {
                            selectedHobbies.push(subItem.textContent.trim());
                        });
                    }
                }
            });
            
            if (selectedHobbies.length === 0) {
                alert('Please select at least one hobby');
                return;
            }
            
            // Get bio text
            const bio = bioInput.value.trim();
            
            try {
                // Update hobbies first
                const hobbiesResponse = await fetch('/api/users/update-hobbies', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, hobbies: selectedHobbies })
                });
                
                if (!hobbiesResponse.ok) {
                    const data = await hobbiesResponse.json();
                    alert(data.message || 'Failed to save hobbies. Please try again');
                    return;
                }
                
                // Then update bio
                const bioResponse = await fetch('/api/users/update-bio', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, bio })
                });
                
                if (!bioResponse.ok) {
                    const data = await bioResponse.json();
                    alert(data.message || 'Failed to save bio. Please try again');
                    return;
                }
                
                alert('Profile updated successfully');
                window.location.href = '/index.html';
                
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while saving your profile. Please try again');
            }
        });
    }
    
    // Function to load user data and populate the form
    async function loadUserData(username) {
        try {
            const response = await fetch(`/api/users/profile?username=${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                console.error('Failed to load user data');
                return;
            }
            
            const userData = await response.json();
            
            // Set bio value
            if (userData.bio) {
                bioInput.value = userData.bio;
            }
            
            // Select hobbies
            if (userData.hobbies && userData.hobbies.length > 0) {
                userData.hobbies.forEach(hobby => {
                    // Try to find main category buttons that match the hobby
                    const mainButtons = document.querySelectorAll('.hobby-item > button');
                    mainButtons.forEach(button => {
                        if (button.textContent.trim() === hobby) {
                            const parentItem = button.closest('.hobby-item');
                            toggleSelection(parentItem);
                            
                            // If this button has a subcategory, check it
                            const parentOnclick = parentItem.getAttribute('onclick');
                            if (parentOnclick) {
                                const match = parentOnclick.match(/toggleSelection\(this,\s*'([^']+)'/);
                                if (match && match[1]) {
                                    document.getElementById(match[1]).style.display = 'block';
                                }
                            }
                        }
                    });
                    
                    // Try to find subcategory buttons that match the hobby
                    const subButtons = document.querySelectorAll('.subcategory .hobby-item > button');
                    subButtons.forEach(button => {
                        if (button.textContent.trim() === hobby) {
                            const parentItem = button.closest('.hobby-item');
                            toggleSelection(parentItem);
                            
                            // Make sure parent category is selected and visible
                            const subcategory = button.closest('.subcategory');
                            if (subcategory) {
                                subcategory.style.display = 'block';
                                const subcategoryId = subcategory.id;
                                const parentItem = document.querySelector(`.hobby-item[onclick*="${subcategoryId}"]`);
                                if (parentItem && !parentItem.classList.contains('selected')) {
                                    toggleSelection(parentItem);
                                }
                            }
                        }
                    });
                });
            }
            
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }
});