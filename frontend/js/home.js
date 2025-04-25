document.addEventListener('DOMContentLoaded', function() {
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
    const journals = getJournals();
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
      const latestDate = new Date(Math.max(...journals.map(j => new Date(j.date))));
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
      new Date(b.date) - new Date(a.date)
    );
    
    // Check if there's an entry today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const latestDate = new Date(sortedJournals[0].date);
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
    
    for (let i = 1; i < sortedJournals.length; i++) {
      const journalDate = new Date(sortedJournals[i].date);
      journalDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(currentDate);
      expectedDate.setDate(currentDate.getDate() - 1);
      
      if (journalDate.getTime() === expectedDate.getTime()) {
        streak++;
        currentDate = journalDate;
      } else {
        break;
      }
    }
    
    return streak;
  }
  
  // Load and display journals
  function displayJournals() {
    const journals = getJournals();
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
    card.dataset.id = journal.id;
    
    const previewText = journal.content.length > 150 
      ? journal.content.substring(0, 150) + '...'
      : journal.content;
    
    card.innerHTML = `
      <div class="journal-header">
        <h3 class="journal-title">${escapeHtml(journal.title)}</h3>
        <div class="journal-date">${formatDate(new Date(journal.date))}</div>
      </div>
      <div class="journal-body">
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
        return sortedJournals.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'oldest':
        return sortedJournals.sort((a, b) => new Date(a.date) - new Date(b.date));
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
  function openJournalModal(journal) {
    currentJournalId = journal.id;
    
    const modalTitle = document.getElementById('journalModalLabel');
    const modalBody = document.getElementById('journalModalBody');
    const journalDate = document.getElementById('journalDate');
    
    modalTitle.textContent = journal.title;
    
    // Format content with proper paragraphs
    const formattedContent = journal.content
      .split('\n')
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0)
      .map(paragraph => `<p>${escapeHtml(paragraph)}</p>`)
      .join('');
    
    modalBody.innerHTML = formattedContent;
    journalDate.textContent = formatDate(new Date(journal.date), true);
    
    // Set up edit button
    document.getElementById('editJournalBtn').onclick = function() {
      journalModal.hide();
      redirectToEditPage(journal.id);
    };
    
    // Set up delete button
    document.getElementById('deleteJournalBtn').onclick = function() {
      journalModal.hide();
      openDeleteConfirmation(journal.id);
    };
    
    journalModal.show();
  }
  
  // Delete journal
  function deleteJournalEntry(journalId) {
    // Get journals from localStorage
    let journals = getJournals();
    const initialLength = journals.length;
    
    // Filter out the journal to delete
    journals = journals.filter(journal => journal.id != journalId);
    
    // Check if a journal was actually removed
    if (journals.length !== initialLength) {
      // Save back to localStorage
      localStorage.setItem('journals', JSON.stringify(journals));
      // Refresh the display
      displayJournals();
      return true;
    }
    
    return false;
  }
  
  // Open delete confirmation modal
  function openDeleteConfirmation(journalId) {
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    
    // Set up delete confirmation button
    confirmDeleteBtn.onclick = function() {
      deleteJournalEntry(journalId);
      deleteConfirmModal.hide();
    };
  }
  
  // Function to get journals from localStorage
  function getJournals() {
    return JSON.parse(localStorage.getItem('journals') || '[]');
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
    window.location.href = `write.html?id=${journalId}`;
  }
  
  // Initialize the page
  updateSidebarState();
  window.addEventListener('resize', updateSidebarState);
  displayJournals();
});

 // Logout functionality
 document.getElementById('logoutButton').addEventListener('click', function(e) {
  e.preventDefault();
  // Show the logout modal instead of using confirm
  const logoutModal = new bootstrap.Modal(document.getElementById('logoutConfirmModal'));
  logoutModal.show();
});

// Add event listener for the confirm logout button in the modal
document.getElementById('confirmLogoutBtn').addEventListener('click', function() {
  // Hide the modal
  const logoutModal = bootstrap.Modal.getInstance(document.getElementById('logoutConfirmModal'));
  logoutModal.hide();
  
  // Display logout successful message
  alert("Logged out successfully!");
  
  // Redirect to login page
  window.location.href = 'index.html';
});
