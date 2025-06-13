document.addEventListener('DOMContentLoaded', () => {
  const aiLeftVideo = document.querySelector('#ai-left');
  const aiRightVideo = document.querySelector('#ai-right');
  const replayLeftBtn = document.querySelector('.ai .content .left .replay');
  const replayRightBtn = document.querySelector('.ai .content .right .replay');

  aiLeftVideo.setAttribute(
    'data-src',
    window.AppConfig.baseUrl + '/assets/videos/voice.mp4'
  );
  aiRightVideo.setAttribute(
    'data-src',
    window.AppConfig.baseUrl + '/assets/videos/qa.mp4'
  );

  replayLeftBtn.addEventListener('click', () => {
    aiLeftVideo.currentTime = 0;
    aiLeftVideo.play();
  })
  replayRightBtn.addEventListener('click', () => {
    aiRightVideo.currentTime = 0;
    aiRightVideo.play();
  })

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
});
