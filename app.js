const header = document.querySelector('#site-header');
const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelectorAll('.nav a');
const videoModal = document.querySelector('#report-video-modal');
const videoFrame = document.querySelector('#report-video-frame');
const videoOpenButtons = document.querySelectorAll('[data-video-open]');
const videoCloseButtons = document.querySelectorAll('[data-video-close]');
const videoHighlights = document.querySelectorAll('[data-video-highlight]');
const videoLink = document.querySelector('#report-video-link');
const episodeList = document.querySelector('.episode-list');
let youtubePlayer = null;
let youtubeApiPromise = null;
let lastFocusedElement = null;
const youtubeOrigin = window.location.origin === 'null' ? '' : `&origin=${encodeURIComponent(window.location.origin)}`;

const sortEpisodes = () => {
  if (!episodeList) return;
  [...episodeList.children]
    .sort((a, b) => Number(b.querySelector('[data-episode]')?.dataset.episode || 0) - Number(a.querySelector('[data-episode]')?.dataset.episode || 0))
    .forEach((episode) => episodeList.appendChild(episode));
};

sortEpisodes();

const updateHeader = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 28);
};

const closeMenu = () => {
  header.classList.remove('nav-active');
  document.body.classList.remove('nav-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menú');
};

menuButton.addEventListener('click', () => {
  const isOpen = header.classList.toggle('nav-active');
  document.body.classList.toggle('nav-open', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
});

navLinks.forEach((link) => link.addEventListener('click', closeMenu));

const loadYoutubeApi = () => {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise((resolve) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      resolve(window.YT);
    };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    document.head.appendChild(script);
  });

  return youtubeApiPromise;
};

const createYoutubePlayer = () => {
  loadYoutubeApi().then((YT) => {
    const iframe = videoFrame?.querySelector('iframe');
    if (!iframe || !YT?.Player) return;
    youtubePlayer = new YT.Player(iframe, { events: { onReady: () => {} } });
  });
};

const openVideoModal = (event) => {
  if (!videoModal || !videoFrame) return;
  const source = event?.currentTarget;
  const videoId = source?.dataset.videoId || 'fNtS0tomOLk';
  const videoTitle = source?.dataset.videoTitle || 'León XIV vuelve a casa: reportaje especial';
  lastFocusedElement = document.activeElement;
  videoFrame.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0&enablejsapi=1${youtubeOrigin}" title="${videoTitle}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" loading="eager"></iframe>`;
  if (videoLink) videoLink.href = `https://www.youtube.com/watch?v=${videoId}`;
  videoModal.hidden = false;
  document.body.classList.add('nav-open');
  videoHighlights.forEach((highlight, index) => highlight.classList.toggle('is-active', index === 0));
  createYoutubePlayer();
  videoModal.querySelector('.video-modal__close').focus();
};

const closeVideoModal = () => {
  if (!videoModal || videoModal.hidden) return;
  videoModal.hidden = true;
  videoFrame.innerHTML = '';
  youtubePlayer?.destroy?.();
  youtubePlayer = null;
  document.body.classList.remove('nav-open');
  if (lastFocusedElement) lastFocusedElement.focus();
};

videoOpenButtons.forEach((button) => button.addEventListener('click', openVideoModal));
videoCloseButtons.forEach((button) => button.addEventListener('click', closeVideoModal));

videoHighlights.forEach((highlight) => {
  highlight.addEventListener('click', () => {
    const start = Number(highlight.dataset.start || 0);
    videoHighlights.forEach((item) => item.classList.toggle('is-active', item === highlight));

    if (youtubePlayer?.seekTo) {
      youtubePlayer.seekTo(start, true);
      youtubePlayer.playVideo?.();
      return;
    }

    const iframe = videoFrame?.querySelector('iframe');
    if (iframe) iframe.src = `https://www.youtube.com/embed/fNtS0tomOLk?autoplay=1&playsinline=1&rel=0&enablejsapi=1&start=${start}${youtubeOrigin}`;
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && header.classList.contains('nav-active')) {
    closeMenu();
    menuButton.focus();
  }
  if (event.key === 'Escape' && videoModal && !videoModal.hidden) closeVideoModal();
});
window.addEventListener('scroll', updateHeader, { passive: true });
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) closeMenu();
});

updateHeader();

const revealItems = document.querySelectorAll('.reveal');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .12, rootMargin: '0px 0px -40px' });

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    observer.observe(item);
  });
}
