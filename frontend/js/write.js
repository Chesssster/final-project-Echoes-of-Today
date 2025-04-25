document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarToggleContainer = document.getElementById('sidebarToggleContainer');
  const sidebarToggleIcon = sidebarToggle.querySelector('.sidebar-toggle-icon');
  
  sidebarToggle.addEventListener('click', function() {
    const isSidebarHidden = sidebar.classList.contains('sidebar-hidden');
    sidebar.classList.toggle('sidebar-hidden');
    mainContent.classList.toggle('main-content-expanded');
    
    // Update toggle button position
    if (sidebar.classList.contains('sidebar-hidden')) {
      sidebarToggleContainer.style.left = '0';
    } else {
      sidebarToggleContainer.style.left = '250px';
    }
    
    // Update toggle icon after toggling the sidebar
    updateToggleIcon(!isSidebarHidden);
  });

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
  
  // Set initial toggle icon based on sidebar state
  updateToggleIcon(sidebar.classList.contains('sidebar-hidden'));
  
  // Dropdown functionality
  const dropdowns = document.querySelectorAll('.dropdown-icon');
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', function() {
      this.classList.toggle('up');
      const sectionId = this.id.replace('Dropdown', 'Section');
      const section = document.getElementById(sectionId);
      
      if (section) {
        section.style.display = section.style.display === 'none' ? 'block' : 'none';
      }
    });
  });
  
  // Image upload functionality
  const insertImageBtn = document.getElementById('insertImageBtn');
  const imageUploadContainer = document.getElementById('imageUploadContainer');
  const imageUpload = document.getElementById('imageUpload');
  const browseImagesBtn = document.getElementById('browseImagesBtn');
  const imagePreviewContainer = document.getElementById('imagePreviewContainer');
  
  // Toggle image upload container visibility
  insertImageBtn.addEventListener('click', function() {
    imageUploadContainer.classList.toggle('hidden');
  });
  
  // Trigger file input when browse button is clicked
  browseImagesBtn.addEventListener('click', function() {
    imageUpload.click();
  });
  
  // Handle drag and drop
  imageUploadContainer.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.style.backgroundColor = '#e9eef5';
    this.style.borderColor = '#4a6baf';
  });
  
  imageUploadContainer.addEventListener('dragleave', function(e) {
    e.preventDefault();
    this.style.backgroundColor = '#f9f9f9';
    this.style.borderColor = '#ccc';
  });
  
  imageUploadContainer.addEventListener('drop', function(e) {
    e.preventDefault();
    this.style.backgroundColor = '#f9f9f9';
    this.style.borderColor = '#ccc';
    
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  });
  
  // Click to browse files
  imageUploadContainer.addEventListener('click', function(e) {
    if (e.target !== browseImagesBtn && !e.target.closest('.image-preview-item')) {
      imageUpload.click();
    }
  });
  
  // Handle file selection
  imageUpload.addEventListener('change', function() {
    handleFiles(this.files);
  });
  
  // Process selected files
  function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Only process image files
      if (!file.type.match('image.*')) {
        continue;
      }
      
      const reader = new FileReader();
      
      reader.onload = function(e) {
        // Create preview element
        const previewItem = document.createElement('div');
        previewItem.className = 'image-preview-item';
        previewItem.innerHTML = `
          <img src="${e.target.result}" alt="Image Preview">
          <div class="remove-image">×</div>
        `;
        
        // Add remove functionality
        previewItem.querySelector('.remove-image').addEventListener('click', function() {
          previewItem.remove();
        });
        
        // Add to preview container
        imagePreviewContainer.appendChild(previewItem);
        
        // Insert image into textarea (in a real app, you might want to store the images and reference them)
        const imageTag = `\n[Image: ${file.name}]\n`;
        const textarea = document.getElementById('journalContent');
        
        // Insert at cursor position or at the end if no selection
        if (textarea.selectionStart || textarea.selectionStart === 0) {
          const startPos = textarea.selectionStart;
          const endPos = textarea.selectionEnd;
          textarea.value = textarea.value.substring(0, startPos) + imageTag + textarea.value.substring(endPos, textarea.value.length);
          textarea.selectionStart = startPos + imageTag.length;
          textarea.selectionEnd = startPos + imageTag.length;
        } else {
          textarea.value += imageTag;
        }
      };
      
      reader.readAsDataURL(file);
    }
  }
  
  // Text editor toolbar functionality
  const toolbar = document.querySelector('.toolbar');
  const journalContent = document.getElementById('journalContent');
  
  toolbar.addEventListener('click', function(e) {
    const button = e.target.closest('button');
    if (!button) return;
    
    const command = button.getAttribute('data-command');
    
    if (command) {
      e.preventDefault();
      
      // Simple formatting commands
      switch (command) {
        case 'bold':
          wrapSelectedText('**', '**');
          break;
        case 'italic':
          wrapSelectedText('*', '*');
          break;
        case 'underline':
          wrapSelectedText('__', '__');
          break;
        case 'justifyLeft':
          alignSelectedText('left');
          break;
        case 'justifyCenter':
          alignSelectedText('center');
          break;
        case 'justifyRight':
          alignSelectedText('right');
          break;
      }
    }
  });
  
  // Helper function to wrap selected text with tags
  function wrapSelectedText(openTag, closeTag) {
    if (journalContent.selectionStart || journalContent.selectionStart === 0) {
      const startPos = journalContent.selectionStart;
      const endPos = journalContent.selectionEnd;
      const selectedText = journalContent.value.substring(startPos, endPos);
      
      if (selectedText) {
        const newText = openTag + selectedText + closeTag;
        journalContent.value = journalContent.value.substring(0, startPos) + newText + journalContent.value.substring(endPos);
        journalContent.selectionStart = startPos + newText.length;
        journalContent.selectionEnd = startPos + newText.length;
      }
    }
  }
  
  // Helper function to align selected text
  function alignSelectedText(alignment) {
    if (journalContent.selectionStart || journalContent.selectionStart === 0) {
      const startPos = journalContent.selectionStart;
      let endPos = journalContent.selectionEnd;
      
      // Find the beginning of the line
      let lineStart = journalContent.value.lastIndexOf('\n', startPos);
      lineStart = lineStart === -1 ? 0 : lineStart + 1;
      
      // Find the end of the line
      let lineEnd = journalContent.value.indexOf('\n', endPos);
      lineEnd = lineEnd === -1 ? journalContent.value.length : lineEnd;
      
      const currentLine = journalContent.value.substring(lineStart, lineEnd);
      
      // Remove existing alignment if any
      let newLine = currentLine.replace(/^<div style="text-align: (left|center|right);">(.*?)<\/div>$/, '$2');
      
      // Add new alignment
      newLine = `<div style="text-align: ${alignment};">${newLine}</div>`;
      
      journalContent.value = journalContent.value.substring(0, lineStart) + newLine + journalContent.value.substring(lineEnd);
    }
  }
  
  // Check if we're editing an existing journal
  const urlParams = new URLSearchParams(window.location.search);
  const journalId = urlParams.get('id');
  let currentJournal = null;
  
  // If we have an ID, load the journal for editing
  if (journalId) {
    // Get journals from localStorage
    const journals = JSON.parse(localStorage.getItem('journals') || '[]');
    currentJournal = journals.find(journal => journal.id == journalId);
    
    if (currentJournal) {
      // Populate form fields
      document.getElementById('journalTitle').value = currentJournal.title;
      document.getElementById('journalContent').value = currentJournal.content;
      
      // Update page title to indicate editing mode
      document.querySelector('h1.page-title').textContent = 'Edit Journal Entry';
      
      // Update button text
      const submitButton = document.querySelector('#writeForm button[type="submit"]');
      if (submitButton) {
        submitButton.textContent = 'Update Journal';
      }
    }
  }
  
  // Form submission 
  document.getElementById('writeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const title = document.getElementById('journalTitle').value;
    const content = document.getElementById('journalContent').value;
    const date = new Date();
    
    // Get existing journals from localStorage
    let journals = JSON.parse(localStorage.getItem('journals') || '[]');
    
    if (currentJournal) {
      // Editing existing journal
      const index = journals.findIndex(journal => journal.id == currentJournal.id);
      
      if (index !== -1) {
        // Update the existing journal
        journals[index] = {
          ...currentJournal,
          title: title,
          content: content,
          updatedAt: date.toISOString()
        };
      }
    } else {
      // Create a new journal entry object
      const journalEntry = {
        id: Date.now(), // Use timestamp as a unique ID
        title: title,
        content: content,
        date: date.toISOString(),
        createdAt: date.toISOString()
      };
      
      // Add new entry
      journals.push(journalEntry);
    }
    
    // Save back to localStorage
    localStorage.setItem('journals', JSON.stringify(journals));
    
    // Redirect to home page
    window.location.href = 'home.html';
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
});