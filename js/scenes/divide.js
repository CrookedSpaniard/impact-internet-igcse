FD.add({
  id: 'divide',
  title: 'The digital divide',
  tab: 'Digital divide',
  icon: 'divide',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Digital divide', 'The gap between people who have access to digital devices and the internet and people who do not.'],
    ['Inclusive', 'Making sure that all individuals and sections of society are included in or have access to something.'],
    ['Infrastructure', 'The networks, cables and masts a country needs to provide access to networks and the internet.'],
  ],
  mount(el) {
    // Figure 7.15 (billions of people).
    const YRS = [2000, 2002, 2004, 2006, 2008, 2010, 2012, 2014, 2016];
    const POP = [6.14, 6.30, 6.46, 6.62, 6.78, 6.95, 7.12, 7.30, 7.46];
    const NET = [0.41, 0.66, 0.91, 1.16, 1.57, 2.02, 2.50, 2.93, 3.42];
    const REG = [['North America', 88], ['Europe', 77], ['Oceania', 68], ['Latin America', 59], ['Middle East', 57], ['Asia', 46], ['Africa', 28]];
    const F = [
      ['eco', 'Economy and infrastructure', ['Advanced economy', 'Emerging or developing economy'], 30, 'Advanced economies can afford the infrastructure for networks and the internet. In emerging and developing economies, governments may prioritise other needs, such as food and healthcare.'],
      ['loc', 'Location', ['Town or city', 'Remote area (forest, mountains)'], 25, 'Wireless signals or cabling may not reach rural or remote locations, such as heavily forested and mountainous areas.'],
      ['pol', 'Politics', ['Open access', 'Government restricts access'], 25, 'Some governments prevent or reduce internet access, block certain websites or content from other countries, or ban satellite receivers.'],
      ['rel', 'Religion', ['No restriction', 'Religion bans some technologies'], 30, 'Some religions ban certain technologies, e.g. Old Order Amish communities in the USA do not use radio, television or the internet.'],
      ['dis', 'Disability', ['Devices designed to be inclusive', 'Devices not inclusive'], 15, 'If devices are not designed to be inclusive, people with disabilities find technology harder to use and may rely on adaptations.'],
      ['age', 'Age', ['Younger', 'Older person'], 10, 'Social factor: older people often have reduced access.'],
      ['edu', 'Education', ['Higher level of education', 'Lower level of education'], 10, 'Social factor: people with a lower level of education often have reduced access.'],
      ['inc', 'Income', ['Higher income', 'Lower income'], 15, 'Social factor: there is a close relationship between income and access to technology (Figure 7.17).'],
      ['gen', 'Gender', ['Male', 'Female'], 8, 'Social factor: in many countries, women are less likely than men to access the internet or own a smartphone (Figure 7.18).'],
    ];
    const IMP = [
      ['💬', 'Communication', 'Talk to people anywhere; learn about other cultures', 'More isolated; less understanding of different cultures'],
      ['🛒', 'Goods and services', 'Find bargains and good deals', 'Harder to find bargains and good deals'],
      ['🎬', 'Entertainment', 'Access to popular culture', 'Less access to popular culture'],
      ['🎓', 'Education', 'More employment opportunities', 'Fewer employment opportunities'],
    ];
    el.innerHTML = `
      <div class="sim dd-s">
        <div class="ptabs"><button data-p="chart">📈 Who is online?</button><button data-p="factors">🧩 Causes of unequal access</button><button data-p="impact">🏘️ Limited or no access</button></div>
        <div data-panel="chart">
          <div class="two-col">
            <div class="sim-box"><h5 class="mw-h">Internet users vs world population (Figure 7.15)</h5><svg viewBox="0 0 340 220" id="ch"></svg>
              <label class="rng"><span>Year <output id="yOut">2016</output></span><input type="range" id="yr" min="0" max="8" value="8"></label>
              <div class="readout"><span class="ro"><small>World population</small><b id="rP"></b></span><span class="ro"><small>Internet users</small><b id="rN"></b></span><span class="ro"><small>Online</small><b id="rPc"></b></span></div></div>
            <div class="sim-box"><h5 class="mw-h">Share of people online by region (about 2016)</h5><div id="reg">${REG.map(([n, v]) => `<div class="dd-reg"><span>${n}</span><div class="dd-bar"><i style="--w:${v}%;background:${v >= 70 ? '#2f9e44' : v >= 55 ? '#94d82d' : v >= 40 ? '#fab005' : '#e03131'}"></i></div><b>${v}%</b></div>`).join('')}</div>
              <p class="note">Like Figure 7.16: green = high percentages online, red = low. The proportion is smaller in Africa and South Asia.</p></div>
          </div>
        </div>
        <div data-panel="factors" hidden>
          <div class="dd-fac">
            <div class="dd-list" id="fl">${F.map(([k, n, [a, b]]) => `<div class="dd-f" data-k="${k}"><b>${n}</b><span class="seg"><button data-v="0">${a}</button><button data-v="1">${b}</button></span></div>`).join('')}</div>
            <div class="sim-box dd-meter"><div class="dd-face" id="face">🧑</div><div class="dd-gauge"><i id="gauge"></i></div><b id="acc">Access to ICT: 100%</b><p class="note" id="fWhy">Change the factors to see how they affect a person’s access to ICT.</p></div>
          </div>
        </div>
        <div data-panel="impact" hidden>
          <div class="ctrls"><span class="seg" id="vil"><span class="seg-l">A village with…</span><button data-v="on">📶 Good access to digital technologies</button><button data-v="off">🚫 Limited or no access</button></span></div>
          <div class="cards3" id="imp"></div>
          <div class="sim-box dd-tog"><span>👨‍👩‍👧‍👦</span><div><b>Time spent together in person</b><div class="rm-meter"><i id="tog"></i></div></div></div>
        </div>
        <p class="verdict" id="msg"></p>
      </div>`;
    const root = el.querySelector('.dd-s'), $ = (s) => root.querySelector(s);
    let dead = false, gen = 0, V = {};
    const show = FD.panels(root, () => { gen++; $('#msg').innerHTML = ''; });

    // ---- Figure 7.15 ----
    const X = (i) => 40 + i * 36, Y = (v) => 190 - v * 22;
    function chart(k) {
      const line = (A) => A.slice(0, k + 1).map((v, i) => `${X(i)},${Y(v)}`).join(' ');
      $('#ch').innerHTML = `${[0, 2, 4, 6, 8].map((v) => `<line class="dd-grid" x1="40" x2="330" y1="${Y(v)}" y2="${Y(v)}"/><text class="svg-sm" x="22" y="${Y(v) + 4}">${v} bn</text>`).join('')}
        ${YRS.map((y, i) => (i % 2 ? '' : `<text class="svg-sm" x="${X(i)}" y="207">${y}</text>`)).join('')}
        <polygon class="dd-gapA" points="${line(POP)} ${NET.slice(0, k + 1).map((v, i) => `${X(i)},${Y(v)}`).reverse().join(' ')}"/>
        <polyline class="dd-pop" points="${line(POP)}"/><polyline class="dd-net" points="${line(NET)}"/>
        <text class="svg-sm dd-l1" x="${X(k) + 4}" y="${Y(POP[k]) - 6}" style="text-anchor:end">World population</text><text class="svg-sm dd-l2" x="${X(k) + 4}" y="${Y(NET[k]) + 16}" style="text-anchor:end">Internet users</text>`;
      $('#yOut').textContent = YRS[k];
      $('#rP').textContent = POP[k].toFixed(2) + ' bn'; $('#rN').textContent = NET[k].toFixed(2) + ' bn';
      $('#rPc').textContent = Math.round(100 * NET[k] / POP[k]) + '%';
    }
    async function play() {
      show('chart');
      const g = ++gen;
      for (let k = 0; k <= 8; k++) { $('#yr').value = k; chart(k); await FD.wait(380); if (dead || g !== gen) return; }
      $('#msg').className = 'verdict';
      $('#msg').innerHTML = 'In 2016, approximately <b>46%</b> of the world’s population had access to the internet. More people than ever, but still not everyone: the <b>digital divide</b>.';
    }
    $('#yr').addEventListener('input', (e) => chart(+e.target.value));
    function regions() { show('chart'); root.querySelectorAll('.dd-bar i').forEach((i) => { i.classList.add('grow'); }); $('#msg').className = 'verdict'; $('#msg').innerHTML = 'Access is not equal: the proportion of internet users is smaller in <b>Africa</b> and <b>South Asia</b>. The digital divide is not just about the internet: it also covers TV, telephones and many digital devices.'; }

    // ---- factors ----
    function factors(k) {
      root.querySelectorAll('.dd-f').forEach((d) => FD.segSet(d, V[d.dataset.k] ? 1 : 0));
      const pen = F.reduce((s, f) => s + (V[f[0]] ? f[3] : 0), 0), acc = Math.max(3, 100 - pen);
      $('#gauge').style.width = acc + '%';
      $('#gauge').style.background = acc > 66 ? 'var(--good)' : acc > 33 ? '#e67700' : 'var(--bad)';
      $('#acc').textContent = `Access to ICT: ${acc}%`;
      $('#face').textContent = acc > 66 ? '🧑‍💻' : acc > 33 ? '🧑' : '🧍';
      const f = k && F.find((x) => x[0] === k);
      if (f) { $('#fWhy').innerHTML = `<b>${f[1]}:</b> ${f[4]}`; FD.pulse($('#face')); }
      $('#msg').className = 'verdict';
      $('#msg').innerHTML = 'National wealth is <b>not the only factor</b> that determines access to ICT.';
    }
    function setF(k, v) { show('factors'); V[k] = v; factors(k); }
    $('#fl').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) setF(b.closest('.dd-f').dataset.k, b.dataset.v === '1'); });

    // ---- limited or no access ----
    function village(v) {
      show('impact');
      FD.segSet($('#vil'), v);
      const on = v === 'on';
      $('#imp').innerHTML = IMP.map(([e, n, g, b]) => `<div class="mini new" style="--c:var(${on ? '--good' : '--bad'})"><h5>${e} ${n}</h5><p>${on ? g : b}</p></div>`).join('');
      $('#tog').style.width = on ? '45%' : '85%';
      $('#msg').className = 'verdict' + (on ? '' : ' bad');
      $('#msg').innerHTML = on ? 'With access, people can communicate with others anywhere and reach goods, services, entertainment and education.'
        : 'Limited or no access makes people <b>more isolated</b> and reduces the availability of goods and services, entertainment and education. However, some argue it builds <b>stronger communities</b>, because people spend more time together in person.';
    }
    $('#vil').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) village(b.dataset.v); });

    function reset() { gen++; V = {}; $('#yr').value = 8; chart(8); factors(); $('#fWhy').textContent = 'Change the factors to see how they affect a person’s access to ICT.'; root.querySelectorAll('.dd-bar i').forEach((i) => i.classList.remove('grow')); village('on'); show('chart'); $('#msg').innerHTML = ''; }
    reset();
    return { play, regions, setF, village, show, reset, destroy() { dead = true; } };
  },
  steps: [
    {
      title: 'Unequal access to ICT',
      text: `<p>In 2016, approximately <b>46%</b> of the world’s population had access to the internet. Access to information and communication technology (ICT) is <b>not equal</b>.</p>
             <p>The difference between those with technology and those without is called the <strong>digital divide</strong>.</p>`,
      tip: 'Try it: move the year slider (Figure 7.15).',
      async on(a) { a.reset(); await a.play(); },
    },
    {
      title: 'Where in the world?',
      text: `<p>Lots of people in many regions use the internet, but the proportion of internet users is smaller in <b>Africa</b> and <b>South Asia</b> (Figure 7.16).</p>
             <p>The digital divide is not just about the internet: it also relates to access to <b>television, telephones</b> and a wide range of digital devices.</p>`,
      async on(a) { a.regions(); },
    },
    {
      title: 'Economy and infrastructure',
      text: `<p>Countries with <b>advanced economies</b> can afford to invest in the infrastructure needed for networks and the internet.</p>
             <p>In <b>emerging and developing economies</b>, governments may prioritise other needs, such as food and healthcare.</p>`,
      tip: 'Try it: change each factor and watch the access gauge.',
      async on(a) { a.setF('eco', true); },
    },
    {
      title: 'Location and politics',
      text: `<p><b>Location:</b> wireless signals or cabling may not reach rural or remote areas, such as heavily forested and mountainous areas.</p>
             <p><b>Politics:</b> some governments prevent or reduce access, block certain websites or content from other countries, or ban satellite receivers so people cannot watch broadcasts from countries they disagree with.</p>`,
      tip: 'Did you know? In 2016 the United Nations criticised governments that deliberately blocked or disrupted internet access.',
      async on(a, ctx) { a.setF('eco', false); a.setF('loc', true); if (!(await ctx.sleep(1500))) return; a.setF('pol', true); },
    },
    {
      title: 'Religion, disability and social factors',
      text: `<p><b>Religion:</b> some religions ban certain technologies (e.g. Old Order Amish communities in the USA).</p>
             <p><b>Disability:</b> if devices are not designed to be <strong>inclusive</strong>, people with disabilities may rely on adaptations.</p>
             <p><b>Social factors:</b> <b>age, gender, education and income</b> affect people’s ability to access ICT in every region of the world.</p>`,
      async on(a, ctx) { a.setF('loc', false); a.setF('pol', false); for (const k of ['rel', 'dis', 'age', 'inc', 'gen']) { a.setF(k, true); if (!(await ctx.sleep(800))) return; } },
    },
    {
      title: 'The impact of limited or no access',
      text: `<p>Limited or no access to digital technologies means less communication with other people: more <b>isolated</b>, with less understanding of different cultures. It also reduces the availability of:</p>
             <ul><li><b>goods and services</b> (finding bargains and good deals)</li><li><b>entertainment</b> (popular culture)</li><li><b>education</b> (employment opportunities).</li></ul>`,
      tip: 'However, some people argue it builds stronger communities: more time together in person.',
      async on(a, ctx) { a.village('on'); if (!(await ctx.sleep(1600))) return; a.village('off'); },
    },
  ],
});

FD.activities({
  section: 'divide',
  items: [
    {
      id: 'divide-map',
      title: 'The digital divide',
      task: '<p>Create a mind map that highlights the causes and effects of the digital divide and its impact on society.</p><p class="note">Draw it on paper or with software. Write its main branches here.</p>',
      fields: ['Causes', 'Effects', 'Impact on society'],
      lines: 3,
      hint: 'Anything else…',
    },
    {
      id: 'divide-table',
      title: 'Causes of reduced internet access (Table 7.4)',
      task: '<p>Do some research into the cause of reduced internet access for each of the social factors listed on page 127, then use your findings to complete Table 7.4.</p>',
      fields: ['Age · older people: causes', 'Education · people with a lower level of education: causes', 'Income · people with lower income: causes', 'Gender · female users: causes'],
      lines: 2,
      hint: 'Notes (optional)…',
    },
  ],
});

FD.check({
  section: 'divide',
  items: [
    { type: 'mcq', q: 'What is the <b>digital divide</b>?', opts: ['The gap between people who have access to digital devices and the internet and people who do not', 'The difference between the internet and the World Wide Web', 'The time difference between two countries', 'A firewall between two networks'], why: 'In 2016 about 46% of the world’s population had internet access.' },
    { type: 'multi', q: 'State <b>three</b> factors that affect unequal access to ICT. <small>(Chapter question 7)</small>', need: 3, opts: [['Economy and infrastructure', true], ['Location', true], ['Politics', true], ['The colour of the device', false], ['The day of the week', false]], why: 'Also religion, disability and social factors (age, gender, education and income).' },
    { type: 'tf', q: 'National wealth is the only factor that determines access to ICT.', a: false, why: 'Location, politics, religion, disability and social factors matter too.' },
    { type: 'multi', q: 'Which <b>three</b> become less available to people with limited or no access to digital technologies? <small>(Chapter question 8)</small>', need: 3, opts: [['Goods and services (bargains and good deals)', true], ['Entertainment (popular culture)', true], ['Education (employment opportunities)', true], ['Time spent together in person', false]], why: 'Some argue that limited access builds stronger communities, because people spend more time together in person.' },
  ],
});
