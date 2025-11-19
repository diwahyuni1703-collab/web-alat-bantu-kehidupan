// Dashboard Kehidupan Sehari-hari - app.js
const STORE_KEY = 'life_dashboard_v1';
let state = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
if(!state.todos) state.todos=[];
if(!state.notes) state.notes=[];
if(!state.plans) state.plans=[];
if(!state.habits) state.habits=[];
if(!state.shop) state.shop=[];
if(!state.expenses) state.expenses=[];

function save(){ localStorage.setItem(STORE_KEY, JSON.stringify(state)); renderAll(); }
function formatMoney(n){ return 'Rp ' + Number(n||0).toLocaleString('id-ID'); }
function todayLabel(){ const d=new Date(); return d.toLocaleString('id-ID',{weekday:'long',day:'numeric',month:'short',year:'numeric'}); }
document.getElementById('today').textContent = todayLabel();

// TODOs
const todoInput = document.getElementById('todoInput');
const todoTag = document.getElementById('todoTag');
const todoList = document.getElementById('todoList');

document.getElementById('addTodo').onclick = ()=>{ const t = todoInput.value.trim(); if(!t) return; state.todos.push({id:Date.now(),text:t,tag:todoTag.value,done:false}); todoInput.value=''; save(); }

function toggleTodo(id){ const it = state.todos.find(x=>x.id==id); if(it){it.done=!it.done; save();} }
function removeTodo(id){ state.todos = state.todos.filter(x=>x.id!=id); save(); }

// Plans
const planText = document.getElementById('planText');
const planTime = document.getElementById('planTime');
const plansEl = document.getElementById('plans');

document.getElementById('addPlan').onclick = ()=>{ const t = planText.value.trim(); const time = planTime.value; if(!t) return; state.plans.push({id:Date.now(),text:t,time:time}); planText.value=''; planTime.value=''; save(); }
function removePlan(id){ state.plans = state.plans.filter(x=>x.id!=id); save(); }

// Notes
const noteText = document.getElementById('noteText');
const notesList = document.getElementById('notesList');

document.getElementById('saveNote').onclick = ()=>{ const t = noteText.value.trim(); if(!t) return; state.notes.unshift({id:Date.now(),text:t}); noteText.value=''; save(); }
document.getElementById('clearNotes').onclick = ()=>{ if(confirm('Hapus semua catatan?')){ state.notes=[]; save(); } }

// Shopping
const shopInput = document.getElementById('shopInput');
const shopList = document.getElementById('shopList');

document.getElementById('addShop').onclick = ()=>{ const t=shopInput.value.trim(); if(!t) return; state.shop.push({id:Date.now(),text:t,checked:false}); shopInput.value=''; save(); }
function toggleShop(id){ const it=state.shop.find(x=>x.id==id); if(it){it.checked=!it.checked; save();} }
function removeShop(id){ state.shop=state.shop.filter(x=>x.id!=id); save(); }

// Expenses
const expText = document.getElementById('expText');
const expAmount = document.getElementById('expAmount');
const expensesEl = document.getElementById('expenses');

document.getElementById('addExp').onclick = ()=>{ const t = expText.value.trim(); const a = Number(expAmount.value||0); if(!t || !a) return; state.expenses.unshift({id:Date.now(),text:t,amount:a}); expText.value=''; expAmount.value=''; save(); }
function removeExp(id){ state.expenses = state.expenses.filter(x=>x.id!=id); save(); }

// Habits
const habitsEl = document.getElementById('habits');
const habitName = document.getElementById('habitName');

document.getElementById('addHabit').onclick = ()=>{ const name = habitName.value.trim(); if(!name) return; state.habits.push({id:Date.now(),name,records:{}}); habitName.value=''; save(); }
function toggleHabitDay(hid,day){ const h = state.habits.find(x=>x.id==hid); if(!h) return; h.records[day] = !h.records[day]; save(); }
function removeHabit(hid){ state.habits = state.habits.filter(x=>x.id!=hid); save(); }

// Timer
let timerInterval=null; let timerRemaining=0;
document.getElementById('startTimer').onclick = ()=>{ const mins = Number(document.getElementById('timerMin').value||0); if(!mins) return alert('Masukkan menit'); timerRemaining = mins*60; if(timerInterval) clearInterval(timerInterval); timerInterval = setInterval(()=>{ if(timerRemaining<=0){ clearInterval(timerInterval); timerInterval=null; document.getElementById('timerStatus').textContent='Selesai!'; try{ new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=').play(); }catch(e){} } else { timerRemaining--; const m=Math.floor(timerRemaining/60); const s=timerRemaining%60; document.getElementById('timerStatus').textContent=`Tersisa ${m}m ${s}s`; } },1000); }
document.getElementById('stopTimer').onclick = ()=>{ if(timerInterval) clearInterval(timerInterval); timerInterval=null; document.getElementById('timerStatus').textContent='Dihentikan.'; }

// Converter
document.getElementById('doConv').onclick = ()=>{ const a = Number(document.getElementById('convA').value||0); const t = document.getElementById('convType').value; let r='—'; if(t=='*') r = a*2; if(t=='/') r = a/2; if(t=='%') r = a*0.1; document.getElementById('convRes').textContent = r; }

// Weather (Open-Meteo)
document.getElementById('getWeather').onclick = async ()=>{ if(!navigator.geolocation) return alert('Geolocation tidak didukung di peramban Anda'); document.getElementById('weather').textContent = 'Mencari lokasi...'; navigator.geolocation.getCurrentPosition(async pos=>{ const lat = pos.coords.latitude, lon = pos.coords.longitude; try{ const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`); const data = await res.json(); if(data.current_weather){ document.getElementById('weatherCard').classList.remove('hidden'); document.getElementById('weatherPlace').textContent = `Lat ${lat.toFixed(2)}, Lon ${lon.toFixed(2)}`; document.getElementById('weatherMain').textContent = `${data.current_weather.temperature}°C — kode:${data.current_weather.weathercode}`; document.getElementById('weatherDetails').textContent = `Kecepatan angin ${data.current_weather.windspeed} m/s, arah ${data.current_weather.winddirection}°`; document.getElementById('weather').textContent = ''; } else { document.getElementById('weather').textContent = 'Gagal mendapatkan cuaca.' } }catch(e){ document.getElementById('weather').textContent = 'Terjadi error: '+e.message } }, err=>{ document.getElementById('weather').textContent = 'Izin lokasi ditolak atau tidak tersedia.' }); };
document.getElementById('clearWeather').onclick = ()=>{ document.getElementById('weatherCard').classList.add('hidden'); document.getElementById('weather').textContent='Klik tombol di bawah untuk mendapatkan cuaca (butuh izin lokasi).'; }

// Export / Import
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFile = document.getElementById('importFile');
exportBtn.onclick = ()=>{ const blob = new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='life-dashboard-export.json'; a.click(); URL.revokeObjectURL(url); }
importBtn.onclick = ()=> importFile.click();
importFile.onchange = ()=>{ const f = importFile.files[0]; if(!f) return; const r = new FileReader(); r.onload = ()=>{ try{ const obj = JSON.parse(r.result); if(confirm('Ganti data lokal dengan data dari file?')){ state = obj; save(); alert('Data diimport.'); } }catch(e){ alert('File tidak valid'); } }; r.readAsText(f); }

// Render
function renderAll(){ renderTodos(); renderPlans(); renderNotes(); renderShop(); renderExpenses(); renderHabits(); }
function renderTodos(){ todoList.innerHTML=''; state.todos.forEach(t=>{ const li = document.createElement('li'); li.className='todo-item card'; if(t.done) li.classList.add('done'); li.innerHTML = `<input type='checkbox' ${t.done?'checked':''} onchange='window.toggleTodo(${t.id})' /> <div style="flex:1"><strong>${escapeHtml(t.text)}</strong><div class='small-muted'>${t.tag}</div></div><div class='right'><button onclick='window.removeTodo(${t.id})' class='btn-ghost'>Hapus</button></div>`; todoList.appendChild(li); }); }
function renderPlans(){ plansEl.innerHTML=''; state.plans.sort((a,b)=> (a.time||'').localeCompare(b.time||'')).forEach(p=>{ const li = document.createElement('li'); li.className='card row'; li.style.marginTop='8px'; li.innerHTML = `<div style='min-width:80px' class='pill'>${p.time||'—'}</div><div style='flex:1'>${escapeHtml(p.text)}</div><div class='right'><button onclick='window.removePlan(${p.id})' class='btn-ghost'>Hapus</button></div>`; plansEl.appendChild(li); }); }
function renderNotes(){ notesList.innerHTML=''; state.notes.forEach(n=>{ const d=document.createElement('div'); d.className='card'; d.style.marginTop='8px'; d.innerHTML = `<div style='display:flex;align-items:start;gap:10px'><div style='flex:1'>${escapeHtml(n.text)}</div><div><button onclick='(function(){state.notes=state.notes.filter(x=>x.id!=${n.id}); save();})()' class='btn-ghost'>Hapus</button></div></div>`; notesList.appendChild(d); }); }
function renderShop(){ shopList.innerHTML=''; state.shop.forEach(s=>{ const li=document.createElement('li'); li.className='row'; li.style.marginTop='6px'; li.innerHTML = `<label style='display:flex;align-items:center;gap:8px;flex:1'><input type='checkbox' ${s.checked?'checked':''} onchange='window.toggleShop(${s.id})'/> <span ${s.checked?"style='text-decoration:line-through;opacity:0.6'":""}>${escapeHtml(s.text)}</span></label><div><button onclick='window.removeShop(${s.id})' class='btn-ghost'>Hapus</button></div>`; shopList.appendChild(li); }); }
function renderExpenses(){ expensesEl.innerHTML=''; let total=0; state.expenses.forEach(e=>{ total += Number(e.amount||0); const d = document.createElement('div'); d.className='row card'; d.style.marginTop='8px'; d.innerHTML = `<div style='flex:1'><strong>${escapeHtml(e.text)}</strong><div class='small-muted'>${new Date(e.id).toLocaleString('id-ID')}</div></div><div style='min-width:110px;text-align:right'>${formatMoney(e.amount)}<div style='margin-top:6px'><button onclick='window.removeExp(${e.id})' class='btn-ghost'>Hapus</button></div></div>`; expensesEl.appendChild(d); }); document.getElementById('expTotal').textContent = formatMoney(total); }
function renderHabits(){ habitsEl.innerHTML=''; const days = getLast7Days(); state.habits.forEach(h=>{ const card = document.createElement('div'); card.className='card'; card.style.marginTop='8px'; let row = `<div style='display:flex;align-items:center;gap:8px'><strong>${escapeHtml(h.name)}</strong><div class='right'><button onclick='window.removeHabit(${h.id})' class='btn-ghost'>Hapus</button></div></div><div style='display:flex;gap:6px;margin-top:8px'>`; days.forEach(d=>{ const checked = h.records && h.records[d.key]; row += `<button onclick='window.toggleHabitDay(${h.id},"${d.key}")' class='btn-ghost' style='min-width:42px;padding:6px;border-radius:8px'>${d.label}${checked?" ✅":""}</button>`; }); row += '</div>'; card.innerHTML=row; habitsEl.appendChild(card); }); }
function getLast7Days(){ const out=[]; for(let i=6;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i); const key = d.toISOString().slice(0,10); out.push({key,label:d.toLocaleDateString('id-ID',{weekday:'short',day:'numeric'})}); } return out; }
function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;').replace(/\'/g,'&#039;'); }

// Expose functions for inline handlers
window.toggleTodo = toggleTodo; window.removeTodo = removeTodo; window.removePlan = removePlan; window.toggleShop = toggleShop; window.removeShop = removeShop; window.removeExp = removeExp; window.toggleHabitDay = toggleHabitDay; window.removeHabit = removeHabit;

// Initial render
renderAll();
