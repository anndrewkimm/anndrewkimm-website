const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const precisePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

if (!reducedMotion.matches && precisePointer.matches) {
  const root = document.documentElement;
  const cards = document.querySelectorAll(".repo-card");
  const scrambleTargets = document.querySelectorAll(".scramble-text");
  const codeGlyphs = "0123456789ABCDEF{}[]<>/\\|*+=-_";
  const activeDecodes = new WeakMap();

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

  const decodeText = (element) => {
    const original =
      element.dataset.scrambleOriginal ?? element.textContent.replace(/\s+/g, " ").trim();
    const previousFrame = activeDecodes.get(element);
    const bounds = element.getBoundingClientRect();

    if (previousFrame) {
      window.cancelAnimationFrame(previousFrame);
    }

    element.dataset.scrambleOriginal = original;
    if (!element.hasAttribute("aria-label")) {
      element.setAttribute("aria-label", original);
    }

    element.style.setProperty("--decode-width", `${bounds.width.toFixed(2)}px`);
    element.style.setProperty("--decode-height", `${bounds.height.toFixed(2)}px`);
    element.classList.add("is-decoding");

    const characters = [...original];
    const duration = Math.min(760, Math.max(360, 260 + characters.length * 6));
    const startedAt = performance.now();

    const renderFrame = (time) => {
      const progress = Math.min((time - startedAt) / duration, 1);
      const revealProgress = Math.max(0, (progress - 0.16) / 0.84);
      const revealedCharacters = Math.floor(revealProgress * characters.length);

      element.textContent = characters
        .map((character, index) => {
          if (!/[\p{L}\p{N}]/u.test(character) || index < revealedCharacters) {
            return character;
          }

          return codeGlyphs[Math.floor(Math.random() * codeGlyphs.length)];
        })
        .join("");

      if (progress < 1) {
        activeDecodes.set(element, window.requestAnimationFrame(renderFrame));
        return;
      }

      element.textContent = original;
      element.classList.remove("is-decoding");
      element.style.removeProperty("--decode-width");
      element.style.removeProperty("--decode-height");
      activeDecodes.delete(element);
    };

    activeDecodes.set(element, window.requestAnimationFrame(renderFrame));
  };

  scrambleTargets.forEach((target) => {
    if (target.matches(".repo-title, .availability-label")) {
      return;
    }

    target.addEventListener("pointerenter", () => decodeText(target));
  });

  const availability = document.querySelector(".availability");
  const availabilityLabel = document.querySelector(".availability-label");

  availability?.addEventListener("pointerenter", () => decodeText(availabilityLabel));

  cards.forEach((card) => {
    const title = card.querySelector(".repo-title");

    card.addEventListener("pointerenter", () => decodeText(title));
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
