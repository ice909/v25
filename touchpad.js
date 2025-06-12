const videoSrc = [
  {
    left: '/assets/videos/触控板三指上下.mp4',
    right: '/assets/videos/触控板三指窗口大小.mp4',
  },
  {
    left: '/assets/videos/触控板四指左右.mp4',
    right: '/assets/videos/触控板四指切换桌面.mp4',
  },
];

document.addEventListener('DOMContentLoaded', () => {
  const videos = document.querySelectorAll(
    '.window-tube .content .right .video'
  );

  videos.forEach((video, i) => {
    video.src =
      window.AppConfig.baseUrl + videoSrc[0][i === 0 ? 'left' : 'right'];
  });
  const replayBtn = document.querySelector('.window-tube .content .right img');
  const btns = document.querySelectorAll(
    '.window-tube .content .left .tab .btn'
  );

  document
    .querySelector('.window-tube .content .left .tab')
    .addEventListener('click', (e) => {
      if (
        e.target.classList.contains('btn') ||
        e.target.parentElement.classList.contains('btn')
      ) {
        const btn = e.target.classList.contains('btn')
          ? e.target
          : e.target.parentElement;
        const bg = document.querySelector(
          '.window-tube .content .left .tab .bg'
        );
        const index = Array.from(btns).indexOf(btn);
        btns.forEach((b) => b.classList.remove('active'));
        bg.style.left = index === 0 ? '0' : 'calc(50% + 1.5px)';
        btn.classList.add('active');
        videos.forEach((video, i) => {
          video.src =
            window.AppConfig.baseUrl +
            videoSrc[index][i === 0 ? 'left' : 'right'];
          video.load();
          video.play();
        });
      }
    });

  videos[0].addEventListener('ended', () => {
    document.querySelector(
      '.window-tube .content .right img'
    ).style.visibility = 'visible';
  });
  videos[0].addEventListener('play', () => {
    document.querySelector(
      '.window-tube .content .right img'
    ).style.visibility = 'hidden';
  });

  replayBtn.addEventListener('click', () => {
    videos.forEach((video) => {
      video.currentTime = 0;
      video.play();
    });
  });
});
