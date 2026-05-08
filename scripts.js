/* ================================
   VIDEO ARCHIVE SECTION
================================ */

const archiveVideo = document.getElementById("archiveVideo");
const videoTitle = document.getElementById("videoTitle");
const videoDate = document.getElementById("videoDate");
const videoDescription = document.getElementById("videoDescription");
const videoButtons = document.querySelectorAll(".video-thumb-item");

videoButtons.forEach((button) => {
  button.addEventListener("click", () => {
    archiveVideo.pause();
    archiveVideo.src = button.dataset.video;
    archiveVideo.poster = button.dataset.poster;
    archiveVideo.load();
    archiveVideo.play();

    videoTitle.textContent = button.dataset.title;
    videoDate.textContent = button.dataset.date;
    videoDescription.textContent = button.dataset.description;

    videoButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  });
});


/* ================================
   AUDIO CARD CAROUSEL SECTION
================================ */

const audioCarouselTrack = document.querySelector(".audio-carousel-track");
const audioSlides = Array.from(document.querySelectorAll(".audio-slide"));
const audioPrevBtn = document.querySelector(".audio-carousel-arrow.left");
const audioNextBtn = document.querySelector(".audio-carousel-arrow.right");

let audioIndex = 2;

if (audioCarouselTrack && audioSlides.length > 0 && audioPrevBtn && audioNextBtn) {
  const firstClones = audioSlides.slice(0, 2).map((slide) => slide.cloneNode(true));
  const lastClones = audioSlides.slice(-2).map((slide) => slide.cloneNode(true));

  lastClones.forEach((clone) => audioCarouselTrack.prepend(clone));
  firstClones.forEach((clone) => audioCarouselTrack.append(clone));

  const allAudioSlides = document.querySelectorAll(".audio-slide");

  function getAudioStep() {
    const slide = allAudioSlides[0];
    const gap = parseInt(getComputedStyle(audioCarouselTrack).gap) || 0;
    return slide.offsetWidth + gap;
  }

  function moveAudioCarousel(animate = true) {
    const step = getAudioStep();

    audioCarouselTrack.style.transition = animate
      ? "transform 0.45s ease"
      : "none";

    audioCarouselTrack.style.transform = `translateX(-${audioIndex * step}px)`;
  }

  moveAudioCarousel(false);

  audioNextBtn.addEventListener("click", () => {
    audioIndex++;
    moveAudioCarousel(true);
  });

  audioPrevBtn.addEventListener("click", () => {
    audioIndex--;
    moveAudioCarousel(true);
  });

  audioCarouselTrack.addEventListener("transitionend", () => {
    const total = allAudioSlides.length;

    if (audioIndex >= total - 2) {
      audioIndex = 2;
      moveAudioCarousel(false);
    }

    if (audioIndex <= 1) {
      audioIndex = total - 4;
      moveAudioCarousel(false);
    }
  });

  window.addEventListener("resize", () => {
    moveAudioCarousel(false);
  });
}


/* ================================
   UNLOCK / ACCESS CODE SECTION
================================ */

const codeInput = document.getElementById("accessCode0");
const unlockBtn = document.getElementById("unlockBtn");
const clearBtn = document.getElementById("clearBtn");
const message = document.getElementById("unlockMessage");

const slots = [
  document.getElementById("slot1"),
  document.getElementById("slot2"),
  document.getElementById("slot3"),
  document.getElementById("slot4"),
  document.getElementById("slot5"),
  document.getElementById("slot6"),
];

const lockedState = document.getElementById("lockedState");
const audioTerminal = document.getElementById("audioTerminal");

const CORRECT_CODE = "343343";

if (codeInput && unlockBtn && clearBtn && message && lockedState && audioTerminal) {
  function updateSlots() {
    const value = codeInput.value;

    slots.forEach((slot, index) => {
      if (slot) {
        slot.textContent = value[index] ? "•" : "_";
      }
    });
  }

  function clearCode() {
    codeInput.value = "";
    updateSlots();
    message.textContent = "AWAITING CLEARANCE";
    codeInput.focus();
  }

  function checkCode() {
    const entered = codeInput.value;

    if (entered.length < 6) {
      message.textContent = "ENTER 6 DIGITS";
      codeInput.focus();
      return;
    }

    if (entered === CORRECT_CODE) {
      message.textContent = "ACCESS GRANTED";

      setTimeout(() => {
        lockedState.classList.add("hidden");
        audioTerminal.classList.remove("hidden");
      }, 500);
    } else {
      message.textContent = "ACCESS DENIED";
      codeInput.focus();
    }
  }

  codeInput.addEventListener("input", updateSlots);
  unlockBtn.addEventListener("click", checkCode);
  clearBtn.addEventListener("click", clearCode);

  document.addEventListener("keydown", (event) => {
    if (lockedState.classList.contains("hidden")) return;

    if (/^[0-9]$/.test(event.key)) {
      event.preventDefault();

      if (codeInput.value.length < 6) {
        codeInput.value += event.key;
        updateSlots();
      }
    }

    if (event.key === "Backspace") {
      event.preventDefault();
      codeInput.value = codeInput.value.slice(0, -1);
      updateSlots();
    }

    if (event.key === "Enter") {
      event.preventDefault();
      checkCode();
    }
  });

  lockedState.addEventListener("click", () => {
    codeInput.focus();
  });

  updateSlots();
}


/* ================================
   PROFILE CAROUSEL SECTION — INFINITE
================================ */

const profileTrack = document.getElementById("profile-Track");
const profileSlides = Array.from(document.querySelectorAll(".profile-slide"));
const prevProfileBtn = document.getElementById("prevProfile");
const nextProfileBtn = document.getElementById("nextProfile");
const profileViewport = document.querySelector(".carousel-viewport");

let currentProfileIndex = 1;
let isProfileMoving = false;

if (profileTrack && profileSlides.length > 0 && prevProfileBtn && nextProfileBtn && profileViewport) {
  const firstProfileClone = profileSlides[0].cloneNode(true);
  const lastProfileClone = profileSlides[profileSlides.length - 1].cloneNode(true);

  firstProfileClone.classList.add("profile-clone");
  lastProfileClone.classList.add("profile-clone");

  profileTrack.appendChild(firstProfileClone);
  profileTrack.prepend(lastProfileClone);

  const allProfileSlides = Array.from(document.querySelectorAll(".profile-slide"));

  function getProfileStep() {
    return allProfileSlides[0].offsetWidth;
  }

  function moveProfileCarousel(animate = true) {
    profileTrack.style.transition = animate ? "transform 0.45s ease" : "none";
    profileTrack.style.transform = `translateX(-${currentProfileIndex * getProfileStep()}px)`;
  }

  moveProfileCarousel(false);

  function nextProfile() {
    if (isProfileMoving) return;
    isProfileMoving = true;
    currentProfileIndex++;
    moveProfileCarousel(true);
  }

  function prevProfile() {
    if (isProfileMoving) return;
    isProfileMoving = true;
    currentProfileIndex--;
    moveProfileCarousel(true);
  }

  nextProfileBtn.addEventListener("click", nextProfile);
  prevProfileBtn.addEventListener("click", prevProfile);

  profileTrack.addEventListener("transitionend", () => {
    if (currentProfileIndex === allProfileSlides.length - 1) {
      currentProfileIndex = 1;
      moveProfileCarousel(false);
    }

    if (currentProfileIndex === 0) {
      currentProfileIndex = allProfileSlides.length - 2;
      moveProfileCarousel(false);
    }

    isProfileMoving = false;
  });

  window.addEventListener("resize", () => {
    moveProfileCarousel(false);
  });

  let touchStartX = 0;
  let touchEndX = 0;

  profileViewport.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].screenX;
  });

  profileViewport.addEventListener("touchend", (event) => {
    touchEndX = event.changedTouches[0].screenX;

    if (touchStartX - touchEndX > 50) {
      nextProfile();
    }

    if (touchEndX - touchStartX > 50) {
      prevProfile();
    }
  });
}


/* ================================
   AUDIO TERMINAL PLAYER SECTION
================================ */

const terminalAudio = document.getElementById("terminalAudio");

const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const stopBtn = document.getElementById("stopBtn");
const terminalNextBtn = document.getElementById("nextBtn");
const terminalPrevBtn = document.getElementById("prevBtn");

const volumeSlider = document.getElementById("volumeSlider");

const waveView = document.getElementById("waveView");
const lyricsView = document.getElementById("lyricsView");
const lyricToggleBtn = document.getElementById("lyricToggleBtn");

const trackButtons = document.querySelectorAll(".terminal-track");

let currentTrackIndex = 0;
let showingLyrics = false;

if (
  terminalAudio &&
  playBtn &&
  pauseBtn &&
  stopBtn &&
  terminalNextBtn &&
  terminalPrevBtn &&
  volumeSlider &&
  waveView &&
  lyricsView &&
  lyricToggleBtn
) {
  function loadTrack(index) {
    const track = trackButtons[index];

    if (!track) return;

    terminalAudio.src = track.dataset.audio;
    lyricsView.textContent = track.dataset.lyrics || "LYRICS NOT LOADED";

    trackButtons.forEach((btn) => btn.classList.remove("active"));
    track.classList.add("active");

    currentTrackIndex = index;
  }

  function playTrack() {
    terminalAudio.play();
  }

  function pauseTrack() {
    terminalAudio.pause();
  }

  function stopTrack() {
    terminalAudio.pause();
    terminalAudio.currentTime = 0;
  }

  function nextTrack() {
    currentTrackIndex++;

    if (currentTrackIndex >= trackButtons.length) {
      currentTrackIndex = 0;
    }

    loadTrack(currentTrackIndex);
    playTrack();
  }

  function prevTrack() {
    currentTrackIndex--;

    if (currentTrackIndex < 0) {
      currentTrackIndex = trackButtons.length - 1;
    }

    loadTrack(currentTrackIndex);
    playTrack();
  }

  function toggleLyrics() {
    showingLyrics = !showingLyrics;

    if (showingLyrics) {
      waveView.classList.add("hidden");
      lyricsView.classList.remove("hidden");
      lyricToggleBtn.textContent = "WAVES";
    } else {
      lyricsView.classList.add("hidden");
      waveView.classList.remove("hidden");
      lyricToggleBtn.textContent = "LYRICS";
    }
  }

  if (trackButtons.length > 0) {
    loadTrack(0);
  }

  playBtn.addEventListener("click", playTrack);
  pauseBtn.addEventListener("click", pauseTrack);
  stopBtn.addEventListener("click", stopTrack);
  terminalNextBtn.addEventListener("click", nextTrack);
  terminalPrevBtn.addEventListener("click", prevTrack);

  volumeSlider.addEventListener("input", () => {
    terminalAudio.volume = volumeSlider.value;
  });

  lyricToggleBtn.addEventListener("click", toggleLyrics);

  trackButtons.forEach((track, index) => {
    track.addEventListener("click", () => {
      loadTrack(index);
      playTrack();
    });
  });

  terminalAudio.addEventListener("ended", nextTrack);
}

document.querySelectorAll(".vote-btn").forEach((button) => {
  button.onclick = async () => {
    const card = button.closest(".vote-card");
    const trackId = card.dataset.track;

    const res = await fetch("https://cmrcrypt-api.cmrcrypt.workers.dev/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ track_id: trackId }),
    });

    const data = await res.json();
    console.log(data);

    button.innerText = `VOTED (${data.votes})`;
    button.disabled = true;
  };
});