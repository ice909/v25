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

document.addEventListener('DOMContentLoaded', function () {
  function ai() {
    const aiLeftVideo = document.querySelector('#ai-left');
    const aiRightVideo = document.querySelector('#ai-right');
    const replayLeftBtn = document.querySelector('.ai .content .left .replay');
    const replayRightBtn = document.querySelector(
      '.ai .content .right .replay'
    );

    if (window.AppConfig.lang === 'en') {
      aiLeftVideo.setAttribute(
        'data-src',
        window.AppConfig.baseUrl + '/assets/videos/voice-en.mp4'
      );
      aiRightVideo.setAttribute(
        'data-src',
        window.AppConfig.baseUrl + '/assets/videos/qa-en.mp4'
      );
    } else {
      aiLeftVideo.setAttribute(
        'data-src',
        window.AppConfig.baseUrl + '/assets/videos/voice.mp4'
      );
      aiRightVideo.setAttribute(
        'data-src',
        window.AppConfig.baseUrl + '/assets/videos/qa.mp4'
      );
    }

    replayLeftBtn.addEventListener('click', () => {
      aiLeftVideo.currentTime = 0;
      aiLeftVideo.play();
    });
    replayRightBtn.addEventListener('click', () => {
      aiRightVideo.currentTime = 0;
      aiRightVideo.play();
    });

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

    const aiIo = new IntersectionObserver(
      (changes) => {
        changes.forEach((change) => {
          if (change.isIntersecting) {
            change.target.play();
          } else {
            change.target.pause();
          }
        });
      },
      { threshold: 0.8 }
    );
    aiIo.observe(document.querySelector('#ai-left'));
    aiIo.observe(document.querySelector('#ai-right'));

    // ai问答
    const aiAnswerVideo = document.querySelector('#aiAnswerVideo');
    const aiAnswerReplayBtn = document.querySelector('.ai .answer .replay');

    if (window.AppConfig.lang === 'en') {
      aiAnswerVideo.setAttribute(
        'data-src',
        window.AppConfig.baseUrl + '/assets/videos/aibar-en.mp4'
      );
    } else {
      aiAnswerVideo.setAttribute(
        'data-src',
        window.AppConfig.baseUrl + '/assets/videos/aibar.mp4'
      );
    }

    aiAnswerReplayBtn.addEventListener('click', () => {
      aiAnswerVideo.currentTime = 0;
      aiAnswerVideo.play();
    });

    const aiBario = new IntersectionObserver(
      (changes) => {
        changes.forEach((change) => {
          if (change.isIntersecting) {
            change.target.play();
          } else {
            change.target.pause();
          }
        });
      },
      { threshold: 1 }
    );
    aiBario.observe(document.querySelector('#aiAnswerVideo'));
  }

  function cross() {
    const video = document.querySelector('#cross');
    const replayBtn = document.querySelector('.cross .replay');
    const src =
      window.AppConfig.lang === 'en'
        ? '/assets/videos/cooperate-en.mp4'
        : '/assets/videos/cooperate.mp4';
    video.setAttribute('data-src', window.AppConfig.baseUrl + src);

    replayBtn.addEventListener('click', () => {
      video.currentTime = 0;
      video.play();
    });
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

    video.setAttribute(
      'data-src',
      window.AppConfig.baseUrl + '/assets/videos/new-desktop.mp4'
    );

    replyBtn.addEventListener('click', () => {
      video.currentTime = 0;
      video.play();
    });

    const io = new IntersectionObserver(
      (changes) => {
        if (changes[0].isIntersecting) {
          const cover = document.querySelector('.fullscreen-cover');
          cover.style.opacity = 1;
          cover.style.transition = 'all 0.5s ease-in-out';
          cover.style.display = 'block';
          const video = document.querySelector('#desktopVideo');
          video.currentTime = 0;
          video.pause();
        }
      },
      { threshold: [0.8] }
    );
    io.observe(document.querySelector('.monolith .title'));

    const fullCoverOb = new IntersectionObserver(
      (changes) => {
        changes.forEach((change) => {
          if (change.isIntersecting) {
            window.scrollTo({
              top: document.querySelector('.desktop').offsetTop,
              behavior: 'smooth',
            });
            setTimeout(() => {
              const sectionRect = document
                .querySelector('.desktop')
                .getBoundingClientRect();
              const videoRect = document
                .querySelector('.desktop video')
                .getBoundingClientRect();
              change.target.style.top = `${
                videoRect.top - sectionRect.top + 5
              }px`;
              change.target.style.left = `${
                videoRect.left - sectionRect.left
              }px`;
              change.target.style.right = `${
                sectionRect.right - videoRect.right
              }px`;
              change.target.style.borderRadius = '7px';
              setTimeout(() => {
                change.target.style.opacity = 0;
                setTimeout(() => {
                  change.target.style.display = 'none';
                  change.target.style.top = '0';
                  change.target.style.left = '0';
                  change.target.style.right = '0';
                  change.target.style.transition = 'none';
                  document.querySelector('.desktop video').play();
                }, 500);
              }, 500);
            }, 500);
          }
        });
      },
      { threshold: 0.4 }
    );

    fullCoverOb.observe(document.querySelector('.fullscreen-cover'));

    const desktopIo = new IntersectionObserver(
      (changes) => {
        changes.forEach((change) => {
          if (change.isIntersecting) {
            if (
              document.querySelector('.fullscreen-cover').style.display ===
              'block'
            )
              return;
            change.target.play();
          } else {
            change.target.pause();
          }
        });
      },
      { threshold: 1 }
    );

    desktopIo.observe(document.querySelector('.desktop video'));
  }

  function dialog() {
    const video = document.querySelector('#dialog-video');
    const videoDialog = document.querySelector('.video-dialog');
    if (window.AppConfig.lang == 'en')
      video.setAttribute(
        'data-src',
        window.AppConfig.baseUrl + '/assets/videos/v25-release-en.mp4'
      );
    else
      video.setAttribute(
        'data-src',
        window.AppConfig.baseUrl + '/assets/videos/v25-release.mp4'
      );

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

    const observer = new IntersectionObserver(
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

    observer.observe(monolith);
  }

  function touchpad() {
    const videos = document.querySelectorAll(
      '.window-tube .content .right .video'
    );

    videos.forEach((video, i) => {
      video.setAttribute(
        'data-src',
        window.AppConfig.oldBaseUrl + videoSrc[0][i === 0 ? 'left' : 'right']
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
              window.AppConfig.oldBaseUrl +
              videoSrc[index][i === 0 ? 'left' : 'right'];
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

    const touchpad = new IntersectionObserver(
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
    touchpad.observe(
      document.querySelector('.window-tube .content .right .data video')
    );
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
        translations[window.AppConfig.lang][workerCurrentIndex].aiTitle;
      document.getElementById('worker-ai-desc').textContent =
        translations[window.AppConfig.lang][workerCurrentIndex].aiDesc;
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
      translations[window.AppConfig.lang][workerCurrentIndex].aiTitle;
    document.getElementById('worker-ai-desc').textContent =
      translations[window.AppConfig.lang][workerCurrentIndex].aiDesc;

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

    // 初始化视频观察器
    const worker0 = document.getElementById('worker0');
    worker0.setAttribute(
      'data-src',
      window.AppConfig.baseUrl + workerVideos[window.AppConfig.lang][0]
    );
    worker0.addEventListener('ended', () => {
      document.querySelector('.worker .banner .img.left img').style.visibility =
        'visible';
    });

    worker0.addEventListener('play', () => {
      document.querySelector('.worker .banner .img.left img').style.visibility =
        'hidden';
    });

    const worker1 = document.getElementById('worker1');
    worker1.setAttribute(
      'data-src',
      window.AppConfig.baseUrl + workerVideos[window.AppConfig.lang][1]
    );
    worker1.addEventListener('ended', () => {
      document.querySelector(
        '.worker .banner .img:nth-child(2) img'
      ).style.visibility = 'visible';
    });

    worker1.addEventListener('play', () => {
      document.querySelector(
        '.worker .banner .img:nth-child(2) img'
      ).style.visibility = 'hidden';
    });
    const worker2 = document.getElementById('worker2');
    worker2.setAttribute(
      'data-src',
      window.AppConfig.baseUrl + workerVideos[window.AppConfig.lang][2]
    );
    worker2.addEventListener('ended', () => {
      document.querySelector(
        '.worker .banner .img.right img'
      ).style.visibility = 'visible';
    });

    worker2.addEventListener('play', () => {
      document.querySelector(
        '.worker .banner .img.right img'
      ).style.visibility = 'hidden';
    });

    const workerIo = new IntersectionObserver(
      (changes) => {
        changes.forEach((change) => {
          if (change.isIntersecting) {
            setTimeout(() => {
              change.target.play();
            }, 500);
          } else {
            change.target.pause();
          }
        });
      },
      { threshold: 0.9 }
    );

    workerIo.observe(document.querySelector('#worker0'));
    workerIo.observe(document.querySelector('#worker1'));
    workerIo.observe(document.querySelector('#worker2'));
  }

  ai();
  cross();
  desktop();
  dialog();
  monolith();
  touchpad();
  worker();
});
