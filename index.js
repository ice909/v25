import { i18n } from './i18n.js';

const App = {
  data() {
    return {
      baseUrl: '',
      currentLanguage: 'en',
      i18n: i18n,
      isSmallScreen: document.body.clientWidth < 1700,
      toolBarWidthStyle: {
        width: `${window.screen.width / 2}px`,
      },
      desktopCurrentIndex: 0,
      windowTubeCurrentIndex: 0,
      windowTubeVideos: [
        {
          left: '/assets/videos/three-finger-right.mp4',
          right: '/assets/videos/window-right.mp4',
        },
        {
          left: '/assets/videos/four-finger-left.mp4',
          right: '/assets/videos/next-dekstop.mp4',
        },
      ],
      workerCurrentIndex: 1,
      workerVideos: [
        '/assets/videos/ai-search.mp4',
        '/assets/videos/ai-write.mp4',
        '/assets/videos/ai-assistant.mp4',
      ],
    };
  },
  created() {
    this.getLanguage();
  },
  mounted() {
    this.initIntersectionObservers();
  },
  methods: {
    getLanguage() {
      const lang = location.pathname.split('/')[1].trim();
      if (lang === 'en') {
        this.currentLanguage = lang;
      }
    },
    switchDeskTopBanner(index) {
      if (this.desktopCurrentIndex === index) return;
      this.desktopCurrentIndex = index;
      const items = document.querySelectorAll('.desktop .banner .item');
      const dots = document.querySelectorAll('.desktop .pagination .dot');
      items.forEach((item, i) => {
        item.classList.toggle('opacity', i !== index);
        item.style.left = this.isSmallScreen
          ? `calc(50% - ${510 + (index - i) * 1100}px)`
          : `calc(50% - ${510 + (index - i) * 1239}px)`;
      });
      dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    },
    resetDesktopBanner() {
      this.switchDeskTopBanner(0);
      document.querySelector('.desktop .banner .left video').currentTime = 0;
    },
    switchWorkerBanner(index) {
      if (this.workerCurrentIndex === index) return;
      index > this.workerCurrentIndex
        ? this.switchNextWorkerBanner()
        : this.switchPrevWorkerBanner();
    },
    switchPrevWorkerBanner() {
      if (this.workerCurrentIndex === 0) return;
      this.workerCurrentIndex--;
      this.updateWorkerBanner();
    },
    switchNextWorkerBanner() {
      if (this.workerCurrentIndex === 2) return;
      this.workerCurrentIndex++;
      this.updateWorkerBanner();
    },
    updateWorkerBanner() {
      const items = document.querySelectorAll('.worker .banner .img');
      const positions = [
        ['calc(50% - 480px)', 'calc(50% + 549px)', '200%'],
        ['calc(50% - 1509px)', 'calc(50% - 480px)', 'calc(50% + 549px)'],
        ['-200%', 'calc(50% - 1509px)', 'calc(50% - 480px)'],
      ];
      items.forEach(
        (item, i) => (item.style.left = positions[this.workerCurrentIndex][i])
      );
      document
        .querySelector('.worker .toolbar .button.left')
        .classList.toggle('disabled', this.workerCurrentIndex === 0);
      document
        .querySelector('.worker .toolbar .button.right')
        .classList.toggle('disabled', this.workerCurrentIndex === 2);

      // 停止其他并重置，播放当前视频
      const videos = document.querySelectorAll('.worker .banner .img video');
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
    switchWindowTubeVideo(index) {
      if (this.windowTubeCurrentIndex === index) return;
      this.windowTubeCurrentIndex = index;
      const btns = document.querySelectorAll(
        '.window-tube .content .left .tab .btn'
      );
      document
        .querySelector('.window-tube .content .left .tab .btn.active')
        .classList.remove('active');
      document.querySelector(
        '.window-tube .content .left .tab .bg'
      ).style.left = index === 0 ? '0' : 'calc(50% + 1.5px)';
      btns[index].classList.add('active');
      this.playVideos('.window-tube .content .right .data video');
    },
    replayWindowTube() {
      this.playVideos('.window-tube .content .right .data video', true);
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
            this.resetDesktopBanner();
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
                  '.desktop .item video'
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
      const workerIo = new IntersectionObserver(
        (changes) => {
          changes.forEach((change) => {
            console.log(change.target.id, change.isIntersecting);
            if (change.isIntersecting) {
              const worker = document.querySelector(
                `#worker${this.workerCurrentIndex}`
              );
              setTimeout(() => {
                worker.play();
              }, 500);
            } else {
              const worker = document.querySelector(
                `#worker${this.workerCurrentIndex}`
              );
              worker.pause();
            }
          });
        },
        { threshold: 0.9 }
      );

      workerIo.observe(document.querySelector('#worker0'));
      workerIo.observe(document.querySelector('#worker1'));
      workerIo.observe(document.querySelector('#worker2'));

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

      desktopIo.observe(
        document.querySelectorAll('.desktop .banner .item video')[0]
      );
      desktopIo.observe(
        document.querySelectorAll('.desktop .banner .item video')[1]
      );
      const aiIo = new IntersectionObserver(
        (changes) => {
          changes.forEach((change) => {
            if (change.target.id === 'cross') {
              if (
                document.querySelector('.fullscreen-cover2').style.display ===
                'block'
              )
                return;
            }
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
      aiIo.observe(document.querySelector('#cross'));
    },
    handleFullScreenCover(
      cover,
      sectionSelector,
      videoSelector,
      isCross = false
    ) {
      document
        .querySelector(sectionSelector)
        .scrollIntoView({ behavior: 'smooth' });
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
          (isCross ? (this.isSmallScreen ? 75 : 90) : 5)
        }px`;
        cover.style.left = `${
          videoRect.left -
          sectionRect.left +
          (isCross ? (this.isSmallScreen ? 175 : 211) : 0)
        }px`;
        cover.style.right = `${
          sectionRect.right -
          videoRect.right +
          (isCross ? (this.isSmallScreen ? 187 : 230) : 0)
        }px`;
        cover.style.bottom = `${
          sectionRect.bottom - videoRect.bottom - (isCross ? 0 : 0)
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
  },
  computed: {
    currentMessage() {
      return this.i18n[this.currentLanguage];
    },
    ai() {
      return this.currentMessage.ai[this.workerCurrentIndex];
    },
    isZh() {
      return this.currentLanguage === 'zh';
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
            console.log('replay isvisible');
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
    { threshold: 1 }
  );

  crossIo2.observe(document.querySelector('.ai .answer .right .replay span'));
  crossIo2.observe(
    document.querySelector('.window-tube .content .right .data video')
  );
});
