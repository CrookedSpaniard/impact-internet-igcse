FD.add({
  id: 'gap',
  title: 'Information gap and socialising',
  tab: 'Info gap',
  icon: 'gap',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Information gap', 'The divide between people who have access to online information and people who do not.'],
    ['Information rich', 'People with good access to information provided by communication technologies.'],
    ['Information poor', 'People with limited access to information provided by communication technologies.'],
    ['Status update', 'A message or post that a user adds to their own social media page to inform others of something they consider important enough to share.'],
  ],
  mount(el) {
    const LEVELS = {
      none: { n: '🚫 No phone', price: 200, buyers: 1, srv: [] },
      sms: { n: '💬 SMS only', price: 260, buyers: 3, srv: ['💶 Prices from several buyers', '🌧️ Weather forecast updates'] },
      net: { n: '🌐 Internet', price: 275, buyers: 12, srv: ['💶 Prices from many buyers', '🌧️ Weather forecasts', '💬 Communication', '📰 News', '🎬 Entertainment', '🛒 Goods', '🏦 Banking', '🧾 Tax', '🚗 Driving licence applications'] },
    };
    el.innerHTML = `
      <div class="sim gp-s">
        <div class="ptabs"><button data-p="gap">📊 The information gap</button><button data-p="sms">🌾 Farmers and SMS</button><button data-p="soc">📱 Ways of socialising</button></div>
        <div data-panel="gap">
          <div class="ctrls"><span class="seg" id="era"><button data-v="before">📺 Before the internet</button><button data-v="after">🌐 With the internet</button></span></div>
          <div class="two-col">
            ${[['rich', '🧑‍💻', 'Information rich'], ['poor', '🧑‍🌾', 'Information poor']].map(([k, e, n]) => `
            <div class="sim-box gp-p" id="p-${k}"><div class="gp-face">${e}</div><b>${n}</b>
              <div class="gp-r"><small>Information available</small><div class="rm-meter"><i id="i-${k}"></i></div></div>
              <div class="gp-r"><small>Education and decision-making</small><div class="rm-meter"><i id="d-${k}"></i></div></div>
              <div class="chips" id="s-${k}"></div></div>`).join('')}
          </div>
          <div class="readout"><span class="ro bad"><small>The gap</small><b id="gapN">0</b></span></div>
        </div>
        <div data-panel="sms" hidden>
          <div class="ctrls"><span class="seg" id="lvl">${Object.entries(LEVELS).map(([k, l]) => `<button data-v="${k}">${l.n}</button>`).join('')}</span><button class="btn primary" id="sell">🌾 Sell the rice harvest</button></div>
          <div class="two-col">
            <div class="sim-box"><h5 class="mw-h">Offers from buyers</h5><ul class="gp-offers" id="offers"></ul><div class="readout"><span class="ro" id="pRo"><small>Best price per tonne</small><b id="price">—</b></span></div></div>
            <div class="sim-box"><h5 class="mw-h">What the farmer can access</h5><div class="chips" id="srv"></div></div>
          </div>
        </div>
        <div data-panel="soc" hidden>
          <label class="rng"><span>Hours a day looking at screens <output id="hOut">2 h</output></span><input type="range" id="hrs" min="0" max="10" value="2"></label>
          <div class="two-col">
            <div class="sim-box"><h5 class="mw-h">📱 Status updates</h5><ul class="gp-feed" id="feed"></ul></div>
            <div class="sim-box"><div class="readout" id="sRo"></div><p class="note" id="sT"></p></div>
          </div>
        </div>
        <p class="verdict" id="msg"></p>
      </div>`;
    const root = el.querySelector('.gp-s'), $ = (s) => root.querySelector(s);
    let dead = false, gen = 0, lvl = 'none';
    const show = FD.panels(root, () => { gen++; $('#msg').innerHTML = ''; });

    // ---- the information gap ----
    async function era(v) {
      show('gap');
      const g = ++gen;
      FD.segSet($('#era'), v);
      const after = v === 'after';
      const R = after ? 100 : 35, P = after ? 14 : 10;
      $('#s-rich').innerHTML = ['📺 TV', '📰 Newspapers', '📚 Books'].concat(after ? ['🌐 Online news', '🎓 Online courses', '🏦 Online services'] : []).map((t) => `<span class="pill g">${t}</span>`).join('');
      $('#s-poor').innerHTML = ['📻 Radio'].concat(after ? ['💬 SMS'] : []).map((t) => `<span class="pill r">${t}</span>`).join('');
      const from = { r: parseFloat($('#i-rich').style.width) || 0, p: parseFloat($('#i-poor').style.width) || 0 };
      await FD.tween(900, (t) => {
        if (g !== gen) return;
        const r = from.r + (R - from.r) * t, p = from.p + (P - from.p) * t;
        $('#i-rich').style.width = $('#d-rich').style.width = r + '%';
        $('#i-poor').style.width = $('#d-poor').style.width = p + '%';
        $('#i-poor').classList.add('bad'); $('#d-poor').classList.add('bad');
        $('#gapN').textContent = Math.round(r - p) + ' points';
      });
      if (dead || g !== gen) return;
      $('#msg').className = 'verdict' + (after ? ' bad' : '');
      $('#msg').innerHTML = after ? 'The internet has <b>widened the gap</b>: much more information is available online, and it is unavailable to people without internet access.'
        : 'The information gap existed before the internet: some people had more access than others to TV, newspapers and books.';
    }
    $('#era').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) era(b.dataset.v); });

    // ---- farmers and SMS ----
    function level(v) {
      show('sms');
      lvl = v;
      FD.segSet($('#lvl'), v);
      $('#srv').innerHTML = LEVELS[v].srv.map((s) => `<span class="pill g new">${s}</span>`).join('') || '<span class="note">Only what people nearby can tell them.</span>';
      $('#offers').innerHTML = ''; $('#price').textContent = '—'; $('#pRo').className = 'ro';
    }
    async function sell(v) {
      if (v) level(v); else show('sms');
      const g = ++gen, L = LEVELS[lvl];
      $('#offers').innerHTML = '';
      const offers = Array.from({ length: Math.min(L.buyers, 5) }, (_, i) => (i === 0 ? L.price : L.price - 10 - i * 12));
      if (L.buyers === 1) offers[0] = L.price;
      for (let i = 0; i < offers.length; i++) {
        await FD.wait(450); if (dead || g !== gen) return;
        $('#offers').appendChild(FD.h(`<li class="new">${L.buyers === 1 ? '🚚 The only local buyer' : `💬 Buyer ${i + 1}`}: €${offers[i]} per tonne</li>`));
      }
      if (L.buyers > 5) $('#offers').appendChild(FD.h(`<li class="note">…and ${L.buyers - 5} more online</li>`));
      $('#price').textContent = '€' + Math.max(...offers);
      $('#pRo').className = 'ro ' + (lvl === 'none' ? 'bad' : 'good');
      $('#msg').className = 'verdict' + (lvl === 'none' ? ' bad' : ' good');
      $('#msg').innerHTML = { none: 'Without information, the farmer has to accept whatever price is offered.', sms: 'People without internet access have alternatives: mobile networks give <b>SMS</b> access, so farmers in remote areas can contact buyers to get a <b>fair price</b>, and receive <b>weather forecast updates</b> to protect their farms.', net: 'SMS does not give as much access as the internet. With the internet, people have greater access to communication, news, entertainment, goods, banking and services like tax and driving licence applications.' }[lvl];
    }
    $('#lvl').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) level(b.dataset.v); });
    $('#sell').addEventListener('click', () => sell());

    // ---- ways of socialising ----
    const POSTS = [['Marta', '🏖️ At the beach with my cousins!'], ['Leo', '🎮 New high score!!'], ['Mum', '🍝 Making pasta for dinner'], ['Unknown_88', '👋 Thanks for accepting my friend request'], ['Sara', '📚 Revising for the ICT test…']];
    function soc(h) {
      show('soc');
      if (h != null) $('#hrs').value = h;
      const v = +$('#hrs').value;
      $('#hOut').textContent = v + ' h';
      $('#feed').innerHTML = POSTS.slice(0, 1 + Math.min(4, Math.floor(v / 2))).map(([n, t]) => `<li><b>${n}</b> ${t}</li>`).join('');
      const fam = Math.max(0.3, 4 - v * 0.35), online = 40 + v * 55;
      $('#sRo').innerHTML = `<span class="ro"><small>Social media ‘friends’</small><b>${FD.fmt(online)}</b></span><span class="ro ${v >= 6 ? 'bad' : ''}"><small>Time with family and local community</small><b>${fam.toFixed(1)} h</b></span><span class="ro"><small>Close friends you meet</small><b>${Math.max(1, 6 - Math.floor(v / 2))}</b></span>`;
      $('#sT').innerHTML = v >= 6 ? 'Spending most of the time looking at screens can make people <b>isolated from their own families and local communities</b>. Thanks to status updates you no longer have to ask your family what they are doing.' : 'People can connect with people around the world whom they have never met.';
      $('#msg').className = 'verdict' + (v >= 6 ? ' bad' : '');
      $('#msg').innerHTML = v >= 6 ? 'Some people argue that social media makes friendship meaningless: even <b>complete strangers</b> can be labelled ‘friends’.' : '';
    }
    $('#hrs').addEventListener('input', () => soc());

    function reset() { gen++; ['rich', 'poor'].forEach((k) => { $('#i-' + k).style.width = '0'; $('#d-' + k).style.width = '0'; }); level('none'); soc(2); era('before'); $('#msg').innerHTML = ''; }
    reset();
    return { era, level, sell, soc, show, reset, destroy() { dead = true; } };
  },
  steps: [
    {
      title: 'Information rich and information poor',
      text: `<p>The growth of the internet has created a divide between people who have access to online information and people who do not: the <b>information gap</b>.</p>
             <p><strong>Information rich</strong> people have good access to information, which improves their education and their ability to <b>make decisions</b>. <strong>Information poor</strong> people have reduced access.</p>`,
      async on(a) { a.reset(); await a.era('before'); },
    },
    {
      title: 'The internet has widened the gap',
      text: `<p>The information gap existed before the internet: some people had more access than others to TV, newspapers and books.</p>
             <p>The internet has <b>widened the gap</b>, because it has increased the amount of information available online, which is unavailable to people without internet access.</p>`,
      tip: 'Try it: switch between “Before the internet” and “With the internet”.',
      async on(a) { await a.era('after'); },
    },
    {
      title: 'Alternatives: SMS',
      text: `<p>People without internet access have some alternatives. Mobile networks provide <b>SMS</b> (text messages), so farmers in remote areas can contact buyers to get a <b>fair price</b> for their produce, and receive <b>weather forecast updates</b> to protect their farms.</p>`,
      tip: 'Try it: sell the harvest with no phone, then with SMS.',
      async on(a, ctx) { await a.sell('none'); if (!(await ctx.sleep(1400))) return; await a.sell('sms'); },
    },
    {
      title: 'SMS is not the internet',
      text: `<p>Mobile text message services do not provide as much access to services and information as the internet.</p>
             <p>With the internet, people have greater access to <b>communication, news, entertainment, goods, banking</b> and services like <b>tax</b> and applications for <b>driving licences</b>.</p>`,
      async on(a) { await a.sell('net'); },
    },
    {
      title: 'Changes in ways of socialising',
      text: `<p>As people use the internet more, they spend more time in the <b>virtual world</b> than the real world. It has arguably affected the way people think and their ability to form relationships.</p>
             <p>People can connect with people around the world whom they have <b>never met</b>.</p>`,
      async on(a) { a.soc(2); },
    },
    {
      title: 'Isolated from family and community?',
      text: `<p>The internet can also make people <b>isolated</b> from their own families and local communities, as they spend most of their time looking at screens. Friends’ and family’s <strong>status updates</strong> mean you no longer have to ask them what they are doing.</p>
             <p>Some argue social media makes friendship <b>meaningless</b>: even complete strangers can be labelled ‘friends’.</p>`,
      tip: 'Try it: move the screen-time slider.',
      async on(a, ctx) { for (const h of [4, 6, 8]) { a.soc(h); if (!(await ctx.sleep(900))) return; } },
    },
  ],
});

FD.check({
  section: 'gap',
  items: [
    { type: 'mcq', q: 'Who are <b>information poor</b> people?', opts: ['People with limited access to information provided by communication technologies', 'People with no money', 'People who do not read books', 'People who post too much information'], why: 'Reduced access decreases their education and ability to make decisions.' },
    { type: 'mcq', q: 'Describe the effect of the internet on the information gap. <small>(Chapter question 10)</small>', opts: ['It has widened the gap, because much more information is available online and unavailable to people without access', 'It has closed the gap completely', 'It created the gap, which did not exist before', 'It has had no effect'], why: 'The gap existed before, with TV, newspapers and books.' },
    { type: 'tf', q: 'SMS messages give farmers in remote areas as much access to services and information as the internet.', a: false, why: 'SMS helps (fair prices, weather updates), but the internet gives far more access.' },
    { type: 'mcq', q: 'What is a <b>status update</b>?', opts: ['A message or post a user adds to their own social media page to inform others', 'A software update for a phone', 'A notice that a website is offline', 'A private message to one friend'], why: 'Status updates mean you no longer have to ask family and friends what they are doing.' },
  ],
});
