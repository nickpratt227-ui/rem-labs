const Cart=(()=>{let P={};const K='remlabs_cart';const get=()=>JSON.parse(localStorage.getItem(K)||'{}');const set=c=>{localStorage.setItem(K,JSON.stringify(c));render()};
const soon=b=>{b.textContent='Coming soon';b.classList.add('soon');b.disabled=true};
function render(){const c=get(),el=document.getElementById('items');let n=0,s=0,h='';for(const k in c){const p=P[k];if(!p)continue;n+=c[k];s+=c[k]*p.price_aud;h+=`<div class="ci"><span>${p.title}<br><small>${c[k]} × A$${p.price_aud.toFixed(2)}</small></span><button onclick="Cart.rm('${k}')">Remove</button></div>`}
document.getElementById('cc').textContent=n;el.innerHTML=h||'<p class="note">Your cart is empty.</p>';document.getElementById('sub').textContent='A$'+s.toFixed(2);
const co=document.getElementById('checkout'),ks=Object.keys(c);co.disabled=false;co.classList.remove('soon');co.textContent='Checkout';
if(!ks.length){co.disabled=true;co.classList.add('soon')}else if(ks.length==1&&P[ks[0]].stripe_link){co.onclick=()=>location.href=P[ks[0]].stripe_link}else{soon(co)}}
fetch((window.ROOT||'')+'products.json').then(r=>r.json()).then(d=>{d.forEach(p=>P[p.sku]=p);render();const b=document.getElementById('buy');if(b){const p=P[b.dataset.sku];if(p&&p.stripe_link)b.onclick=()=>location.href=p.stripe_link;else soon(b)}});
return{add(k,q=1){const c=get();c[k]=(c[k]||0)+q;set(c);this.open()},rm(k){const c=get();delete c[k];set(c)},open(){document.getElementById('drawer').classList.add('open')},close(){document.getElementById('drawer').classList.remove('open')}}})();
