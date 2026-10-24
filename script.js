
document.addEventListener("DOMContentLoaded", () => {
  /* Footer year */
  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* Work carousel and category filters */
  const coverflow = document.getElementById("coverflow");

  if (!coverflow) return;

  const track = coverflow.querySelector(".coverflow-track");
  const previousButton = coverflow.querySelector(".carousel-arrow.prev");
  const nextButton = coverflow.querySelector(".carousel-arrow.next");
  const dotsContainer = document.getElementById("carousel-dots");
  const filterButtons = document.querySelectorAll(".work-filters .filter");

  if (!track) return;

  const allSlides = Array.from(
    track.querySelectorAll(".coverflow-slide")
  );

  if (!allSlides.length) return;

  let visibleSlides = [...allSlides];
  let currentIndex = 0;
  let autoplayTimer = null;
  let resumeTimer = null;
  const AUTOPLAY_DELAY = 3500;
  const RESUME_DELAY = 5000;

  /* Create dots for the currently visible slides */
  function createDots() {
    if (!dotsContainer) return;

    dotsContainer.innerHTML = "";

    visibleSlides.forEach((slide, index) => {
      const dot = document.createElement("button");

      dot.type = "button";
      dot.className = "carousel-dot";
      dot.setAttribute("aria-label", `Show photo ${index + 1}`);
      dot.addEventListener("click", () => {
        currentIndex = index;
        updateCarousel();
        pauseAndResumeAutoplay();
      });

      dotsContainer.appendChild(dot);
    });
  }

  /* Update carousel positions and active dot */
  function updateCarousel() {
    const total = visibleSlides.length;

    allSlides.forEach((slide) => {
      slide.classList.remove(
        "is-center",
        "is-left",
        "is-right",
        "is-hidden"
      );

      slide.setAttribute("aria-hidden", "true");
      slide.tabIndex = -1;
    });

    if (total === 0) {
      if (dotsContainer) dotsContainer.innerHTML = "";
      if (previousButton) previousButton.disabled = true;
      if (nextButton) nextButton.disabled = true;
      return;
    }

    currentIndex = ((currentIndex % total) + total) % total;

    visibleSlides.forEach((slide, index) => {
      slide.setAttribute("aria-hidden", "false");
      slide.tabIndex = 0;

      if (index === currentIndex) {
        slide.classList.add("is-center");
        slide.setAttribute("aria-label", "Current photo");
      } else if (index === (currentIndex - 1 + total) % total) {
        slide.classList.add("is-left");
      } else if (index === (currentIndex + 1) % total) {
        slide.classList.add("is-right");
      } else {
        slide.classList.add("is-hidden");
      }
    });

    if (total === 1) {
      visibleSlides[0].classList.remove("is-left", "is-right");
      visibleSlides[0].classList.add("is-center");
    }

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll(".carousel-dot");

      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
        dot.setAttribute(
          "aria-current",
          index === currentIndex ? "true" : "false"
        );
      });
    }

    if (previousButton) previousButton.disabled = total < 2;
    if (nextButton) nextButton.disabled = total < 2;
  }

  /* Move through visible slides */
  function showNext() {
    if (visibleSlides.length < 2) return;

    currentIndex = (currentIndex + 1) % visibleSlides.length;
    updateCarousel();
  }

  function showPrevious() {
    if (visibleSlides.length < 2) return;

    currentIndex =
      (currentIndex - 1 + visibleSlides.length) % visibleSlides.length;

    updateCarousel();
  }

  /* Autoplay controls */
  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function startAutoplay() {
    stopAutoplay();

    if (visibleSlides.length < 2) return;

    autoplayTimer = setInterval(() => {
      showNext();
    }, AUTOPLAY_DELAY);
  }

  function pauseAndResumeAutoplay() {
    stopAutoplay();

    if (resumeTimer) {
      clearTimeout(resumeTimer);
    }

    resumeTimer = setTimeout(() => {
      startAutoplay();
    }, RESUME_DELAY);
  }

  /* Filter slides by category */
  function applyFilter(category) {
    stopAutoplay();

    if (resumeTimer) {
      clearTimeout(resumeTimer);
    }

    visibleSlides = allSlides.filter((slide) => {
      return (
        category === "all" ||
        slide.dataset.category === category
      );
    });

    allSlides.forEach((slide) => {
      const shouldShow = visibleSlides.includes(slide);

      slide.hidden = !shouldShow;
      slide.style.display = shouldShow ? "" : "none";
    });

    currentIndex = 0;

    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === category;

      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    createDots();
    updateCarousel();
    startAutoplay();
  }

  /* Arrow buttons */
  if (previousButton) {
    previousButton.addEventListener("click", () => {
      showPrevious();
      pauseAndResumeAutoplay();
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      showNext();
      pauseAndResumeAutoplay();
    });
  }

  /* Clicking a side slide makes it the main slide */
  allSlides.forEach((slide) => {
    slide.addEventListener("click", () => {
      const index = visibleSlides.indexOf(slide);

      if (index === -1) return;

      currentIndex = index;
      updateCarousel();
      pauseAndResumeAutoplay();
    });
  });

  /* Filter button events */
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyFilter(button.dataset.filter || "all");
    });
  });

  /* Pause autoplay while the pointer is over the carousel */
  coverflow.addEventListener("mouseenter", stopAutoplay);

  coverflow.addEventListener("mouseleave", () => {
    if (!resumeTimer) {
      startAutoplay();
    }
  });

  /* Pause autoplay when the browser tab is hidden */
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  /* Initial setup */
  applyFilter("all");
});
