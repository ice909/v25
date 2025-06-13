document.addEventListener('DOMContentLoaded', () => {
  const video = document.querySelector('#cross')
  const replayBtn = document.querySelector('.cross .replay');
  video.setAttribute(
    'data-src',
    window.AppConfig.baseUrl + '/assets/videos/cooperate.mp4'
  );

  replayBtn.addEventListener('click', () => {
    video.currentTime = 0;
    video.play();
  });
  video.addEventListener('ended', () => {
    replayBtn.classList.toggle('visible')
  });
  video.addEventListener('play', () => {
    replayBtn.classList.remove('visible');
  });

  const supportDialogWrap = document.querySelector('.support-dialog-wrap');

  supportDialogWrap.addEventListener('wheel', (e) => {
    e.preventDefault()
  }, { passive: false });

  const supportBtn = document.querySelector('.cross .support-btn')
  supportBtn.addEventListener('click', () => {
    supportDialogWrap.style.display = 'block';
    video.pause();
  });
  const closeSupportDialog = document.querySelector('.support-dialog .close-btn');
  closeSupportDialog.addEventListener('click', (e) => {
    // 阻止事件冒泡
    e.stopPropagation();
    supportDialogWrap.style.display = 'none';
    video.play();
  })

  function handleFullScreenCover(
    cover,
    sectionSelector,
    videoSelector,
    isCross = false
  ) {
    window.scrollTo({
      top: document.querySelector(sectionSelector).offsetTop,
      behavior: 'smooth',
    });
    setTimeout(() => {
      const isSmallScreen = document.body.clientWidth < 1700;
      const isLargeScreen = document.body.clientWidth >= 2200;
      const sectionRect = document
        .querySelector(sectionSelector)
        .getBoundingClientRect();
      const videoRect = document
        .querySelector(videoSelector)
        .getBoundingClientRect();
      cover.style.top = `${
        videoRect.top -
        sectionRect.top +
        (isCross
          ? isSmallScreen
            ? 82
            : isLargeScreen
            ? 119
            : 90
          : 5)
      }px`;
      cover.style.left = `${
        videoRect.left -
        sectionRect.left +
        (isCross
          ? isSmallScreen
            ? 193
            : isLargeScreen
            ? 279
            : 211
          : 0)
      }px`;
      cover.style.right = `${
        sectionRect.right -
        videoRect.right +
        (isCross
          ? isSmallScreen
            ? 211
            : isLargeScreen
            ? 301
            : 230
          : 0)
      }px`;
      cover.style.borderRadius = '7px';
      setTimeout(() => {
        cover.style.opacity = 0;
        setTimeout(() => {
          cover.style.display = 'none';
          cover.style.top = '0';
          cover.style.left = '0';
          cover.style.right = '0';
          cover.style.transition = 'none';
          document.querySelector('#cross').play();
        }, 500);
      }, 500);
    }, 500);
  }
  const fullCoverOb = new IntersectionObserver(
    (changes) => {
      changes.forEach((change) => {
        if (change.isIntersecting) {
          if (change.target.classList.contains('fullscreen-cover2')) {
            handleFullScreenCover(
              change.target,
              '.cross',
              '.cross #cross',
              true
            );
          }
        }
      });
    },
    { threshold: 0.4 }
  );

  fullCoverOb.observe(document.querySelector('.fullscreen-cover2'));

  const aiIo = new IntersectionObserver(
    (changes) => {
      changes.forEach((change) => {
        if (change.target.id === 'cross') {
          if (
            document.querySelector('.fullscreen-cover2').style.display ===
            'block'
          )
            return;
          if (change.isIntersecting) {
            change.target.play();
          } else {
            change.target.pause();
          }
        }
      });
    },
    { threshold: 0.8 }
  );
  aiIo.observe(document.querySelector('#cross'));

  const crossIo2 = new IntersectionObserver(
    (changes) => {
      changes.forEach((change) => {
        if (change.target.tagName === 'SPAN') {
          if (change.isIntersecting) {
            const cover = document.querySelector('.fullscreen-cover2');
            cover.style.opacity = 1;
            cover.style.transition = 'all 0.5s ease-in-out';
            cover.style.display = 'block';
            document.querySelector('#cross').currentTime = 0;
            document.querySelector('#cross').pause();
          }
        }
      });
    },
    { threshold: 0.5 }
  );
  // 监听ai问答重播按钮可见
  crossIo2.observe(document.querySelector('.ai .answer .right .replay span'));
 })