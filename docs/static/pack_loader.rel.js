// static/pack_loader.rel.js - relative-path version (GitHub Pages等)
(async function (global) {
  const MANIFEST_URL = 'static/content-packs/manifest.json';
  async function fetchJSON(url) { const r = await fetch(url, {cache:'no-store'}); if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); }
  async function fetchText(url) { const r = await fetch(url, {cache:'no-store'}); if(!r.ok) throw new Error('HTTP '+r.status); return r.text(); }
  async function getKV(key){ return (await IDB.get('kv', key))?.value; }
  async function setKV(key,v){ await IDB.put('kv', { key, value:v }); }
  function parseJSONL(t){ return t.split(/\r?\n/).filter(Boolean).map(l=>JSON.parse(l)); }
  function normalize(items){ return items.map(it=>({ key:`${it.type}:${it.id}`, type:it.type, id:it.id, payload:it })); }
  async function syncPacks(){
    const server = await fetchJSON(MANIFEST_URL);
    const localHash = await getKV('manifest_hash');
    const currentHash = JSON.stringify(server.packs.map(p=>[p.id,p.sha256]));
    if(localHash===currentHash) return {updated:false, server};
    for(const p of server.packs){
      const base = MANIFEST_URL.replace(/manifest\.json$/, '');
      const text = await fetchText(base + p.file);
      const items = parseJSONL(text);
      await IDB.put('packs', p);
      await IDB.bulkPut('items', normalize(items));
    }
    await setKV('manifest_hash', currentHash);
    return {updated:true, server};
  }
  async function getPart5Pool(level='all'){ const all=await IDB.getAll('items'); return all.filter(r=>r.type==='part5' && (level==='all'||r.payload.level==level)).map(r=>r.payload); }
  async function getPart6Pool(level='all'){ const all=await IDB.getAll('items'); return all.filter(r=>r.type==='part6' && (level==='all'||r.payload.level==level)).map(r=>r.payload); }
  global.PackLoader = { syncPacks, getPart5Pool, getPart6Pool };
})(window);
