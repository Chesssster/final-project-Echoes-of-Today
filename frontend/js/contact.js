// Contact Form Script for Echoes of Today

document.addEventListener('DOMContentLoaded', function() {
    // Sidebar elements
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarToggleContainer = document.getElementById('sidebarToggleContainer');
    const sidebarToggleIcon = sidebarToggle ? sidebarToggle.querySelector('.sidebar-toggle-icon') : null;
    
    // Section dropdowns
    const navDropdown = document.getElementById('navDropdown');
    const accountDropdown = document.getElementById('accountDropdown');
    const helpDropdown = document.getElementById('helpDropdown');
    
    // Sections
    const navSection = document.getElementById('navSection');
    const accountSection = document.getElementById('accountSection');
    const helpSection = document.getElementById('helpSection');
    
    // Form elements
    const contactForm = document.querySelector('.contact-form');
    
    // Initialize sidebar state and toggle icon
    function initSidebar() {
        // Check for saved sidebar state
        const sidebarHidden = localStorage.getItem('sidebarHidden') === 'true';
        
        if (sidebarHidden) {
            sidebar.classList.add('sidebar-hidden');
            mainContent.classList.add('main-content-expanded');
            sidebarToggleContainer.style.left = '0';
            updateToggleIcon(true);
        } else {
            updateToggleIcon(false);
        }
    }
    
    // Function to update the toggle icon between hamburger and X
    function updateToggleIcon(isSidebarHidden) {
        if (!sidebarToggleIcon) return;
        
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
    
    // Toggle sidebar function
    function toggleSidebar() {
        const isSidebarHidden = sidebar.classList.contains('sidebar-hidden');
        sidebar.classList.toggle('sidebar-hidden');
        mainContent.classList.toggle('main-content-expanded');
        
        // Update toggle button position
        if (sidebar.classList.contains('sidebar-hidden')) {
            sidebarToggleContainer.style.left = '0';
            localStorage.setItem('sidebarHidden', 'true');
            updateToggleIcon(true);
        } else {
            // Use actual sidebar width for responsive layouts
            const sidebarWidth = getComputedStyle(sidebar).width;
            sidebarToggleContainer.style.left = sidebarWidth;
            localStorage.setItem('sidebarHidden', 'false');
            updateToggleIcon(false);
        }
    }
    
    // Toggle sections function
    function toggleSection(dropdown, section) {
        dropdown.classList.toggle('up');
        
        // Use slideUp/slideDown effect
        if (dropdown.classList.contains('up')) {
            section.style.maxHeight = section.scrollHeight + 'px';
            section.style.opacity = '1';
            section.style.visibility = 'visible';
        } else {
            section.style.maxHeight = '0';
            section.style.opacity = '0';
            section.style.visibility = 'hidden';
        }
    }
    
    // Set initial section states
    function initSections() {
        if (!navSection || !accountSection || !helpSection) return;
        
        // Default all sections to be visible
        [navSection, accountSection, helpSection].forEach(section => {
            section.style.maxHeight = section.scrollHeight + 'px';
            section.style.opacity = '1';
            section.style.visibility = 'visible';
            section.style.overflow = 'hidden';
            section.style.transition = 'all 0.3s ease';
        });
    }
    
    // Add event listeners for sidebar
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    if (navDropdown) {
        navDropdown.addEventListener('click', () => toggleSection(navDropdown, navSection));
    }
    
    if (accountDropdown) {
        accountDropdown.addEventListener('click', () => toggleSection(accountDropdown, accountSection));
    }
    
    if (helpDropdown) {
        helpDropdown.addEventListener('click', () => toggleSection(helpDropdown, helpSection));
    }
    
    // Form validation and submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectSelect = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            
            // Validation
            let isValid = true;
            
            if (nameInput.value.trim() === '') {
                showError(nameInput, 'Please enter your name');
                isValid = false;
            } else {
                removeError(nameInput);
            }
            
            if (emailInput.value.trim() === '') {
                showError(emailInput, 'Please enter your email');
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            } else {
                removeError(emailInput);
            }
            
            if (messageInput.value.trim() === '') {
                showError(messageInput, 'Please enter your message');
                isValid = false;
            } else {
                removeError(messageInput);
            }
            
            if (isValid) {
                // Show loading state
                const submitButton = contactForm.querySelector('.submit-button');
                const originalButtonText = submitButton.innerHTML;
                submitButton.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
                submitButton.disabled = true;
                
                // Simulate form submission (replace with actual AJAX call)
                setTimeout(() => {
                    // Reset form
                    contactForm.reset();
                    
                    // Show success message
                    showSuccessMessage();
                    
                    // Reset button
                    submitButton.innerHTML = originalButtonText;
                    submitButton.disabled = false;
                }, 1500);
            }
        });
    }
    
    // Function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Function to show error message
    function showError(input, message) {
        const formGroup = input.parentElement;
        let errorElement = formGroup.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        input.classList.add('is-invalid');
    }
    
    // Function to remove error message
    function removeError(input) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-message');
        
        if (errorElement) {
            formGroup.removeChild(errorElement);
        }
        
        input.classList.remove('is-invalid');
    }
    
    // Function to show success message
    function showSuccessMessage() {
        const formContainer = document.querySelector('.form-container');
        const existingMessage = document.querySelector('.success-message');
        
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create success message element
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = '<strong>Thank you!</strong> Your message has been sent successfully. We\'ll get back to you shortly.';
        
        // Insert before the form
        formContainer.insertBefore(successMessage, contactForm);
        
        // Scroll to the success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Remove the message after 5 seconds
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.style.opacity = '0';
                successMessage.style.transform = 'translateY(-20px)';
                successMessage.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                
                setTimeout(() => {
                    if (successMessage.parentNode) {
                        successMessage.parentNode.removeChild(successMessage);
                    }
                }, 500);
            }
        }, 5000);
    }
    
    // Add animation to elements
    function animateElements() {
        // Animate contact info cards
        const infoCards = document.querySelectorAll('.contact-info-card');
        infoCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * (index + 1));
        });
        
        // Animate form container
        const formContainer = document.querySelector('.contact-form-container');
        if (formContainer) {
            formContainer.style.opacity = '0';
            formContainer.style.transform = 'translateY(20px)';
            formContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                formContainer.style.opacity = '1';
                formContainer.style.transform = 'translateY(0)';
            }, 400);
        }
        
        // Animate FAQ items
        const faqItems = document.querySelectorAll('.accordion-item');
        faqItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 800 + (100 * index));
        });
    }
    
    // Initialize the page
    initSidebar();
    initSections();
    animateElements();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (sidebar && !sidebar.classList.contains('sidebar-hidden') && sidebarToggleContainer) {
            const sidebarWidth = getComputedStyle(sidebar).width;
            sidebarToggleContainer.style.left = sidebarWidth;
        }
    });
});