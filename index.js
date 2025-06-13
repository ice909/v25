const App = {
  data() {
    return {
      baseUrl: '',
      isSmallScreen: document.body.clientWidth < 1700,
      isLargeScreen: document.body.clientWidth >= 2200,
      previewSrc: '/assets/videos/v25-preview.mp4',
      desktopCurrentIndex: 0,
      workerCurrentIndex: 1,
      workerVideos: [
        '/assets/videos/ai-search.mp4',
        '/assets/videos/ai-write.mp4',
        '/assets/videos/ai-assistant.mp4',
      ],
    };
  },
  mounted() {
    const observer = window.lozad();
    observer.observe();

    this.initIntersectionObservers();
    // 全新桌面视频
    this.addVideoEventListener('#desktopVideo', 'ended', () => {
      document.querySelector('.desktop .replay').classList.toggle('visible');
    });
    this.addVideoEventListener('#desktopVideo', 'play', () => {
      document.querySelector('.desktop .replay').classList.remove('visible');
    });
    // ai问答
    this.addVideoEventListener('#ai-left', 'ended', () => {
      document.querySelector('.ai .content .left .replay').style.visibility =
        'visible';
    });
    this.addVideoEventListener('#ai-left', 'play', () => {
      document.querySelector('.ai .content .left .replay').style.visibility =
        'hidden';
    });
    this.addVideoEventListener('#ai-right', 'ended', () => {
      document.querySelector('.ai .content .right .replay').style.visibility =
        'visible';
    });
    this.addVideoEventListener('#ai-right', 'play', () => {
      document.querySelector('.ai .content .right .replay').style.visibility =
        'hidden';
    });
    this.addVideoEventListener('#aiAnswerVideo', 'ended', () => {
      document
        .querySelector('.ai .answer .right .replay')
        .classList.toggle('visible');
    });
    this.addVideoEventListener('#aiAnswerVideo', 'play', () => {
      document
        .querySelector('.ai .answer .right .replay')
        .classList.remove('visible');
    });

    // 跨端协同
    this.addVideoEventListener('#cross', 'ended', () => {
      document.querySelector('.cross .replay').classList.toggle('visible');
    });
    this.addVideoEventListener('#cross', 'play', () => {
      document.querySelector('.cross .replay').classList.remove('visible');
    });
  },
  methods: {
    replay(id) {
      const video = document.querySelector(id);
      video.currentTime = 0;
      video.play();
    },
    resetAndStopVideo(id) {
      const video = document.querySelector(id);
      video.currentTime = 0;
      video.pause();
    },
    openVideoDialog() {
      const videoDialog = document.querySelector('.video-dialog');
      videoDialog.style.display = 'block';
      const video = document.querySelector('#dialog-video');
      video.currentTime = 0;
      video.play();
    },
    closeVideoDialog() {
      const video = document.querySelector('#dialog-video');
      video.pause();
      video.currentTime = 0;
      document.querySelector('.video-dialog').style.display = 'none';
    },
    playVideos(selector, reset = false) {
      const videos = document.querySelectorAll(selector);
      videos.forEach((video) => {
        if (reset) video.currentTime = 0;
        const onCanPlay = () => {
          video.play();
          video.removeEventListener('canplay', onCanPlay);
        };
        video.addEventListener('canplay', onCanPlay);
        video.load();
      });
    },
    initIntersectionObservers() {
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
              if (change.target.classList.contains('fullscreen-cover')) {
                this.handleFullScreenCover(
                  change.target,
                  '.desktop',
                  '.desktop video'
                );
              } else if (
                change.target.classList.contains('fullscreen-cover2')
              ) {
                this.handleFullScreenCover(
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

      fullCoverOb.observe(document.querySelector('.fullscreen-cover'));
      fullCoverOb.observe(document.querySelector('.fullscreen-cover2'));

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
      aiBario.observe(document.querySelector('.answer .right video'));

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
            } else if (change.isIntersecting) {
              const onCanPlay = () => {
                change.target.play();
                change.target.removeEventListener('canplay', onCanPlay);
              };
              change.target.addEventListener('canplay', onCanPlay);
              change.target.load();
            } else {
              change.target.pause();
            }
          });
        },
        { threshold: 0.8 }
      );
      aiIo.observe(document.querySelector('#ai-left'));
      aiIo.observe(document.querySelector('#ai-right'));
      aiIo.observe(document.querySelector('#cross'));
    },
    handleFullScreenCover(
      cover,
      sectionSelector,
      videoSelector,
      isCross = false
    ) {
      window.scrollTo({
        top: document.querySelector(sectionSelector).offsetTop,
        behavior: 'smooth',
      });
      // document
      //   .querySelector(sectionSelector)
      //   .scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
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
            ? this.isSmallScreen
              ? 82
              : this.isLargeScreen
              ? 119
              : 90
            : 5)
        }px`;
        cover.style.left = `${
          videoRect.left -
          sectionRect.left +
          (isCross
            ? this.isSmallScreen
              ? 193
              : this.isLargeScreen
              ? 279
              : 211
            : 0)
        }px`;
        cover.style.right = `${
          sectionRect.right -
          videoRect.right +
          (isCross
            ? this.isSmallScreen
              ? 211
              : this.isLargeScreen
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
            if (isCross) document.querySelector('#cross').play();
            else document.querySelector(videoSelector).play();
          }, 500);
        }, 500);
      }, 500);
    },
    openSupportDialog() {
      document.querySelector('.support-dialog-wrap').style.display = 'block';
      // #cross停止播放
      document.querySelector('#cross').pause();
    },
    closeSupportDialog() {
      document.querySelector('.support-dialog-wrap').style.display = 'none';
      document.querySelector('#cross').play();
    },
    // 添加视频事件监听器
    addVideoEventListener(selector, event, callback) {
      document.querySelector(selector).addEventListener(event, callback);
    },
    // 播放当前视频
    playCurrentVideo(selector) {
      const videos = document.querySelectorAll(selector);
      videos.forEach((video, i) => {
        if (i === this.workerCurrentIndex) {
          video.currentTime = 0;
          setTimeout(() => video.play(), 500);
        } else {
          video.pause();
          video.currentTime = 0;
        }
      });
    },
  },
};

const app = Vue.createApp(App);
app.mount('#app');

document.addEventListener('DOMContentLoaded', function () {
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

  const crossIo2 = new IntersectionObserver(
    (changes) => {
      changes.forEach((change) => {
        if (change.target.className.includes('video')) {
          const videos = document.querySelectorAll(
            '.window-tube .content .right .data video'
          );
          if (change.isIntersecting) {
            videos.forEach((video) => {
              const onCanPlay = () => {
                video.play();
                video.removeEventListener('canplay', onCanPlay);
              };
              video.addEventListener('canplay', onCanPlay);
              video.load();
            });
          } else {
            videos.forEach((video) => {
              video.currentTime = 0;
              video.pause();
            });
          }
        }
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
  // 监听窗管视频可见
  crossIo2.observe(
    document.querySelector('.window-tube .content .right .data video')
  );
});

