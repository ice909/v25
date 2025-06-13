document.addEventListener('DOMContentLoaded', () => {
  const video = document.querySelector('#dialog-video');
  const videoDialog = document.querySelector('.video-dialog');
  if (window.AppConfig.lang == 'zh')
    video.src = window.AppConfig.baseUrl + '/assets/videos/v25-preview.mp4';
  else
    video.src = window.AppConfig.baseUrl + '/assets/videos/v25-preview-en.mp4';

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
});
