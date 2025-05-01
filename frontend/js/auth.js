// auth.js

document.addEventListener("DOMContentLoaded", () => {
  // Login form handling
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Clear any previous error states
      clearErrorStates(loginForm);

      // Show loading state
      const submitButton = loginForm.querySelector("button[type='submit']");
      const originalButtonText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = "Logging in...";

      const usernameOrEmail = loginForm.querySelector("input[placeholder='Username or Email']").value;
      const password = loginForm.querySelector("input[placeholder='Password']").value;

      try {
        const response = await fetch('http://localhost:5000/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usernameOrEmail, password })
        });

        const data = await response.json();

        if (response.ok) {
          // Store user data in localStorage with consistent key
          localStorage.setItem('userData', JSON.stringify(data));
          console.log("Login successful, user data stored:", data);
          
          // Redirect to home page
          window.location.href = "home.html";
        } else {
          // Display error message and highlight input fields
          const errorMessage = data.message || "Login failed. Please try again.";
          const errorType = data.errorType;
          
          // Apply error styling based on the error type
          if (errorType === 'user_not_found') {
            // Highlight just the username/email field
            const usernameInput = loginForm.querySelector("input[placeholder='Username or Email']");
            usernameInput.classList.add('is-invalid');
            
            const formGroup = usernameInput.closest('.mb-3');
            if (formGroup) {
              const errorDiv = document.createElement('div');
              errorDiv.className = 'invalid-feedback';
              errorDiv.textContent = errorMessage;
              formGroup.appendChild(errorDiv);
            }
          } else if (errorType === 'invalid_password') {
            // Highlight just the password field
            const passwordInput = loginForm.querySelector("input[placeholder='Password']");
            passwordInput.classList.add('is-invalid');
            
            const formGroup = passwordInput.closest('.mb-3');
            if (formGroup) {
              const errorDiv = document.createElement('div');
              errorDiv.className = 'invalid-feedback';
              errorDiv.textContent = errorMessage;
              formGroup.appendChild(errorDiv);
            }
          } else {
            // Generic error - highlight all fields
            const inputs = loginForm.querySelectorAll('input');
            inputs.forEach(input => {
              input.classList.add('is-invalid');
            });
          }
          
          // Create error alert at top of form if it doesn't exist
          if (!loginForm.querySelector('.alert-danger')) {
            const errorAlert = document.createElement('div');
            errorAlert.className = 'alert alert-danger mb-3';
            errorAlert.role = 'alert';
            errorAlert.textContent = errorMessage;
            loginForm.insertBefore(errorAlert, loginForm.firstChild);
          }
          
          // Reset button state
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      } catch (error) {
        console.error('Error:', error);
        
        // Display network error
        const errorAlert = document.createElement('div');
        errorAlert.className = 'alert alert-danger mb-3';
        errorAlert.role = 'alert';
        errorAlert.textContent = "Login failed. Please check your network connection and try again.";
        loginForm.insertBefore(errorAlert, loginForm.firstChild);
        
        // Reset button state
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    });

    // Forgot password handling
    const forgotPasswordLink = document.getElementById("forgotPassword");
    if (forgotPasswordLink) {
      forgotPasswordLink.addEventListener("click", (e) => {
        e.preventDefault();
        // Display forgot password modal or redirect to password reset page
        alert("Password reset functionality will be implemented here.");
      });
    }
  }

  // Signup form handling
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Clear any previous error states
      clearErrorStates(signupForm);

      // Show loading state
      const submitButton = signupForm.querySelector("button[type='submit']");
      const originalButtonText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = "Signing up...";

      const username = signupForm.querySelector("input[placeholder='Username']").value;
      const email = signupForm.querySelector("input[placeholder='Email']").value;
      const password = signupForm.querySelector("input[placeholder='Password']").value;

      try {
        // First check if account exists
        const checkResponse = await fetch(`http://localhost:5000/api/users/check?email=${encodeURIComponent(email)}`);
        const checkData = await checkResponse.json();
        
        if (checkResponse.ok && checkData.exists) {
          // Email already exists - highlight the email field and show error
          const emailInput = signupForm.querySelector("input[placeholder='Email']");
          emailInput.classList.add('is-invalid');
          
          const formGroup = emailInput.closest('.mb-3');
          if (formGroup) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            errorDiv.textContent = 'This email is already associated with an account';
            formGroup.appendChild(errorDiv);
          }
          
          // Create error alert at top of form
          const errorAlert = document.createElement('div');
          errorAlert.className = 'alert alert-danger mb-3';
          errorAlert.role = 'alert';
          errorAlert.textContent = 'An account with this email already exists';
          signupForm.insertBefore(errorAlert, signupForm.firstChild);
          
          // Reset button state
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
          return;
        }
        
        // If email is available, proceed with signup
        const response = await fetch('http://localhost:5000/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: username, email, password, role: 'user' })
        });

        if (response.ok) {
          const userData = await response.json();
          
          // Store user data in localStorage with consistent key
          const loginData = {
            message: 'Sign-up successful',
            user: {
              id: userData._id,
              name: userData.name,
              email: userData.email,
              role: userData.role
            }
          };
          localStorage.setItem('userData', JSON.stringify(loginData));
          
          alert("Sign-up successful! Redirecting to home page...");
          window.location.href = "home.html";
        } else {
          const errorData = await response.json();
          const errorMessage = errorData.message || "Sign-up failed. Please try again.";
          
          // Create error alert at top of form
          const errorAlert = document.createElement('div');
          errorAlert.className = 'alert alert-danger mb-3';
          errorAlert.role = 'alert';
          errorAlert.textContent = errorMessage;
          signupForm.insertBefore(errorAlert, signupForm.firstChild);
          
          // Apply error styling to all fields
          const inputs = signupForm.querySelectorAll('input');
          inputs.forEach(input => {
            input.classList.add('is-invalid');
          });
          
          // Reset button state
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      } catch (error) {
        console.error('Error:', error);
        
        // Display network error
        const errorAlert = document.createElement('div');
        errorAlert.className = 'alert alert-danger mb-3';
        errorAlert.role = 'alert';
        errorAlert.textContent = "Sign-up failed. Please check your network connection and try again.";
        signupForm.insertBefore(errorAlert, signupForm.firstChild);
        
        // Reset button state
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    });
  }

  // Helper function to clear error states
  function clearErrorStates(form) {
    // Remove any previous error alerts
    const previousAlerts = form.querySelectorAll('.alert-danger');
    previousAlerts.forEach(alert => alert.remove());
    
    // Remove error styling from input fields
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
      input.classList.remove('is-invalid');
      const errorFeedback = input.closest('.mb-3')?.querySelector('.invalid-feedback');
      if (errorFeedback) {
        errorFeedback.remove();
      }
    });
  }

  // Social login handlers
  const socialButtons = document.querySelectorAll(".social-btn");
  socialButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const socialPlatform = button.textContent.includes("Google") ? "Google" : "Facebook";
      console.log(`${socialPlatform} authentication initiated`);
      
      // Simulate OAuth authentication process
      alert(`${socialPlatform} authentication would occur here.`);
      // This is where you'd implement OAuth flow with your chosen provider
    });
  });
});

// Toggle password visibility
document.addEventListener('DOMContentLoaded', function() {
  const togglePassword = document.querySelector('#togglePassword');
  const password = document.querySelector('#password');
  const eyeIcon = document.querySelector('#eyeIcon');
  
  if (togglePassword && password && eyeIcon) {
    // Make sure the initial icon state matches the password field state
    // Since password starts as hidden, use the eye-slash icon (indicating it can be shown)
    eyeIcon.classList.remove('fa-eye');
    eyeIcon.classList.add('fa-eye-slash');
  
    togglePassword.addEventListener('click', function() {
      if (password.getAttribute('type') === 'password') {
        // If password is hidden, show it and change to regular eye
        password.setAttribute('type', 'text');
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
      } else {
        // If password is visible, hide it and change to slashed eye
        password.setAttribute('type', 'password');
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
      }
    });
  }
});
