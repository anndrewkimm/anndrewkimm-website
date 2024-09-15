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
};
