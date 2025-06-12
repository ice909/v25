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

const workerVideos = [
  '/assets/videos/ai-search.mp4',
  '/assets/videos/ai-write.mp4',
  '/assets/videos/ai-assistant.mp4',
];

document.addEventListener('DOMContentLoaded', async () => {
  // 左右切换按钮绑定点击事件
  const items = document.querySelectorAll('.worker .banner .img');
  const leftBtn = document.querySelector('.worker .toolbar .button.left');
  const rightBtn = document.querySelector('.worker .toolbar .button.right');
  const replyBtns = document.querySelectorAll('.worker .banner .img img');

  replyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const video = items[workerCurrentIndex].querySelector('video');
      video.currentTime = 0;
      video.play();
    });
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

  // 图片点击切换
  items.forEach((item, idx) => {
    item.addEventListener('click', function () {
      if (workerCurrentIndex === idx) return;
      if (idx > workerCurrentIndex) switchNextWorkerBanner();
      else switchPrevWorkerBanner();
    });
  });

  // 初始化视频观察器
  const worker0 = document.getElementById('worker0');
  worker0.src = window.AppConfig.baseUrl + workerVideos[0];
  worker0.addEventListener('ended', () => {
    document.querySelector('.worker .banner .img.left img').style.visibility =
      'visible';
  });

  worker0.addEventListener('play', () => {
    document.querySelector('.worker .banner .img.left img').style.visibility =
      'hidden';
  });

  const worker1 = document.getElementById('worker1');
  worker1.src = window.AppConfig.baseUrl + workerVideos[1];
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
  worker2.src = window.AppConfig.baseUrl + workerVideos[2];
  worker2.addEventListener('ended', () => {
    document.querySelector('.worker .banner .img.right img').style.visibility =
      'visible';
  });

  worker2.addEventListener('play', () => {
    document.querySelector('.worker .banner .img.right img').style.visibility =
      'hidden';
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
});
