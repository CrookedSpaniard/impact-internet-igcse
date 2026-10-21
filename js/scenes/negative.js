FD.add({
  id: 'negative',
  title: 'Negative impacts on organisations',
  tab: 'Negative',
  icon: 'negative',
  color: '--c2',
  section: true,
  interactive: true,
  vocab: [
    ['Hacking', 'Accessing a system using malicious methods.'],
    ['Accountable', 'When someone is held responsible for the effects of their actions and must be willing to explain or be criticised for them.'],
    ['VPN', 'Virtual private network: remote access to the data stored in the organisation’s building.'],
    ['Encryption', 'Scrambling data so that it is protected even if it is intercepted.'],
  ],
  mount(el) {
    const WAYS = [
      ['mail', '✉️', 'Email a copy home', 'A copy of the organisation’s data is transferred to the employee’s home via email.', [470, 60, '🏠💻']],
      ['vpn', '🔐', 'Remote access (VPN)', 'The employee accesses the data stored in the organisation’s building remotely, using a VPN.', [470, 160, '🏠💻']],
      ['cloud', '☁️', 'Another company’s servers', 'The data is stored on another company’s servers. The organisation must rely on the security of the other organisation.', [470, 250, '🏢☁️']],
    ];
    const ATT = {
      reveal: { n: '🗝️ Login details revealed', d: 'policy', steps: ['Lost a paper copy of the login details', 'Saved the login details on a laptop that was lost', 'Pressured into telling someone their details', 'Used a password that is easy to guess: 22111996'] },
      intercept: { n: '📡 Data intercepted', d: 'enc', steps: ['Data travels over the internet (WAN) to the employee’s computer…', '…and inside the employee’s LAN', 'An unauthorised user intercepts it'] },
      hack: { n: '💻 Hacking into the systems', d: 'hack', steps: ['Tries thousands of usernames and passwords', 'Connects to an unprotected port from the internet', 'Copies the customer database at 03:00'] },
    };
    const INDS = [
      ['🎬', 'Music and film retailers', 'Online downloads and streaming'], ['📼', 'DVD rental companies', 'More people watch films online'],
      ['💿', 'Record labels', 'Independent artists publish and distribute their own music online'], ['🏡', 'Estate agents', 'Individuals advertise their properties online'],
      ['📰', 'Newspaper publishers and TV broadcasters', 'More choice and more convenient news online'], ['📮', 'Postal services', 'Messages and digital media are sent instantly'],
    ];
    el.innerHTML = `
      <div class="sim ng-s">
        <div class="ptabs"><button data-p="leave">🏢 Data leaves the building</button><button data-p="attack">🕵️ Unauthorised access</button><button data-p="compete">🌍 Greater competition</button></div>
        <div data-panel="leave">
          <div class="ctrls">${WAYS.map(([k, e, n]) => `<button class="btn" data-w="${k}">${e} ${n}</button>`).join('')}</div>
          <div class="sim-box"><svg viewBox="0 0 600 300" id="bld" role="img" aria-label="Data leaving a secure building">
            <rect class="ng-wall" x="40" y="40" width="250" height="230" rx="6"/><text class="svg-lbl" x="165" y="30">🏢 The organisation’s building</text>
            <text x="165" y="150" class="emo" font-size="44">🗄️</text><text class="svg-sm" x="165" y="185">private and valuable data</text>
            <text x="75" y="75" class="emo" font-size="20">🔒</text><text x="255" y="75" class="emo" font-size="20">🚨</text><text x="75" y="240" class="emo" font-size="20">💂</text><text x="255" y="240" class="emo" font-size="20">🧱</text>
            ${WAYS.map(([k, , n, , [x, y, ic]]) => `<g class="ng-way" data-k="${k}" opacity=".15"><path class="ng-path" d="M215 150 C 330 150, 360 ${y}, ${x - 20} ${y}"/><text x="${x + 25}" y="${y}" class="emo" font-size="26">${ic}</text><text class="svg-sm" x="${x + 25}" y="${y + 28}">${k === 'cloud' ? 'Another company' : 'Employee’s home'} · ${n.replace(/ \(.*\)| a copy home|Another company’s /g, '')}</text><text x="${x - 12}" y="${y - 16}" class="emo ng-thief" font-size="18" opacity="0">🕵️</text></g>`).join('')}
            <circle r="9" class="pkt" id="dp" opacity="0"/>
          </svg></div>
          <div class="readout"><span class="ro" id="vRo"><small>How vulnerable is the data?</small><b id="vul">Secure in a central location</b></span></div>
        </div>
        <div data-panel="attack" hidden>
          <div class="ctrls"><span class="seg" id="att">${Object.entries(ATT).map(([k, a]) => `<button data-v="${k}">${a.n}</button>`).join('')}</span></div>
          <div class="two-col">
            <div class="sim-box"><h5 class="mw-h">Defences</h5>
              <div id="def"></div>
              <button class="btn primary" id="run">▶ Run the attack</button></div>
            <div class="sim-box"><h5 class="mw-h">What happens</h5><ol class="ng-log" id="log"></ol></div>
          </div>
        </div>
        <div data-panel="compete" hidden>
          <div class="ctrls"><span class="seg" id="mk"><button data-v="local">🏘️ Before: local market</button><button data-v="global">🌍 Now: global marketplace</button></span><span class="ro"><small>Competitors</small><b id="nComp">3</b></span></div>
          <div class="ng-inds" id="inds">${INDS.map(([e, n, w], i) => `<button class="ng-ind" data-i="${i}"><span>${e}</span><b>${n}</b><small>Threatened by: ${w}</small></button>`).join('')}</div>
        </div>
        <p class="verdict" id="msg"></p>
      </div>`;
    const root = el.querySelector('.ng-s'), $ = (s) => root.querySelector(s);
    let dead = false, gen = 0, att = 'reveal', D = {}, used = {};
    const show = FD.panels(root, () => { gen++; $('#msg').innerHTML = ''; });

    // ---- data leaves the building ----
    async function leave(k) {
      show('leave');
      const g = ++gen, w = WAYS.find((x) => x[0] === k);
      used[k] = true;
      root.querySelectorAll('.ng-way').forEach((x) => x.setAttribute('opacity', used[x.dataset.k] ? 1 : 0.15));
      root.querySelectorAll('[data-w]').forEach((b) => b.classList.toggle('on', !!used[b.dataset.w]));
      const path = root.querySelector(`.ng-way[data-k="${k}"] .ng-path`), L = path.getTotalLength();
      $('#dp').setAttribute('opacity', 1);
      await FD.tween(1300, (t) => { if (g === gen) { const p = path.getPointAtLength(L * t); $('#dp').setAttribute('cx', p.x); $('#dp').setAttribute('cy', p.y); } });
      if (dead || g !== gen) return;
      $('#dp').setAttribute('opacity', 0);
      root.querySelector(`.ng-way[data-k="${k}"] .ng-thief`).setAttribute('opacity', 1);
      const n = Object.keys(used).length;
      $('#vul').textContent = ['Secure in a central location', 'More vulnerable', 'Even more vulnerable', 'Very vulnerable'][n];
      $('#vRo').className = 'ro bad';
      $('#msg').className = 'verdict bad';
      $('#msg').innerHTML = `${w[3]}<br>As soon as data leaves a secure building, it is <b>more vulnerable</b> to being accessed by an unauthorised user than if it stayed in a central location.`;
    }
    root.querySelectorAll('[data-w]').forEach((b) => b.addEventListener('click', () => leave(b.dataset.w)));

    // ---- unauthorised access ----
    const DEFS = {
      policy: [['policy', 'Policies that help employees understand and manage the risks (they are accountable)']],
      enc: [['enc', 'Encryption of data sent over the internet']],
      hack: [['auth', 'Authentication (strong usernames and passwords)'], ['fw', 'Firewall'], ['ids', 'Intrusion detection system']],
    };
    function drawAtt() {
      FD.segSet($('#att'), att);
      $('#def').innerHTML = DEFS[ATT[att].d].map(([k, t]) => `<label class="tgl"><input type="checkbox" data-d="${k}" ${D[k] ? 'checked' : ''}> ${t}</label>`).join('');
      $('#log').innerHTML = '';
    }
    $('#att').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) { gen++; att = b.dataset.v; drawAtt(); $('#msg').innerHTML = ''; } });
    $('#def').addEventListener('change', (e) => { const c = e.target.closest('[data-d]'); if (c) D[c.dataset.d] = c.checked; });
    async function run(k, defs) {
      show('attack');
      const g = ++gen;
      if (k) { att = k; drawAtt(); }
      if (defs) { defs.forEach((d) => { D[d] = true; }); drawAtt(); }
      const a = ATT[att], log = $('#log');
      log.innerHTML = '';
      $('#msg').innerHTML = '';
      const add = (h, cls = '') => log.appendChild(FD.h(`<li class="${cls} new">${h}</li>`));
      let blocked = false;
      for (let i = 0; i < a.steps.length; i++) {
        await FD.wait(700); if (dead || g !== gen) return;
        if (att === 'hack') {
          const d = ['auth', 'fw', 'ids'][i];
          if (D[d]) { add(`${a.steps[i]} → <b class="good-t">✓ stopped by the ${{ auth: 'authentication', fw: 'firewall', ids: 'intrusion detection system' }[d]}</b>`, 'ok'); blocked = true; break; }
          add(a.steps[i] + ' → <span class="bad-t">✗ gets through</span>');
        } else if (att === 'reveal') {
          if (D.policy && i === 0) { add('Employees follow the policy: no paper copies, no saved logins, never tell anyone, strong passwords → <b class="good-t">✓ they act responsibly</b>', 'ok'); blocked = true; break; }
          add(a.steps[i]);
        } else {
          add(a.steps[i]);
          if (i === 2) add(D.enc ? 'The intercepted data reads: <span class="mono">x9#Lq!7vR@2pZ…</span> → <b class="good-t">✓ protected by encryption</b>' : 'The intercepted data reads: <span class="mono">Name: A Olatunji · Card: 4929 …</span> → <span class="bad-t">✗ readable!</span>', D.enc ? 'ok' : '');
          if (i === 2 && D.enc) blocked = true;
        }
      }
      $('#msg').className = 'verdict ' + (blocked ? 'good' : 'bad');
      $('#msg').innerHTML = blocked
        ? { reveal: 'Policies like these make employees <b>accountable</b> for their actions, so they are more likely to act responsibly.', intercept: 'Organisations use <b>encryption</b> when data is sent over the internet: it is protected even if it is intercepted.', hack: 'To prevent access from the internet, organisations use <b>authentication</b>, <b>firewalls</b> and <b>intrusion detection systems</b>.' }[att]
        : { reveal: '✗ Authorised users revealed their login details, intentionally or unintentionally. An unauthorised user is in.', intercept: '✗ The data was intercepted while it was transferred and anyone can read it.', hack: '✗ The organisation’s systems were <b>hacked</b>: accessed using malicious methods.' }[att];
    }
    $('#run').addEventListener('click', () => run());

    // ---- greater competition ----
    async function market(v) {
      show('compete');
      const g = ++gen;
      FD.segSet($('#mk'), v);
      const to = v === 'global' ? 300 : 3, from = +$('#nComp').textContent.replace(/\D/g, '') || 3;
      await FD.tween(900, (t) => { if (g === gen) $('#nComp').textContent = FD.fmt(from + (to - from) * t); });
      $('#msg').className = 'verdict';
      $('#msg').innerHTML = v === 'global' ? 'Organisations must now compete in a <b>global marketplace</b>. Large organisations can be less attractive because they may be less flexible than small online businesses.' : 'In the past, organisations usually competed with others in their local area or their own country.';
    }
    function ind(i) {
      show('compete');
      root.querySelectorAll('.ng-ind').forEach((b) => b.classList.toggle('on', +b.dataset.i === i || b.classList.contains('on')));
      $('#msg').className = 'verdict bad';
      $('#msg').innerHTML = `${INDS[i][0]} <b>${INDS[i][1]}</b> have been put at risk: ${INDS[i][2].toLowerCase()}.`;
    }
    $('#mk').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) market(b.dataset.v); });
    $('#inds').addEventListener('click', (e) => { const b = e.target.closest('.ng-ind'); if (b) ind(+b.dataset.i); });

    function reset() {
      gen++; used = {}; D = {}; att = 'reveal';
      root.querySelectorAll('.ng-way').forEach((x) => { x.setAttribute('opacity', 0.15); x.querySelector('.ng-thief').setAttribute('opacity', 0); });
      root.querySelectorAll('[data-w]').forEach((b) => b.classList.remove('on'));
      $('#vul').textContent = 'Secure in a central location'; $('#vRo').className = 'ro good'; $('#dp').setAttribute('opacity', 0);
      drawAtt(); FD.segSet($('#mk'), 'local'); $('#nComp').textContent = '3'; root.querySelectorAll('.ng-ind').forEach((b) => b.classList.remove('on'));
      show('leave'); $('#msg').innerHTML = '';
    }
    reset();
    return { leave, run, market, ind, show, reset, destroy() { dead = true; } };
  },
  steps: [
    {
      title: 'Security issues: data in a central location',
      text: `<p>The data stored by organisations is often <b>private and valuable</b>. In a central location, it can be physically secured by <b>walls, locks, alarms and security guards</b>.</p>
             <p>None of these methods is totally safe, but they are all good ways of securing data.</p>`,
      async on(a) { a.reset(); },
    },
    {
      title: 'Three ways data leaves the building',
      text: `<p>To let employees work from home, organisations:</p>
             <ul><li>let employees transfer a copy of the data home <b>via email</b></li><li>provide <b>remote access</b> to the data in the building, e.g. using a <b>VPN</b></li><li>store data on <b>another company’s servers</b> and provide access to it.</li></ul>
             <p>Each method makes the data <b>more vulnerable</b> to unauthorised users.</p>`,
      tip: 'Hint: if an organisation stores data on another organisation’s servers, it must rely on that organisation’s security.',
      async on(a, ctx) { for (const k of ['mail', 'vpn', 'cloud']) { await a.leave(k); if (!(await ctx.sleep(900))) return; } },
    },
    {
      title: '1 · Authorised users reveal their login details',
      text: `<p>Intentionally or not: losing paper copies, saving login details on a computer that is lost, being pressured into telling someone, or using passwords that are easy to guess.</p>
             <p>Organisations have <b>policies</b> that help employees manage these risks. Policies make employees <strong>accountable</strong>, so they are more likely to act responsibly.</p>`,
      tip: 'Try it: run the attack, then tick the policy and run it again.',
      async on(a, ctx) { await a.run('reveal'); if (!(await ctx.sleep(1500))) return; await a.run('reveal', ['policy']); },
    },
    {
      title: '2 · Unauthorised users intercept the data',
      text: `<p>Data can be intercepted as it is transferred over the internet (WAN) to the employee’s computer, or within the employee’s LAN.</p>
             <p>Organisations often use <b>encryption</b> when data is sent over the internet, which protects it even if it is intercepted.</p>`,
      async on(a, ctx) { await a.run('intercept'); if (!(await ctx.sleep(1500))) return; await a.run('intercept', ['enc']); },
    },
    {
      title: '3 · Unauthorised users hack into the systems',
      text: `<p><strong>Hacking</strong> is accessing a system using malicious methods. To prevent access from the internet, organisations use <b>authentication</b>, <b>firewalls</b> and <b>intrusion detection systems</b>.</p>`,
      tip: 'Hint: hacking is not the same as stealing someone’s password.',
      async on(a, ctx) { await a.run('hack'); if (!(await ctx.sleep(1500))) return; await a.run('hack', ['fw']); },
    },
    {
      title: 'Greater competition',
      text: `<p>In the past, organisations competed with others in their local area or country. Now they must compete in a <b>global marketplace</b>, with more organisations to compete with.</p>
             <p>Large organisations can become less attractive because they may be <b>less flexible</b> than small online businesses.</p>`,
      async on(a, ctx) { await a.market('local'); if (!(await ctx.sleep(1000))) return; await a.market('global'); },
    },
    {
      title: 'Industries put at risk',
      text: `<p>New channels for trade put some organisations and whole industries at risk: music and film retailers, DVD rental companies, record labels, estate agents, newspaper publishers and TV broadcasters, and postal services.</p>`,
      tip: 'Try it: press each industry to see what threatened it.',
      async on(a, ctx) { for (let i = 0; i < 6; i++) { a.ind(i); if (!(await ctx.sleep(900))) return; } },
    },
  ],
});

FD.activities({
  section: 'negative',
  items: [
    {
      id: 'negative-data',
      title: 'Private and valuable data (Table 7.3)',
      task: '<p>Complete Table 7.3 by providing examples of private or valuable data stored by these types of organisation. Then add your own choice of organisation and identify examples of private or valuable data that it holds.</p>',
      fields: ['Banks', 'Hospitals', 'Online retailers', 'Schools', 'Your choice: organisation and its data'],
      lines: 2,
      hint: 'Notes (optional)…',
    },
  ],
});

FD.check({
  section: 'negative',
  items: [
    { type: 'multi', q: 'Which <b>three</b> methods do organisations use to give employees working from home access to their systems?', need: 3, opts: [['Transferring a copy of the data home via email', true], ['Remote access to the data in the building, e.g. using a VPN', true], ['Storing data on another company’s servers', true], ['Locking the data in a safe', false]], why: 'Each makes the data more vulnerable than keeping it in a central location.' },
    { type: 'sort', q: 'Which protection matches each threat?', bins: ['Policies (accountability)', 'Encryption', 'Firewalls and intrusion detection'], rows: [['Employees saving login details on a laptop that is lost', 0], ['Data intercepted while it travels over the internet', 1], ['Hackers trying to reach the systems from the internet', 2]], why: 'Authentication also helps prevent hacking.' },
    { type: 'mcq', q: 'What is <b>hacking</b>?', opts: ['Accessing a system using malicious methods', 'Stealing someone’s password', 'Sending spam emails', 'Encrypting data'], why: 'Hacking is not the same as stealing someone’s password.' },
    { type: 'mcq', q: 'Which industry has been threatened because independent artists can publish and distribute their own music online?', opts: ['Record labels', 'Estate agents', 'Postal services', 'Banks'], why: 'Music and film retailers are threatened by downloads and streaming.' },
  ],
});
