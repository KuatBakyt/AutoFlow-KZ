'use strict';

// Replace the studio placeholders before accepting real bookings.
// The developer number is taken from the existing neKerek portfolio demo.
const STUDIO_PHONE = '+70000000000';
const STUDIO_WHATSAPP = '70000000000';
const DEVELOPER_WHATSAPP = '77476202879';
const DEMO_NUMBER = '70000000000';

function whatsappLink(number, message = '') {
  const url = new URL('https://wa.me/' + number);
  if (message) url.searchParams.set('text', message);
  return url.href;
}

document.querySelectorAll('[data-call]').forEach(link => {
  link.href = 'tel:' + STUDIO_PHONE;
});
document.querySelector('[data-studio-chat]').href = whatsappLink(STUDIO_WHATSAPP);
document.querySelector('[data-developer-chat]').href = whatsappLink(
  DEVELOPER_WHATSAPP, 'Здравствуйте! Хочу заказать сайт по примеру AutoFlow KZ.'
);

const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#mobile-menu');
function setMenu(open) {
  menu.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
}
menuButton.addEventListener('click', () => setMenu(menu.hidden));
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || menu.hidden) return;
  setMenu(false);
  menuButton.focus();
});
matchMedia('(max-width: 880px)').addEventListener('change', () => setMenu(false));

const gallery = document.querySelector('#gallery-track');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
function moveGallery(direction) {
  const first = gallery.children[0];
  const second = gallery.children[1];
  const step = second.getBoundingClientRect().left - first.getBoundingClientRect().left;
  gallery.scrollBy({left: direction * step, behavior: reducedMotion.matches ? 'instant' : 'smooth'});
}
document.querySelector('#gallery-prev').addEventListener('click', () => moveGallery(-1));
document.querySelector('#gallery-next').addEventListener('click', () => moveGallery(1));
gallery.addEventListener('keydown', event => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  if (event.key === 'Home' || event.key === 'End') {
    gallery.scrollTo({left: event.key === 'Home' ? 0 : gallery.scrollWidth, behavior: 'instant'});
    return;
  }
  moveGallery(event.key === 'ArrowLeft' ? -1 : 1);
});

const form = document.querySelector('#booking-form');
const status = document.querySelector('#form-status');
const submit = form.querySelector('button[type="submit"]');
const date = form.elements.namedItem('date');
const service = form.elements.namedItem('service');
const optional = document.querySelector('#booking-extra');

function localDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return [year, month, day].join('-');
}
date.min = localDate();

function setStatus(state, message) {
  status.dataset.state = state;
  status.textContent = message;
}

document.querySelectorAll('[data-service]').forEach(link => {
  link.addEventListener('click', () => {
    service.value = link.dataset.service;
    service.removeAttribute('aria-invalid');
    setStatus('', '');
  });
});
form.addEventListener('input', event => {
  event.target.removeAttribute('aria-invalid');
  if (!form.hasAttribute('aria-busy')) setStatus('', '');
});
form.addEventListener('submit', event => {
  event.preventDefault();
  if (form.hasAttribute('aria-busy')) return;
  const values = Object.fromEntries(new FormData(form));
  const name = values.name.trim();
  const phone = values.phone.trim();
  const car = values.car.trim();
  const digits = phone.replace(/\D/g, '');
  const checks = [
    ['name', name.length >= 2, 'Укажите имя (минимум 2 символа).'],
    ['phone', /^[78]\d{10}$/.test(digits), 'Введите телефон: +7 или 8 и ещё 10 цифр.'],
    ['service', Boolean(values.service), 'Выберите услугу.'],
    ['date', date.validity.valid && (!values.date || values.date >= localDate()), 'Выберите сегодняшнюю или будущую дату.']
  ];
  checks.forEach(([field, valid]) => {
    form.elements.namedItem(field).setAttribute('aria-invalid', String(!valid));
  });
  const invalid = checks.find(([, valid]) => !valid);
  if (invalid) {
    if (invalid[0] === 'date') optional.open = true;
    setStatus('error', invalid[2]);
    form.elements.namedItem(invalid[0]).focus();
    return;
  }
  const message = [
    'Здравствуйте! Хочу записаться на сервис AutoFlow KZ.',
    'Имя: ' + name,
    'Телефон: ' + phone,
    'Услуга: ' + values.service,
    car && 'Автомобиль: ' + car,
    values.date && 'Предпочтительная дата: ' + values.date
  ].filter(Boolean).join('\n');
  const url = whatsappLink(STUDIO_WHATSAPP, message);
  form.setAttribute('aria-busy', 'true');
  submit.disabled = true;
  setStatus('pending', 'Подготавливаем заявку…');
  window.setTimeout(() => {
    form.removeAttribute('aria-busy');
    submit.disabled = false;
    if (STUDIO_WHATSAPP === DEMO_NUMBER) {
      setStatus('success', 'Заявка подготовлена. Для перехода в WhatsApp укажите номер сервиса.');
      return;
    }
    setStatus('success', 'Заявка подготовлена, открываем WhatsApp…');
    window.setTimeout(() => window.location.assign(url), 350);
  }, 200);
});
