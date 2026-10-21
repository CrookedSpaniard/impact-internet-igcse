FD.add({
  id: 'positive',
  title: 'Positive impacts on organisations',
  tab: 'Positive',
  icon: 'positive',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Corporate communication', 'Providing information about a company for its employees, customers and the public, so they know what it is trying to achieve and have a good opinion of it.'],
    ['In-video advertising', 'Advertisements that appear within online videos.'],
    ['Viral marketing', 'Advertising in which computer users pass on advertising messages or images, sometimes without realising they are doing so.'],
    ['Cookies', 'Information that a website stores on a user’s computer so that the website recognises the user when they use it again.'],
    ['Profile', 'A compilation of personal information about an individual.'],
    ['Big data', 'The analysis of huge quantities of data collected from many sources (smartphones, online applications, social media, payment systems) to find patterns of behaviour and interactions.'],
  ],
  mount(el) {
    // Figure 7.12: a charity and the internet services it uses.
    const MAP = [
      ['🌐', 'Own website', [250, 105], [['Displays goals', 250, 35], ['Explains fundraising activities', 105, 62], ['Hosts contact forms', 85, 150]]],
      ['💳', 'Payment processors (such as PayPal)', [450, 95], [['Collecting donations', 520, 30]]],
      ['👥', 'Social networks', [570, 200], [['Connecting volunteers and donors', 650, 115], ['Viral marketing', 704, 200], ['Advertising on networks', 676, 285]]],
      ['🍪', 'Cookies', [500, 290], [['Tracking donors’ online activities', 650, 322]]],
      ['✉️', 'Emails', [330, 310], [['Getting donor feedback', 150, 345], ['Communicating with people on mailing list', 290, 380], ['Business communications', 480, 352]]],
      ['▶️', 'Video-sharing websites', [190, 220], [['Promotional videos', 75, 250], ['Advertising on videos', 85, 300]]],
    ];
    const CITIES = [['🇬🇧', 'London', 0, '#1c7ed6'], ['🇺🇸', 'Los Angeles', -8, '#d6336c'], ['🇸🇬', 'Singapore', 8, '#e67700']];
    const GAMES = [['🏎️', 'Turbo Kart', [3, 2, 4, 3]], ['🐉', 'Dragon Quest X', [9, 8, 9, 7]], ['⚽', 'Pro Football 26', [6, 7, 5, 8]], ['🧩', 'Puzzle Park', [2, 1, 2, 1]]];
    const SRC = ['💬 Social media posts', '🌐 Web browsing patterns', '⭐ Movie ratings', '🧾 Current game sales'];
    el.innerHTML = `
      <div class="sim po-s">
        <div class="ptabs"><button data-p="comms">📣 Improved communication</button><button data-p="market">🌍 Global markets</button><button data-p="work">🕐 Global workforce</button><button data-p="data">📊 Big data</button></div>
        <div data-panel="comms">
          <div class="sim-box"><svg viewBox="0 0 760 395" id="cmap" role="img" aria-label="Figure 7.12: a charity uses many internet services"></svg><p class="note" id="cT">Press a service to see how the charity uses it.</p></div>
        </div>
        <div data-panel="market" hidden>
          <div class="ctrls"><span class="seg" id="kind"><button data-v="cd">💿 Physical album (CD)</button><button data-v="dl">⬇️ Digital download</button></span><button class="btn primary" id="sell">🌍 Sell to 6 countries</button></div>
          <div class="sim-box"><svg viewBox="0 0 600 220" id="world"></svg></div>
          <div class="readout" id="mRo"></div>
        </div>
        <div data-panel="work" hidden>
          <label class="rng"><span>Time now (UK time, UTC) <output id="tOut">10:00</output></span><input type="range" id="utc" min="0" max="23" value="10"></label>
          <div class="sim-box"><div class="po-24" id="bar24"></div><div class="po-cities" id="cities"></div></div>
          <div class="sim-box po-call"><span class="po-ph">☎️</span><p id="call"></p></div>
        </div>
        <div data-panel="data" hidden>
          <div class="po-data">
            <div class="sim-box"><h5 class="mw-h">Data sources</h5><ul class="po-src" id="src">${SRC.map((s, i) => `<li data-s="${i}">${s}</li>`).join('')}</ul><button class="btn primary" id="an">⚙️ Analyse the big data</button></div>
            <div class="sim-box"><h5 class="mw-h">Predicted demand in six months</h5><div id="pred">${GAMES.map(([e, n], i) => `<div class="po-g"><span>${e} ${n}</span><div class="rm-meter"><i data-g="${i}"></i></div><b data-v="${i}">?</b></div>`).join('')}</div>
              <div class="chk-btns"><button class="btn" id="ordP" disabled>📦 Order stock from the prediction</button><button class="btn ghost" id="ordE">📦 Order the same of each</button></div></div>
          </div>
          <div class="sim-box" id="out" hidden></div>
        </div>
        <p class="verdict" id="msg"></p>
      </div>`;
    const root = el.querySelector('.po-s'), $ = (s) => root.querySelector(s);
    let dead = false, gen = 0;
    const show = FD.panels(root, () => { gen++; $('#msg').innerHTML = ''; });

    // ---- Figure 7.12 ----
    const CX = 380, CY = 200;
    function drawMap(sel) {
      let s = '';
      MAP.forEach(([e, n, [x, y], uses], i) => {
        s += `<line class="po-ln" x1="${CX}" y1="${CY}" x2="${x}" y2="${y}"/>`;
        if (sel === i || sel === 'all') uses.forEach(([u, ux, uy]) => { s += `<line class="po-ln on" x1="${x}" y1="${y}" x2="${ux}" y2="${uy}"/><g class="po-use new"><rect x="${ux - u.length * 2.9 - 9}" y="${uy - 13}" width="${u.length * 5.8 + 18}" height="26" rx="5"/><text class="svg-sm" x="${ux}" y="${uy + 4}">${u}</text></g>`; });
      });
      MAP.forEach(([e, n, [x, y]], i) => { s += `<g class="po-svc ${sel === i ? 'on' : ''}" data-i="${i}"><rect x="${x - 82}" y="${y - 16}" width="164" height="32" rx="8"/><text class="svg-lbl" x="${x}" y="${y + 4}">${e} ${n.replace(/ \(.*\)/, '')}</text></g>`; });
      s += `<g class="po-ctr"><circle cx="${CX}" cy="${CY}" r="34"/><text class="svg-lbl" x="${CX}" y="${CY + 4}">❤️ Charity</text></g>`;
      $('#cmap').innerHTML = s;
      if (typeof sel === 'number') $('#cT').innerHTML = `<b>${MAP[sel][0]} ${MAP[sel][1]}</b>: ${MAP[sel][3].map((u) => u[0]).join(' · ').toLowerCase()}.`;
    }
    function svc(i) { show('comms'); drawMap(i); }
    $('#cmap').addEventListener('click', (e) => { const g = e.target.closest('.po-svc'); if (g) svc(+g.dataset.i); });

    // ---- global markets ----
    const PL = [[90, 80, '🇨🇦'], [150, 150, '🇧🇷'], [300, 60, '🇩🇪'], [320, 140, '🇳🇬'], [470, 80, '🇯🇵'], [500, 165, '🇦🇺']];
    let kind = 'cd';
    function world(sent) {
      $('#world').innerHTML = `<rect class="po-sea" x="0" y="0" width="600" height="220" rx="12"/>
        <text x="250" y="110" class="emo" font-size="30">🏭</text><text class="svg-sm" x="250" y="135">Your company (Spain)</text>
        ${PL.map(([x, y, f]) => `<text x="${x}" y="${y}" class="emo" font-size="24">${f}</text>`).join('')}<g id="fly"></g>`;
      FD.segSet($('#kind'), kind);
      const unit = 5, pack = kind === 'cd' ? 1.2 : 0, post = kind === 'cd' ? 4.5 : 0;
      $('#mRo').innerHTML = `<span class="ro"><small>Making each copy</small><b>€${kind === 'cd' ? unit.toFixed(2) : '0.00'}</b></span><span class="ro ${pack ? 'bad' : 'good'}"><small>Packaging</small><b>€${pack.toFixed(2)}</b></span><span class="ro ${post ? 'bad' : 'good'}"><small>Postage</small><b>€${post.toFixed(2)}</b></span><span class="ro"><small>Delivery time</small><b>${kind === 'cd' ? '5–15 days' : 'seconds'}</b></span>${sent ? `<span class="ro good"><small>Countries reached</small><b>6</b></span>` : ''}`;
    }
    async function sell(k) {
      show('market');
      const g = ++gen;
      if (k) kind = k;
      world(false);
      $('#msg').className = 'verdict'; $('#msg').innerHTML = 'The internet makes it easier to <b>advertise and sell</b> to customers in countries around the world.';
      await FD.tween(kind === 'cd' ? 2200 : 900, (t) => {
        if (g !== gen) return;
        $('#fly').innerHTML = PL.map(([x, y]) => { const px = 255 + (x - 255) * t, py = 105 + (y - 105) * t; return `<text x="${px}" y="${py}" class="emo" font-size="16">${kind === 'cd' ? '📦' : '💾'}</text>`; }).join('');
      });
      if (dead || g !== gen) return;
      world(true);
      if (kind === 'dl') { $('#msg').className = 'verdict good'; $('#msg').innerHTML = 'Producers of digital content sell online <b>without physical packaging</b> and avoid <b>postage charges</b>.'; }
    }
    $('#kind').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) { kind = b.dataset.v; world(false); } });
    $('#sell').addEventListener('click', () => sell());

    // ---- global workforce (Figure 7.13) ----
    $('#bar24').innerHTML = CITIES.map(([f, n, off, c]) => { const a = (9 - off + 24) % 24; return [[a, Math.min(24, a + 8)], a + 8 > 24 ? [0, a + 8 - 24] : null].filter(Boolean).map(([x, y]) => `<span style="left:${x / 24 * 100}%;width:${(y - x) / 24 * 100}%;background:${c}">${y - x >= 4 ? f + ' ' + n : f}</span>`).join(''); }).join('') + '<i id="now"></i>';
    function clock(h) {
      show('work');
      $('#utc').value = h;
      $('#tOut').textContent = String(h).padStart(2, '0') + ':00';
      $('#now').style.left = ((h + 0.5) / 24 * 100) + '%';
      let who = null;
      $('#cities').innerHTML = CITIES.map(([f, n, off, c]) => {
        const l = (h + off + 24) % 24, on = l >= 9 && l < 17, day = l >= 7 && l < 20;
        if (on) who = [f, n, c];
        return `<div class="po-city ${on ? 'on' : ''}" style="--c:${c}"><span class="po-sun">${day ? '☀️' : '🌙'}</span><b>${f} ${n}</b><small>UTC${off >= 0 ? '+' : '−'}${Math.abs(off)}</small><span class="po-t">${String(l).padStart(2, '0')}:00</span><em>${on ? 'Team working 09:00–17:00' : 'Team off (not working)'}</em></div>`;
      }).join('');
      $('#call').innerHTML = `A customer calls at ${String(h).padStart(2, '0')}:00 UK time → answered by the team in <b style="color:${who[2]}">${who[0]} ${who[1]}</b>, working in daylight hours in their local area.`;
      $('#msg').className = 'verdict good';
      $('#msg').innerHTML = 'Three teams in three time zones, each working one 8-hour shift: 3 × 8 = <b>24-hour</b> customer support.';
    }
    $('#utc').addEventListener('input', (e) => clock(+e.target.value));
    async function sweep() { const g = ++gen; for (let h = 6; h < 30; h += 2) { clock(h % 24); gen = g; await FD.wait(450); if (dead || g !== gen) return; } }

    // ---- big data ----
    let pred = null;
    async function analyse() {
      show('data');
      const g = ++gen;
      $('#out').hidden = true;
      for (let i = 0; i < SRC.length; i++) {
        root.querySelectorAll('#src li').forEach((li) => li.classList.toggle('on', +li.dataset.s <= i));
        await FD.wait(450); if (dead || g !== gen) return;
      }
      pred = GAMES.map(([, , s]) => s.reduce((a, b) => a + b, 0));
      const max = Math.max(...pred);
      await FD.tween(900, (t) => { if (g === gen) GAMES.forEach((_, i) => { root.querySelector(`[data-g="${i}"]`).style.width = (100 * pred[i] / max * t) + '%'; }); });
      if (dead || g !== gen) return;
      GAMES.forEach((_, i) => { root.querySelector(`[data-v="${i}"]`).textContent = FD.fmt(pred[i] * 150); });
      $('#ordP').disabled = false;
      $('#msg').className = 'verdict'; $('#msg').innerHTML = '📊 Patterns in the data predict which game will sell best in six months’ time.';
    }
    function order(useP) {
      show('data');
      const sales = GAMES.map(([, , s]) => s.reduce((a, b) => a + b, 0) * 150);
      const total = sales.reduce((a, b) => a + b, 0);
      const stock = useP && pred ? pred.map((p) => p * 150) : GAMES.map(() => Math.round(total / 4));
      let html = '<h5 class="mw-h">Six months later…</h5><table class="tbl"><thead><tr><th>Game</th><th>Stock bought</th><th>Customers wanted</th><th>Result</th></tr></thead><tbody>';
      let bad = 0;
      GAMES.forEach(([e, n], i) => {
        const d = stock[i] - sales[i];
        const r = d < 0 ? `<span class="bad-t">✗ Sold out: ${FD.fmt(-d)} customers disappointed</span>` : d > 0 ? `<span class="bad-t">✗ ${FD.fmt(d)} copies left unsold</span>` : '<span class="good-t">✓ Just right</span>';
        if (d) bad++;
        html += `<tr><td>${e} ${n}</td><td>${FD.fmt(stock[i])}</td><td>${FD.fmt(sales[i])}</td><td>${r}</td></tr>`;
      });
      $('#out').innerHTML = html + '</tbody></table>';
      $('#out').hidden = false;
      $('#msg').className = 'verdict ' + (bad ? 'bad' : 'good');
      $('#msg').innerHTML = bad ? 'Without big data, the retailer bought too much of some games and too little of others.' : '✓ Using <b>big data</b>, the retailer bought enough stock to meet demand and did not buy too much of games that will not be popular.';
    }
    $('#an').addEventListener('click', analyse);
    $('#ordP').addEventListener('click', () => order(true));
    $('#ordE').addEventListener('click', () => order(false));

    function reset() { gen++; pred = null; kind = 'cd'; drawMap(null); $('#cT').textContent = 'Press a service to see how the charity uses it.'; world(false); clock(10); $('#ordP').disabled = true; $('#out').hidden = true; root.querySelectorAll('#src li').forEach((li) => li.classList.remove('on')); root.querySelectorAll('[data-g]').forEach((b) => { b.style.width = '0'; }); root.querySelectorAll('#pred b').forEach((b) => { b.textContent = '?'; }); show('comms'); $('#msg').innerHTML = ''; }
    reset();
    return { svc, all: () => { show('comms'); drawMap('all'); }, sell, clock, sweep, analyse, order, show, reset, destroy() { dead = true; } };
  },
  steps: [
    {
      title: 'Improved communication',
      text: `<p>Organisations can communicate and interact with their customers and employees more easily and in <b>real time</b> using email, instant messaging and social media.</p>
             <p>They can provide up-to-date information about the development, pricing and availability of products, and publish live information so people can follow their activities.</p>`,
      tip: 'Try it: press each service around the charity (Figure 7.12).',
      async on(a, ctx) { a.reset(); for (const i of [0, 1, 2]) { if (!(await ctx.sleep(1300))) return; a.svc(i); } },
    },
    {
      title: 'How a charity uses internet services',
      text: `<p>Figure 7.12 shows a charity using its own website, payment processors, social networks (<b>viral marketing</b>), <b>cookies</b>, emails and video-sharing websites (<b>in-video advertising</b>) to communicate with different groups of people.</p>
             <p>This is <b>corporate communication</b>.</p>`,
      async on(a, ctx) { for (const i of [3, 4, 5]) { a.svc(i); if (!(await ctx.sleep(1300))) return; } a.all(); },
    },
    {
      title: 'Access to global markets',
      text: `<p>The internet makes it easier for organisations to <b>advertise and sell</b> to customers in countries around the world.</p>
             <p>Producers of <b>digital content</b> can sell online without physical packaging and avoid postage charges. Manufacturers also have easier access to businesses that produce materials and parts.</p>`,
      tip: 'Try it: sell the CD, then sell the download.',
      async on(a, ctx) { await a.sell('cd'); if (!(await ctx.sleep(1000))) return; await a.sell('dl'); },
    },
    {
      title: 'Access to a global workforce',
      text: `<p>Organisations can employ people in <b>other countries</b>, so they can be more selective when hiring, use different <b>skills</b> and <b>time zones</b>, and may reduce costs because people in some countries accept lower wages.</p>
             <p>Figure 7.13: three teams in three time zones cover all 24 hours with three 8-hour shifts (3 × 8 = 24).</p>`,
      tip: 'Try it: move the time slider. Who answers the phone?',
      async on(a) { await a.sweep(); },
    },
    {
      title: 'Big data',
      text: `<p>Organisations use <strong>big data</strong> to understand customers’ behaviour, improve the customer experience and make processes more efficient.</p>
             <p>A computer game retailer analyses social media posts, web browsing patterns, movie ratings and current game sales to <b>predict which game will sell best</b> in six months’ time.</p>`,
      tip: 'Try it: analyse the data, then order stock both ways.',
      async on(a, ctx) { await a.analyse(); if (!(await ctx.sleep(1200))) return; a.order(true); },
    },
    {
      title: 'Big data from weather sensors',
      text: `<p>Weather data from hundreds of thousands of sensors, smartphones and aircraft helps organisations understand how weather affects their services:</p>
             <ul><li><b>supermarkets</b> change the products or staff they need</li><li><b>energy suppliers</b> calculate how many people will need heating</li><li><b>governments</b> predict and warn of extreme weather, protecting property and saving lives.</li></ul>`,
      async on(a) { a.show('data'); },
    },
  ],
});

FD.activities({
  section: 'positive',
  items: [
    {
      id: 'positive-politics',
      title: 'Social media and politics',
      task: '<p>Investigate some of the ways in which political organisations have used social media to communicate with voters during recent campaigns.</p>',
      lines: 5,
    },
    {
      id: 'positive-zones',
      title: 'Using different time zones',
      task: '<p>A company employs people in your country from 09.00 until 17.00. Find two other countries in which it could employ people to work the same times of day while still ensuring that the company provides 24-hour customer support.</p>',
      fields: ['Country 1 (and its time difference)', 'Country 2 (and its time difference)'],
      lines: 2,
      hint: 'Show your working: each team covers 8 hours…',
      sim: ['positive', 'Use the time zone simulation'],
    },
  ],
});

FD.check({
  section: 'positive',
  items: [
    { type: 'mcq', q: 'What is <b>viral marketing</b>?', opts: ['Advertising in which users pass on advertising messages or images, sometimes without realising', 'Advertising that contains a computer virus', 'Adverts shown inside online videos', 'Emails sent to a mailing list'], why: 'Adverts inside online videos are in-video advertising.' },
    { type: 'mcq', q: 'Why can producers of digital content sell more cheaply around the world?', opts: ['They do not need physical packaging and avoid postage charges', 'Digital content is always free', 'They do not pay their workers', 'The internet pays for delivery'], why: 'The internet gives access to global markets.' },
    { type: 'mcq', q: 'How can three teams provide 24-hour customer support while all work in daylight hours?', opts: ['Each team is in a different time zone and works one 8-hour shift', 'Each team works 24 hours', 'They take turns working at night', 'They use one team in one country'], why: '3 × 8 = 24 (Figure 7.13).' },
    { type: 'mcq', q: 'What is <b>big data</b>?', opts: ['The analysis of huge quantities of data from many sources to find patterns of behaviour', 'A very large hard disk', 'A database with one table', 'Data that is too big to email'], why: 'For example, predicting which game will sell best in six months’ time.' },
  ],
});
