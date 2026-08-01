const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const precisePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

if (!reducedMotion.matches && precisePointer.matches) {
  const root = document.documentElement;
  const wordTargets = document.querySelectorAll(".word-decode");
  const codeGlyphs = "0123456789ABCDEF{}[]<>/\\|*+=-_";
  const activeWordDecodes = new WeakMap();

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

  const decodeWord = (word) => {
    const original = word.dataset.original;
    const previousFrame = activeWordDecodes.get(word);

    if (previousFrame) {
      window.cancelAnimationFrame(previousFrame);
    }

    const characters = [...original];
    const duration = Math.min(560, Math.max(360, 280 + characters.length * 18));
    const startedAt = performance.now();

    word.classList.add("is-decoding-word");

    const renderFrame = (time) => {
      const progress = Math.min((time - startedAt) / duration, 1);
      const revealProgress = Math.max(0, (progress - 0.14) / 0.86);
      const revealedCharacters = Math.floor(revealProgress * characters.length);

      word.dataset.glyphs = characters
        .map((character, index) => {
          if (!/[\p{L}\p{N}]/u.test(character) || index < revealedCharacters) {
            return character;
          }

          return codeGlyphs[Math.floor(Math.random() * codeGlyphs.length)];
        })
        .join("");

      if (progress < 1) {
        activeWordDecodes.set(word, window.requestAnimationFrame(renderFrame));
        return;
      }

      word.classList.remove("is-decoding-word");
      delete word.dataset.glyphs;
      activeWordDecodes.delete(word);
    };

    activeWordDecodes.set(word, window.requestAnimationFrame(renderFrame));
  };

  const prepareWordDecode = (element) => {
    const original = element.textContent.replace(/\s+/g, " ").trim();
    const fragment = document.createDocumentFragment();

    original.split(/(\s+)/).forEach((value) => {
      if (!value) {
        return;
      }

      if (/\s+/.test(value)) {
        fragment.append(document.createTextNode(" "));
        return;
      }

      if (!/[\p{L}\p{N}]/u.test(value)) {
        fragment.append(document.createTextNode(value));
        return;
      }

      const word = document.createElement("span");
      word.className = "scramble-word";
      word.dataset.original = value;
      word.textContent = value;
      word.addEventListener("pointerenter", () => decodeWord(word));
      fragment.append(word);
    });

    element.replaceChildren(fragment);
  };

  wordTargets.forEach(prepareWordDecode);
}
