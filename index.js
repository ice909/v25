import { i18n } from './i18n.js';
const App = {
  data() {
    return {
      currentLanguage: 'zh',
      i18n: i18n,
      isSmallScreen: document.body.clientWidth < 1900,
      halfBodyWidth: document.body.clientWidth / 2,
      toolBarWidthStyle: {
        width: `${window.screen.width / 2}px`,
      },
      desktopCurrentIndex: 0,
      desktopOffsetWidth: window.screen.width / 2 - 510,
      workerCurrentIndex: 1,
      workerOffsetWidth: -(window.screen.width / 2 + 69 * 2) / 2,
    };
  },
  created() {
    console.log(window.screen.width);
    this.getLanguage();
  },
  methods: {
    getBodyWidth() {
      const width = document.body.clientWidth;
      console.log(width);
      return width;
    },
    // 从路由中读取语言
    getLanguage() {
      const url = location.pathname;
      const lang = url.split('/')[1];
      console.log(lang);
      if (lang.trim() === 'en') {
        this.currentLanguage = lang;
      }
    },
    switchDeskTopBanner(index) {
      if (this.desktopCurrentIndex === index) return;
      this.desktopCurrentIndex = index;
      document
        .querySelectorAll('.desktop .banner .item')
        [index].classList.remove('opacity');
      document
        .querySelector('.desktop .pagination .dot.active')
        .classList.remove('active');
      document
        .querySelectorAll('.desktop .pagination .dot')
        [index].classList.add('active');
      const items = document.querySelectorAll('.desktop .banner .item');
      if (index === 1) {
        if (this.isSmallScreen) {
          items[0].style.left = 'calc(50% - 1610px)';
          items[1].style.left = 'calc(50% - 510px)';
        } else {
          items[0].style.left = 'calc(50% - 1749px)';
          items[1].style.left = 'calc(50% - 510px)';
        }
        document
          .querySelectorAll('.desktop .banner .container .item')[0]
          .classList.add('opacity');
      } else {
        if (this.isSmallScreen) {
          items[0].style.left = 'calc(50% - 510px)';
          items[1].style.left = 'calc(50% + 600px)';
        } else {
          items[0].style.left = 'calc(50% - 510px)';
          items[1].style.left = 'calc(50% + 729px)';
        }
        document
          .querySelectorAll('.desktop .banner .container .item')[1]
          .classList.add('opacity');
      }
    },
    switchWorkerBanner(index) {
      if (this.workerCurrentIndex === index) return;
      if (index > this.workerCurrentIndex) {
        this.switchNextWorkerBanner();
      } else {
        this.switchPrevWorkerBanner();
      }
    },
    switchPrevWorkerBanner() {
      if (this.workerCurrentIndex === 0) return;
      const items = document.querySelectorAll('.worker .banner .img');

      switch (this.workerCurrentIndex) {
        case 1:
          items[0].style.left = 'calc(50% - 480px)';
          items[1].style.left = 'calc(50% + 549px)';
          items[2].style.left = '200%';
          break;
        case 2:
          items[0].style.left = 'calc(50% - 1509px)';
          items[1].style.left = 'calc(50% - 480px)';
          items[2].style.left = 'calc(50% + 549px)';
          break;
        default:
          break;
      }
      this.workerCurrentIndex--;
      if (this.workerCurrentIndex === 0) {
        document
          .querySelector('.worker .toolbar .button.left')
          .classList.add('disabled');
      } else {
        document
          .querySelector('.worker .toolbar .button.right')
          .classList.remove('disabled');
      }
    },
    switchNextWorkerBanner() {
      if (this.workerCurrentIndex === 2) return;
      const items = document.querySelectorAll('.worker .banner .img');

      switch (this.workerCurrentIndex) {
        case 0:
          items[0].style.left = 'calc(50% - 1509px)';
          items[1].style.left = 'calc(50% - 480px)';
          items[2].style.left = 'calc(50% + 549px)';
          break;
        case 1:
          items[0].style.left = '-200%';
          items[1].style.left = 'calc(50% - 1509px)';
          items[2].style.left = 'calc(50% - 480px)';
          break;
        default:
          break;
      }
      this.workerCurrentIndex++;

      if (this.workerCurrentIndex === 2) {
        document
          .querySelector('.worker .toolbar .button.right')
          .classList.add('disabled');
      } else {
        document
          .querySelector('.worker .toolbar .button.left')
          .classList.remove('disabled');
      }
    },
    replay(id) {
      document.querySelector(id).currentTime = 0;
      document.querySelector(id).play();
    },
    openVideoDialog() {
      console.log('open');
      const videoDialog = document.querySelector('.video-dialog');
      videoDialog.style.display = 'block';
      document.querySelector('#dialog-video').currentTime = 0;
      document.querySelector('#dialog-video').play();
    },
    closeVideoDialog() {
      document.querySelector('#dialog-video').pause();
      const videoDialog = document.querySelector('.video-dialog');
      videoDialog.style.display = 'none';
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
  const maxRadius = 680; // 最大圆角值

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const visibleHeight = entry.intersectionRect.height; // 元素的可见高度
        const totalHeight = entry.boundingClientRect.height - 64; // 元素的总高度 减去导航栏64px

        // 如果可见高度，小于等于视口高度 - 780 + 64px，
        // 保持直角
        if (visibleHeight <= window.innerHeight - 780 + 64) {
          monolith.style.borderRadius = '0';
          return;
        }
        // 根据可见高度计算当前圆角值
        const currentRadius = Math.min(
          maxRadius,
          (visibleHeight / totalHeight) * maxRadius
        );

        // 设置圆角值
        monolith.style.borderRadius = `${currentRadius}px ${currentRadius}px 0 0`;
      });
    },
    {
      threshold: Array.from({ length: 101 }, (_, i) => i / 100), // 创建 0 到 1 的阈值数组
    }
  );

  observer.observe(monolith);
  // 当desktop 下面的第一个笔记本完全出现的时候，缩放过去
  const io = new IntersectionObserver(
    (changes, observe) => {
      if (changes[0].isIntersecting) {
        const cover = document.querySelector('.fullscreen-cover');
        // 恢复全屏封面图片
        cover.style.opcaity = 1;
        cover.style.transition = 'all 0.5s ease-in-out';
        cover.style.display = 'block';
      }
    },
    {
      threshold: [0.8],
    }
  );
  io.observe(document.querySelector('.monolith .title'));

  const fullCoverOb = new IntersectionObserver(
    (changes, obseve) => {
      changes.forEach((change) => {
        console.log(change.target.className, change.isIntersecting);
        if (
          change.target.className === 'fullscreen-cover' &&
          change.isIntersecting
        ) {
          document.querySelector('.desktop').scrollIntoView({
            behavior: 'smooth',
          });
          setTimeout(() => {
            // 获取位置
            const desktopRect = document
              .querySelector('.desktop')
              .getBoundingClientRect();
            const imgRect = document
              .querySelector('.desktop .item img')
              .getBoundingClientRect();

            const cover = document.querySelector('.fullscreen-cover');
            cover.style.top = `${imgRect.top - desktopRect.top + 26}px`;
            cover.style.left = `${imgRect.left - desktopRect.left + 109}px`;
            cover.style.right = `${desktopRect.right - imgRect.right + 135}px`;
            cover.style.bottom = `${
              desktopRect.bottom - imgRect.bottom - 79.22
            }px`;
            // 等待0.5s后透明度变为0
            setTimeout(() => {
              cover.style.opcaity = 0;

              // 完全隐藏
              setTimeout(() => {
                cover.style.display = 'none';
                cover.style.top = '0';
                cover.style.left = '0';
                cover.style.right = '0';
                cover.style.transition = 'none';
              }, 500);
            }, 500);
          }, 500);
          return;
        }
        if (
          change.target.className === 'fullscreen-cover2' &&
          change.isIntersecting
        ) {
          document.querySelector('.cross').scrollIntoView({
            behavior: 'smooth',
          });
          setTimeout(() => {
            const crossRect = document
              .querySelector('.cross')
              .getBoundingClientRect();
            const imgRect = document
              .querySelector('.cross #cross')
              .getBoundingClientRect();
            const cover = document.querySelector('.fullscreen-cover2');
            cover.style.left = `${imgRect.left - crossRect.left + 211}px`;
            cover.style.top = `${imgRect.top - crossRect.top + 90}px`;
            cover.style.right = `${crossRect.right - imgRect.right + 230}px`;

            // 等待0.5s后透明度变为0
            setTimeout(() => {
              cover.style.opcaity = 0;

              // 完全隐藏
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
      });
    },
    {
      threshold: 0.4,
    }
  );

  fullCoverOb.observe(document.querySelector('.fullscreen-cover'));
  fullCoverOb.observe(document.querySelector('.fullscreen-cover2'));

  const crossIo2 = new IntersectionObserver(
    (changes, observe) => {
      if (changes[0].isIntersecting) {
        // 恢复全屏封面图片
        const cover = document.querySelector('.fullscreen-cover2');
        cover.style.opcaity = 1;
        cover.style.transition = 'all 0.5s ease-in-out';
        cover.style.display = 'block';
        document.querySelector('#cross').currentTime = 0;
        document.querySelector('#cross').pause();
      }
    },
    {
      threshold: 1,
    }
  );
  crossIo2.observe(document.querySelector('.ai .answer .right .replay'));
});
