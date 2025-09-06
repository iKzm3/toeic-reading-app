// static/main5.js - minimal Part5 renderer using PackLoader
document.addEventListener('DOMContentLoaded', async () => {
  const app = document.getElementById('app');
  try{
    await PackLoader.syncPacks();
    const pool = await PackLoader.getPart5Pool('all'); // '600' or '750'も可
    if(!pool || pool.length===0){
      app.textContent = 'コンテンツパックが見つかりません。';
      return;
    }
    let i = 0;
    function render(){
      const q = pool[i % pool.length];
      app.innerHTML = `
        <div><strong>Q${i+1}.</strong> ${escapeHtml(q.question || '(question)')}</div>
        <div class="choices">
          ${(q.choices || []).map((c,idx)=>`<button data-i="${idx}" class="btn">${escapeHtml(c)}</button>`).join('')}
        </div>
        <div id="result"></div>
        <div style="margin-top:12px;">
          <button id="nextBtn" class="btn btn-primary btn-sm">次の問題へ</button>
        </div>
      `;
      app.querySelectorAll('button[data-i]').forEach(btn=>{
        btn.addEventListener('click', (e)=>{
          const idx = Number(e.currentTarget.dataset.i);
          const ans = q.answer;
          const ok = (typeof ans==='number') ? (idx===ans) : ((q.choices||[])[idx]===ans);
          document.getElementById('result').innerHTML = ok
            ? `✅ 正解<br>${escapeHtml(q.explain || '')}`
            : `❌ 不正解<br>${escapeHtml(q.explain || '')}`;
        });
      });
      document.getElementById('nextBtn').addEventListener('click', ()=>{ i++; render(); });
    }
    render();
    document.getElementById('meta').textContent = `全${pool.length}問`;
  }catch(e){
    console.error(e);
    app.textContent = '読み込みエラー: ' + e.message;
  }
});

function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, m=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m])); }
