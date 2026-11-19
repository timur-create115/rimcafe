const dishes = [
  { id: 'rim-pizza', category: 'pizza', name: 'Пицца Рим', detail: 'Курица, шампиньоны, томаты, моцарелла и базилик', price: 790, image: 'images/pizza-rim-unique.png', badge: 'Хит' },
  { id: 'margarita', category: 'pizza', name: 'Маргарита', detail: 'Томаты, моцарелла, базилик и оливковое масло', price: 550, image: 'images/pizza-rim-unique.png' },
  { id: 'philadelphia', category: 'rolls', name: 'Филадельфия', detail: 'Лосось, сливочный сыр, авокадо и огурец', price: 590, image: 'images/rolls-rim-unique.png', badge: '8 шт.' },
  { id: 'shrimp-roll', category: 'rolls', name: 'Запечённая креветка', detail: 'Креветка, сыр, огурец и нежный спайси-соус', price: 610, image: 'images/rolls-rim-unique.png', badge: '8 шт.' },
  { id: 'salad', category: 'salads', name: 'Салат с пармезаном', detail: 'Свежая зелень, томаты, огурец и лёгкая заправка', price: 420, image: 'images/salad-fresh.png', badge: 'Новинка' },
  { id: 'burger', category: 'fast', name: 'Классический бургер', detail: 'Сочная котлета, чеддер, овощи и фирменный соус', price: 520, image: 'images/burger-classic.png', badge: 'С фри' }
];

const grid = document.querySelector('[data-menu-grid]');
const tabs = [...document.querySelectorAll('[data-category]')];
const nav = document.querySelector('[data-nav]');
const navToggle = document.querySelector('[data-nav-toggle]');
const dialog = document.querySelector('[data-booking-dialog]');
const form = document.querySelector('[data-booking-form]');
const bookingContent = document.querySelector('[data-booking-content]');
const bookingSuccess = document.querySelector('[data-booking-success]');
const cartDrawer = document.querySelector('[data-cart-drawer]');
const cartBackdrop = document.querySelector('[data-cart-backdrop]');
const cartBody = document.querySelector('[data-cart-body]');
const cartFooter = document.querySelector('[data-cart-footer]');
const cartTotal = document.querySelector('[data-cart-total]');
const cartCount = document.querySelector('[data-cart-count]');
const toast = document.querySelector('[data-toast]');
let cart = [];

function renderMenu(category = 'all') {
  const visible = category === 'all' ? dishes : dishes.filter((dish) => dish.category === category);
  grid.innerHTML = visible.map((dish) => `<article class="dish-card"><div class="dish-card__image"><img src="${dish.image}" alt="${dish.name}" />${dish.badge ? `<span>${dish.badge}</span>` : ''}</div><div class="dish-card__body"><h3>${dish.name}</h3><p>${dish.detail}</p><div class="dish-card__bottom"><strong>${dish.price.toLocaleString('ru-RU')} ₽</strong><button type="button" data-add="${dish.id}" aria-label="Добавить ${dish.name} в корзину">В корзину</button></div></div></article>`).join('');
}

tabs.forEach((tab) => tab.addEventListener('click', () => {
  tabs.forEach((item) => { item.classList.remove('is-active'); item.setAttribute('aria-selected', 'false'); });
  tab.classList.add('is-active'); tab.setAttribute('aria-selected', 'true'); renderMenu(tab.dataset.category);
}));

navToggle.addEventListener('click', () => { const open = nav.classList.toggle('is-open'); navToggle.setAttribute('aria-expanded', String(open)); });
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { nav.classList.remove('is-open'); navToggle.setAttribute('aria-expanded', 'false'); }));

function openBooking() { bookingContent.hidden = false; bookingSuccess.hidden = true; dialog.showModal(); }
document.querySelectorAll('[data-open-booking]').forEach((button) => button.addEventListener('click', openBooking));
document.querySelectorAll('[data-close-booking]').forEach((button) => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
form.addEventListener('submit', (event) => { event.preventDefault(); if (!form.checkValidity()) return form.reportValidity(); bookingContent.hidden = true; bookingSuccess.hidden = false; form.reset(); });
function renderCart() {
  const amount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = quantity;
  cartFooter.hidden = !cart.length;
  cartTotal.textContent = `${amount.toLocaleString('ru-RU')} ₽`;
  cartBody.innerHTML = cart.length ? cart.map((item) => `<article class="cart-item"><img src="${item.image}" alt="" /><div><h3>${item.name}</h3><p>${item.price.toLocaleString('ru-RU')} ₽</p><div class="quantity"><button type="button" data-quantity="${item.id}" data-change="-1" aria-label="Уменьшить количество">−</button><span>${item.quantity}</span><button type="button" data-quantity="${item.id}" data-change="1" aria-label="Увеличить количество">+</button></div></div><button class="remove" type="button" data-remove="${item.id}" aria-label="Удалить ${item.name}">×</button></article>`).join('') : '<div class="cart-empty"><span>⌂</span><h3>Корзина пока пуста</h3><p>Добавьте любимые блюда из меню.</p></div>';
}
function setCart(open) { cartDrawer.classList.toggle('is-open', open); cartBackdrop.classList.toggle('is-open', open); cartDrawer.setAttribute('aria-hidden', String(!open)); document.body.classList.toggle('no-scroll', open); }
function showToast(message) { toast.textContent = message; toast.classList.add('is-visible'); window.setTimeout(() => toast.classList.remove('is-visible'), 2800); }
grid.addEventListener('click', (event) => { const button = event.target.closest('[data-add]'); if (!button) return; const dish = dishes.find((item) => item.id === button.dataset.add); const existing = cart.find((item) => item.id === dish.id); if (existing) existing.quantity += 1; else cart.push({ ...dish, quantity: 1 }); renderCart(); showToast('Блюдо добавлено в корзину'); });
cartBody.addEventListener('click', (event) => { const quantityButton = event.target.closest('[data-quantity]'); const removeButton = event.target.closest('[data-remove]'); if (quantityButton) { const item = cart.find((entry) => entry.id === quantityButton.dataset.quantity); item.quantity += Number(quantityButton.dataset.change); if (item.quantity < 1) cart = cart.filter((entry) => entry.id !== item.id); } if (removeButton) cart = cart.filter((item) => item.id !== removeButton.dataset.remove); renderCart(); });
document.querySelectorAll('[data-open-cart]').forEach((button) => button.addEventListener('click', () => setCart(true)));
document.querySelectorAll('[data-close-cart]').forEach((button) => button.addEventListener('click', () => setCart(false)));
cartBackdrop.addEventListener('click', () => setCart(false));
document.querySelector('[data-demo-order]').addEventListener('click', () => { setCart(false); showToast('Демо-заказ оформлен — данные никуда не отправлены.'); });
document.querySelector('[data-year]').textContent = new Date().getFullYear();
renderMenu();
renderCart();
