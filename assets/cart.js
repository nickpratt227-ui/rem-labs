const Cart=(()=>{let P={};const K='remlabs_cart';const get=()=>JSON.parse(localStorage.getItem(K)||'{}');const set=c=>{localStorage.setItem(K,JSON.stringify(c));render()};
const soon=b=>{b.textContent='Coming soon';b.classList.add('soon');b.disabled=true};
function render(){const c=get(),el=document.getElementById('items');let n=0,s=0,h='';for(const k in c){const p=P[k];if(!p)continue;n+=c[k];s+=c[k]*p.price_aud;h+=`<div class="ci"><span>${p.title}<br><small>${c[k]} × A$${p.price_aud.toFixed(2)}</small></span><button onclick="Cart.rm('${k}')">Remove</button></div>`}
document.getElementById('cc').textContent=n;el.innerHTML=h||'<p class="note">Your cart is empty.</p>';document.getElementById('sub').textContent='A$'+s.toFixed(2);
const co=document.getElementById('checkout'),ks=Object.keys(c);co.disabled=false;co.classList.remove('soon');co.textContent='Checkout';
if(!ks.length){co.disabled=true;co.classList.add('soon')}else if(ks.length==1&&P[ks[0]].stripe_link){co.onclick=()=>location.href=P[ks[0]].stripe_link}else{soon(co)}}
fetch((window.ROOT||'')+'products.json').then(r=>r.json()).then(d=>{d.forEach(p=>P[p.sku]=p);render();const b=document.getElementById('buy');if(b){const p=P[b.dataset.sku];if(p&&p.stripe_link)b.onclick=()=>location.href=p.stripe_link;else soon(b)}});
return{add(k,q=1){const c=get();c[k]=(c[k]||0)+q;set(c);this.open()},rm(k){const c=get();delete c[k];set(c)},open(){document.getElementById('drawer').classList.add('open')},close(){document.getElementById('drawer').classList.remove('open')}}})();
// Heartbeat rating: only from our own reviews.json (no third-party totals)
fetch((window.ROOT||'')+'reviews.json').then(r=>r.json()).catch(()=>[]).then(d=>{document.querySelectorAll('.hb').forEach(el=>{const rs=(d||[]).filter(x=>x.sku==el.dataset.sku&&x.rating>=1&&x.rating<=5);
let path='M0 13 H110',txt='No reviews yet';if(rs.length){const a=rs.reduce((s,x)=>s+x.rating,0)/rs.length,n=Math.round(a);path='M0 13';const w=110/5;for(let i=0;i<5;i++){const x=i*w;path+=i<n?` L${x+6} 13 L${x+9} 3 L${x+12} 23 L${x+15} 13 L${x+w} 13`:` L${x+w} 13`}el.classList.add('on');txt=`${a.toFixed(1)} / 5 · ${rs.length} review${rs.length>1?'s':''}`}
el.innerHTML=`<svg viewBox="0 0 110 26" aria-hidden="true"><path d="${path}"/></svg><span>${txt}</span>`;el.setAttribute('aria-label',txt)})});
