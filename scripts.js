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

// CHANGE THIS CODE
const CORRECT_CODE = "343343";


// ===== INPUT VISUAL FILL =====
codeInput.addEventListener("input", () => {
  const value = codeInput.value;

  slots.forEach((slot, index) => {
    slot.textContent = value[index] ? "•" : "_";
  });
});


// ===== UNLOCK LOGIC =====
unlockBtn.addEventListener("click", () => {
  const entered = codeInput.value;

  if (entered.length < 6) {
    message.textContent = "ENTER 6 DIGITS";
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
  }
});


// ===== CLEAR =====
clearBtn.addEventListener("click", () => {
  codeInput.value = "";

  slots.forEach((slot) => {
    slot.textContent = "_";
  });

  message.textContent = "AWAITING CLEARANCE";
});
