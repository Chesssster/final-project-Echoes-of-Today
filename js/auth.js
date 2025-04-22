// auth.js

document.addEventListener("DOMContentLoaded", () => {
  // Login form handling
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const usernameOrEmail = loginForm.querySelector("input[placeholder='Username or Email']").value;
      const password = loginForm.querySelector("input[placeholder='Password']").value;

      console.log("Login submitted:", {
        usernameOrEmail,
        password,
      });

      // Simulate login success (replace with your actual authentication logic)
      alert("Login successful!");
      // Redirect to dashboard or homepage after successful login
      // window.location.href = "dashboard.html";
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
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = signupForm.querySelector("input[placeholder='Username']").value;
      const email = signupForm.querySelector("input[placeholder='Email']").value;
      const password = signupForm.querySelector("input[placeholder='Password']").value;

      console.log("Signup submitted:", {
        username,
        email,
        password,
      });

      // Simulate signup success (replace with your actual registration logic)
      alert("Sign-up successful!");
      // Redirect to login page or onboarding after successful signup
      // window.location.href = "login.html";
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

// js/signup.js

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");

  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("signupUsername").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    console.log("Signup form submitted:");
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Password:", password);

    // Placeholder: Future API integration
    /*
    fetch("https://your-api-endpoint.com/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, email, password })
    })
    .then(response => response.json())
    .then(data => {
      console.log("Signup response:", data);
    })
    .catch(error => {
      console.error("Error during signup:", error);
    });
    */
  });
});


// js/auth.js

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get values from inputs
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Log data (you’ll replace this with an actual API call later)
    console.log("Form submitted:");
    console.log("Username:", username);
    console.log("Password:", password);

    // Placeholder: Backend/API integration goes here
    // Example:
    /*
    fetch("https://your-api-endpoint.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
      // Handle success/failure
      console.log("Login response:", data);
    })
    .catch(error => {
      console.error("Error during login:", error);
    });
    */
  });
});
