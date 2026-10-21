FD.add({
  id: 'home',
  title: 'Working from home',
  tab: 'From home',
  icon: 'home',
  color: '--c7',
  section: true,
  interactive: true,
  vocab: [
    ['Decentralised', 'Not controlled by any one individual or organisation, like the internet.'],
    ['LAN', 'Local area network: let employees use shared storage and resources, but only inside the office.'],
    ['Perks', 'Something provided to employees by their employer in addition to their wages, such as goods, meals or a car.'],
  ],
  mount(el) {
    const B = {
      ind: {
        good: ['No need to travel: less stress from traffic and delays, saves money, fewer travel emissions', 'More time working or resting instead of travelling', 'No uniform or business clothes, which reduces cost', 'Work at a time to suit them', 'Work for longer periods without distractions from colleagues or meetings', 'Work in a comfortable environment', 'Organise work around social or family commitments'],
        bad: ['Distractions at home, such as family and leisure activities', 'Lack of social interaction with colleagues', 'Feel disconnected from the company'],
      },
      org: {
        good: ['Attract a talented, motivated workforce', 'Employ people located anywhere: they do not need to travel', 'No need to buy or rent office space or furniture', 'Workers are not delayed by weather or transport issues', 'Workers may work more effectively at home'],
        bad: ['Concerns about data security', 'More difficult to manage and support employees who are not in the office', 'Employees at home might not work as hard', 'Complicated to organise payments and permissions for workers in different countries'],
      },
    };
    el.innerHTML = `
      <div class="sim hm-s">
        <div class="ptabs"><button data-p="office">🏢 From the office to home</button><button data-p="commute">🚗 No need to travel</button><button data-p="scale">⚖️ Benefits and drawbacks</button></div>
        <div data-panel="office">
          <div class="ctrls"><span class="seg" id="era"><button data-v="paper">📁 Before the internet</button><button data-v="lan">🔌 Office LAN</button><button data-v="net">🌐 Internet: work from home</button></span></div>
          <div class="sim-box"><svg viewBox="0 0 600 260" id="map" role="img" aria-label="Offices and homes connected"></svg><p class="note" id="eT"></p></div>
        </div>
        <div data-panel="commute" hidden>
          <div class="ctrls">
            <label class="rng"><span>Journey to work (one way) <output id="mOut">40 min</output></span><input type="range" id="min" min="10" max="120" step="5" value="40"></label>
            <label class="rng"><span>Cost of a return journey <output id="cOut">€6</output></span><input type="range" id="cost" min="2" max="30" value="6"></label>
            <label class="rng"><span>Days at home each week <output id="dOut">3</output></span><input type="range" id="days" min="1" max="5" value="3"></label>
          </div>
          <div class="readout" id="cRo"></div>
          <p class="note">A year has about 46 working weeks. Car emissions: about 0.17 kg of CO₂ per km, at an average of 40 km/h.</p>
        </div>
        <div data-panel="scale" hidden>
          <div class="ctrls"><span class="seg" id="who"><button data-v="ind">🧑 Individuals</button><button data-v="org">🏢 Organisations</button></span><button class="btn ghost" id="clr">↺ Empty the scales</button></div>
          <div class="sim-box"><svg viewBox="0 0 420 150" class="hm-sc"><path class="hm-post" d="M210 40v95M170 140h80"/><g id="beam"><path class="hm-beam" d="M70 40h280"/></g><g class="hm-pan" id="panL"><path d="M70 40l-35 50h70z"/><text class="svg-lbl" x="70" y="108">Benefits <tspan id="nL">0</tspan></text></g><g class="hm-pan bad" id="panR"><path d="M350 40l-35 50h70z"/><text class="svg-lbl" x="350" y="108">Drawbacks <tspan id="nR">0</tspan></text></g><circle cx="210" cy="40" r="6" class="hm-pin"/></svg></div>
          <div class="two-col"><div class="mini" style="--c:var(--good)"><h5>✓ Benefits</h5><div class="hm-items" id="iG"></div></div><div class="mini" style="--c:var(--bad)"><h5>✗ Drawbacks</h5><div class="hm-items" id="iB"></div></div></div>
        </div>
        <p class="verdict" id="msg"></p>
      </div>`;
    const root = el.querySelector('.hm-s'), $ = (s) => root.querySelector(s);
    let dead = false, gen = 0, who = 'ind', on = {};
    const show = FD.panels(root, () => { gen++; $('#msg').innerHTML = ''; });

    // ---- from the office to home ----
    const HOMES = [[60, 40], [80, 200], [300, 225], [520, 200], [540, 40], [300, 30]];
    function era(v) {
      show('office');
      FD.segSet($('#era'), v);
      const office = v !== 'net';
      let s = '';
      if (office) {
        s += `<rect class="hm-off" x="220" y="80" width="160" height="100" rx="8"/><text class="svg-lbl" x="300" y="100">🏢 Central office</text>`;
        if (v === 'lan') s += `<rect class="hm-srv" x="285" y="112" width="30" height="40" rx="3"/><text class="svg-sm" x="300" y="166">shared storage</text>`;
        else s += `<text x="300" y="140" class="emo" font-size="26">📁📁📁</text>`;
        [[245, 150], [355, 150], [245, 118], [355, 118]].forEach(([x, y]) => {
          s += `<text x="${x}" y="${y}" class="emo" font-size="18">🧑‍💼</text>`;
          if (v === 'lan') s += `<line class="wire on" x1="${x + 10}" y1="${y}" x2="${x < 300 ? 285 : 315}" y2="132"/>`;
        });
        HOMES.forEach(([x, y]) => { s += `<text x="${x}" y="${y}" class="emo" font-size="22">🏠</text><path class="hm-trip" d="M${x} ${y + 12} L${x < 300 ? 220 : 380} ${y < 130 ? 95 : 165}"/>`; });
        s += `<text class="svg-sm" x="300" y="200">${v === 'lan' ? 'Employees must be inside the office to reach the LAN' : 'Employees travel 09.00–17.00 to discuss, collect, file paperwork and be supervised'}</text>`;
      } else {
        HOMES.forEach(([x, y], i) => HOMES.forEach(([x2, y2], j) => { if (j > i && (j - i) % 2) s += `<line class="wire on hm-net" x1="${x}" y1="${y}" x2="${x2}" y2="${y2}"/>`; }));
        HOMES.forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="20" class="hm-node"/><text x="${x}" y="${y}" class="emo" font-size="22">🏠</text><text x="${x + 16}" y="${y + 14}" class="emo" font-size="13">💻</text>`; });
        s += `<text class="svg-lbl" x="300" y="135">🌐 The internet is decentralised</text><text class="svg-sm" x="300" y="152">not controlled by any one individual or organisation</text>`;
      }
      $('#map').innerHTML = s;
      $('#eT').innerHTML = { paper: 'Before the internet, offices were a central place to discuss business, collect, distribute and file paperwork, and to be supervised by managers.', lan: 'Later, employees could use <b>LANs</b> to access shared storage and resources, but they still had to be <b>within the office</b>.', net: 'As computers became cheaper and more powerful, people could use digital devices (their employer’s or their own) to connect to the internet and <b>work from home</b>.' }[v];
    }
    $('#era').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) era(b.dataset.v); });

    // ---- commute calculator ----
    function calc() {
      const m = +$('#min').value, c = +$('#cost').value, d = +$('#days').value, wk = 46;
      $('#mOut').textContent = m + ' min'; $('#cOut').textContent = '€' + c; $('#dOut').textContent = d;
      const hours = (2 * m * d * wk) / 60, money = c * d * wk, co2 = (2 * m / 60) * 40 * 0.17 * d * wk;
      $('#cRo').innerHTML = `<span class="ro good"><small>Hours saved per year</small><b>${FD.fmt(hours)} h</b></span><span class="ro good"><small>That is</small><b>${(hours / 24).toFixed(1)} days</b></span><span class="ro good"><small>Money saved per year</small><b>€${FD.fmt(money)}</b></span><span class="ro good"><small>CO₂ not emitted</small><b>${FD.fmt(co2)} kg</b></span>`;
      $('#msg').className = 'verdict good';
      $('#msg').innerHTML = 'No need to travel: less stress from traffic, delays and overcrowded transport, money saved, and people feel they are helping the environment. That time can be spent <b>working or resting</b>.';
    }
    ['#min', '#cost', '#days'].forEach((s) => $(s).addEventListener('input', calc));
    function commute(m, d) { show('commute'); $('#min').value = m; $('#days').value = d; calc(); }

    // ---- the scales ----
    function items() {
      FD.segSet($('#who'), who);
      const L = B[who];
      $('#iG').innerHTML = L.good.map((t, i) => `<button class="hm-it ${on[who + 'g' + i] ? 'on' : ''}" data-k="${who}g${i}">${t}</button>`).join('');
      $('#iB').innerHTML = L.bad.map((t, i) => `<button class="hm-it bad ${on[who + 'b' + i] ? 'on' : ''}" data-k="${who}b${i}">${t}</button>`).join('');
      const nl = Object.keys(on).filter((k) => on[k] && k.startsWith(who + 'g')).length, nr = Object.keys(on).filter((k) => on[k] && k.startsWith(who + 'b')).length;
      $('#nL').textContent = nl; $('#nR').textContent = nr;
      const ang = FD.clamp((nr - nl) * 3, -14, 14);
      const r = ang * Math.PI / 180, dx = 140 * (1 - Math.cos(r)), dy = 140 * Math.sin(r);
      $('#beam').setAttribute('transform', `rotate(${ang} 210 40)`);
      $('#panL').setAttribute('transform', `translate(${dx.toFixed(1)} ${(-dy).toFixed(1)})`);
      $('#panR').setAttribute('transform', `translate(${(-dx).toFixed(1)} ${dy.toFixed(1)})`);
      $('#msg').className = 'verdict';
      $('#msg').innerHTML = `Working from home has benefits and drawbacks for both <b>individuals</b> and <b>organisations</b>. Press each one to put it on the scales.`;
    }
    function scale(w, keys) { show('scale'); who = w; (keys || []).forEach((k) => { on[k] = true; }); items(); }
    $('#who').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) scale(b.dataset.v); });
    root.querySelector('[data-panel="scale"]').addEventListener('click', (e) => { const b = e.target.closest('.hm-it'); if (b) { on[b.dataset.k] = !on[b.dataset.k]; items(); } });
    $('#clr').addEventListener('click', () => { on = {}; items(); });

    function reset() { gen++; on = {}; who = 'ind'; $('#min').value = 40; $('#cost').value = 6; $('#days').value = 3; era('paper'); $('#msg').innerHTML = ''; }
    reset();
    return { era, commute, scale, show, reset, destroy() { dead = true; } };
  },
  steps: [
    {
      title: 'Before the internet: the central office',
      text: `<p>Before the internet, offices were needed as a <b>central location</b> for people to discuss business and collect, distribute and file paperwork. Offices also let <b>managers supervise</b> employees.</p>
             <p>Many businesses still have set working hours, such as 09.00–17.00, and scheduled meetings.</p>`,
      async on(a) { a.reset(); },
    },
    {
      title: 'LANs, then the internet',
      text: `<p>Later, employees could use <b>LANs</b> to access shared storage and resources, but still had to be <b>within the office</b>.</p>
             <p>As computer systems became cheaper and more powerful, they began to be used at home. People can use devices from their employer, or their own, to connect to the internet and <b>work from home</b>.</p>`,
      tip: 'Key point: connected digital devices allow a decentralised, distributed approach.',
      async on(a, ctx) { a.era('lan'); if (!(await ctx.sleep(2200))) return; a.era('net'); },
    },
    {
      title: 'Benefits to individuals: no need to travel',
      text: `<p>No need to travel to work <b>reduces stress</b> caused by traffic, public transport delays and overcrowded transport, <b>saves money</b> and makes people feel they are helping the environment by <b>reducing travel emissions</b>.</p>
             <p>People can spend more time working or resting.</p>`,
      tip: 'Try it: change the journey time and the number of days.',
      async on(a, ctx) { a.commute(30, 2); if (!(await ctx.sleep(1500))) return; a.commute(60, 5); },
    },
    {
      title: 'More benefits to individuals',
      text: `<ul><li>no uniform or business clothes, which reduces cost</li><li>work at a time to suit them</li><li>work for longer without distractions from colleagues or meetings</li><li>work in a comfortable environment</li><li>organise work around social or family commitments.</li></ul>`,
      tip: 'Try it: put each benefit on the scales.',
      async on(a, ctx) { a.scale('ind'); for (let i = 0; i < 7; i++) { if (!(await ctx.sleep(350))) return; a.scale('ind', ['indg' + i]); } },
    },
    {
      title: 'Drawbacks to individuals',
      text: `<ul><li><b>distractions</b> at home, such as family and leisure activities</li><li>a lack of <b>social interaction</b> with colleagues</li><li>feeling <b>disconnected</b> from the company.</li></ul>`,
      async on(a, ctx) { a.scale('ind', [0, 1, 2, 3, 4, 5, 6].map((i) => 'indg' + i)); for (let i = 0; i < 3; i++) { if (!(await ctx.sleep(500))) return; a.scale('ind', ['indb' + i]); } },
    },
    {
      title: 'Benefits to organisations',
      text: `<ul><li>attract a talented, motivated workforce</li><li>employ people <b>located anywhere</b></li><li>no need to buy or rent <b>office space</b> or furniture</li><li>workers are not delayed by weather or transport issues</li><li>workers may work more effectively at home.</li></ul>`,
      async on(a, ctx) { a.scale('org'); for (let i = 0; i < 5; i++) { if (!(await ctx.sleep(400))) return; a.scale('org', ['orgg' + i]); } },
    },
    {
      title: 'Drawbacks to organisations',
      text: `<ul><li>concerns about <b>data security</b></li><li>more difficult to <b>manage and support</b> employees who are not in the office</li><li>employees at home might not work as hard</li><li>complicated to organise <b>payments and permissions</b> for workers in different countries.</li></ul>`,
      tip: 'Some organisations, like Google, provide perks such as sleep pods so employees feel more at home in the office.',
      async on(a, ctx) { a.scale('org', [0, 1, 2, 3, 4].map((i) => 'orgg' + i)); for (let i = 0; i < 4; i++) { if (!(await ctx.sleep(500))) return; a.scale('org', ['orgb' + i]); } },
    },
  ],
});

FD.activities({
  section: 'home',
  items: [
    {
      id: 'home-brazil',
      title: 'Changing office environments',
      task: '<p>Carry out an internet search using the key terms ‘Brazil movie Ministry of Information’ to find a clip set in the Ministry of Information in Terry Gilliam’s movie, <i>Brazil</i>. Compare this to a modern office environment. What is the same? What has changed?</p>',
      fields: ['What is the same?', 'What has changed?'],
      lines: 2,
    },
    {
      id: 'home-fried',
      title: 'Efficient ways of working',
      task: '<p>Carry out an internet search using the key terms ‘Jason Fried TED talk’ to watch Jason Fried talk about why offices are not the best places to get work done. Note his main arguments.</p>',
      lines: 4,
    },
    {
      id: 'home-improve',
      title: 'How to improve working from home',
      task: '<p>For each of the drawbacks that you have just read, suggest solutions that would make working from home better for individuals and organisations.</p>',
      fields: ['Distractions at home', 'Lack of social interaction with colleagues', 'Feeling disconnected from the company', 'Concerns about data security', 'Difficult to manage and support employees', 'Employees might not work as hard', 'Payments and permissions in different countries'],
      lines: 2,
      hint: 'Anything else…',
    },
    {
      id: 'home-letter',
      title: 'Perspectives on working from home · 1',
      task: '<p>Write a letter or email from an employee asking their employer to let them work from home. Explain how the internet makes it possible to work from home.</p>',
      lines: 7,
    },
    {
      id: 'home-reply',
      title: 'Perspectives on working from home · 2',
      task: '<p>Write a reply from the employer that explains the benefits and drawbacks for the organisation and the employee. Finish with a decision on whether or not the employer is going to let the employee work from home.</p>',
      lines: 8,
    },
  ],
});

FD.check({
  section: 'home',
  items: [
    { type: 'sort', q: 'Is each a benefit to <b>individuals</b> or to <b>organisations</b>?', bins: ['Individuals', 'Organisations'], rows: [['No need to rent office space or furniture', 1], ['Less stress from traffic and transport delays', 0], ['Can employ people located anywhere', 1], ['Can organise work around family commitments', 0], ['No need to wear a uniform or business clothes', 0]], why: 'Both individuals and organisations can benefit from working from home.' },
    { type: 'multi', q: 'State <b>two</b> drawbacks to <b>organisations</b> of employees working from home. <small>(Chapter question 3)</small>', need: 2, opts: [['Concerns about data security', true], ['More difficult to manage and support employees', true], ['Employees feel disconnected from the company', false], ['They must rent more office space', false]], why: 'Also: employees might not work as hard; payments and permissions for workers in different countries. Feeling disconnected is a drawback to individuals.' },
    { type: 'mcq', q: 'Why does working from home save individuals money?', opts: ['No travel costs and no need for business clothes', 'Their employer pays them more', 'Home internet is free', 'They do not pay tax'], why: 'Not travelling also reduces stress and emissions.' },
    { type: 'tf', q: 'The internet is decentralised: it is not controlled by any one individual or organisation.', a: true, why: 'Unlike the traditional central office.' },
  ],
});
