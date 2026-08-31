// An array of links for navigation bar
const navBarLinks = [
  { name: 'Главная', url: '/' },
  { name: 'Каталог', url: '/catalog' },
  { name: 'Как строим', url: '/services' },
  { name: 'Квиз', url: '/quiz' },
  { name: 'Калькулятор', url: '/calculator' },
  { name: 'Контакты', url: '/contact' },
];
// An array of links for footer
const footerLinks = [
  {
    section: 'Каталог',
    links: [
      { name: 'Все дома', url: '/catalog' },
      { name: 'Квиз: Подбор дома', url: '/quiz' },
      { name: 'Калькулятор стоимости', url: '/calculator' },
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
