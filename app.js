window.onload = function () {
  console.log("Welcome to Andrew Kim's CS portfolio!");

  // Handle section visibility on scroll
  const sections = document.querySelectorAll('.section');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  });

  sections.forEach(section => {
    observer.observe(section);
  });

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Intersection Observer for fade-in animations
  const observerOptions = {
    root: null,
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe all sections
  document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(section);
  });

  // Add visible class to show sections
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.section').forEach(section => {
      if (section.getBoundingClientRect().top < window.innerHeight) {
        section.classList.add('visible');
      }
    });
  });

  // Add CSS styles for the visible class
  const style = document.createElement('style');
  style.textContent = `
    .section.visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
};
