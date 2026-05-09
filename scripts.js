/* ================================
   HEADER / NAV
================================ */

/* No JS needed yet. */


/* ================================
   HERO
================================ */

/* No JS needed yet. */


/* ================================
   AUDIO CARD CAROUSEL
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

    audioCarouselTrack.style.transition = animate ? "transform 0.45s ease" : "none";
    audioCarouselTrack.style.transform = `translateX(-${audioIndex * step}px)`;
  }

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

  moveAudioCarousel(false);
}


/* ================================
   VOTING
================================ */
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

    updateVoteUI(data);

    document.querySelectorAll(".vote-btn").forEach((btn) => {
      btn.disabled = true;
      btn.innerText = "VOTING LOCKED";
    });

    button.innerText = data.already_voted ? "ALREADY VOTED" : "VOTED";
  };
});

function updateVoteUI(data) {
  document.querySelectorAll(".vote-card").forEach((card) => {
    const trackId = card.dataset.track;
    const voteCount = card.querySelector(".vote-count");
    const votePercent = card.querySelector(".vote-percent");
    const voteBar = card.querySelector(".vote-bar-fill");

    const trackResult = data.results.find((item) => item.track_id === trackId);
    const votes = trackResult ? trackResult.votes : 0;

    const percent =
      data.total_votes > 0 ? Math.round((votes / data.total_votes) * 100) : 0;

    voteCount.innerText = `Votes: ${votes}`;
    votePercent.innerText = `${percent}%`;
    voteBar.style.width = `${percent}%`;
  });
}
}
/* ================================
   VIDEO ARCHIVE
================================ */

const archiveVideo = document.getElementById("archiveVideo");
const videoTitle = document.getElementById("videoTitle");
const videoDate = document.getElementById("videoDate");
const videoDescription = document.getElementById("videoDescription");
const videoButtons = document.querySelectorAll(".video-thumb-item");

if (archiveVideo && videoTitle && videoDate && videoDescription && videoButtons.length > 0) {
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
}


/* ================================
   UNLOCK / ACCESS CODE
================================ */

const codeInput = document.getElementById("accessCode0");
const unlockBtn = document.getElementById("unlockBtn");
const clearBtn = document.getElementById("clearBtn");
const unlockMessage = document.getElementById("unlockMessage");

const codeSlots = [
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

if (codeInput && unlockBtn && clearBtn && unlockMessage && lockedState && audioTerminal) {
  function updateSlots() {
    const value = codeInput.value;

    codeSlots.forEach((slot, index) => {
      if (slot) {
        slot.textContent = value[index] ? "•" : "_";
      }
    });
  }

  function clearCode() {
    codeInput.value = "";
    updateSlots();
    unlockMessage.textContent = "AWAITING CLEARANCE";
    codeInput.focus();
  }

  function checkCode() {
    const enteredCode = codeInput.value;

    if (enteredCode.length < 6) {
      unlockMessage.textContent = "ENTER 6 DIGITS";
      codeInput.focus();
      return;
    }

    if (enteredCode === CORRECT_CODE) {
      unlockMessage.textContent = "ACCESS GRANTED";

      setTimeout(() => {
        lockedState.classList.add("hidden");
        audioTerminal.classList.remove("hidden");
      }, 500);
    } else {
      unlockMessage.textContent = "ACCESS DENIED";
      codeInput.focus();
    }
  }

  codeInput.addEventListener("input", updateSlots);
  unlockBtn.addEventListener("click", checkCode);
  clearBtn.addEventListener("click", clearCode);

  lockedState.addEventListener("click", () => {
    codeInput.focus();
  });

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

  updateSlots();
}


/* ================================
   AUDIO TERMINAL PLAYER
================================ */

const audioPlayer = document.getElementById("audioPlayer");

const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const stopBtn = document.getElementById("stopBtn");
const nextBtn = document.getElementById("nextBtn");
const toggleLyricsBtn = document.getElementById("toggleLyricsBtn");

const volumeControl = document.getElementById("volumeControl");

const coverArt = document.getElementById("coverArt");
const trackTitle = document.getElementById("trackTitle");
const trackArtist = document.getElementById("trackArtist");

const wavesView = document.getElementById("wavesView");
const lyricsView = document.getElementById("lyricsView");
const lyricsPanel = document.getElementById("lyricsPanel");

const trackItems = Array.from(document.querySelectorAll(".track-item"));

let currentTrackIndex = 0;
let showingLyrics = false;

if (
  audioPlayer &&
  playBtn &&
  pauseBtn &&
  stopBtn &&
  nextBtn &&
  toggleLyricsBtn &&
  volumeControl &&
  coverArt &&
  trackTitle &&
  trackArtist &&
  wavesView &&
  lyricsView &&
  lyricsPanel &&
  trackItems.length > 0
) {
  function loadTrack(index) {
    const track = trackItems[index];

    if (!track) return;

    audioPlayer.src = track.dataset.src;
    coverArt.src = track.dataset.cover;
    trackTitle.textContent = track.dataset.title;
    trackArtist.textContent = track.dataset.artist;

    lyricsPanel.innerHTML = "";

    const lyrics = track.dataset.lyrics || "LYRICS NOT LOADED";

    lyrics.split("|").forEach((line) => {
      const lyricLine = document.createElement("p");
      lyricLine.textContent = line.trim();
      lyricsPanel.appendChild(lyricLine);
    });

    trackItems.forEach((item) => item.classList.remove("active"));
    track.classList.add("active");

    currentTrackIndex = index;
  }

  function playTrack() {
    audioPlayer.play();
  }

  function pauseTrack() {
    audioPlayer.pause();
  }

  function stopTrack() {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
  }

  function nextTrack() {
    currentTrackIndex++;

    if (currentTrackIndex >= trackItems.length) {
      currentTrackIndex = 0;
    }

    loadTrack(currentTrackIndex);
    playTrack();
  }

  function toggleLyrics() {
    showingLyrics = !showingLyrics;

    if (showingLyrics) {
      wavesView.classList.add("hidden");
      lyricsView.classList.remove("hidden");
      toggleLyricsBtn.textContent = "WAVES";
    } else {
      lyricsView.classList.add("hidden");
      wavesView.classList.remove("hidden");
      toggleLyricsBtn.textContent = "LYRICS";
    }
  }

  playBtn.addEventListener("click", playTrack);
  pauseBtn.addEventListener("click", pauseTrack);
  stopBtn.addEventListener("click", stopTrack);
  nextBtn.addEventListener("click", nextTrack);
  toggleLyricsBtn.addEventListener("click", toggleLyrics);

  volumeControl.addEventListener("input", () => {
    audioPlayer.volume = volumeControl.value;
  });

  trackItems.forEach((track, index) => {
    track.addEventListener("click", () => {
      loadTrack(index);
      playTrack();
    });
  });

  audioPlayer.addEventListener("ended", nextTrack);

  loadTrack(0);
}


/* ================================
   ABOUT / PROFILE CAROUSEL
================================ */

const profileTrack = document.getElementById("profile-Track");
const profileSlides = Array.from(document.querySelectorAll(".profile-slide"));
const prevProfileBtn = document.getElementById("prevProfile");
const nextProfileBtn = document.getElementById("nextProfile");
const profileViewport = document.querySelector(".carousel-viewport");

let currentProfileIndex = 1;
let profileIsMoving = false;

if (profileTrack && profileSlides.length > 0 && prevProfileBtn && nextProfileBtn && profileViewport) {
  const firstClone = profileSlides[0].cloneNode(true);
  const lastClone = profileSlides[profileSlides.length - 1].cloneNode(true);

  profileTrack.appendChild(firstClone);
  profileTrack.prepend(lastClone);

  const allProfileSlides = Array.from(profileTrack.querySelectorAll(".profile-slide"));

  function moveProfileCarousel(animate = true) {
    const viewportWidth = profileViewport.clientWidth;

    profileTrack.style.transition = animate ? "transform 0.45s ease" : "none";
    profileTrack.style.transform = `translateX(-${currentProfileIndex * viewportWidth}px)`;
  }

  function goNextProfile() {
    if (profileIsMoving) return;

    profileIsMoving = true;
    currentProfileIndex++;
    moveProfileCarousel(true);
  }

  function goPrevProfile() {
    if (profileIsMoving) return;

    profileIsMoving = true;
    currentProfileIndex--;
    moveProfileCarousel(true);
  }

  nextProfileBtn.addEventListener("click", goNextProfile);
  prevProfileBtn.addEventListener("click", goPrevProfile);

  profileTrack.addEventListener("transitionend", () => {
    if (currentProfileIndex === allProfileSlides.length - 1) {
      currentProfileIndex = 1;
      moveProfileCarousel(false);
    }

    if (currentProfileIndex === 0) {
      currentProfileIndex = allProfileSlides.length - 2;
      moveProfileCarousel(false);
    }

    profileIsMoving = false;
  });

  let touchStartX = 0;

  profileViewport.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].screenX;
  });

  profileViewport.addEventListener("touchend", (event) => {
    const touchEndX = event.changedTouches[0].screenX;

    if (touchStartX - touchEndX > 50) {
      goNextProfile();
    }

    if (touchEndX - touchStartX > 50) {
      goPrevProfile();
    }
  });

  window.addEventListener("resize", () => {
    moveProfileCarousel(false);
  });

  moveProfileCarousel(false);
}


/* ================================
   CONTACT
================================ */

/* No JS needed yet. */