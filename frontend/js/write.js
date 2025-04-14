document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarToggleContainer = document.getElementById('sidebarToggleContainer');
  
  sidebarToggle.addEventListener('click', function() {
    sidebar.classList.toggle('sidebar-hidden');
    mainContent.classList.toggle('main-content-expanded');
    
    // Update toggle button position
    if (sidebar.classList.contains('sidebar-hidden')) {
      sidebarToggleContainer.style.left = '0';
    } else {
      sidebarToggleContainer.style.left = '250px';
    }
  });
  
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
  
  // Form submission 
  document.getElementById('writeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // In a real application, you would process the form data, including the images
    alert('Journal saved! In a real application, your content including images would be saved to the server.');
    
    // Reset form or redirect
    // this.reset();
    // window.location.href = 'home.html';
  });
});