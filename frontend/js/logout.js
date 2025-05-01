// Centralized logout functionality for Echoes of Today
document.addEventListener('DOMContentLoaded', function() {
    // Handle logout button click
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Show the logout modal
            const logoutConfirmModal = document.getElementById('logoutConfirmModal');
            if (logoutConfirmModal) {
                const logoutModal = new bootstrap.Modal(logoutConfirmModal);
                logoutModal.show();
            } else {
                console.error('Logout modal not found');
            }
        });
    } else {
        console.error('Logout button not found');
    }
    
    // Handle confirm logout button click
    const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');
    if (confirmLogoutBtn) {
        confirmLogoutBtn.addEventListener('click', function() {
            // Hide the modal
            const logoutConfirmModal = document.getElementById('logoutConfirmModal');
            if (logoutConfirmModal) {
                const logoutModal = bootstrap.Modal.getInstance(logoutConfirmModal);
                if (logoutModal) {
                    logoutModal.hide();
                }
            }
            
            // Clear user data from localStorage
            localStorage.removeItem('userData');
            
            // Display logout successful message
            alert("Logged out successfully!");
            
            // Redirect to login page
            window.location.href = 'index.html';
        });
    } else {
        console.error('Confirm logout button not found');
    }
}); 