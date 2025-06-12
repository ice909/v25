document.addEventListener('DOMContentLoaded', () => {
  const video = document.querySelector('#desktopVideo');
  const replyBtn = document.querySelector('.desktop .replay');
  video.addEventListener('ended', () => {
    replyBtn.classList.toggle('visible');
  });
  video.addEventListener('ended', () => {
    replyBtn.classList.remove('visible');
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
            change.target.style.left = `${videoRect.left - sectionRect.left}px`;
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
});
