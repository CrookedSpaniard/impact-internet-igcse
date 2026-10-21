FD.add({
  id: 'start',
  title: 'Start here',
  tab: 'Start',
  icon: 'start',
  color: '--accent',
  page: true,
  mount(el) {
    const S = FD.state;
    const part = (p) => `
      <section class="card st-part">
        <h3>Part ${p} · ${FD.PARTS[p].name} <small>${FD.PARTS[p].pages}</small></h3>
        <ul class="st-list">${FD.SECTIONS.filter((s) => s.part === p).map((s) => `
          <li><button data-go="${s.id}" style="--c:var(${s.color})">${FD.icon[s.id]}<span><b>${FD.SECTIONS.indexOf(s) + 1}. ${s.name}</b><small>${s.line}</small></span>${FD.state.checks['check-' + s.id] ? '<span class="st-done" title="Check done">✓</span>' : ''}</button></li>`).join('')}
          <li><button data-go="test${p}" style="--c:var(--red-ui)">${FD.icon.final}<span><b>Test Part ${p}</b><small>Multiple choice + exam-style questions</small></span>${S.tests['test' + p] && S.tests['test' + p].done ? '<span class="st-done">✓</span>' : ''}</button></li>
        </ul>
      </section>`;
    el.innerHTML = `
      <section class="card st-hero">
        <div>
          <p class="kick">Unit 3 · Operating online · Pearson Edexcel International GCSE ICT</p>
          <h2>Impact of the internet</h2>
          <p>Like printing, the <b>internet</b> is one of the most important technological developments in human history. In this lesson you will explore its <b>positive and negative effects</b> on <b>individuals</b> (information, jobs, working practices, socialising, staying safe, working from home) and on <b>organisations and society</b> (global markets, security, the digital divide and the information gap).</p>
          <div class="who">
            <label>Your name<input id="sName" autocomplete="name" placeholder="First name and surname" value="${FD.esc(S.name)}"></label>
            <label>Class<input id="sClass" placeholder="e.g. 10B" value="${FD.esc(S.cls)}"></label>
          </div>
          <p class="small" id="sMsg">Your name goes on the results you send to your teacher.</p>
          <div class="chk-btns">
            <button class="btn primary" id="sGo">${S.last && S.last !== 'start' ? '▶ Continue where I left off' : '▶ Start Part A'}</button>
            <button class="btn ghost" id="sProg" style="color:#fff;border-color:rgb(255 255 255 / .4)">${FD.icon.progress} My progress</button>
          </div>
        </div>
        <svg class="st-net st-flow" viewBox="0 0 420 230" role="img" aria-label="Twelve impacts of the internet">
          <g><rect class="nd" x="10" y="8" width="127" height="46" rx="10"><animate attributeName="fill" values="rgb(255 255 255 / .07);rgb(246 201 76 / .35);rgb(255 255 255 / .07)" dur="12s" begin="0s" repeatCount="indefinite"/></rect><text x="73.5" y="36">🌐 Protocols</text></g>
          <g><rect class="nd" x="147" y="8" width="127" height="46" rx="10"><animate attributeName="fill" values="rgb(255 255 255 / .07);rgb(246 201 76 / .35);rgb(255 255 255 / .07)" dur="12s" begin="1s" repeatCount="indefinite"/></rect><text x="210.5" y="36">📰 Information</text></g>
          <g><rect class="nd" x="284" y="8" width="127" height="46" rx="10"><animate attributeName="fill" values="rgb(255 255 255 / .07);rgb(246 201 76 / .35);rgb(255 255 255 / .07)" dur="12s" begin="2s" repeatCount="indefinite"/></rect><text x="347.5" y="36">💼 Employment</text></g>
          <g><rect class="nd" x="10" y="63" width="127" height="46" rx="10"><animate attributeName="fill" values="rgb(255 255 255 / .07);rgb(246 201 76 / .35);rgb(255 255 255 / .07)" dur="12s" begin="3s" repeatCount="indefinite"/></rect><text x="73.5" y="91">🤝 Collaboration</text></g>
          <g><rect class="nd" x="147" y="63" width="127" height="46" rx="10"><animate attributeName="fill" values="rgb(255 255 255 / .07);rgb(246 201 76 / .35);rgb(255 255 255 / .07)" dur="12s" begin="4s" repeatCount="indefinite"/></rect><text x="210.5" y="91">💬 Socialising</text></g>
          <g><rect class="nd" x="284" y="63" width="127" height="46" rx="10"><animate attributeName="fill" values="rgb(255 255 255 / .07);rgb(246 201 76 / .35);rgb(255 255 255 / .07)" dur="12s" begin="5s" repeatCount="indefinite"/></rect><text x="347.5" y="91">🛡️ Staying safe</text></g>
          <g><rect class="nd" x="10" y="118" width="127" height="46" rx="10"><animate attributeName="fill" values="rgb(255 255 255 / .07);rgb(246 201 76 / .35);rgb(255 255 255 / .07)" dur="12s" begin="6s" repeatCount="indefinite"/></rect><text x="73.5" y="146">🏠 Working from home</text></g>
          <g><rect class="nd" x="147" y="118" width="127" height="46" rx="10"><animate attributeName="fill" values="rgb(255 255 255 / .07);rgb(246 201 76 / .35);rgb(255 255 255 / .07)" dur="12s" begin="7s" repeatCount="indefinite"/></rect><text x="210.5" y="146">📈 Global markets</text></g>
          <g><rect class="nd" x="284" y="118" width="127" height="46" rx="10"><animate attributeName="fill" values="rgb(255 255 255 / .07);rgb(246 201 76 / .35);rgb(255 255 255 / .07)" dur="12s" begin="8s" repeatCount="indefinite"/></rect><text x="347.5" y="146">🔒 Security</text></g>
          <g><rect class="nd" x="10" y="173" width="127" height="46" rx="10"><animate attributeName="fill" values="rgb(255 255 255 / .07);rgb(246 201 76 / .35);rgb(255 255 255 / .07)" dur="12s" begin="9s" repeatCount="indefinite"/></rect><text x="73.5" y="201">🌍 Digital divide</text></g>
          <g><rect class="nd" x="147" y="173" width="127" height="46" rx="10"><animate attributeName="fill" values="rgb(255 255 255 / .07);rgb(246 201 76 / .35);rgb(255 255 255 / .07)" dur="12s" begin="10s" repeatCount="indefinite"/></rect><text x="210.5" y="201">📢 The media</text></g>
          <g><rect class="nd" x="284" y="173" width="127" height="46" rx="10"><animate attributeName="fill" values="rgb(255 255 255 / .07);rgb(246 201 76 / .35);rgb(255 255 255 / .07)" dur="12s" begin="11s" repeatCount="indefinite"/></rect><text x="347.5" y="201">📊 Information gap</text></g>
        </svg>
      </section>

      <section class="card">
        <h3>How to use this website on your own</h3>
        ${FD.HOWTO}
      </section>

      <div class="st-cols">${part('A')}${part('B')}</div>
      <p class="small muted">Your progress is saved in this browser only. Nothing is sent to the internet. The simulations are simplified drawings of how each part works, and many are slowed down so you can see them.</p>`;
    const $ = (s) => el.querySelector(s);
    $('#sName').addEventListener('input', (e) => { FD.state.name = e.target.value; FD.save(); });
    $('#sClass').addEventListener('input', (e) => { FD.state.cls = e.target.value; FD.save(); });
    $('#sGo').addEventListener('click', () => {
      if (FD.state.last && FD.state.last !== 'start') FD.goto(FD.state.last, FD.state.step || 0);
      else FD.goto('internet');
    });
    $('#sProg').addEventListener('click', FD.openProgress);
    el.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => FD.goto(b.dataset.go)));
  },
});
