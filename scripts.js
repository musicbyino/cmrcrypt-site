let scrollTimer;

window.addEventListener("scroll", () => {
  document.documentElement.classList.add("scrolling");

  clearTimeout(scrollTimer);

  scrollTimer = setTimeout(() => {
    document.documentElement.classList.remove("scrolling");
  }, 800);
});
/* ================================
   HEADER / NAV
================================ */

/* No JS needed yet. */


/* ================================
   HERO
================================ */
const heroSection = document.querySelector(".hero-section");
const systemNav = document.querySelector(".side-system-nav");

function updateSystemNav() {
  const heroBottom = heroSection.getBoundingClientRect().bottom;

  if (heroBottom <=80) {
    systemNav.classList.add("nav-visible");
  } else {
    systemNav.classList.remove("nav-visible");
  }
}

window.addEventListener("scroll", updateSystemNav);
window.addEventListener("load", updateSystemNav);
updateSystemNav();

/* ================================
   AUDIO DATABASE / DATA-DRIVEN UI
================================ */

const audioDisplayPanel = document.querySelector("#audioDisplayPanel");
const releaseDatabaseGrid = document.querySelector("#releaseDatabaseGrid");

function getFeaturedRelease() {
  return releases.find((release) => release.featured) || releases[0];
}

function updateAudioDisplay(release) {
  if (!audioDisplayPanel || !release) return;

  const youtubeLink = release.youtube
    ? `<a href="${release.youtube}" target="_blank">YouTube</a>`
    : `<span class="is-disabled">YouTube</span>`;

  audioDisplayPanel.innerHTML = `
    <div class="audio-display-cover">
      <img src="${release.cover}" alt="${release.title} cover" />
    </div>

    <div class="audio-display-info">
      <p class="audio-kicker">Current Transmission</p>
      <h2>${release.title}</h2>
      <p class="audio-type">${release.type}</p>

      <div class="audio-display-links project-links">
        <a href="${release.soundcloud}" target="_blank">SoundCloud</a>
        <a href="${release.spotify}" target="_blank">Spotify</a>
        <a href="${release.apple}" target="_blank">Apple Music</a>
        ${youtubeLink}
      </div>
    </div>
  `;
}

function buildReleaseDatabase() {
  if (!releaseDatabaseGrid || !Array.isArray(releases)) return;

  releaseDatabaseGrid.innerHTML = "";

  releases.forEach((release) => {
    const releaseButton = document.createElement("button");

    releaseButton.className = release.featured
      ? "release-database-item active"
      : "release-database-item";

    releaseButton.type = "button";

    releaseButton.innerHTML = `
      <img src="${release.cover}" alt="${release.title} cover" />
      <span>${release.title}</span>
    `;

    releaseButton.addEventListener("click", () => {
      updateAudioDisplay(release);

      document.querySelectorAll(".release-database-item").forEach((item) => {
        item.classList.remove("active");
      });

      releaseButton.classList.add("active");
    });

    releaseDatabaseGrid.appendChild(releaseButton);
  });
}

if (
  typeof releases !== "undefined" &&
  Array.isArray(releases) &&
  releases.length > 0
) {
  updateAudioDisplay(getFeaturedRelease());
  buildReleaseDatabase();
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
    const percent = data.total_votes > 0
      ? Math.round((votes / data.total_votes) * 100)
      : 0;

    voteCount.innerText = `Votes: ${votes}`;
    votePercent.innerText = `${percent}%`;
    voteBar.style.width = `${percent}%`;
  });
}
/* ================================
   VIDEO DATABASE / DATA-DRIVEN UI
================================ */

const videoDisplayPanel = document.querySelector("#videoDisplayPanel");
const videoDatabaseList = document.querySelector("#videoDatabaseList");

function getFeaturedVideo() {
  return videos.find((video) => video.featured) || videos[0];
}

function updateVideoDisplay(video) {
  if (!videoDisplayPanel || !video) return;

  videoDisplayPanel.innerHTML = `
    <div class="video-player-top">
      <span class="video-system-label">[ SITE ACCESS: ACTIVE ]</span>
    </div>

    <div class="video-player-wrap">
      <video
        id="archiveVideo"
        class="archive-video"
        controls
        preload="metadata"
        poster="${video.poster}"
      >
        <source src="${video.video}" type="video/mp4" />
        Your browser aint supportin dis vid.
      </video>
    </div>

    <div class="video-meta">
      <div class="video-meta-line">
        <h3 class="video-title" id="videoTitle">${video.title}</h3>
        <p class="video-date" id="videoDate">${video.date}</p>
      </div>

      <p class="video-description" id="videoDescription">
        ${video.description}
      </p>
    </div>
  `;
}

function buildVideoDatabase() {
  if (!videoDatabaseList || !Array.isArray(videos)) return;

  videoDatabaseList.innerHTML = "";

  videos.forEach((video) => {
    const videoButton = document.createElement("button");

    videoButton.className = video.featured
      ? "video-thumb-item active"
      : "video-thumb-item";

    videoButton.type = "button";

    videoButton.innerHTML = `
      <span class="video-thumb-image-wrap">
        <img
          src="${video.poster}"
          alt="${video.title} thumbnail"
          class="video-thumb-image"
        />
      </span>

      <span class="video-thumb-text">
        <span class="video-thumb-name">${video.title}</span>
        <span class="video-thumb-sub">SITE ACCESS</span>
      </span>
    `;

    videoButton.addEventListener("click", () => {
      updateVideoDisplay(video);

      document.querySelectorAll(".video-thumb-item").forEach((item) => {
        item.classList.remove("active");
      });

      videoButton.classList.add("active");
    });

    videoDatabaseList.appendChild(videoButton);
  });
}

if (
  typeof videos !== "undefined" &&
  Array.isArray(videos) &&
  videos.length > 0
) {
  updateVideoDisplay(getFeaturedVideo());
  buildVideoDatabase();
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
   SECRET AUDIO TERMINAL PLAYER
================================ */

const audioPlayer = document.getElementById("audioPlayer");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const showWavesBtn = document.getElementById("showWavesBtn");
const toggleLyricsBtn = document.getElementById("toggleLyricsBtn");

const coverArt = document.getElementById("coverArt");
const trackTitle = document.getElementById("trackTitle");
const trackArtist = document.getElementById("trackArtist");

const wavesView = document.getElementById("wavesView");
const lyricsView = document.getElementById("lyricsView");
const lyricsPanel = document.getElementById("lyricsPanel");


const waveArea = document.getElementById("waveArea");

const WAVE_BAR_COUNT = 150;

if (waveArea) {
  for (let i = 0; i < WAVE_BAR_COUNT; i++) {
    const bar = document.createElement("span");

    bar.classList.add("wave-bar");

    waveArea.appendChild(bar);
  }
}

const waveBars = Array.from(document.querySelectorAll(".wave-bar"));


let currentTrackIndex = 0;
let isPlaying = false;

let audioContext;
let analyser;
let sourceNode;
let frequencyData;
let animationId;

/* ================================
   HIDDEN TRACK LIST
================================ */

const secretTracks = [
  {
    src: "https://pub-9db467ada9744f04b4c0eaf2e4b1ca71.r2.dev/audio/audio_player/ICB_WYS.mp3",

    title: "CLASSIFIED AUDIO",

    artist: "INO",

    cover:
      "https://pub-9db467ada9744f04b4c0eaf2e4b1ca71.r2.dev/INO_LOGO_BARB.WIRE.png",

    lyrics: [
      "Ino mf crazy baby, watch yo self!",
      "I be talkin to myself in the depths of hell.",
      "I been dropping more tabs",
      "I need bigger dabs",
      "It don’t ever last",
      "It don’t ever fucking last",
      "Walking lone thru this world trynna love myself",
      "Trynna find these pieces they so scattered down this well",
      "I ain’t good I ain’t really fucking feeing well",
      "Been a long time since I really seen myself",
      "",
      "",
      "",
      "",
      "I ain’t got no options baby what the Fuck is left",
      "Imma do the right thing. All with no respect",
      "I do what I want to do what you can",
      "Imma shoot a lil film and fly to Japan",
      "This blacksmith",
      "Come Fuck with the man",
      "Cuz, I make this",
      "All with my hands",
      "Fuck a bag",
      "Fuck mask",
      "You can look me right up",
      "I’m the eyes mf",
      "Imma tell you wassup",
      "Ain’t no lie mf",
      "I don’t need to hype up",
    ],
  },
];
/* ================================
   LOAD TRACK + TERMINAL LYRIC FEED
================================ */

let currentLyricLineIndex = 0;
let lyricInterval;
let lyricStartTimeout;

const LYRIC_START_DELAY = 13500; // 13.5 seconds before first bar
const LYRIC_LINE_DELAY = 2500;  // time between lyric lines

function loadTrack(index) {
  const track = secretTracks[index];

  if (!track) return;

  audioPlayer.src = track.src;
  audioPlayer.crossOrigin = "anonymous";
  coverArt.src = track.cover;
  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;

  lyricsPanel.innerHTML = "";

  currentTrackIndex = index;
  currentLyricLineIndex = -1;

  clearInterval(lyricInterval);
  clearTimeout(lyricStartTimeout);
}

function addNextLyricLine() {
  const track = secretTracks[currentTrackIndex];

  if (!track || !track.lyrics) return;

  currentLyricLineIndex++;

  if (currentLyricLineIndex >= track.lyrics.length) {
    clearInterval(lyricInterval);
    return;
  }

  const oldActiveLine = lyricsPanel.querySelector(".lyric-line.active");

  if (oldActiveLine) {
    oldActiveLine.classList.remove("active");
  }

  const line = track.lyrics[currentLyricLineIndex];
  const lyricLine = document.createElement("p");

  if (line === "") {
    lyricLine.classList.add("lyric-line", "lyric-spacer");
    lyricLine.innerHTML = "&nbsp;";
  } else {
    lyricLine.classList.add("lyric-line", "active");
    lyricLine.textContent = line;
  }

  lyricsPanel.appendChild(lyricLine);
  lyricsPanel.scrollTop = lyricsPanel.scrollHeight;
}

function startLyricFeed() {
  clearInterval(lyricInterval);
  clearTimeout(lyricStartTimeout);

lyricsPanel.innerHTML = "";

const loadingLine = document.createElement("p");
loadingLine.classList.add("lyric-line", "active");
loadingLine.textContent = "[ LYRICS LOADING ]";
lyricsPanel.appendChild(loadingLine);

currentLyricLineIndex = -1;

  lyricStartTimeout = setTimeout(() => {
    lyricsPanel.innerHTML = "";
    addNextLyricLine();

    lyricInterval = setInterval(() => {
      addNextLyricLine();
    }, LYRIC_LINE_DELAY);
  }, LYRIC_START_DELAY);
}

function stopLyricFeed() {
  clearInterval(lyricInterval);
  clearTimeout(lyricStartTimeout);
}
/* ================================
   AUDIO VISUALIZER SETUP
================================ */

function setupAudioVisualizer() {
  if (audioContext) return;

  audioContext = new AudioContext();
  analyser = audioContext.createAnalyser();

  analyser.fftSize = 64;

  sourceNode = audioContext.createMediaElementSource(audioPlayer);
  sourceNode.connect(analyser);
  analyser.connect(audioContext.destination);

  frequencyData = new Uint8Array(analyser.frequencyBinCount);
}

function animateWaveBars() {
  if (!analyser || !frequencyData || waveBars.length === 0) return;

  analyser.getByteFrequencyData(frequencyData);

  waveBars.forEach((bar, index) => {
    const dataIndex = Math.floor(
      (index / waveBars.length) * frequencyData.length
    );

    const value = frequencyData[dataIndex];
    const height = Math.max(8, (value / 255) * 100);

    bar.style.height = `${height}%`;
  });

  animationId = requestAnimationFrame(animateWaveBars);
}

function stopWaveBars() {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }

  waveBars.forEach((bar) => {
    bar.style.height = "8%";
  });
}

/* ================================
   PLAY / PAUSE
================================ */

function playTrack() {
  setupAudioVisualizer();

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  audioPlayer.play();
  isPlaying = true;
  playBtn.textContent = "PAUSE";

  animateWaveBars();
  startLyricFeed();
}

function pauseTrack() {
  audioPlayer.pause();
  isPlaying = false;
  playBtn.textContent = "PLAY";

  stopWaveBars();
  stopLyricFeed();
}

/* ================================
   NEXT / PREV
================================ */

function nextTrack() {
  currentTrackIndex++;

  if (currentTrackIndex >= secretTracks.length) {
    currentTrackIndex = 0;
  }

  loadTrack(currentTrackIndex);

  if (isPlaying) {
    playTrack();
  }
}

function prevTrack() {
  currentTrackIndex--;

  if (currentTrackIndex < 0) {
    currentTrackIndex = secretTracks.length - 1;
  }

  loadTrack(currentTrackIndex);

  if (isPlaying) {
    playTrack();
  }
}

/* ================================
   WAVES / LYRICS TOGGLE
================================ */

function showWaves() {
  wavesView.classList.add("active");
  lyricsView.classList.remove("active");

  showWavesBtn.classList.add("active");
  toggleLyricsBtn.classList.remove("active");
}

function showLyrics() {
  lyricsView.classList.add("active");
  wavesView.classList.remove("active");

  toggleLyricsBtn.classList.add("active");
  showWavesBtn.classList.remove("active");
}

/* ================================
   EVENTS
================================ */

if (
  audioPlayer &&
  playBtn &&
  prevBtn &&
  nextBtn &&
  showWavesBtn &&
  toggleLyricsBtn &&
  coverArt &&
  trackTitle &&
  trackArtist &&
  wavesView &&
  lyricsView &&
  lyricsPanel &&
  waveBars.length > 0
) {
  playBtn.addEventListener("click", () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      playTrack();
    }
  });

  prevBtn.addEventListener("click", prevTrack);
  nextBtn.addEventListener("click", nextTrack);

  showWavesBtn.addEventListener("click", showWaves);
  toggleLyricsBtn.addEventListener("click", showLyrics);

  audioPlayer.addEventListener("ended", nextTrack);

  loadTrack(0);
  showWaves();
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
function unlockProfileCarousel() {
  setTimeout(() => {
    profileIsMoving = false;
  }, 500);
}

function goNextProfile() {
  if (profileIsMoving) return;

  profileIsMoving = true;
  currentProfileIndex++;
  moveProfileCarousel(true);
  unlockProfileCarousel();
}

function goPrevProfile() {
  if (profileIsMoving) return;

  profileIsMoving = true;
  currentProfileIndex--;
  moveProfileCarousel(true);
  unlockProfileCarousel();
}

  nextProfileBtn.addEventListener("click", goNextProfile);
  prevProfileBtn.addEventListener("click", goPrevProfile);

profileTrack.addEventListener("transitionend", () => {
  if (currentProfileIndex >= allProfileSlides.length - 1) {
    currentProfileIndex = 1;
    moveProfileCarousel(false);
  }

  if (currentProfileIndex <= 0) {
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