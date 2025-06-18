const isEn = window.location.pathname.includes('/en');
const lang = isEn ? 'en' : 'zh';

window.AppConfig = {
  oldBaseUrl:
    'https://cdn-nu-common.uniontech.com/deepin-component/v25-preview',
  baseUrl: 'https://cdn-nu-common.uniontech.com/deepin-component/v25',
  lang: lang,
};
