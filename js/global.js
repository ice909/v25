const isEn = window.location.pathname.includes('/en');

window.AppConfig = {
  oldBaseUrl:
    'https://cdn-nu-common.uniontech.com/deepin-component/v25-preview',
  baseUrl: 'https://cdn-nu-common.uniontech.com/deepin-component/v25',
  lang: isEn ? 'en' : 'zh',
};
