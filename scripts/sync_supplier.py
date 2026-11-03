#!/usr/bin/env python3
"""Sync products.json from a Dropshipzone catalogue export (CSV or JSON) once the retailer account is approved.

Usage: python3 scripts/sync_supplier.py feed.csv [--download-images]
Matches rows on products[].supplier.supplier_sku. Updates images, about, variants and stock.
Never edits price_aud or stripe_link: if the supplier price/RRP or a variant price differs, it is written to
scripts/price_flags.json for Nick to review instead.
Expected feed columns (rename via MAP below to match the real export): sku, title, description, features, specs(JSON),
in_the_box, images (| separated URLs), colours (name:hex|...), materials (|), stock_qty, rrp.
"""
import csv,json,sys,os,urllib.request,datetime,pathlib
MAP={'sku':'sku','images':'images','features':'features','specs':'specs','in_the_box':'in_the_box','colours':'colours','materials':'materials','stock':'stock_qty','rrp':'rrp','description':'description'}
ROOT=pathlib.Path(__file__).resolve().parent.parent
def rows(path):
    if path.endswith('.json'): return json.load(open(path))
    return list(csv.DictReader(open(path,newline='',encoding='utf-8')))
def split(v): return [x.strip() for x in (v or '').split('|') if x.strip()]
def main():
    feed=rows(sys.argv[1]);dl='--download-images' in sys.argv
    by={str(r.get(MAP['sku'],'')).strip():r for r in feed}
    P=json.load(open(ROOT/'products.json'));flags=[];n=0
    for p in P:
        s=(p.get('supplier') or {}).get('supplier_sku')
        if not s or s not in by: continue
        r=by[s];n+=1;imgs=[]
        for i,u in enumerate(split(r.get(MAP['images']))):
            if dl:
                ext=os.path.splitext(u.split('?')[0])[1] or '.jpg';rel=f"assets/products/{p['slug']}/{i+1}{ext}"
                (ROOT/rel).parent.mkdir(parents=True,exist_ok=True)
                urllib.request.urlretrieve(u,ROOT/rel);imgs.append({'src':rel,'alt':p['title']})
        if imgs: p['images']=imgs
        a=p.setdefault('about',{})
        if r.get(MAP['description']): a['overview']=r[MAP['description']].strip()
        if r.get(MAP['features']): a['features']=split(r[MAP['features']])
        if r.get(MAP['in_the_box']): a['in_the_box']=split(r[MAP['in_the_box']])
        if r.get(MAP['specs']):
            try: a.setdefault('specs',{}).update(json.loads(r[MAP['specs']]))
            except Exception: pass
        cols=[]
        for c in split(r.get(MAP['colours'])):
            nm,_,hx=c.partition(':');cols.append({'name':nm.strip(),'hex':hx.strip() or None})
        if cols: p.setdefault('variants',{})['colours']=cols
        mats=[{'name':m} for m in split(r.get(MAP['materials']))]
        if mats: p['variants']['materials']=mats
        if r.get(MAP['stock'])not in(None,''): p['stock_qty']=int(float(r[MAP['stock']]))
        if r.get(MAP['rrp']) and abs(float(r[MAP['rrp']])-p['price_aud'])>0.009:
            flags.append({'sku':p['sku'],'site_price':p['price_aud'],'supplier_rrp':float(r[MAP['rrp']])})
        p['supplier'].update(status='linked',last_synced=datetime.datetime.now().astimezone().isoformat(timespec='seconds'))
        p['info_status']='complete' if (p.get('images') and a.get('features')) else 'partial'
    json.dump(P,open(ROOT/'products.json','w'),indent=1,ensure_ascii=False)
    json.dump(flags,open(ROOT/'scripts/price_flags.json','w'),indent=1)
    print(f'synced {n} products, {len(flags)} price flags')
if __name__=='__main__': main()
