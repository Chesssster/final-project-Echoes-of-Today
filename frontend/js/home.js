document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  const checkAuth = () => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      // Redirect to login if not logged in
      window.location.href = 'login.html';
      return null;
    }
    return JSON.parse(userData).user;
  };
  
  // Initialize by checking authentication
  const currentUser = checkAuth();
  
  // API endpoints
  const API_BASE_URL = 'http://localhost:5000/api';
  
  // Get references to elements
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  const toggleContainer = document.getElementById('sidebarToggleContainer');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarToggleIcon = sidebarToggle.querySelector('.sidebar-toggle-icon');
  const journalsContainer = document.getElementById('journalsContainer');
  const emptyState = document.getElementById('emptyState');
  const gridViewBtn = document.getElementById('gridViewBtn');
  const listViewBtn = document.getElementById('listViewBtn');
  const sortSelect = document.getElementById('sortJournals');
  
  // Bootstrap modals
  const journalModal = new bootstrap.Modal(document.getElementById('journalModal'));
  const deleteConfirmModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
  
  // Current journal being viewed/edited
  let currentJournalId = null;
  let currentPage = 1;
  const journalsPerPage = 9;
  let viewMode = 'grid';
  let sortMode = 'newest';
  let journals = []; // Store journals data
  
  // Initialize sidebar state and toggle icon
  function updateSidebarState() {
    if (window.innerWidth <= 768) {
      sidebar.classList.add('sidebar-hidden');
      mainContent.classList.add('main-content-expanded');
      toggleContainer.style.left = '0';
      updateToggleIcon(true);
    } else {
      if (!sidebar.classList.contains('sidebar-hidden')) {
        toggleContainer.style.left = sidebar.offsetWidth + 'px';
        updateToggleIcon(false);
      } else {
        toggleContainer.style.left = '0';
        updateToggleIcon(true);
      }
    }
  }
  
  // Function to update the toggle button position
  function updateTogglePosition() {
    if (sidebar.classList.contains('sidebar-hidden')) {
      toggleContainer.style.left = '0';
    } else {
      toggleContainer.style.left = sidebar.offsetWidth + 'px';
    }
  }
  
  // Function to toggle the sidebar icon between hamburger and X
  function updateToggleIcon(isSidebarHidden) {
    if (isSidebarHidden) {
      // Hamburger icon
      sidebarToggleIcon.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
      `;
    } else {
      // X icon
      sidebarToggleIcon.innerHTML = `
        <span style="transform: rotate(45deg); top: 6px;"></span>
        <span style="opacity: 0;"></span>
        <span style="transform: rotate(-45deg); top: 6px;"></span>
      `;
    }
  }
  
  // Set initial toggle position based on sidebar state
  updateSidebarState();
  
  // Initialize dropdown sections
  const sections = ['navSection', 'accountSection', 'helpSection'];
  sections.forEach(id => {
    document.getElementById(id).style.display = 'block';
  });
  
  // Sidebar toggle click event
  sidebarToggle.addEventListener('click', function() {
    const isSidebarHidden = sidebar.classList.contains('sidebar-hidden');
    sidebar.classList.toggle('sidebar-hidden');
    mainContent.classList.toggle('main-content-expanded');
    updateTogglePosition();
    updateToggleIcon(!isSidebarHidden);
  });
  
  // View toggle events
  gridViewBtn.addEventListener('click', function() {
    setViewMode('grid');
  });
  
  listViewBtn.addEventListener('click', function() {
    setViewMode('list');
  });
  
  // Sort event
  sortSelect.addEventListener('change', function() {
    sortMode = this.value;
    displayJournals();
  });
  
  // Section dropdown toggles
  const dropdownToggles = ['navDropdown', 'accountDropdown', 'helpDropdown'];
  
  dropdownToggles.forEach((id, index) => {
    document.getElementById(id).addEventListener('click', function() {
      this.classList.toggle('up');
      const section = document.getElementById(sections[index]);
      section.style.display = section.style.display === 'none' ? 'block' : 'none';
    });
  });
  
  // Set view mode
  function setViewMode(mode) {
    viewMode = mode;
    
    if (mode === 'grid') {
      journalsContainer.className = 'journals-grid';
      gridViewBtn.classList.add('active');
      listViewBtn.classList.remove('active');
    } else {
      journalsContainer.className = 'journals-list';
      listViewBtn.classList.add('active');
      gridViewBtn.classList.remove('active');
    }
    
    displayJournals();
  }
  
  // Update dashboard stats
  function updateStats() {
    const totalEntriesElement = document.getElementById('totalEntries');
    const streakDaysElement = document.getElementById('streakDays');
    const lastActiveElement = document.getElementById('lastActive');
    
    // Update total entries
    totalEntriesElement.textContent = journals.length;
    
    // Calculate streak (simplified version)
    let streak = 0;
    if (journals.length > 0) {
      streak = calculateStreak(journals);
    }
    streakDaysElement.textContent = streak;
    
    // Update last active
    if (journals.length > 0) {
      const latestDate = new Date(Math.max(...journals.map(j => new Date(j.createdAt))));
      lastActiveElement.textContent = formatDate(latestDate, true);
    } else {
      lastActiveElement.textContent = '-';
    }
  }
  
  // Calculate streak (simplified)
  function calculateStreak(journals) {
    if (journals.length === 0) return 0;
    
    // Sort journals by date (newest first)
    const sortedJournals = [...journals].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    // Check if there's an entry today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const latestDate = new Date(sortedJournals[0].createdAt);
    latestDate.setHours(0, 0, 0, 0);
    
    // If latest entry isn't from today or yesterday, streak is 0
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    if (latestDate < yesterday) {
      return 0;
    }
    
    // Count consecutive days
    let streak = 1;
    let currentDate = latestDate;
    let previousDate = new Date(currentDate);
    previousDate.setDate(currentDate.getDate() - 1);
    
    // Go through journals looking for consecutive days
    for (let i = 1; i < sortedJournals.length; i++) {
      const journalDate = new Date(sortedJournals[i].createdAt);
      journalDate.setHours(0, 0, 0, 0);
      
      // If this journal was from the previous day, increment streak
      if (journalDate.getTime() === previousDate.getTime()) {
        streak++;
        currentDate = journalDate;
        previousDate = new Date(currentDate);
        previousDate.setDate(currentDate.getDate() - 1);
      } else if (journalDate.getTime() < previousDate.getTime()) {
        // Skip older entries for the same day
        continue;
      } else {
        // Break streak
        break;
      }
    }
    
    return streak;
  }
  
  // Fetch journals from the API
  async function fetchJournals() {
    try {
      const response = await fetch(`${API_BASE_URL}/journals/user/${currentUser.id}?userId=${currentUser.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch journals');
      }
      
      journals = await response.json();
      displayJournals();
    } catch (error) {
      console.error('Error fetching journals:', error);
      // Show error message to user
      journalsContainer.innerHTML = `
        <div class="alert alert-danger" role="alert">
          Failed to load journals. Please try again later.
        </div>
      `;
      emptyState.style.display = 'none';
    }
  }
  
  // Load and display journals
  function displayJournals() {
    const sortedJournals = sortJournals(journals, sortMode);
    
    // Update stats first
    updateStats();
    
    // Show empty state if no journals
    if (sortedJournals.length === 0) {
      emptyState.style.display = 'block';
      journalsContainer.innerHTML = '';
      document.getElementById('journalPagination').innerHTML = '';
      return;
    }
    
    // Hide empty state and show journals
    emptyState.style.display = 'none';
    
    // Calculate pagination
    const totalPages = Math.ceil(sortedJournals.length / journalsPerPage);
    const startIndex = (currentPage - 1) * journalsPerPage;
    const endIndex = Math.min(startIndex + journalsPerPage, sortedJournals.length);
    const pageJournals = sortedJournals.slice(startIndex, endIndex);
    
    // Clear container
    journalsContainer.innerHTML = '';
    
    // Add journal cards
    pageJournals.forEach(journal => {
      const journalCard = createJournalCard(journal);
      journalsContainer.appendChild(journalCard);
    });
    
    // Update pagination
    updatePagination(totalPages);
  }
  
  // Create a journal card element
  function createJournalCard(journal) {
    const card = document.createElement('div');
    card.className = viewMode === 'grid' ? 'journal-card journal-card-grid' : 'journal-card journal-card-list';
    card.dataset.id = journal._id;
    
    const previewText = journal.content.length > 150 
      ? journal.content.substring(0, 150) + '...'
      : journal.content;
    
    const dateObj = new Date(journal.createdAt);
    
    card.innerHTML = `
      <div class="journal-inner">
        <div class="journal-header">
          <h3 class="journal-title">${escapeHtml(journal.title)}</h3>
          <div class="journal-date">${formatDate(dateObj)}</div>
        </div>
        <p class="journal-preview">${escapeHtml(previewText)}</p>
      </div>
    `;
    
    // Add click event to open the journal modal
    card.addEventListener('click', function() {
      openJournalModal(journal);
    });
    
    return card;
  }
  
  // Sort journals based on selected sort method
  function sortJournals(journals, sortMethod) {
    const sortedJournals = [...journals];
    
    switch (sortMethod) {
      case 'newest':
        return sortedJournals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return sortedJournals.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'az':
        return sortedJournals.sort((a, b) => a.title.localeCompare(b.title));
      case 'za':
        return sortedJournals.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sortedJournals;
    }
  }
  
  // Update pagination controls
  function updatePagination(totalPages) {
    const paginationContainer = document.getElementById('journalPagination');
    
    if (totalPages <= 1) {
      paginationContainer.innerHTML = '';
      return;
    }
    
    let paginationHTML = `
      <nav aria-label="Journal pagination">
        <ul class="pagination">
          <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
    `;
    
    // Add page numbers
    for (let i = 1; i <= totalPages; i++) {
      paginationHTML += `
        <li class="page-item ${currentPage === i ? 'active' : ''}">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>
      `;
    }
    
    paginationHTML += `
          <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
    
    // Add event listeners to pagination links
    const pageLinks = paginationContainer.querySelectorAll('.page-link');
    pageLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const page = parseInt(this.dataset.page);
        if (page >= 1 && page <= totalPages) {
          currentPage = page;
          displayJournals();
          // Scroll to top of journal container
          journalsContainer.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
  
  // Open journal modal to view a journal
  async function openJournalModal(journal) {
    currentJournalId = journal._id;
    
    const modalTitle = document.getElementById('journalModalLabel');
    const modalBody = document.getElementById('journalModalBody');
    const journalDate = document.getElementById('journalDate');
    
    modalTitle.textContent = journal.title;
    
    // Show loading state in modal body
    modalBody.innerHTML = '<div class="text-center my-4"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Loading content...</p></div>';
    
    try {
      console.log('Loading journal content and images for journal ID:', journal._id);
      
      // Fetch images for this journal
      const imagesResponse = await fetch(`${API_BASE_URL}/journal-images/journal/${journal._id}?userId=${currentUser.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      let journalImages = [];
      if (imagesResponse.ok) {
        journalImages = await imagesResponse.json();
        console.log('Fetched images:', journalImages.length);
      } else {
        console.error('Failed to fetch images:', await imagesResponse.text());
      }
      
      // Format content with proper paragraphs
      const formattedContent = journal.content
        .split('\n')
        .map(paragraph => paragraph.trim())
        .filter(paragraph => paragraph.length > 0)
        .map(paragraph => `<p>${escapeHtml(paragraph)}</p>`)
        .join('');
      
      // Prepare image gallery if there are images
      let imageGallery = '';
      if (journalImages && journalImages.length > 0) {
        console.log('Creating image gallery with', journalImages.length, 'images');
        imageGallery = `
          <div class="journal-images mt-4 mb-3">
            <h5>Attached Images (${journalImages.length})</h5>
            <div class="image-gallery">
              ${journalImages.map(img => `
                <div class="image-item">
                  <img src="${img.imageUrl}" alt="Journal Image" class="img-fluid rounded" 
                       onerror="this.onerror=null; this.src='images/placeholder.png'; console.error('Failed to load image');">
                  ${img.caption ? `<p class="image-caption">${escapeHtml(img.caption)}</p>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        `;
      } else {
        console.log('No images found for this journal');
      }
      
      // Combine content and images
      modalBody.innerHTML = formattedContent + imageGallery;
      
      journalDate.textContent = formatDate(new Date(journal.createdAt), true);
      
      // Set up edit button
      document.getElementById('editJournalBtn').onclick = function() {
        journalModal.hide();
        redirectToEditPage(journal._id);
      };
      
      // Set up delete button
      document.getElementById('deleteJournalBtn').onclick = function() {
        journalModal.hide();
        openDeleteConfirmation(journal._id);
      };
      
    } catch (error) {
      console.error('Error loading journal content:', error);
      modalBody.innerHTML = `<div class="alert alert-danger">Failed to load journal content. Please try again.</div>`;
    }
    
    journalModal.show();
  }
  
  // Delete journal using API
  async function deleteJournalEntry(journalId) {
    try {
      const response = await fetch(`${API_BASE_URL}/journals/${journalId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: currentUser.id
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete journal');
      }
      
      const result = await response.json();
      console.log('Delete result:', result);
      
      // Show success message if images were deleted
      if (result.deletedImagesCount && result.deletedImagesCount > 0) {
        console.log(`Deleted ${result.deletedImagesCount} associated images`);
      }
      
      // Show success notification
      showNotification('Journal deleted successfully', 'success');
      
      // Fetch journals again to refresh the list
      await fetchJournals();
      return true;
    } catch (error) {
      console.error('Error deleting journal:', error);
      showNotification('Failed to delete journal. Please try again.', 'error');
      return false;
    }
  }
  
  // Open delete confirmation modal
  function openDeleteConfirmation(journalId) {
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    
    // Set up delete confirmation button
    confirmDeleteBtn.onclick = function() {
      deleteJournalEntry(journalId).then(success => {
        if (success) {
          deleteConfirmModal.hide();
        }
      });
    };
    
    deleteConfirmModal.show();
  }
  
  // Helper function to escape HTML
  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
  
  // Format date helper
  function formatDate(date, includeTime = false) {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    };
    
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    
    return date.toLocaleDateString('en-US', options);
  }
  
  // Redirect to edit page
  function redirectToEditPage(journalId) {
    // Store that we're in edit mode so the write page knows to load existing data
    localStorage.setItem('editingJournal', 'true');
    
    // Navigate to the write page with the journal ID
    window.location.href = `write.html?id=${journalId}`;
  }
  
  // Helper function to show notifications
  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
        <p>${message}</p>
      </div>
      <button class="notification-close">×</button>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Auto dismiss after 3 seconds
    const dismissTimeout = setTimeout(() => {
      dismissNotification(notification);
    }, 3000);
    
    // Add dismiss button handler
    notification.querySelector('.notification-close').addEventListener('click', () => {
      clearTimeout(dismissTimeout);
      dismissNotification(notification);
    });
  }
  
  // Helper function to dismiss notifications
  function dismissNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }
  
  // Initialize the page
  updateSidebarState();
  window.addEventListener('resize', updateSidebarState);
  
  // Add debugging logs
  console.log("Current user:", currentUser);
  
  // Make sure we have a valid user before fetching journals
  if (currentUser && currentUser.id) {
    console.log("Fetching journals for user ID:", currentUser.id);
    fetchJournals(); // Fetch journals from API
  } else {
    console.error("User not authenticated or missing ID");
    // Redirect to login page
    window.location.href = 'login.html';
  }
});

// Logout functionality removed - now handled by logout.js
