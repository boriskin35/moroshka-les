// An array of links for navigation bar
const navBarLinks = [
  { name: 'Главная', url: '/' },
  { name: 'Каталог', url: '/products' },
  { name: 'Как строим', url: '/services' },
  { name: 'Квиз', url: '/products' },
  { name: 'Калькулятор', url: '/products' },
  { name: 'Контакты', url: '/contact' },
];
// An array of links for footer
const footerLinks = [
  {
    section: 'Каталог',
    links: [
      { name: 'Все дома', url: '/products' },
      { name: 'Дома до 40 м²', url: '/products' },
      { name: 'Дома от 60 м²', url: '/products' },
    ],
  },
  {
    section: 'Компания',
    links: [
      { name: 'О нас', url: '/services' },
      { name: 'Блог', url: '/blog' },
      { name: 'Как мы строим', url: '/services' },
      { name: 'Контакты', url: '/contact' },
    ],
  },
];
// An object of links for social icons
const socialLinks = {
  telegram: 'https://t.me/moroshkales',
  instagram: 'https://instagram.com/moroshkales',
};

export default {
  navBarLinks,
  footerLinks,
  socialLinks,
};
