'use strict';
const evaluations = [
  {code:'E154',desc:'Quality Control of Finished Product Blueberries Arrival at Destination',group:'Blueberries',fruit:true},
  {code:'E291',desc:'Quality Control of Finished Product Blueberry Stock at Destination v2',group:'Blueberries',fruit:true},
  {code:'E292',desc:'Quality Control of Finished Product Outbounds at Destination v2',group:'Blueberries',fruit:true},
  {code:'E317',desc:'EU Quality Control of Finished Product Blueberries Arrival at Destination',group:'EU',fruit:true},
  {code:'E323',desc:'EU Quality Control of Finished Product Blueberries Stock at Destination',group:'EU',fruit:true},
  {code:'E324',desc:'EU Quality Control of Finished Product Blueberry Outbounds at Destination',group:'EU',fruit:true},
  {code:'E547',desc:'PE Requerimiento Registro de Actividades Sanidad',group:'PE',fruit:false},
  {code:'E591',desc:'Quality Control of Finished Product Blueberries Organic Arrival at Destination',group:'Blueberries',fruit:true},
  {code:'E592',desc:'EU Quality Control of Finished Product Blueberries Organic Arrival at Destination',group:'EU',fruit:true},
  {code:'E593',desc:'Quality Control of Finished Product Blueberries Dispatch',group:'Blueberries',fruit:true},
  {code:'E594',desc:'EU Quality Control of Finished Product Blueberries Dispatch',group:'EU',fruit:true},
  {code:'E595',desc:'Control de calidad y registro de producto',group:'PE',fruit:true},
];
const $ = id => document.getElementById(id);
const editIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 14 6.7-6.7 2 2L10 16H8zM8 18h8M15 5h4v4"/></svg>';
let activeFilter = 'all';
let activeEvaluation = evaluations[0];
let toastTimer;
function showToast(text){const toast=$('toast');toast.textContent=text;toast.classList.remove('hidden');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.add('hidden'),3000)}
function renderCards(){
  const query=$('searchInput').value.trim().toLocaleLowerCase();
  const filtered=evaluations.filter(e=>(activeFilter==='all'||e.group===activeFilter) && `${e.code} ${e.desc}`.toLocaleLowerCase().includes(query));
  $('cardsGrid').innerHTML=filtered.map(e=>`<button type="button" class="eval-card" data-code="${e.code}" aria-label="Abrir evaluación ${e.code}: ${e.desc}"><span class="edit-circle">${editIcon}</span><span class="code">${e.code}</span><span class="desc">${e.desc}</span><span class="card-bottom"><span class="count"><span class="fruit-outline">♧</span>0</span>${e.fruit?'<span class="blueberries"><i class="berry"></i><i class="berry"></i><i class="berry"></i></span>':''}</span></button>`).join('');
  $('emptyMessage').classList.toggle('hidden',filtered.length!==0);
  $('cardsGrid').querySelectorAll('.eval-card').forEach(btn=>btn.addEventListener('click',()=>openForm(btn.dataset.code)));
}
function openForm(code){
  activeEvaluation=evaluations.find(e=>e.code===code)||evaluations[0];
  $('formTitle').textContent=activeEvaluation.code;
  $('formSubtitle').textContent=activeEvaluation.desc;
  $('formCode').value=activeEvaluation.code;
  $('evaluationForm').reset();
  $('formCode').value=activeEvaluation.code;
  $('evaluationForm').elements.fecha.value=new Date().toLocaleDateString('en-CA');
  $('formNotice').textContent='';
  $('homeView').classList.add('hidden');$('formView').classList.remove('hidden');$('quickCreate').classList.add('hidden');
  window.scrollTo({top:0,behavior:'instant'});
}
function goHome(){ $('formView').classList.add('hidden');$('homeView').classList.remove('hidden');$('quickCreate').classList.remove('hidden');window.scrollTo({top:0,behavior:'instant'}) }
$('searchInput').addEventListener('input',renderCards);
$('clearSearch').addEventListener('click',()=>{$('searchInput').value='';renderCards();$('searchInput').focus()});
$('filterBtn').addEventListener('click',()=>$('filtersPanel').classList.toggle('hidden'));
document.querySelectorAll('.filter-choice').forEach(btn=>btn.addEventListener('click',()=>{activeFilter=btn.dataset.filter;document.querySelectorAll('.filter-choice').forEach(b=>b.classList.toggle('active',b===btn));renderCards();$('filtersPanel').classList.add('hidden')}));
$('backBtn').addEventListener('click',goHome);$('cancelBtn').addEventListener('click',goHome);$('navHome').addEventListener('click',goHome);$('quickCreate').addEventListener('click',()=>openForm('E154'));
$('evaluationForm').addEventListener('submit',event=>{
 event.preventDefault();
 if(!$('evaluationForm').reportValidity())return;
 const data=Object.fromEntries(new FormData($('evaluationForm')).entries());
 const current=JSON.parse(localStorage.getItem('digiproy_registros')||'[]');current.push({...data,guardadoEn:new Date().toISOString()});localStorage.setItem('digiproy_registros',JSON.stringify(current));
 $('formNotice').textContent='Registro guardado en este navegador (modo demostración).';showToast('Evaluación guardada correctamente (demo)');
});
document.querySelectorAll('[data-nav]').forEach(b=>b.addEventListener('click',()=>showToast('Sección disponible en una próxima versión del prototipo.')));
renderCards();
