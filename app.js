const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const precisePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

if (!reducedMotion.matches && precisePointer.matches) {
  const root = document.documentElement;
  const cards = document.querySelectorAll(".repo-card");

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let glowFrame;

  const animateGlow = () => {
    currentX += (targetX - currentX) * 0.09;
    currentY += (targetY - currentY) * 0.09;

    root.style.setProperty("--glow-x", `${currentX.toFixed(2)}px`);
    root.style.setProperty("--glow-y", `${currentY.toFixed(2)}px`);

    if (Math.abs(targetX - currentX) > 0.08 || Math.abs(targetY - currentY) > 0.08) {
      glowFrame = window.requestAnimationFrame(animateGlow);
    } else {
      glowFrame = undefined;
    }
  };

  const queueGlowFrame = () => {
    if (!glowFrame) {
      glowFrame = window.requestAnimationFrame(animateGlow);
    }
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 44;
      targetY = (event.clientY / window.innerHeight - 0.5) * 28;
      queueGlowFrame();
    },
    { passive: true },
  );

  window.addEventListener("blur", () => {
    targetX = 0;
    targetY = 0;
    queueGlowFrame();
  });

  cards.forEach((card) => {
    card.addEventListener(
      "pointermove",
      (event) => {
        const bounds = card.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width) * 100;
        const y = ((event.clientY - bounds.top) / bounds.height) * 100;

        card.style.setProperty("--card-x", `${x.toFixed(1)}%`);
        card.style.setProperty("--card-y", `${y.toFixed(1)}%`);
      },
      { passive: true },
    );
  });
}
