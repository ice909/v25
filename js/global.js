const isEn = window.location.pathname.includes('/en');
const lang = isEn ? 'en' : 'zh';

window.AppConfig = {
  baseUrl: 'https://cdn-nu-common.uniontech.com/deepin-component/v25-preview',
  lang: lang,
};

