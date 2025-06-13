const isEn = window.location.pathname.includes('/en');
const lang = isEn ? 'en' : 'zh';

window.AppConfig = {
  baseUrl: '',
  lang: lang,
};

