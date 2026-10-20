/* A local poster keeps YouTube off the initial loading path. */
(() => {
  const stage = document.getElementById("update-video-stage");
  if (!stage) return;
  const play = document.getElementById("update-video-play");
  const poster = document.getElementById("update-video-poster");
  const stop = document.getElementById("update-video-stop");
  const external = document.getElementById("update-video-youtube");
  const caption = play.querySelector("strong");
  const note = document.querySelector(".video-note");
  const choices = [...document.querySelectorAll("[data-update-video]")];
  const videos = {
    career: {
      id: "D5ZV0m4T24U",
      title: "NEW Career Mode in StreamPicks",
      label: "the new Career Mode Short",
      caption: "Watch the Career Short",
      url: "https://www.youtube.com/shorts/D5ZV0m4T24U",
      poster: "/assets/images/updates/career-short.webp",
      alt: "Neonbyte, one of Career Mode’s rivals, at Stage 40",
    },
    dev: {
      id: "zmcvTfJ5EzY",
      title: "StreamPicks - Dev Update 1.52.1",
      label: "the latest StreamPicks developer update",
      caption: "Watch the latest dev update",
      url: "https://www.youtube.com/watch?v=zmcvTfJ5EzY",
      poster: "/assets/images/updates/dev-update-1-52-1.webp",
      alt: "Dev Taylor presents the StreamPicks 1.52.1 update with new pack artwork",
    },
  };
  let selected = "career";
  const reset = (focus = false) => {
    stage.querySelector("iframe")?.remove();
    play.hidden = false;
    stop.hidden = true;
    note.textContent = "Video loads when you press play.";
    if (focus) play.focus();
  };
  choices.forEach((choice) =>
    choice.addEventListener("click", () => {
      if (
        !videos[choice.dataset.updateVideo] ||
        selected === choice.dataset.updateVideo
      )
        return;
      reset();
      selected = choice.dataset.updateVideo;
      const video = videos[selected];
      poster.src = video.poster;
      poster.alt = video.alt;
      caption.textContent = video.caption;
      play.href = external.href = video.url;
      play.setAttribute("aria-label", "Play " + video.label);
      choices.forEach((button) =>
        button.setAttribute("aria-pressed", String(button === choice)),
      );
    }),
  );
  play.addEventListener("click", (event) => {
    // Preserve normal open-in-new-tab gestures and a no-JavaScript YouTube link.
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    )
      return;
    event.preventDefault();
    if (stage.querySelector("iframe")) return;
    const video = videos[selected];
    const player = document.createElement("iframe");
    player.src =
      "https://www.youtube-nocookie.com/embed/" +
      video.id +
      "?autoplay=1&playsinline=1&rel=0";
    player.title = video.title + " — YouTube video player";
    player.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    player.allowFullscreen = true;
    player.referrerPolicy = "strict-origin-when-cross-origin";
    play.hidden = true;
    stop.hidden = false;
    note.textContent = "Playing on YouTube. Close the video to stop playback.";
    stage.append(player);
    player.focus();
  });
  stop.addEventListener("click", () => reset(true));
})();
