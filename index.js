import { i18n } from './i18n.js';

const App = {
  data() {
    return {
      baseUrl: '',
      currentLanguage: 'en',
      i18n: i18n,
      isSmallScreen: document.body.clientWidth < 1900,
      toolBarWidthStyle: {
        width: `${window.screen.width / 2}px`,
      },
      desktopCurrentIndex: 0,
      desktopOffsetWidth: window.screen.width / 2 - 510,
      windowTubeCurrentIndex: 0,
      windowTubeVideos: [
        {
          left: '/assets/videos/触控板三指右.mp4',
          right: '/assets/videos/窗口右分屏.mp4',
        },
        {
          left: '/assets/videos/触控板四指左.mp4',
          right: '/assets/videos/切换后一个桌面.mp4',
        },
      ],
      workerCurrentIndex: 1,
      workerOffsetWidth: -(window.screen.width / 2 + 69 * 2) / 2,
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
    },
    replay(id) {
      const video = document.querySelector(id);
      video.currentTime = 0;
      video.play();
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
      ).style.left = index === 0 ? '0' : '50%';
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
                  '.desktop .item img'
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
    },
    handleFullScreenCover(
      cover,
      sectionSelector,
      imgSelector,
      isCross = false
    ) {
      document
        .querySelector(sectionSelector)
        .scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const sectionRect = document
          .querySelector(sectionSelector)
          .getBoundingClientRect();
        const imgRect = document
          .querySelector(imgSelector)
          .getBoundingClientRect();
        cover.style.top = `${
          imgRect.top -
          sectionRect.top +
          (isCross ? (this.isSmallScreen ? 75 : 90) : 26)
        }px`;
        cover.style.left = `${
          imgRect.left -
          sectionRect.left +
          (isCross ? (this.isSmallScreen ? 175 : 211) : 109)
        }px`;
        cover.style.right = `${
          sectionRect.right -
          imgRect.right +
          (isCross ? (this.isSmallScreen ? 187 : 230) : 135)
        }px`;
        cover.style.bottom = `${
          sectionRect.bottom - imgRect.bottom - (isCross ? 0 : 79.22)
        }px`;
        setTimeout(() => {
          cover.style.opacity = 0;
          setTimeout(() => {
            cover.style.display = 'none';
            cover.style.top = '0';
            cover.style.left = '0';
            cover.style.right = '0';
            cover.style.transition = 'none';
            if (isCross) document.querySelector('#cross').play();
          }, 500);
        }, 500);
      }, 500);
    },
    replayWorkerVideo() {
      console.log('replayWorkerVideo');
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
        if (change.target.className.includes('replay')) {
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
    { threshold: 1 }
  );

  crossIo2.observe(document.querySelector('.ai .answer .right .replay'));
  crossIo2.observe(
    document.querySelector('.window-tube .content .right .data video')
  );
});
