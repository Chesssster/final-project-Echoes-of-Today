document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarToggleContainer = document.getElementById('sidebarToggleContainer');
  const sidebarToggleIcon = sidebarToggle.querySelector('.sidebar-toggle-icon');
  
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
  
  // Track removed images
  const removedImageIds = [];
  
  // Process selected files
  function handleFiles(files) {
    // Show the image upload container if it's hidden
    if (imageUploadContainer.classList.contains('hidden')) {
      imageUploadContainer.classList.remove('hidden');
    }
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Only process image files
      if (!file.type.match('image.*')) {
        continue;
      }
      
      const reader = new FileReader();
      
      reader.onload = function(e) {
        // Create preview element with the data URL
        const imageDataUrl = e.target.result;
        const previewItem = document.createElement('div');
        previewItem.className = 'image-preview-item';
        previewItem.dataset.imageData = imageDataUrl; // Store the image data URL as a data attribute
        previewItem.innerHTML = `
          <img src="${imageDataUrl}" alt="Image Preview">
          <div class="image-caption">
            <input type="text" placeholder="Add a caption (optional)" class="form-control caption-input">
          </div>
          <div class="remove-image">×</div>
        `;
        
        // Add remove functionality
        previewItem.querySelector('.remove-image').addEventListener('click', function() {
          const imageId = previewItem.dataset.imageId;
          if (imageId) {
            removedImageIds.push(imageId);
            console.log('Marked image for deletion:', imageId);
          }
          previewItem.remove();
          
          // Check if there are no more images
          checkEmptyImageContainer();
        });
        
        // Add to preview container
        imagePreviewContainer.appendChild(previewItem);
      };
      
      reader.readAsDataURL(file);
    }
  }
  
  // Helper function to check if image container should be hidden
  function checkEmptyImageContainer() {
    if (imagePreviewContainer.children.length === 0) {
      imageUploadContainer.classList.add('hidden');
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
  
  // API endpoints
  const API_BASE_URL = 'http://localhost:5000/api';
  
  // Check if we're editing an existing journal
  const urlParams = new URLSearchParams(window.location.search);
  const journalId = urlParams.get('id');
  let currentJournal = null;
  
  // If we have an ID, load the journal for editing
  if (journalId) {
    console.log('Editing journal with ID:', journalId);
    
    // Get journal from API
    fetch(`${API_BASE_URL}/journals/${journalId}?userId=${currentUser.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch journal');
      }
      return response.json();
    })
    .then(async journal => {
      currentJournal = journal;
      
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
      
      // Fetch existing images for this journal
      try {
        const imagesResponse = await fetch(`${API_BASE_URL}/journal-images/journal/${journalId}?userId=${currentUser.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (imagesResponse.ok) {
          const journalImages = await imagesResponse.json();
          console.log('Loaded existing images:', journalImages.length);
          
          // Show the image upload container
          if (journalImages.length > 0) {
            imageUploadContainer.classList.remove('hidden');
            
            // Add each image to the preview container
            journalImages.forEach(image => {
              const previewItem = document.createElement('div');
              previewItem.className = 'image-preview-item';
              previewItem.dataset.imageData = image.imageUrl;
              previewItem.dataset.imageId = image._id; // Store image ID for potential updates
              previewItem.innerHTML = `
                <img src="${image.imageUrl}" alt="Image Preview">
                <div class="image-caption">
                  <input type="text" placeholder="Add a caption (optional)" class="form-control caption-input" value="${image.caption || ''}">
                </div>
                <div class="remove-image">×</div>
              `;
              
              // Add remove functionality
              previewItem.querySelector('.remove-image').addEventListener('click', function() {
                const imageId = previewItem.dataset.imageId;
                if (imageId) {
                  removedImageIds.push(imageId);
                  console.log('Marked image for deletion:', imageId);
                }
                previewItem.remove();
                
                // Check if there are no more images
                checkEmptyImageContainer();
              });
              
              // Add to preview container
              imagePreviewContainer.appendChild(previewItem);
            });
          }
        }
      } catch (error) {
        console.error('Error loading images:', error);
      }
    })
    .catch(error => {
      console.error('Error fetching journal:', error);
      alert('Could not load journal entry. Please try again later.');
      window.location.href = 'home.html';
    });
  }
  
  // Form submission 
  document.getElementById('writeForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form values
    const title = document.getElementById('journalTitle').value;
    const content = document.getElementById('journalContent').value;
    
    // Get image previews
    const imagePreviews = imagePreviewContainer.querySelectorAll('.image-preview-item');
    
    // Show loading state
    const submitButton = this.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Saving...';
    
    try {
      let journalResponse;
      let journalId;
      
      if (currentJournal) {
        // Update existing journal via API
        journalResponse = await fetch(`${API_BASE_URL}/journals/${currentJournal._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title,
            content,
            userId: currentUser.id,
            userName: currentUser.name
          })
        });
        
        if (!journalResponse.ok) {
          throw new Error('Failed to update journal');
        }
        
        const updatedJournal = await journalResponse.json();
        journalId = currentJournal._id;
        
        console.log('Journal updated successfully:', updatedJournal);
      } else {
        // Create a new journal via API
        journalResponse = await fetch(`${API_BASE_URL}/journals`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title,
            content,
            userId: currentUser.id,
            userName: currentUser.name
          })
        });
        
        if (!journalResponse.ok) {
          throw new Error('Failed to create journal');
        }
        
        const newJournal = await journalResponse.json();
        journalId = newJournal._id;
        
        console.log('Journal created successfully:', newJournal);
      }
      
      // Delete any images that were removed during editing
      if (removedImageIds.length > 0) {
        console.log(`Deleting ${removedImageIds.length} removed images`);
        
        for (const imageId of removedImageIds) {
          try {
            const deleteResponse = await fetch(`${API_BASE_URL}/journal-images/${imageId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                userId: currentUser.id
              })
            });
            
            if (deleteResponse.ok) {
              console.log(`Successfully deleted image: ${imageId}`);
            } else {
              console.error(`Failed to delete image: ${imageId}`);
            }
          } catch (deleteError) {
            console.error(`Error deleting image ${imageId}:`, deleteError);
          }
        }
      }
      
      // Save attached images if there are any
      if (imagePreviews.length > 0) {
        // Track successful image uploads
        let successfulImageUploads = 0;
        
        for (const preview of imagePreviews) {
          const imageUrl = preview.dataset.imageData;
          const caption = preview.querySelector('.caption-input').value || '';
          const imageId = preview.dataset.imageId || null; // Get existing image ID if available
          
          // Log image info for debugging
          console.log('Processing image for journal:', journalId);
          console.log('Caption:', caption);
          console.log('Image URL length:', imageUrl ? imageUrl.length : 0);
          console.log('Existing image ID:', imageId);
          
          try {
            let imageResponse;
            
            if (imageId) {
              // Update existing image caption if it has changed
              imageResponse = await fetch(`${API_BASE_URL}/journal-images/${imageId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  userId: currentUser.id,
                  caption
                })
              });
            } else {
              // Save new image to JournalImages collection
              imageResponse = await fetch(`${API_BASE_URL}/journal-images`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  journalId,
                  userId: currentUser.id,
                  userName: currentUser.name,
                  journalTitle: title,
                  imageUrl,
                  caption
                })
              });
            }
            
            if (!imageResponse.ok) {
              const errorData = await imageResponse.json();
              console.error('Failed to save image:', errorData);
              throw new Error(`Failed to save image: ${errorData.message || 'Unknown error'}`);
            } else {
              console.log('Image saved successfully');
              successfulImageUploads++;
            }
          } catch (imageError) {
            console.error('Error during image save:', imageError);
            // Continue trying to save other images even if one fails
          }
        }
        
        console.log(`Successfully processed ${successfulImageUploads} of ${imagePreviews.length} images`);
      }
      
      // Show success message
      alert('Journal saved successfully!');
      
      // Redirect to home page on success
      window.location.href = 'home.html';
    } catch (error) {
      console.error('Error saving journal:', error);
      alert('Failed to save journal. Please try again.');
      
      // Reset button state
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
});