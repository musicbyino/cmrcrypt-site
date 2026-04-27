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
