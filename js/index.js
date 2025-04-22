document.addEventListener("DOMContentLoaded", function () {
  console.log("Index JS loaded!");

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if(targetId === "#") return;
      
      const targetElement = document.querySelector(targetId);
      if(targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust for header height
          behavior: 'smooth'
        });
      }
    });
  });

  // Button hover effects
  const allButtons = document.querySelectorAll('.btn');
  allButtons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.classList.add('btn-hover-effect');
    });
    
    button.addEventListener('mouseleave', function() {
      this.classList.remove('btn-hover-effect');
    });
  });

  // Animated entrance for feature cards
  const featureCards = document.querySelectorAll('.feature-card');
  
  // Check if IntersectionObserver is supported
  if ('IntersectionObserver' in window) {
    const featureObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-feature');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    featureCards.forEach(card => {
      featureObserver.observe(card);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    featureCards.forEach(card => {
      card.classList.add('animate-feature');
    });
  }

  // Add active class to journal cards when hovered
  const journalCards = document.querySelectorAll('.journal-card');
  journalCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      journalCards.forEach(c => c.classList.remove('active-card'));
      this.classList.add('active-card');
    });
  });

  // Simple animation for CTA section
  const ctaButton = document.querySelector('.cta-button');
  let animationInterval;
  
  ctaButton.addEventListener('mouseenter', function() {
    let scale = 1;
    animationInterval = setInterval(() => {
      scale = scale === 1 ? 1.05 : 1;
      this.style.transform = `translateY(-5px) scale(${scale})`;
    }, 500);
  });
  
  ctaButton.addEventListener('mouseleave', function() {
    clearInterval(animationInterval);
    this.style.transform = '';
  });

  // Add CSS class for animations
  document.body.classList.add('page-loaded');
});

// Add some CSS variables for animation
const style = document.createElement('style');
style.textContent = `
  .btn-hover-effect {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2) !important;
  }
  
  @keyframes featureCardAnimate {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-feature {
    animation: featureCardAnimate 0.6s ease-out forwards;
  }
  
  .active-card {
    border-color: var(--primary-color);
  }
  
  .page-loaded .hero-content h2 {
    animation: fadeInUp 0.8s ease-out;
  }
  
  .page-loaded .hero-content p {
    animation: fadeInUp 0.8s ease-out 0.2s both;
  }
  
  .page-loaded .hero-buttons {
    animation: fadeInUp 0.8s ease-out 0.4s both;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);