(()=>{
const root=document.getElementById('ing');if(!root)return;
const SYS={
nerve:{t:'Nervous system',d:'The brain, spinal cord and nerves. Nerves carry electrical and chemical signals between the brain and the rest of the body, controlling movement, senses, breathing and heart rate.',src:'https://www.healthdirect.gov.au/nervous-system'},
heart:{t:'Heart & circulation',d:'The heart pumps blood through arteries, veins and capillaries, carrying oxygen and nutrients to every cell and taking waste away. Electrolytes such as sodium and potassium help keep fluid levels balanced.',src:'https://www.healthdirect.gov.au/circulatory-system'},
gut:{t:'Digestive system',d:'The mouth, stomach, intestines and supporting organs break food down into nutrients the body can absorb, and remove what it can\u2019t use.',src:'https://www.healthdirect.gov.au/digestive-system'},
muscle:{t:'Muscles',d:'More than 600 muscles move the skeleton, keep you upright and power the heart and gut. They contract when nerves signal them to.',src:'https://www.healthdirect.gov.au/bones-muscles-and-joints'},
bone:{t:'Bones',d:'The skeleton supports and protects the body, anchors muscles, makes blood cells in the marrow and stores minerals such as calcium.',src:'https://www.healthdirect.gov.au/bones-muscles-and-joints'}};
const $=s=>root.querySelector(s),body=$('#ing-body'),panel=$('#ing-panel'),list=$('#ing-list'),tip=$('#ing-tip'),dlg=document.getElementById('ing-modal');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function light(sys,label){body.querySelectorAll('[data-sys]').forEach(g=>g.classList.toggle('on',sys.includes(g.dataset.sys)));root.querySelectorAll('.sysbtn').forEach(b=>b.setAttribute('aria-pressed',sys.length==1&&sys[0]==b.dataset.s));
 if(!sys.length){panel.innerHTML=`<h3>${esc(label||'Explore the body')}</h3><p>${label?'This ingredient isn\u2019t tied to one body system in our guide; it\u2019s found throughout the body\u2019s cells.':'Pick a body system or an ingredient to see where it sits in the body.'}</p><p class="fine">Educational anatomy only. Not a claim about any product.</p>`;return}
 panel.innerHTML=(label?`<p class="eyebrow">${esc(label)} \u00b7 where it\u2019s found or used</p>`:'')+sys.map(s=>`<h3>${SYS[s].t}</h3><p>${SYS[s].d}</p><p class="fine">Source: <a href="${SYS[s].src}" target="_blank" rel="noopener">healthdirect Australia</a></p>`).join('')+`<p class="fine">Educational anatomy only. This doesn\u2019t mean any product affects this system.</p>`}
root.querySelectorAll('.sysbtn').forEach(b=>b.onclick=()=>light([b.dataset.s]));
const cats=['All','Vitamins','Minerals','Longevity'];let cat='All',DATA=[];
$('#ing-cats').innerHTML=cats.map(c=>`<button class="chip" data-c="${c}" aria-pressed="${c=='All'}">${c}</button>`).join('');
$('#ing-cats').onclick=e=>{const b=e.target.closest('.chip');if(!b)return;cat=b.dataset.c;$('#ing-cats').querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed',x==b));draw()};
function draw(){let L='',h='';DATA.filter(d=>cat=='All'||d.cat==cat).forEach(d=>{const f=d.name[0].toUpperCase();if(f!=L){L=f;h+=`<li class="L" id="az-${f}">${f}</li>`}h+=`<li><button class="it" data-id="${d.id}"><img src="${d.img}" alt="" loading="lazy" width="28" height="28"><span>${esc(d.name)}</span><small>${d.cat}</small></button></li>`});list.innerHTML=h}
list.addEventListener('mousemove',e=>{const b=e.target.closest('.it');if(!b||matchMedia('(hover:none)').matches){tip.hidden=true;return}const d=DATA.find(x=>x.id==b.dataset.id);tip.src=d.img;tip.hidden=false;const r=root.getBoundingClientRect();tip.style.left=(e.clientX-r.left+18)+'px';tip.style.top=(e.clientY-r.top-40)+'px'});
list.addEventListener('mouseleave',()=>tip.hidden=true);
list.addEventListener('click',e=>{const b=e.target.closest('.it');if(b)open(b.dataset.id)});
function open(id){const d=DATA.find(x=>x.id==id);tip.hidden=true;light(d.systems,d.name);
 const br=d.brands.length?d.brands.map(b=>`<a class="go" href="${({Tmrw:'https://drinktmrw.com/en-au/ingredients'})[b]}" target="_blank" rel="sponsored noopener">${b} ingredients page</a>`).join(''):'';
 dlg.querySelector('.mc').innerHTML=`<img src="${d.img}" alt="${esc(d.sources)}" width="240" height="240"><div><p class="eyebrow">${d.cat}</p><h3>${esc(d.name)}</h3><p>${esc(d.what)}</p><p><b>Common sources:</b> ${esc(d.sources)}</p><p><b>Common forms:</b> ${esc(d.forms)}</p><p><b>Listed by:</b> ${d.brands.length?d.brands.join(', ')+' (on their published ingredient lists, checked 3 Nov 2026)':'Not on the Tmrw ingredient list we checked'}</p>${d.systems.length?`<p><b>Where it\u2019s found or used in the body:</b> ${d.systems.map(s=>SYS[s].t).join(', ')}</p>`:''}<div class="links">${br}<a class="go dark" data-affiliate="iherb" data-aff-url="${esc(d.aff_url)}" href="${d.aff_url||(window.iherbUrl?iherbUrl(d.iherb_url):d.iherb_url)}" target="_blank" rel="sponsored noopener">${d.iherb_kind=='product'?'Find on iHerb':'Search iHerb'}</a></div><p class="fine">General information only, not medical advice. Read the label and talk to your doctor or pharmacist before taking a supplement.</p></div>`;
 dlg.showModal?dlg.showModal():dlg.setAttribute('open','')}
dlg.addEventListener('click',e=>{if(e.target==dlg||e.target.closest('.mx'))dlg.close()});
fetch((window.ROOT||'')+'ingredients.json').then(r=>r.json()).then(d=>{DATA=d;draw();const q=location.hash.match(/ing-preview=([\w-]+)/);if(q)open(q[1]);if(/sys-preview/.test(location.hash))light(['nerve','heart'])});
light([]);
})();

/* compact A-Z list with popovers */
(function(){var R=window.ROOT||'',ul=document.getElementById('ing-more'),pop=document.getElementById('ing-pop'),wrap=document.getElementById('ing-more-wrap');if(!ul)return;
function e(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var cur=null,hideT;
function show(b,d){clearTimeout(hideT);cur=b;var u=d.iherb_url?(window.iherbUrl?iherbUrl(d.iherb_url):d.iherb_url):'';
pop.innerHTML='<b>'+e(d.name)+'</b>'+e(d.what)+'<br><span style="opacity:.7">Found in: '+e(d.sources)+'</span><br><span style="opacity:.7">Listed by: '+e(d.brands)+'</span>'+(u?'<br><a href="'+e(u)+'" target="_blank" rel="sponsored noopener" data-affiliate="iherb">Example on iHerb</a>':'');
pop.hidden=false;var r=b.getBoundingClientRect(),w=wrap.getBoundingClientRect();pop.style.left=Math.max(0,Math.min(r.left-w.left,w.width-300))+'px';pop.style.top=(r.bottom-w.top+6)+'px';b.setAttribute('aria-expanded','true')}
function hide(){hideT=setTimeout(function(){pop.hidden=true;if(cur)cur.setAttribute('aria-expanded','false');cur=null},250)}
pop.addEventListener('mouseenter',function(){clearTimeout(hideT)});pop.addEventListener('mouseleave',hide);
fetch(R+'ingredients_more.json').then(function(r){return r.json()}).then(function(L){L.sort(function(a,b){return a.name.localeCompare(b.name)});
L.forEach(function(d){var li=document.createElement('li'),b=document.createElement('button');b.type='button';b.textContent=d.name;b.setAttribute('aria-expanded','false');
b.addEventListener('mouseenter',function(){if(matchMedia('(hover:hover)').matches)show(b,d)});b.addEventListener('mouseleave',function(){if(matchMedia('(hover:hover)').matches)hide()});
b.addEventListener('click',function(ev){ev.stopPropagation();if(cur===b&&!pop.hidden){pop.hidden=true;cur=null}else show(b,d)});b.addEventListener('focus',function(){show(b,d)});b.addEventListener('blur',hide);
li.appendChild(b);ul.appendChild(li)});
if(location.hash=='#more-preview'){var f=ul.querySelector('button');f.scrollIntoView({block:'center'});show(f,L[0])}});
document.addEventListener('click',function(ev){if(!pop.contains(ev.target)){pop.hidden=true;cur=null}});
document.addEventListener('keydown',function(ev){if(ev.key=='Escape'){pop.hidden=true;cur=null}})})();
