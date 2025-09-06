// pages_main6.js - GitHub Pages用 Part6（堅牢版）
document.addEventListener('DOMContentLoaded', async () => {
  const app = document.getElementById('app');
  const meta = document.getElementById('meta');

  try {
    const res = await fetch('../../static/part6_demo.json');
    if (!res.ok) throw new Error('part6_demo.json が見つかりません');

    const raw = await res.json();
    const pool = normalizePool(raw);
    meta.textContent = `全${pool.length}文書`;
    if (!Array.isArray(pool) || pool.length === 0) {
      throw new Error('デモデータが空、または形式が違います');
    }

    let i = 0;
    render();

    function render() {
      const it = pool[i % pool.length] || {};
      const passage = it.passage || it.context || it.text || '(passage)';
      const firstBlank = pickFirstBlank(it);
      if (!firstBlank) {
        throw new Error('questions/blanks が見つかりません（データ形式を確認）');
      }

      const question = firstBlank.question || '(1) に入る語を選べ';
      const choices  = firstBlank.choices || [];
      const answer   = firstBlank.answer;

      app.innerHTML = `
        <pre class="p-3 bg-light border rounded" style="white-space:pre-wrap">${escapeHtml(passage)}</pre>
        <div class="mb-2"><strong>${escapeHtml(question)}</strong></div>
        <div class="row g-2">
          ${choices.map((c, idx) => `
            <div class="col-6">
              <button class="btn btn-outline-primary w-100" data-i="${idx}">${escapeHtml(c)}</button>
            </div>
          `).join('')}
        </div>
        <div id="result" class="alert mt-3 d-none"></div>
        <div class="mt-3"><button id="nextBtn" class="btn btn-primary">次の文書へ</button></div>
      `;

      app.querySelectorAll('button[data-i]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = Number(e.currentTarget.dataset.i);
          const ok = (typeof answer === 'number') ? (idx === answer)
                    : (choices[idx] === answer);
          const box = document.getElementById('result');
          box.classList.remove('d-none', 'alert-success', 'alert-danger');
          box.classList.add(ok ? 'alert-success' : 'alert-danger');
          box.textContent = ok ? '✅ 正解' : '❌ 不正解';
        });
      });
      document.getElementById('nextBtn').addEventListener('click', () => { i++; render(); });
    }

  } catch (e) {
    console.error(e);
    app.textContent = '読み込みエラー: ' + e.message;
  }
});

// ---- ヘルパー ----
function normalizePool(raw) {
  if (Array.isArray(raw)) return raw;
  // よくあるラッパーキーに対応
  if (raw && Array.isArray(raw.items))     return raw.items;
  if (raw && Array.isArray(raw.data))      return raw.data;
  if (raw && Array.isArray(raw.passages))  return raw.passages;
  if (raw && Array.isArray(raw.questions)) return raw.questions; // 稀
  return [];
}

function pickFirstBlank(it) {
  if (!it || typeof it !== 'object') return null;
  if (Array.isArray(it.questions) && it.questions.length) return it.questions[0];
  if (Array.isArray(it.blanks)    && it.blanks.length)    return it.blanks[0];
  if (Array.isArray(it.items)     && it.items.length)     return it.items[0];
  return null;
}

function escapeHtml(s){ 
  return String(s||'').replace(/[&<>"']/g, m => ({ 
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" 
  }[m])); 
}
