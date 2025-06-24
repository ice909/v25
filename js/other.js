const { lang, baseUrl, oldBaseUrl } = window.AppConfig;
const SMALL_SCREEN_WIDTH_Threshold = 1700;
const LARGE_SCREEN_WIDTH_Threshold = 2200;

const videoSrc = [
  {
    left: '/assets/videos/触控板三指上下.mp4',
    right: '/assets/videos/触控板三指窗口大小.mp4',
  },
  {
    left: '/assets/videos/触控板四指左右.mp4',
    right: '/assets/videos/触控板四指切换桌面.mp4',
  },
  // {
  //   left: '/assets/videos/touchpad-three-finger-up-down.mp4',
  //   right: '/assets/videos/touchpad-three-finger-window-size.mp4',
  // },
  // {
  //   left: '/assets/videos/touchpad-four-finger-left-right.mp4',
  //   right: '/assets/videos/touchpad-four-finger-switch-desktop.mp4',
  // },
];

let workerCurrentIndex = 1; // 初始居中
const translations = {
  en: [
    {
      aiTitle: 'AI Search',
      aiDesc: 'Find files with just one word',
    },
    {
      aiTitle: 'AI Assistant',
      aiDesc: 'Simply swipe to enjoy AI',
    },
    {
      aiTitle: 'AI Writing',
      aiDesc: 'Thinking for You, Effortlessly Creating',
    },
  ],
  zh: [
    {
      aiTitle: 'AI搜索',
      aiDesc: '一句话随心找文件',
    },
    {
      aiTitle: 'AI写作',
      aiDesc: '想你所想，轻松创作',
    },
    {
      aiTitle: 'AI随航',
      aiDesc: '轻轻一划，即享AI',
    },
  ],
};

const workerVideos = {
  zh: [
    '/assets/videos/ai-search.mp4',
    '/assets/videos/ai-write.mp4',
    '/assets/videos/ai-assistant.mp4',
  ],
  en: [
    '/assets/videos/ai-search-en.mp4',
    '/assets/videos/ai-write-en.mp4',
    '/assets/videos/ai-assistant-en.mp4',
  ],
};

const observers = [];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function setVideoSource(video, src) {
  video.setAttribute('data-src', src);
}

function addReplayEvent(video, btn) {
  if (btn && video) {
    btn.addEventListener('click', () => {
      video.currentTime = 0;
      video.play();
    });
  }
}

/**
 * IntersectionObserver 工厂函数
 * @param {*} obj : threshold 交叉阈值，默认值为 1, onEnter 进入时的回调函数, onLeave 离开时的回调函数
 * @returns IntersectionObserver 实例
 */
function createObserver({ threshold = 1, onEnter, onLeave }) {
  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onEnter && onEnter(entry.target, entry);
        } else {
          onLeave && onLeave(entry.target, entry);
        }
      });
    },
    { threshold }
  );
}

document.addEventListener('DOMContentLoaded', function () {
  function ai() {
    const aiLeftVideo = document.querySelector('#ai-left');
    const aiRightVideo = document.querySelector('#ai-right');
    const replayLeftBtn = document.querySelector('.ai .content .left .replay');
    const replayRightBtn = document.querySelector(
      '.ai .content .right .replay'
    );

    if (lang === 'en') {
      setVideoSource(aiLeftVideo, baseUrl + '/assets/videos/voice-en.mp4');
      setVideoSource(aiRightVideo, baseUrl + '/assets/videos/qa-en.mp4');
    } else {
      setVideoSource(aiLeftVideo, baseUrl + '/assets/videos/voice.mp4');
      setVideoSource(aiRightVideo, baseUrl + '/assets/videos/qa.mp4');
    }

    addReplayEvent(aiLeftVideo, replayLeftBtn);
    addReplayEvent(aiRightVideo, replayRightBtn);

    aiLeftVideo.addEventListener('ended', () => {
      replayLeftBtn.style.visibility = 'visible';
    });
    aiLeftVideo.addEventListener('play', () => {
      replayLeftBtn.style.visibility = 'hidden';
    });
    aiRightVideo.addEventListener('ended', () => {
      replayRightBtn.style.visibility = 'visible';
    });
    aiRightVideo.addEventListener('play', () => {
      replayRightBtn.style.visibility = 'hidden';
    });

    // 监听视频是否可见

    const aiOb = createObserver({
      threshold: 0.8,
      onEnter: (video) => {
        video.play();
      },
      onLeave: (video) => {
        video.pause();
      },
    });

    aiOb.observe(document.querySelector('#ai-left'));
    aiOb.observe(document.querySelector('#ai-right'));
    observers.push(aiOb);

    // ai问答
    const aiAnswerVideo = document.querySelector('#aiAnswerVideo');
    const aiAnswerReplayBtn = document.querySelector('.ai .answer .replay');

    const src =
      baseUrl +
      (lang === 'en'
        ? '/assets/videos/aibar-en.mp4'
        : '/assets/videos/aibar.mp4');
    setVideoSource(aiAnswerVideo, src);

    addReplayEvent(aiAnswerVideo, aiAnswerReplayBtn);

    const aiBarOb = createObserver({
      threshold: 1,
      onEnter: (video) => {
        video.play();
      },
      onLeave: (video) => {
        video.pause();
      },
    });
    aiBarOb.observe(document.querySelector('#aiAnswerVideo'));
    observers.push(aiBarOb);
  }

  function cross() {
    const video = document.querySelector('#cross');
    const replayBtn = document.querySelector('.cross .replay');
    const src =
      lang === 'en'
        ? '/assets/videos/cooperate-en.mp4'
        : '/assets/videos/cooperate.mp4';
    setVideoSource(video, baseUrl + src);

    addReplayEvent(video, replayBtn);

    video.addEventListener('ended', () => {
      replayBtn.classList.toggle('visible');
    });
    video.addEventListener('play', () => {
      replayBtn.classList.remove('visible');
    });

    const supportDialogWrap = document.querySelector('.support-dialog-wrap');

    supportDialogWrap.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
      },
      { passive: false }
    );

    const supportBtn = document.querySelector('.cross .support-btn');
    supportBtn.addEventListener('click', () => {
      supportDialogWrap.style.display = 'block';
      video.pause();
    });
    const closeSupportDialog = document.querySelector(
      '.support-dialog .close-btn'
    );
    closeSupportDialog.addEventListener('click', (e) => {
      // 阻止事件冒泡
      e.stopPropagation();
      supportDialogWrap.style.display = 'none';
      video.play();
    });

    async function handleFullScreenCover(
      cover,
      sectionSelector,
      videoSelector,
      isCross = false
    ) {
      window.scrollTo({
        top: document.querySelector(sectionSelector).offsetTop,
        behavior: 'smooth',
      });
      await delay(500);
      const isSmallScreen =
        document.body.clientWidth < SMALL_SCREEN_WIDTH_Threshold;
      const isLargeScreen =
        document.body.clientWidth >= LARGE_SCREEN_WIDTH_Threshold;
      const sectionRect = document
        .querySelector(sectionSelector)
        .getBoundingClientRect();
      const videoRect = document
        .querySelector(videoSelector)
        .getBoundingClientRect();
      cover.style.top = `${
        videoRect.top -
        sectionRect.top +
        (isCross ? (isSmallScreen ? 82 : isLargeScreen ? 119 : 90) : 5)
      }px`;
      cover.style.left = `${
        videoRect.left -
        sectionRect.left +
        (isCross ? (isSmallScreen ? 193 : isLargeScreen ? 279 : 211) : 0)
      }px`;
      cover.style.right = `${
        sectionRect.right -
        videoRect.right +
        (isCross ? (isSmallScreen ? 211 : isLargeScreen ? 301 : 230) : 0)
      }px`;
      cover.style.borderRadius = '7px';
      await delay(500);
      cover.style.opacity = 0;
      await delay(500);

      cover.style.display = 'none';
      cover.style.top = '0';
      cover.style.left = '0';
      cover.style.right = '0';
      cover.style.transition = 'none';
      document.querySelector('#cross').play();
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
    observers.push(fullCoverOb);

    const aiOb = new IntersectionObserver(
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
    aiOb.observe(document.querySelector('#cross'));

    observers.push(aiOb);

    const crossOb = createObserver({
      threshold: 0.5,
      onEnter: (target) => {
        if (target.tagName === 'SPAN') {
          const cover = document.querySelector('.fullscreen-cover2');
          cover.style.opacity = 1;
          cover.style.transition = 'all 0.5s ease-in-out';
          cover.style.display = 'block';
          document.querySelector('#cross').currentTime = 0;
          document.querySelector('#cross').pause();
        }
      },
    });

    // 监听ai问答重播按钮可见
    crossOb.observe(document.querySelector('.ai .answer .right .replay span'));
    observers.push(crossOb);
  }

  function desktop() {
    const video = document.querySelector('#desktopVideo');
    const replyBtn = document.querySelector('.desktop .replay');
    video.addEventListener('ended', () => {
      replyBtn.classList.add('visible');
    });
    video.addEventListener('play', () => {
      replyBtn.classList.remove('visible');
    });

    const src =
      lang === 'en'
        ? '/assets/videos/new-desktop-en.mp4'
        : '/assets/videos/new-desktop.mp4';

    setVideoSource(video, baseUrl + src);

    addReplayEvent(video, replyBtn);

    const monolithOb = createObserver({
      threshold: 0.8,
      onEnter: () => {
        const cover = document.querySelector('.fullscreen-cover');
        cover.style.opacity = 1;
        cover.style.transition = 'all 0.5s ease-in-out';
        cover.style.display = 'block';
        const video = document.querySelector('#desktopVideo');
        video.currentTime = 0;
        video.pause();
      },
    });
    monolithOb.observe(document.querySelector('.monolith .title'));
    observers.push(monolithOb);

    async function animateElement(el) {
      await delay(600);

      const sectionRect = document
        .querySelector('.desktop')
        .getBoundingClientRect();
      const videoRect = document
        .querySelector('.desktop video')
        .getBoundingClientRect();

      el.style.top = `${videoRect.top - sectionRect.top + 5}px`;
      el.style.left = `${videoRect.left - sectionRect.left}px`;
      el.style.right = `${sectionRect.right - videoRect.right}px`;
      el.style.borderRadius = '7px';

      await delay(500);
      el.style.opacity = 0;

      await delay(500);
      el.style.display = 'none';
      el.style.top = '0';
      el.style.left = '0';
      el.style.right = '0';
      el.style.transition = 'none';
      document.querySelector('.desktop video').play();
    }

    const fullCoverOb = createObserver({
      threshold: 0.4,
      onEnter: (target) => {
        window.scrollTo({
          top: document.querySelector('.desktop').offsetTop,
          behavior: 'smooth',
        });
        animateElement(target);
      },
    });

    fullCoverOb.observe(document.querySelector('.fullscreen-cover'));
    observers.push(fullCoverOb);

    const desktopOb = createObserver({
      threshold: 1,
      onEnter: (target) => {
        if (
          document.querySelector('.fullscreen-cover').style.display === 'block'
        )
          return;
        target.play();
      },
      onLeave: (target) => {
        target.pause();
      },
    });

    desktopOb.observe(document.querySelector('.desktop video'));
    observers.push(desktopOb);
  }

  function dialog() {
    const video = document.querySelector('#dialog-video');
    const videoDialog = document.querySelector('.video-dialog');
    const src =
      lang === 'en'
        ? '/assets/videos/v25-release-en.mp4'
        : '/assets/videos/v25-release.mp4';
    setVideoSource(video, baseUrl + src);

    const closeBtn = document.querySelector('.video-dialog img');
    // 关闭对话框
    closeBtn.addEventListener('click', () => {
      video.pause();
      video.currentTime = 0;
      videoDialog.style.display = 'none';
    });

    const openBtn = document.querySelector('.banner1 .content .btn');
    openBtn.addEventListener('click', () => {
      videoDialog.style.display = 'block';
      video.currentTime = 0;
      video.play();
    });
  }

  function monolith() {
    document
      .querySelector('#app > d-header')
      .shadowRoot.querySelector('div').style.position = 'unset';
    const monolith = document.querySelector('.monolith');
    const maxRadius = 680;

    const monolithOb = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const visibleHeight = entry.intersectionRect.height;
          const totalHeight = entry.boundingClientRect.height - 64;
          if (visibleHeight <= window.innerHeight - 780 + 64) {
            monolith.style.borderRadius = '0';
            return;
          }
          const currentRadius = Math.min(
            maxRadius,
            (visibleHeight / totalHeight) * maxRadius
          );
          monolith.style.borderRadius = `${currentRadius}px ${currentRadius}px 0 0`;
        });
      },
      { threshold: Array.from({ length: 101 }, (_, i) => i / 100) }
    );

    monolithOb.observe(monolith);
    observers.push(monolithOb);
  }

  function touchpad() {
    const videos = document.querySelectorAll(
      '.window-tube .content .right .video'
    );

    videos.forEach((video, i) => {
      setVideoSource(
        video,
        oldBaseUrl + videoSrc[0][i === 0 ? 'left' : 'right']
      );
    });
    const replayBtn = document.querySelector(
      '.window-tube .content .right img'
    );
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
              oldBaseUrl + videoSrc[index][i === 0 ? 'left' : 'right'];
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

    const touchpadOb = new IntersectionObserver(
      (changes) => {
        changes.forEach((change) => {
          const videos = document.querySelectorAll(
            '.window-tube .content .right .data video'
          );
          if (change.isIntersecting) {
            videos.forEach((video) => {
              video.play();
            });
          } else {
            videos.forEach((video) => {
              video.currentTime = 0;
              video.pause();
            });
          }
        });
      },
      { threshold: 0.5 }
    );
    touchpadOb.observe(
      document.querySelector('.window-tube .content .right .data video')
    );
    observers.push(touchpadOb);
  }

  function worker() {
    // 左右切换按钮绑定点击事件
    const workerBanner = document.querySelector('.worker .banner');
    const items = document.querySelectorAll('.worker .banner .img');
    const leftBtn = document.querySelector('.worker .toolbar .button.left');
    const rightBtn = document.querySelector('.worker .toolbar .button.right');

    workerBanner.addEventListener('click', (e) => {
      if (e.target.matches('.worker .banner .img img')) {
        const video = document.getElementById(`worker${workerCurrentIndex}`);
        video.currentTime = 0;
        video.play();
      } else if (e.target.closest('.worker .banner .img')) {
        const clickedItem = e.target.closest('.worker .banner .img');
        const idx = Array.from(
          document.querySelectorAll('.worker .banner .img')
        ).indexOf(clickedItem);

        if (workerCurrentIndex === idx) return;
        if (idx > workerCurrentIndex) switchNextWorkerBanner();
        else switchPrevWorkerBanner();
      }
    });

    function updateWorkerBanner() {
      // 三个位置分别给当前索引的三个img
      // 例：current=1，1号居中，0号在左，2号在右
      const positions = [
        ['calc(50% - 30rem)', 'calc(50% + 35rem)', '200%'],
        ['calc(50% - 95rem)', 'calc(50% - 30rem)', 'calc(50% + 35rem)'],
        ['-200%', 'calc(50% - 95rem)', 'calc(50% - 30rem)'],
      ];
      items.forEach((item, i) => {
        item.style.left = positions[workerCurrentIndex][i];
        item.classList.toggle('opacity', workerCurrentIndex != i);
      });

      // 更新文案
      document.getElementById('worker-ai-title').textContent =
        translations[lang][workerCurrentIndex].aiTitle;
      document.getElementById('worker-ai-desc').textContent =
        translations[lang][workerCurrentIndex].aiDesc;
      leftBtn.classList.toggle('disabled', workerCurrentIndex === 0);
      rightBtn.classList.toggle('disabled', workerCurrentIndex === 2);

      const videos = document.querySelectorAll('.worker .banner .img video');
      videos.forEach((item, i) => {
        if (i === this.workerCurrentIndex) {
          item.currentTime = 0;
          setTimeout(() => item.play(), 500);
        } else {
          item.pause();
          item.currentTime = 0;
        }
      });
    }

    document.getElementById('worker-ai-title').textContent =
      translations[lang][workerCurrentIndex].aiTitle;
    document.getElementById('worker-ai-desc').textContent =
      translations[lang][workerCurrentIndex].aiDesc;

    function switchPrevWorkerBanner() {
      if (workerCurrentIndex === 0) return;
      workerCurrentIndex--;
      updateWorkerBanner();
    }
    function switchNextWorkerBanner() {
      if (workerCurrentIndex === 2) return;
      workerCurrentIndex++;
      updateWorkerBanner();
    }

    leftBtn.addEventListener('click', switchPrevWorkerBanner);
    rightBtn.addEventListener('click', switchNextWorkerBanner);

    
    const workerVideoIds = ['worker0', 'worker1', 'worker2'];
    const imgSelectors = [
      '.worker .banner .img.left img',
      '.worker .banner .img:nth-child(2) img',
      '.worker .banner .img.right img',
    ];

    workerVideoIds.forEach((id, idx) => {
      const video = document.getElementById(id);
      setVideoSource(video, baseUrl + workerVideos[lang][idx]);
      const img = document.querySelector(imgSelectors[idx]);
      if (!video || !img) return; // 容错

      video.addEventListener('ended', () => {
        img.style.visibility = 'visible';
      });
      video.addEventListener('play', () => {
        img.style.visibility = 'hidden';
      });
    });

    const workerOb = createObserver({
      threshold: 0.9,
      onEnter: async (video) => {
        await delay(500);
        video.play();
      },
      onLeave: (video) => {
        video.pause();
      },
    });

    workerOb.observe(document.querySelector('#worker0'));
    workerOb.observe(document.querySelector('#worker1'));
    workerOb.observe(document.querySelector('#worker2'));

    observers.push(workerOb);
  }

  ai();
  cross();
  desktop();
  dialog();
  monolith();
  touchpad();
  worker();
});

window.addEventListener('beforeunload', () => {
  observers.forEach((observer) => {
    if (observer) observer.disconnect();
  });
});
