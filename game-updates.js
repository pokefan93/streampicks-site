/* Current artwork videos are fetched only after the player presses play. */
(() => {
  const stage = document.getElementById("update-video-stage");
  if (!stage) return;
  const play = document.getElementById("update-video-play");
  const poster = document.getElementById("update-video-poster");
  const stop = document.getElementById("update-video-stop");
  const external = document.getElementById("update-video-file");
  const caption = play.querySelector("strong");
  const note = document.querySelector(".video-note");
  const choices = [...document.querySelectorAll("[data-update-video]")];
  const videos = {
    trailer: {
      title: "StreamPicks trailer",
      caption: "Watch the trailer",
      url: "/press/video/20261113/StreamPicks-Trailer-9x16.mp4",
      poster: "/assets/images/updates/trailer-20261114.webp",
      alt: "An Arena battle featuring the current painted creator cards",
    },
    pack: {
      title: "StreamPicks pack opening",
      caption: "Watch a pack opening",
      url: "/press/video/20261113/StreamPicks-Pack-Reveal.mp4",
      poster: "/press/video/20261113/pack-reveal-poster.webp",
      alt: "A Viral Pack opening with the current painted card artwork",
    },
  };
  let selected = "trailer";
  const reset = (focus = false) => {
    const player = stage.querySelector("video");
    if (player) {
      player.pause();
      player.removeAttribute("src");
      player.load();
      player.remove();
    }
    play.hidden = false;
    stop.hidden = true;
    note.textContent = "Promotional animation using current game artwork. Video loads when you press play.";
    if (focus) play.focus();
  };
  choices.forEach((choice) => choice.addEventListener("click", () => {
    if (!videos[choice.dataset.updateVideo] || selected === choice.dataset.updateVideo) return;
    reset();
    selected = choice.dataset.updateVideo;
    const video = videos[selected];
    poster.src = video.poster;
    poster.alt = video.alt;
    caption.textContent = video.caption;
    play.href = external.href = video.url;
    play.setAttribute("aria-label", "Play " + video.title);
    choices.forEach((button) => button.setAttribute("aria-pressed", String(button === choice)));
  }));
  play.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    if (stage.querySelector("video")) return;
    const video = videos[selected];
    const player = document.createElement("video");
    player.src = video.url;
    player.poster = video.poster;
    player.controls = true;
    player.playsInline = true;
    player.preload = "none";
    player.setAttribute("aria-label", video.title);
    play.hidden = true;
    stop.hidden = false;
    note.textContent = "Promotional animation using current game artwork. Close the video to stop playback.";
    stage.append(player);
    player.play().catch(() => { note.textContent = "Press play in the video controls to watch with sound."; });
    player.focus();
  });
  stop.addEventListener("click", () => reset(true));
})();
