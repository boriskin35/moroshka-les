// An array of links for navigation bar
const navBarLinks = [
  { name: 'Главная', url: '/' },
  { name: 'Каталог', url: '/catalog' },
  { name: 'Блог', url: '/blog' },
  { name: 'Контакты', url: '/contact' },
];
// An array of links for footer
const footerLinks = [
  {
    section: 'Каталог',
    links: [
      { name: 'Все дома', url: '/catalog' },
      { name: 'Блог', url: '/blog' },
    ],
  },
  {
    section: 'Компания',
    links: [
      { name: 'Как мы строим', url: '/#how' },
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
