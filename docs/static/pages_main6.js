// pages_main6.js - GitHub Pages用の最小Part6レンダラー
document.addEventListener('DOMContentLoaded', async () => {
  const app = document.getElementById('app');
  const meta = document.getElementById('meta');
  try{
    const res = await fetch('../../static/part6_demo.json'); // 既存のデモデータを使用
    if(!res.ok) throw new Error('part6_demo.json が読めません');
    const pool = await res.json(); // [{passage, questions:[{question,choices,answer}], ...}]
    meta.textContent = `全${pool.length}文書`;
    let i=0;
    function render(){
      const it = pool[i % pool.length];
      const b = (it.questions||it.blanks||[])[0] || {};
      app.innerHTML = `
        <pre class="p-3 bg-light border rounded">${escapeHtml(it.passage || it.context || '')}</pre>
        <div class="mb-2"><strong>${escapeHtml(b.question || '(1) に入る語を選べ')}</strong></div>
        <div class="row g-2">
          ${(b.choices||[]).map((c,idx)=>`
            <div class="col-6"><button class="btn btn-outline-primary w-100" data-i="${idx}">${escapeHtml(c)}</button></div>
          `).join('')}
        </div>
        <div id="result" class="alert mt-3 d-none"></div>
        <div class="mt-3"><button id="nextBtn" class="btn btn-primary">次の文書へ</button></div>
      `;
      app.querySelectorAll('button[data-i]').forEach(btn=>{
        btn.addEventListener('click',(e)=>{
          const idx = Number(e.currentTarget.dataset.i);
          const ok = (typeof b.answer==='number') ? (idx===b.answer) : ((b.choices||[])[idx]===b.answer);
          const box = document.getElementById('result');
          box.classList.remove('d-none','alert-success','alert-danger');
          box.classList.add(ok ? 'alert-success':'alert-danger');
          box.textContent = ok ? '✅ 正解' : '❌ 不正解';
        });
      });
      document.getElementById('nextBtn').addEventListener('click', ()=>{ i++; render(); });
    }
    render();
  }catch(e){
    console.error(e);
    app.textContent = '読み込みエラー: ' + e.message;
  }
});
function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, m=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m])); }
