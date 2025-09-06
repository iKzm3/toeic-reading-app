// pages_main5.js - GitHub Pages用の最小Part5レンダラー
document.addEventListener('DOMContentLoaded', async () => {
  const app = document.getElementById('app');
  const meta = document.getElementById('meta');
  try{
    // デモ問題（5問）を静的JSONから読み込み
    const res = await fetch('../../static/part5_demo.json');
    if(!res.ok) throw new Error('part5_demo.json が読めません');
    const pool = await res.json();
    meta.textContent = `全${pool.length}問`;
    let i=0;
    function render(){
      const q = pool[i % pool.length];
      app.innerHTML = `
        <div class="mb-2"><strong>Q${i+1}.</strong> ${escapeHtml(q.question)}</div>
        <div class="row g-2">
          ${(q.choices||[]).map((c,idx)=>`
            <div class="col-6"><button class="btn btn-outline-primary w-100" data-i="${idx}">${escapeHtml(c)}</button></div>
          `).join('')}
        </div>
        <div id="result" class="alert mt-3 d-none"></div>
        <div class="mt-3"><button id="nextBtn" class="btn btn-primary">次の問題へ</button></div>
      `;
      app.querySelectorAll('button[data-i]').forEach(btn=>{
        btn.addEventListener('click', (e)=>{
          const idx = Number(e.currentTarget.dataset.i);
          const ok = idx === q.answer;
          const box = document.getElementById('result');
          box.classList.remove('d-none','alert-success','alert-danger');
          box.classList.add(ok ? 'alert-success':'alert-danger');
          box.textContent = (ok ? '✅ 正解 ' : '❌ 不正解 ') + (q.explanation || '');
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
