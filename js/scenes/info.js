FD.add({
  id: 'info',
  title: 'Information and services',
  tab: 'Information',
  icon: 'info',
  color: '--c5',
  section: true,
  interactive: true,
  vocab: [
    ['On-demand', 'Whenever required (for example, catch-up television services).'],
    ['Interactivity', 'The ability of a computer to respond to input.'],
    ['Web 2.0', 'Online interactivity: users not only read web pages but also add information to them.'],
    ['Meme', 'A photo, a piece of video, a joke or similar content that spreads quickly on the internet.'],
  ],
  mount(el) {
    const ROWS = [
      ['time', 'Only broadcast at certain times', 'Available all the time'],
      ['chan', 'Only a few channels', 'Millions of channels'],
      ['edit', 'Content decided by editors', 'Not always edited'],
      ['range', 'Only available within range of a transmitter', 'Access from anywhere with a connection'],
      ['abroad', 'Limited access to news from other countries', 'More open access, though some content is geo-restricted'],
      ['std', 'Held to enforceable standards', 'Not always held to enforceable standards'],
    ];
    const DAY = [
      ['07:30', '🌦️', 'Weather and sport', 'Check the latest weather before leaving, and last night’s football results.'],
      ['10:00', '📚', 'Virtual learning environment (VLE)', 'Download homework and ask the teacher or other students for online support.'],
      ['13:00', '🎟️', 'Booking system', 'Book cinema tickets and a train for the weekend: travel, leisure and entertainment.'],
      ['18:00', '🛒', 'Shopping and banking', 'Order new trainers and check the bank balance without leaving home.'],
      ['21:00', '🎬', 'On-demand entertainment', 'Stream a film, listen to music, download or play an online game whenever required.'],
    ];
    el.innerHTML = `
      <div class="sim nf-s">
        <div class="ptabs"><button data-p="tv">📺 TV and radio vs internet</button><button data-p="day">🗓️ A day of services</button><button data-p="web2">💬 Web 2.0 and memes</button></div>
        <div data-panel="tv">
          <div class="ctrls">
            <label class="rng"><span>Time of day <output id="hOut">21:00</output></span><input type="range" id="hour" min="0" max="23" value="21"></label>
            <span class="seg" id="place"><span class="seg-l">Where are you?</span><button data-v="city">🏙️ Home town</button><button data-v="far">⛰️ Remote valley</button><button data-v="abroad">✈️ Abroad</button></span>
          </div>
          <div class="two-col nf-devs">
            <div class="sim-box"><h5 class="mw-h">📺 Television and radio</h5><div class="nf-tv" id="tv"></div><div class="readout"><span class="ro"><small>Channels</small><b>5</b></span><span class="ro"><small>Checked by</small><b>Editors</b></span></div></div>
            <div class="sim-box"><h5 class="mw-h">🌐 Internet</h5><div class="nf-tv nf-net" id="net"></div><div class="readout"><span class="ro"><small>Channels</small><b>Millions</b></span><span class="ro"><small>Checked by</small><b>Not always edited</b></span></div></div>
          </div>
          <div class="tbl-wrap"><table class="tbl nf-tbl"><caption class="note">Table 7.1 The impact of the internet on individuals’ access to information services</caption>
            <thead><tr><th>Television and radio</th><th></th><th>Internet</th></tr></thead>
            <tbody>${ROWS.map(([k, a, b]) => `<tr data-zone="${k}"><td>${a}</td><td>→</td><td>${b}</td></tr>`).join('')}</tbody></table></div>
        </div>
        <div data-panel="day" hidden>
          <div class="nf-day" id="day">${DAY.map(([t, e, n], i) => `<button class="nf-slot" data-d="${i}"><small>${t}</small><span>${e}</span><b>${n}</b></button>`).join('')}</div>
          <div class="sim-box nf-phone"><p class="nf-big" id="dE">📱</p><div><h5 class="mw-h" id="dN">Press a time of day</h5><p class="note" id="dT">See how one person uses the internet during a typical day.</p></div></div>
        </div>
        <div data-panel="web2" hidden>
          <div class="two-col">
            <div class="win"><div class="win-bar"><span class="url"><span>sports-news.example</span></span></div>
              <div class="win-body"><b>⚽ Local team wins the cup</b><p class="note">The final finished 2–1 after extra time…</p>
                <label class="tgl"><input type="checkbox" id="w2"> Web 2.0: let readers add content</label>
                <div id="cm" hidden><ul class="nf-cm" id="cmList"><li><b>Lucía</b> What a goal in the 89th minute!</li></ul>
                  <div class="nf-add"><input id="cmIn" maxlength="80" placeholder="Add your comment…"><button class="mini-btn" id="cmGo">Post</button></div></div>
                <p class="note" id="w1">📖 Read only: you can read this page but not add anything to it.</p>
              </div></div>
            <div class="sim-box"><h5 class="mw-h">😾 A meme spreads</h5>
              <svg viewBox="0 0 260 170" id="memeNet" aria-label="People sharing a meme"></svg>
              <div class="ctrls"><button class="btn primary" id="share">↗ Share the meme</button><span class="ro"><small>People who have seen it</small><b id="seen">0</b></span></div>
            </div>
          </div>
        </div>
        <p class="verdict" id="msg"></p>
      </div>`;
    const root = el.querySelector('.nf-s'), $ = (s) => root.querySelector(s);
    let dead = false, gen = 0, place = 'city';
    const show = FD.panels(root, () => { gen++; $('#msg').innerHTML = ''; });

    // ---- TV vs internet ----
    const NEWS = [7, 13, 21];
    function drawTv() {
      const h = +$('#hour').value;
      $('#hOut').textContent = String(h).padStart(2, '0') + ':00';
      FD.segSet($('#place'), place);
      let tv, zone;
      if (place === 'far') { tv = '<div class="nf-noise"></div><b>No signal</b><small>Out of range of the transmitter</small>'; zone = 'range'; }
      else if (place === 'abroad') { tv = '<span class="nf-em">🗣️</span><b>Local channels only</b><small>Very little news from your own country</small>'; zone = 'abroad'; }
      else if (NEWS.includes(h)) { tv = '<span class="nf-em">📰</span><b>The news is on</b><small>Broadcast at 07:00, 13:00 and 21:00</small>'; zone = 'time'; }
      else { tv = `<span class="nf-em">🎭</span><b>A quiz show</b><small>Next news at ${String(NEWS.find((n) => n > h) || 7).padStart(2, '0')}:00</small>`; zone = 'time'; }
      $('#tv').innerHTML = tv;
      $('#net').innerHTML = place === 'abroad'
        ? '<span class="nf-em">📰</span><b>Latest news, live</b><small>⚠️ Some videos: “Not available in your region” (geo-restricted)</small>'
        : `<span class="nf-em">📰</span><b>Latest news, live</b><small>${place === 'far' ? 'Anywhere with a connection' : 'Available all the time'}</small>`;
      FD.focus(root.querySelector('.nf-tbl'), zone);
    }
    $('#hour').addEventListener('input', drawTv);
    $('#place').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) { place = b.dataset.v; drawTv(); } });
    const rows = (z) => { show('tv'); FD.focus(root.querySelector('.nf-tbl'), z); };
    function setTv(h, p) { show('tv'); $('#hour').value = h; place = p; drawTv(); }

    // ---- a day of services ----
    function slot(i) {
      show('day');
      root.querySelectorAll('.nf-slot').forEach((b) => b.classList.toggle('on', +b.dataset.d === i));
      const [t, e, n, d] = DAY[i];
      $('#dE').textContent = e; $('#dN').textContent = `${t} · ${n}`; $('#dT').textContent = d;
      FD.pulse($('#dE'));
    }
    $('#day').addEventListener('click', (e) => { const b = e.target.closest('[data-d]'); if (b) slot(+b.dataset.d); });

    // ---- Web 2.0 and memes ----
    function web2(on) {
      show('web2');
      $('#w2').checked = on; $('#cm').hidden = !on; $('#w1').hidden = on;
      $('#msg').className = 'verdict';
      $('#msg').innerHTML = on ? '💬 <b>Web 2.0</b>: interactivity lets users add information to web pages, not only read them. It changed the way people communicate.' : '';
    }
    function post(txt) {
      const t = (txt || $('#cmIn').value).trim();
      if (!t) return;
      $('#cmList').appendChild(FD.h(`<li class="new"><b>You</b> ${FD.esc(t)}</li>`));
      $('#cmIn').value = '';
    }
    $('#w2').addEventListener('change', (e) => web2(e.target.checked));
    $('#cmGo').addEventListener('click', () => post());
    $('#cmIn').addEventListener('keydown', (e) => { if (e.key === 'Enter') post(); });

    const DOTS = Array.from({ length: 56 }, (_, i) => {
      const a = i * 2.39996, r = 8 + 9.2 * Math.sqrt(i);
      return [130 + r * Math.cos(a) * 1.6, 85 + r * Math.sin(a) * 1.05];
    });
    $('#memeNet').innerHTML = DOTS.map(([x, y], i) => `<circle class="nf-dot" data-i="${i}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5"/>`).join('');
    async function share() {
      show('web2');
      const g = ++gen;
      const dots = [...root.querySelectorAll('.nf-dot')];
      dots.forEach((d) => d.classList.remove('on'));
      $('#seen').textContent = '0';
      let n = 1, views = 0;
      while (n < dots.length) {
        for (let i = 0; i < Math.min(n, dots.length); i++) dots[i].classList.add('on');
        views = Math.round(Math.pow(n, 3.1) * 37);
        $('#seen').textContent = FD.fmt(views);
        await FD.wait(500);
        if (dead || g !== gen) return;
        n = Math.ceil(n * 2.1);
      }
      dots.forEach((d) => d.classList.add('on'));
      $('#seen').textContent = 'millions';
      $('#msg').className = 'verdict good';
      $('#msg').innerHTML = 'Each person shares it with a few more people: a <b>meme</b> spreads around the world in hours. Content added by individuals can share serious issues or be just for entertainment.';
    }
    $('#share').addEventListener('click', share);

    function reset() { gen++; setTv(21, 'city'); web2(false); root.querySelectorAll('.nf-dot').forEach((d) => d.classList.remove('on')); $('#seen').textContent = '0'; $('#msg').innerHTML = ''; root.querySelectorAll('.nf-slot').forEach((b) => b.classList.remove('on')); show('tv'); }
    reset();
    return { setTv, rows, slot, web2, post, share, show, reset, destroy() { dead = true; } };
  },
  steps: [
    {
      title: 'Up to date at all times',
      text: `<p>The internet has changed how people live and work, giving them greater <b>access to information and services</b>.</p>
             <p>News, sport and weather information can spread on the internet <b>within seconds</b>, so individuals can be up to date at all times.</p>`,
      tip: 'Try it: move the time slider. When is the news on TV? And on the internet?',
      async on(a, ctx) { a.reset(); for (const h of [9, 13, 16, 21]) { a.setTv(h, 'city'); if (!(await ctx.sleep(1100))) return; } },
    },
    {
      title: 'Before the internet: television and radio',
      text: `<p>Before the internet, two of the most important channels for these services were <b>television</b> and <b>radio</b>.</p>
             <p>They had disadvantages that the internet solves: they are <b>only broadcast at certain times</b>, have <b>only a few channels</b> and are only available <b>within range of a transmitter</b>.</p>`,
      tip: 'Try it: go to the remote valley, then abroad.',
      async on(a, ctx) { a.setTv(16, 'city'); a.rows('time'); if (!(await ctx.sleep(1800))) return; a.rows('chan'); if (!(await ctx.sleep(1800))) return; a.setTv(21, 'far'); },
    },
    {
      title: 'Table 7.1: not all changes are good',
      text: `<p>TV and radio also have <b>advantages</b>: their content is <b>decided by editors</b> and <b>held to enforceable standards</b>. Internet content is <b>not always edited</b> or held to these standards.</p>
             <p>Abroad, the internet gives more open access to news, though some content is <b>geo-restricted</b>.</p>`,
      tip: 'Activity: decide whether each change in Table 7.1 is beneficial or not.',
      async on(a, ctx) { a.setTv(21, 'abroad'); if (!(await ctx.sleep(1800))) return; a.rows('edit'); if (!(await ctx.sleep(1600))) return; a.rows('std'); },
    },
    {
      title: 'Booking, shopping, banking and studying',
      text: `<p>Users can also use the internet to:</p>
             <ul><li>access <b>booking systems</b> for travel, leisure and entertainment</li><li>do their <b>shopping and banking</b></li><li>study using <b>virtual learning environments (VLEs)</b>, with online support from teachers and other students.</li></ul>`,
      tip: 'Try it: press each time of the day.',
      async on(a, ctx) { for (const i of [0, 1, 2, 3]) { a.slot(i); if (!(await ctx.sleep(1400))) return; } },
    },
    {
      title: 'A wider range of entertainment',
      text: `<p>More entertainment providers give access to <strong>on-demand</strong> services (whenever required): movie and music <b>streaming</b>, <b>downloads</b> and <b>gaming</b> services.</p>`,
      async on(a) { a.slot(4); },
    },
    {
      title: 'Web 2.0: users add content',
      text: `<p>Individuals can also <b>add content</b> to web pages. The development of online <strong>interactivity</strong> (the ability of a computer to respond to input), which let users add information as well as read it, became known as <b>Web 2.0</b>.</p>
             <p>It changed the way people communicate.</p>`,
      tip: 'Try it: tick Web 2.0 and post a comment.',
      async on(a, ctx) { a.web2(false); if (!(await ctx.sleep(1500))) return; a.web2(true); if (!(await ctx.sleep(1000))) return; a.post('Brilliant match, congratulations!'); },
    },
    {
      title: 'Memes',
      text: `<p>Content added by individuals has had an enormous impact on the way information is distributed around the world: it can share information about <b>serious issues</b> and also be used for <b>entertainment</b>.</p>
             <p>A <strong>meme</strong> is a photo, video, joke or similar content that <b>spreads quickly</b> on the internet (Figure 7.1).</p>`,
      tip: 'Try it: share the meme and watch the counter.',
      async on(a) { await a.share(); },
    },
  ],
});

FD.activities({
  section: 'info',
  items: [
    {
      id: 'info-adv',
      title: 'Advantages and disadvantages of the internet',
      task: '<p>For each of the changes in Table 7.1, decide whether you think the impact of the internet has been <b>beneficial</b> (resulting in good) or not. Explain each of your decisions.</p>',
      fields: ['Available all the time', 'Millions of channels', 'Not always edited', 'Access from anywhere with a connection', 'More open access (some content geo-restricted)', 'Not always held to enforceable standards'],
      lines: 2,
      hint: 'Anything else you want to add…',
      sim: ['info', 'See Table 7.1 again'],
    },
    {
      id: 'info-memes',
      title: 'Memes',
      task: '<p>Research the story behind ‘success kid’. Who is he? Why did this image become so popular? How have some companies used this image?</p>',
      lines: 5,
    },
    {
      id: 'info-life',
      title: 'The internet in your life',
      task: '<p>Write a paragraph on how the internet influences a typical day in your life.</p>',
      lines: 6,
      hint: 'Morning, school, afternoon, evening: what do you use the internet for?',
    },
  ],
});

FD.check({
  section: 'info',
  items: [
    { type: 'sort', q: 'Table 7.1: is each feature true of <b>television and radio</b> or of the <b>internet</b>?', bins: ['TV and radio', 'Internet'], rows: [['Only broadcast at certain times', 0], ['Millions of channels', 1], ['Content decided by editors', 0], ['Access from anywhere with a connection', 1], ['Held to enforceable standards', 0], ['Some content is geo-restricted', 1]], why: 'The internet solves some disadvantages of TV and radio, but TV and radio have some advantages too.' },
    { type: 'mcq', q: 'What does <b>on-demand</b> mean?', opts: ['Whenever required', 'Only at certain times', 'Only with a TV licence', 'Paid for in advance'], why: 'For example, catch-up television services.' },
    { type: 'mcq', q: 'What became known as <b>Web 2.0</b>?', opts: ['Online interactivity that let users add information to web pages, not only read them', 'The second version of HTTP', 'Faster broadband', 'Websites with videos'], why: 'It changed the way people communicated.' },
    { type: 'multi', q: 'Which <b>two</b> are services individuals use the internet for, according to the book?', need: 2, opts: [['Booking systems for travel, leisure and entertainment', true], ['Studying with virtual learning environments (VLEs)', true], ['Receiving radio broadcasts from a transmitter', false], ['Printing newspapers', false]], why: 'Also shopping and banking, and on-demand entertainment.' },
  ],
});
