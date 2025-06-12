document.addEventListener('DOMContentLoaded', () => {
  if (window.AppConfig.lang == 'zh')
    document.querySelector('#dialog-video').src =
      window.AppConfig.baseUrl + '/assets/videos/v25-preview.mp4';
  else
    document.querySelector('#dialog-video').src =
      window.AppConfig.baseUrl + '/assets/videos/v25-preview-en.mp4';
});
