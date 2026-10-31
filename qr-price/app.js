const services = [
['Замена моторного масла','ТО',5000,'30–45 мин','Без стоимости масла и фильтра'],
['Замена воздушного фильтра','ТО',2000,'15–20 мин','Для большинства легковых автомобилей'],
['Замена салонного фильтра','ТО',2500,'20–30 мин','Доступ к фильтру влияет на стоимость'],
['Замена свечей зажигания','ТО',6000,'30–60 мин','Стоимость зависит от двигателя'],
['Компьютерная диагностика','Диагностика',7000,'30–45 мин','Считывание ошибок и рекомендации'],
['Диагностика ходовой части','Диагностика',4000,'20–30 мин','Осмотр подвески на подъёмнике'],
['Проверка аккумулятора','Диагностика',2000,'15 мин','Проверка заряда и пусковых характеристик'],
['Замена тормозных колодок','Тормоза',8000,'40–60 мин','За одну ось, без стоимости колодок'],
['Замена тормозных дисков','Тормоза',12000,'60–90 мин','За одну ось, без запчастей'],
['Замена тормозной жидкости','Тормоза',7000,'40–60 мин','Без стоимости жидкости'],
['Замена амортизатора','Подвеска',10000,'60–90 мин','За одну сторону, без запчастей'],
['Замена стойки стабилизатора','Подвеска',4000,'30–45 мин','За одну сторону, без запчастей'],
['Шиномонтаж R15–R16','Шины',10000,'40–60 мин','Комплект из четырёх колёс, с балансировкой'],
['Шиномонтаж R17–R18','Шины',14000,'40–60 мин','Комплект из четырёх колёс, с балансировкой'],
['Ремонт прокола шины','Шины',3000,'20–30 мин','Метод ремонта определяет мастер']
];
const selected = new Set(); let category='Все услуги';
const money = n => n.toLocaleString('ru-RU')+' ₸';
const filters=document.querySelector('#filters');
['Все услуги',...new Set(services.map(s=>s[1]))].forEach(name=>{const b=document.createElement('button');b.textContent=name;b.type='button';b.setAttribute('aria-pressed',String(name===category));b.onclick=()=>{category=name;filters.querySelectorAll('button').forEach(el=>el.setAttribute('aria-pressed',String(el===b)));render();};filters.append(b);});
function render(){
 const query=document.querySelector('#search').value.trim().toLocaleLowerCase('ru'); const results=document.querySelector('#results');results.replaceChildren();
 services.forEach((s,i)=>{if(category!=='Все услуги'&&s[1]!==category)return;if(!s.join(' ').toLocaleLowerCase('ru').includes(query))return;
 const row=document.createElement('article');row.className='service';row.innerHTML=`<div><h3>${s[0]}</h3><p>${s[3]} · ${s[4]}</p></div><div class="price"><small>от </small>${money(s[2])}</div><button class="add" type="button" aria-pressed="${selected.has(i)}" aria-label="${selected.has(i)?'Убрать':'Добавить'}: ${s[0]}">${selected.has(i)?'✓':'+'}</button>`;row.querySelector('button').onclick=()=>{selected.has(i)?selected.delete(i):selected.add(i);render();};results.append(row);});
 if(!results.children.length){const p=document.createElement('p');p.className='empty';p.textContent='Ничего не найдено. Попробуйте другое название или категорию.';results.append(p);}
 const list=document.querySelector('#selected');list.replaceChildren();
 if(!selected.size){list.innerHTML='<p class="empty">Добавьте услуги из прайса.<br>Здесь появится ваш список работ.</p>';}
 selected.forEach(i=>{const row=document.createElement('div');row.className='selected-row';row.innerHTML=`<span>${services[i][0]}<br><b>от ${money(services[i][2])}</b></span><button type="button" aria-label="Удалить: ${services[i][0]}">×</button>`;row.querySelector('button').onclick=()=>{selected.delete(i);render();};list.append(row);});
 document.querySelector('#total').textContent=(selected.size?'от ':'')+money([...selected].reduce((a,i)=>a+services[i][2],0));document.querySelector('#send').disabled=!selected.size;document.querySelector('#clear').hidden=!selected.size;
}
document.querySelector('#search').addEventListener('input',render);
document.querySelector('#clear').onclick=()=>{selected.clear();render();};
document.querySelector('#send').onclick=()=>{const car=document.querySelector('#car').value.trim();const comment=document.querySelector('#comment').value.trim();const total=[...selected].reduce((a,i)=>a+services[i][2],0);const msg=`Здравствуйте! Тестирую демонстрационный QR-прайс AutoFlow.\nАвтомобиль: ${car||'Уточню при общении'}\nРаботы:\n${[...selected].map(i=>'• '+services[i][0]+' — от '+money(services[i][2])).join('\n')}\nПредварительно: от ${money(total)} (без запчастей).\n${comment?'Комментарий: '+comment:''}\nХочу уточнить стоимость и время.`;window.open('https://wa.me/77476202879?text='+encodeURIComponent(msg),'_blank','noopener,noreferrer');document.querySelector('#status').textContent='Заявка не отправлена автоматически. Подтвердите отправку в WhatsApp.';};
document.querySelector('#question').href='https://wa.me/77476202879?text='+encodeURIComponent('Здравствуйте! Интересует демонстрационный QR-прайс для автосервиса.');
const dialog=document.querySelector('#qr-dialog');document.querySelectorAll('.qr-trigger').forEach(b=>b.onclick=()=>dialog.showModal());document.querySelector('#close-qr').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
document.querySelector('#copy-link').onclick=async()=>{try{await navigator.clipboard.writeText('https://autoflow-price.vercel.app');document.querySelector('#copy-status').textContent='Ссылка скопирована';}catch{document.querySelector('#copy-status').textContent='Скопируйте адрес из строки браузера.';}};
document.addEventListener('keydown',e=>{if(e.key==='/'&&!dialog.open&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();document.querySelector('#search').focus();}});render();
