'use strict';
// Enter the client's real WhatsApp number in international format, digits only.
// Keep empty in portfolio demo mode: no personal information will be transmitted.
const WHATSAPP_NUMBER = '';
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
function closeMenu(){mobileMenu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Открыть меню');document.body.classList.remove('menu-open')}
menuButton.addEventListener('click',()=>{const opening=mobileMenu.hidden;mobileMenu.hidden=!opening;menuButton.setAttribute('aria-expanded',String(opening));menuButton.setAttribute('aria-label',opening?'Закрыть меню':'Открыть меню');document.body.classList.toggle('menu-open',opening)});
mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
const serviceSelect=document.querySelector('#service-select');
document.querySelectorAll('[data-service]').forEach(button=>button.addEventListener('click',()=>{serviceSelect.value=button.dataset.service;document.querySelector('#booking').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});setTimeout(()=>serviceSelect.focus({preventScroll:true}),400)}));
const gallery=document.querySelector('.gallery-track');
document.querySelector('#gallery-next').addEventListener('click',()=>gallery.scrollBy({left:gallery.clientWidth*.65,behavior:'smooth'}));
document.querySelector('#gallery-prev').addEventListener('click',()=>gallery.scrollBy({left:-gallery.clientWidth*.65,behavior:'smooth'}));
const dateInput=document.querySelector('#booking-date');
function localISODate(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
dateInput.min=localISODate();
const form=document.querySelector('#booking-form');const status=document.querySelector('#form-status');
form.addEventListener('input',e=>{if(e.target.matches('input,select'))e.target.removeAttribute('aria-invalid');status.textContent=''});
form.addEventListener('submit',e=>{e.preventDefault();status.textContent='';const data=new FormData(form);const name=String(data.get('name')||'').trim(),phone=String(data.get('phone')||'').trim(),car=String(data.get('car')||'').trim(),service=String(data.get('service')||'').trim(),date=String(data.get('date')||'').trim();const digits=phone.replace(/\D/g,'');const fields=[['name',name.length>=2],['phone',/^(7|8)\d{10}$/.test(digits)],['car',car.length>=2],['service',Boolean(service)],['date',Boolean(date)&&date>=localISODate()]];let firstInvalid=null;for(const [field,valid] of fields){const input=form.elements.namedItem(field);input.setAttribute('aria-invalid',String(!valid));if(!valid&&!firstInvalid)firstInvalid=input}if(firstInvalid){status.textContent='Проверьте обязательные поля. Телефон: +7 и 10 цифр, дата — не раньше сегодняшней.';firstInvalid.focus();return}if(!/^\d{10,15}$/.test(WHATSAPP_NUMBER)){status.textContent='Демо-режим: заявка проверена, но не отправлена. Для реальной отправки необходимо настроить WhatsApp компании.';return}const message=`Здравствуйте! Хочу записаться на сервис AutoFlow KZ.\nИмя: ${name}\nТелефон: ${phone}\nАвтомобиль: ${car}\nУслуга: ${service}\nПредпочтительная дата: ${date}`;const url=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;const popup=window.open(url,'_blank','noopener,noreferrer');status.textContent=popup?'Открыт WhatsApp. Отправьте подготовленное сообщение, чтобы оформить заявку.':'Разрешите открытие новой вкладки, чтобы перейти в WhatsApp.'});
document.querySelector('#mobile-contact').addEventListener('click',()=>{if(WHATSAPP_NUMBER){window.open(`https://wa.me/${WHATSAPP_NUMBER}`,'_blank','noopener,noreferrer')}else{document.querySelector('#booking').scrollIntoView({behavior:'smooth'});status.textContent='Демо-режим: WhatsApp пока не подключён.'}});
