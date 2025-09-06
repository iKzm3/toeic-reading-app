// static/main6.js - minimal Part6 renderer using PackLoader
document.addEventListener('DOMContentLoaded', async () => {
  const app = document.getElementById('app');
  try{
    await PackLoader.syncPacks();
    const pool = await PackLoader.getPart6Pool('all');
    if(!pool || pool.length===0){
      app.textContent = 'コンテンツパックが見つかりません。';
      return;
    }
    let i = 0;
    function render(){
      const item = pool[i % pool.length];
      const passage = item.passage || item.context || '(passage)';
      const blanks = item.blanks || item.questions || []; // 柔軟に
      const b = blanks[0] || {};
      const question = b.question || '(1) に入る語を選べ';
      app.innerHTML = `
        <pre>${escapeHtml(passage)}</pre>
        <div><strong>${escapeHtml(question)}</strong></div>
        <div class="choices">
          ${(b.choices || []).map((c,idx)=>`<button data-i="${idx}" class="btn">${escapeHtml(c)}</button>`).join('')}
        </div>
        <div id="result"></div>
        <div style="margin-top:12px;">
          <button id="nextBtn" class="btn btn-primary btn-sm">次の文書へ</button>
        </div>
      `;
      app.querySelectorAll('button[data-i]').forEach(btn=>{
        btn.addEventListener('click', (e)=>{
          const idx = Number(e.currentTarget.dataset.i);
          const ans = b.answer;
          const ok = (typeof ans==='number') ? (idx===ans) : ((b.choices||[])[idx]===ans);
          document.getElementById('result').textContent = ok ? '✅ 正解' : '❌ 不正解';
        });
      });
      document.getElementById('nextBtn').addEventListener('click', ()=>{ i++; render(); });
    }
    render();
    document.getElementById('meta').textContent = `全${pool.length}文書`;
  }catch(e){
    console.error(e);
    app.textContent = '読み込みエラー: ' + e.message;
  }
});

function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, m=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m])); }
