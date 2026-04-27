const archiveVideo = document.getElementById("archiveVideo");
const videoTitle = document.getElementById("videoTitle");
const videoDate = document.getElementById("videoDate");
const videoDescription = document.getElementById("videoDescription");

const videoButtons = document.querySelectorAll(".video-thumb-item");

videoButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const videoSrc = button.dataset.video;
    const posterSrc = button.dataset.poster;
    const title = button.dataset.title;
    const date = button.dataset.date;
    const description = button.dataset.description;

    archiveVideo.pause();
    archiveVideo.src = videoSrc;
    archiveVideo.poster = posterSrc;
    archiveVideo.load();
    archiveVideo.play();

    videoTitle.textContent = title;
    videoDate.textContent = date;
    videoDescription.textContent = description;

    videoButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");
  });
});
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

function updateSlots() {
  const value = codeInput.value;

  slots.forEach((slot, index) => {
    slot.textContent = value[index] ? "•" : "_";
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

/* Let user type anywhere while unlock panel is visible */
document.addEventListener("keydown", (event) => {
  if (lockedState.classList.contains("hidden")) return;

  // 🚫 STOP default typing into hidden input
  event.preventDefault();

  if (/^[0-9]$/.test(event.key) && codeInput.value.length < 6) {
    codeInput.value += event.key;
    updateSlots();
  }

  if (event.key === "Backspace") {
    codeInput.value = codeInput.value.slice(0, -1);
    updateSlots();
  }

  if (event.key === "Enter") {
    checkCode();
  }
});

/* Focus hidden input when user clicks the panel */
lockedState.addEventListener("click", () => {
  codeInput.focus();
});
const profileTrack = document.getElementById("profile-Track");
const profileSlides = document.querySelectorAll(".profile-slide");
const prevProfileBtn = document.getElementById("prevProfile");
const nextProfileBtn = document.getElementById("nextProfile");

let currentProfileIndex = 0;

function updateProfileCarousel() {
  profileTrack.style.transform = `translateX(-${currentProfileIndex * 100}%)`;
}

nextProfileBtn.addEventListener("click", () => {
  currentProfileIndex++;

  if (currentProfileIndex >= profileSlides.length) {
    currentProfileIndex = 0;
  }

  updateProfileCarousel();
});

prevProfileBtn.addEventListener("click", () => {
  currentProfileIndex--;

  if (currentProfileIndex < 0) {
    currentProfileIndex = profileSlides.length - 1;
  }

  updateProfileCarousel();
});