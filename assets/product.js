/* REM Labs product detail renderer. Everything comes from products.json, so a supplier sync updates pages with no HTML edits. */
(function(){
const R=window.ROOT||'',root=document.getElementById('pdx');if(!root)return;const sku=root.dataset.sku;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const st=document.createElement('style');st.textContent=`
.gal{display:flex;gap:10px;margin-top:14px;flex-wrap:wrap}.gal img{width:76px;height:76px;object-fit:cover;border-radius:14px;border:2px solid transparent;cursor:pointer;background:#fff}.gal img.on{border-color:var(--mint)}
.mainimg{width:100%;aspect-ratio:1;object-fit:contain;background:#fff;border-radius:32px}
.opt{margin-top:22px}.opt h4{font-size:.8rem;letter-spacing:.14em;text-transform:uppercase;font-weight:500;color:var(--mute)}.opt h4 b{color:var(--ink);font-weight:500;letter-spacing:0;text-transform:none;margin-left:6px}
.sw{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px}.sw button{width:34px;height:34px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1px #ccc;cursor:pointer}.sw button.on{box-shadow:0 0 0 2px var(--mint)}
.chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.chips button{border:1px solid #d6d9d5;background:#fff;border-radius:999px;padding:8px 16px;font:inherit;font-size:.85rem;cursor:pointer}.chips button.on{background:var(--ink);color:#fff}
.flag{font-size:.78rem;color:#9a6a00;margin-top:8px}
.about{max-width:1200px;margin:0 auto;padding:0 6vw 100px}.about h2{font-size:clamp(1.6rem,3vw,2.4rem)}
.about .cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:22px;margin-top:30px}
.about .box{background:#fff;border-radius:24px;padding:28px}.about h3{font-size:1rem;font-weight:500;margin-bottom:12px}
.about ul{padding-left:18px;line-height:1.8;font-size:.92rem;color:#444}.about table{width:100%;border-collapse:collapse;font-size:.9rem}.about td{padding:9px 0;border-bottom:1px solid #eee;vertical-align:top}.about td:first-child{color:var(--mute);width:42%;padding-right:12px}
.spec-grid{display:grid;grid-template-columns:1.4fr 1fr;gap:22px;margin-top:30px}@media(max-width:760px){.spec-grid{grid-template-columns:1fr}}.about .muted{color:var(--mute);font-size:.9rem}.about .more{display:inline-block;margin-top:14px;font-size:.85rem;color:var(--ink);text-decoration:none;border-bottom:1px solid var(--mint)}.pending{background:#f3f6f3;border:1px dashed #b9cfc0;border-radius:18px;padding:16px 20px;font-size:.85rem;color:#556;margin-top:22px}`;document.head.appendChild(st);
fetch(R+'products.json').then(r=>r.json()).then(all=>{const p=all.find(x=>x.sku===sku);if(!p)return;
 const imgs=(p.images||[]).filter(i=>i&&i.src);
 if(imgs.length){const art=document.querySelector('.pd>.art');const w=document.createElement('div');
  w.innerHTML=`<img class="mainimg" id="mainimg" src="${R+esc(imgs[0].src)}" alt="${esc(imgs[0].alt||p.title)}"><div class="gal">${imgs.map((i,n)=>`<img loading="lazy" src="${R+esc(i.src)}" alt="${esc(i.alt||p.title)}" data-n="${n}" class="${n?'':'on'}">`).join('')}</div>`;
  art.replaceWith(w);w.querySelectorAll('.gal img').forEach(t=>t.onclick=()=>{w.querySelectorAll('.gal img').forEach(x=>x.classList.remove('on'));t.classList.add('on');document.getElementById('mainimg').src=t.src});
  const n=[...document.querySelectorAll('.pd .note')].find(e=>/illustration/.test(e.textContent));if(n)n.textContent='SKU REM-'+p.sku+'. Check compatibility with your exact model before ordering.'}
 // variants
 const V=p.variants||{},sel={};const buy=document.getElementById('buy');const opts=document.createElement('div');
 const upd=()=>{const pick=[sel.colour,sel.material].filter(Boolean);root.dataset.variant=pick.join(' / ');
  const flag=opts.querySelector('.flag');const d=[sel.colourObj,sel.materialObj].find(o=>o&&o.price_delta_aud);if(flag)flag.textContent=d?'Price for this option is being confirmed; checkout shows the base price for now.':'';};
 const group=(key,label,list,swatch)=>{if(!list||!list.length)return'';return`<div class="opt" data-k="${key}"><h4>${label}<b></b></h4><div class="${swatch?'sw':'chips'}">${list.map((o,i)=>swatch?`<button type="button" title="${esc(o.name)}" aria-label="${esc(o.name)}" style="background:${esc(o.hex||'#ccc')}" data-i="${i}"></button>`:`<button type="button" data-i="${i}">${esc(o.name)}</button>`).join('')}</div></div>`};
 opts.innerHTML=group('material','Material',V.materials,false)+group('colour',p.category==='Bands'?'Band colour':'Colour',V.colours,true)+'<p class="flag"></p>';
 if(opts.querySelector('.opt')){document.querySelector('.pd .price').before(opts);
  opts.querySelectorAll('.opt').forEach(g=>{const k=g.dataset.k,list=k==='colour'?V.colours:V.materials;g.querySelectorAll('button').forEach(b=>b.onclick=()=>{g.querySelectorAll('button').forEach(x=>x.classList.remove('on'));b.classList.add('on');const o=list[+b.dataset.i];sel[k]=o.name;sel[k+'Obj']=o;g.querySelector('h4 b').textContent=o.name;upd()});g.querySelector('button').click()});
  // pass the chosen option to Stripe so the order can be forwarded with the right variant (no Stripe product changes)
  if(buy)buy.addEventListener('click',e=>{if(!p.stripe_link||!root.dataset.variant)return;e.stopImmediatePropagation();const ref=(p.sku+'_'+root.dataset.variant).replace(/[^A-Za-z0-9_-]+/g,'-').slice(0,200);location.href=p.stripe_link+(p.stripe_link.includes('?')?'&':'?')+'client_reference_id='+encodeURIComponent(ref)},true)}
 // about
 const A=p.about||{},spec=Object.entries(A.specs||{});const li=a=>a&&a.length?`<ul>${a.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'';
 const boxes=[A.features&&A.features.length&&`<div class="box"><h3>Features</h3>${li(A.features)}</div>`,spec.length&&`<div class="box"><h3>Specifications</h3><table>${spec.map(([k,v])=>`<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}</table></div>`,A.in_the_box&&A.in_the_box.length&&`<div class="box"><h3>What's in the box</h3>${li(A.in_the_box)}</div>`,A.care&&A.care.length&&`<div class="box"><h3>Care</h3>${li(A.care)}</div>`].filter(Boolean);
 const specRows=spec.length?spec:[];const box=A.in_the_box||[];
 const ship=`<div class="box"><h3>Shipping</h3><ul><li>Ships to Australian addresses only.</li><li>Postage and delivery estimate shown at checkout before you pay.</li><li>Tracking emailed when the carrier provides it.</li></ul><a class="more" href="${R}shipping.html">Shipping policy →</a></div>`;
 const ret=`<div class="box"><h3>Returns</h3><ul><li>Change-of-mind returns within 30 days if unused and in original packaging.</li><li>Faulty items covered under the Australian Consumer Law.</li></ul><a class="more" href="${R}returns.html">Returns &amp; refunds →</a></div>`;
 const sec=document.createElement('section');sec.className='about';sec.style.padding='0 6vw 100px';
 sec.innerHTML=`<h2>Details &amp; specifications</h2>${A.overview?`<p class="lead">${esc(A.overview)}</p>`:''}
 <div class="spec-grid"><div class="box spec"><h3>Specifications</h3>${specRows.length?`<table>${specRows.map(([k,v])=>`<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}</table>`:'<p class="muted">Full specifications will be published once the supplier listing is confirmed.</p>'}</div>
 <div class="box"><h3>What's in the box</h3>${box.length?li(box):'<p class="muted">To be confirmed with the supplier.</p>'}</div></div>
 ${A.features&&A.features.length?`<div class="box" style="margin-top:22px"><h3>Features</h3>${li(A.features)}</div>`:''}
 <div class="cols">${ship}${ret}</div>
 ${p.info_status==='no_reseller_source_found'||p.info_status==='awaiting_supplier_data'?'<div class="pending">Photos and full specifications for this item are being confirmed with our supplier.</div>':''}`;
 document.querySelector('main.page').after(sec);
});})();
