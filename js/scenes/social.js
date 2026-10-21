FD.add({
  id: 'social',
  title: 'Social impact',
  tab: 'Social',
  icon: 'social',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Social interaction', 'Communication with and reaction to others.'],
    ['Social network applications', 'Software that allows social interaction and the creation of links between users based on shared characteristics and interests.'],
    ['Filter bubble', 'When the code behind websites decides which content you see, so you mostly meet people and ideas like your own.'],
    ['Cyberbullying', 'Using the internet to send text, images or multimedia in order to upset or embarrass someone.'],
  ],
  mount(el) {
    // Figure 7.2: monthly active Facebook users (November 2016) vs populations, in millions.
    const POP = [['Facebook', 1790, '#2f9e44'], ['China', 1379, '#82c91e'], ['India', 1324, '#37b24d'], ['USA', 323, '#c2255c'], ['Indonesia', 261, '#38d9a9'], ['Brazil', 208, '#e8590c'], ['Pakistan', 193, '#9c36b5'], ['Nigeria', 186, '#4dabf7'], ['Bangladesh', 163, '#ff6b6b'], ['Russia', 144, '#cc5de8'], ['Japan', 127, '#1098ad']];
    const XY = [[95, 95], [345, 85], [345, 245], [205, 250], [150, 210], [262, 168], [215, 178], [175, 140], [228, 60], [240, 118], [270, 212]];
    const TOPICS = { foot: ['⚽', 'Football'], music: ['🎵', 'Music'], sci: ['🔬', 'Science'], art: ['🎨', 'Art'], news: ['🌍', 'World news'] };
    el.innerHTML = `
      <div class="sim so-s">
        <div class="ptabs"><button data-p="pop">🌐 The ‘population’ of Facebook</button><button data-p="bubble">🫧 Filter bubbles</button><button data-p="bully">💔 Cyberbullying</button><button data-p="active">🏃 Physical activity</button></div>
        <div data-panel="pop">
          <div class="sim-box"><svg viewBox="0 0 440 330" id="bub" role="img" aria-label="Figure 7.2: Facebook users compared with populations of countries">
            ${POP.map(([n, v, c], i) => `<g class="so-b" data-i="${i}"><circle cx="${XY[i][0]}" cy="${XY[i][1]}" r="0" fill="${c}"/><text class="svg-lbl so-bt" x="${XY[i][0]}" y="${XY[i][1] + 4}">${n}</text></g>`).join('')}
          </svg><p class="note" id="popT">Press a bubble. Circle areas are proportional to the number of people.</p></div>
        </div>
        <div data-panel="bubble" hidden>
          <div class="two-col">
            <div class="win"><div class="win-bar">📱 Your feed</div><div class="win-body so-feed" id="feed"></div></div>
            <div class="sim-box"><h5 class="mw-h">What the website shows you</h5><div id="mix"></div>
              <div class="readout"><span class="ro"><small>Different topics in your feed</small><b id="div">5</b></span></div>
              <button class="btn ghost" id="pop2">↺ Burst the bubble</button></div>
          </div>
        </div>
        <div data-panel="bully" hidden>
          <div class="two-col">
            <div class="win"><div class="win-bar">💬 Group chat · Year 10</div><div class="win-body">
              <div class="so-msg"><span class="av" style="--av:#495057">?</span><div><b>anon_xx92</b><p>Look at this edited photo of Sam 😂😂 send it to everyone</p><div class="so-img">🖼️ edited photo</div></div></div>
              <div class="ctrls"><button class="btn" id="spread">↗ Watch it spread</button><button class="btn primary" id="trace">🔍 Report and identify the device</button></div>
              <p class="note" id="trOut"></p></div></div>
            <div class="sim-box"><h5 class="mw-h">How far it has spread</h5><svg viewBox="0 0 240 150" id="bNet"></svg>
              <div class="readout"><span class="ro bad"><small>People who have seen it</small><b id="bSeen">0</b></span><span class="ro"><small>Time</small><b id="bTime">0 min</b></span></div></div>
          </div>
        </div>
        <div data-panel="active" hidden>
          <div class="ctrls"><span class="seg" id="day"><span class="seg-l">Choose a day</span><button data-v="home">🛋️ Everything online from home</button><button data-v="old">🚶 Before the internet</button><button data-v="game">📍 Location-based game</button><button data-v="fit">💪 Online fitness community</button></span></div>
          <div class="sim-box so-steps"><div class="so-big" id="aE">🛋️</div><div><div class="rm-meter so-meter"><i id="aBar"></i></div><p class="note" id="aT"></p></div><span class="ro"><small>Steps today</small><b id="aSteps">0</b></span></div>
        </div>
        <p class="verdict" id="msg"></p>
      </div>`;
    const root = el.querySelector('.so-s'), $ = (s) => root.querySelector(s);
    let dead = false, gen = 0;
    const show = FD.panels(root, () => { gen++; $('#msg').innerHTML = ''; });

    // ---- Figure 7.2 ----
    const R = (v) => Math.sqrt(v / 1790) * 78;
    async function grow() {
      show('pop');
      const g = ++gen;
      const cs = [...root.querySelectorAll('.so-b circle')];
      await FD.tween(1600, (t) => { if (g === gen) cs.forEach((c, i) => c.setAttribute('r', (R(POP[i][1]) * Math.min(1, t * 1.2)).toFixed(1))); });
      if (dead || g !== gen) return;
      pick(0);
    }
    function pick(i) {
      root.querySelectorAll('.so-b').forEach((b) => b.classList.toggle('on', +b.dataset.i === i));
      const [n, v] = POP[i];
      $('#popT').innerHTML = i === 0
        ? `<b>Facebook: ${FD.fmt(v)} million</b> monthly active users (November 2016), spending about 50 minutes a day. If it were a country, it would have the biggest population on the planet.`
        : `<b>${n}: about ${FD.fmt(v)} million</b> people (2016).`;
    }
    $('#bub').addEventListener('click', (e) => { const b = e.target.closest('.so-b'); if (b) pick(+b.dataset.i); });

    // ---- filter bubble ----
    let w = {};
    function feed() {
      const keys = Object.keys(TOPICS), tot = keys.reduce((s, k) => s + w[k], 0);
      const posts = [];
      let seed = 3;
      for (let i = 0; i < 5; i++) {
        seed = (seed * 9301 + 49297) % 233280;
        let r = (seed / 233280) * tot, k = keys[0];
        for (const kk of keys) { if ((r -= w[kk]) <= 0) { k = kk; break; } }
        posts.push(k);
      }
      $('#feed').innerHTML = posts.map((k, i) => `<div class="so-post"><span>${TOPICS[k][0]}</span><b>${TOPICS[k][1]} post ${i + 1}</b><button class="mini-btn" data-like="${k}">👍 Like</button></div>`).join('');
      $('#mix').innerHTML = keys.map((k) => `<div class="so-mixr"><span>${TOPICS[k][0]} ${TOPICS[k][1]}</span><div class="rm-meter"><i style="width:${(100 * w[k] / tot).toFixed(0)}%"></i></div></div>`).join('');
      const d = new Set(posts).size;
      $('#div').textContent = d;
      $('#msg').className = 'verdict' + (d <= 1 ? ' bad' : '');
      $('#msg').innerHTML = d <= 1 ? '🫧 You are in a <b>filter bubble</b>: the code behind the website only shows you content like what you already liked, and suggests people who think like you.' : '';
    }
    function like(k) { show('bubble'); w[k] *= 3.2; feed(); }
    function burst() { Object.keys(TOPICS).forEach((k) => { w[k] = 1; }); feed(); }
    $('#feed').addEventListener('click', (e) => { const b = e.target.closest('[data-like]'); if (b) like(b.dataset.like); });
    $('#pop2').addEventListener('click', burst);

    // ---- cyberbullying ----
    const BD = Array.from({ length: 48 }, (_, i) => { const a = i * 2.39996, r = 6 + 8.4 * Math.sqrt(i); return [120 + r * Math.cos(a) * 1.55, 75 + r * Math.sin(a)]; });
    $('#bNet').innerHTML = BD.map(([x, y], i) => `<circle class="nf-dot bad" data-i="${i}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5"/>`).join('');
    async function spread() {
      show('bully');
      const g = ++gen, dots = [...root.querySelectorAll('#bNet circle')];
      dots.forEach((d) => d.classList.remove('on'));
      $('#trOut').innerHTML = '';
      for (let m = 0, n = 1; n <= dots.length * 2.2; m += 5, n = Math.ceil(n * 1.9)) {
        dots.slice(0, n).forEach((d) => d.classList.add('on'));
        $('#bSeen').textContent = FD.fmt(Math.min(n * 6, 600)); $('#bTime').textContent = m + ' min';
        await FD.wait(420); if (dead || g !== gen) return;
      }
      $('#msg').className = 'verdict bad';
      $('#msg').innerHTML = 'On the internet, information spreads <b>very quickly</b> and to <b>more people</b>. This can make the victim feel worse than in-person bullying.';
    }
    async function trace() {
      show('bully');
      const g = ++gen;
      $('#trOut').innerHTML = 'Report sent. Tracing the message…';
      await FD.wait(900); if (dead || g !== gen) return;
      $('#trOut').innerHTML = '<span class="good-t">✓ Sent from a device with IP address 81.2.69.160 · MAC address 3C:22:FB:1A:07:9E</span>';
      $('#msg').className = 'verdict good';
      $('#msg').innerHTML = 'Bullies often hide their identity, but most online communication is easily monitored: it is often possible to find them by <b>identifying the device they used</b>.';
    }
    $('#spread').addEventListener('click', spread);
    $('#trace').addEventListener('click', trace);

    // ---- physical activity ----
    const DAYS = {
      home: ['🛋️', 1800, 'Shopping, banking and even school online: no need to leave home. Less physical activity can harm health and wellbeing.', 'bad'],
      old: ['🚶', 7500, 'Walking to the shops, the bank and school.', ''],
      game: ['📍', 11200, 'A location-based game, such as Pokémon Go, gets players walking around outside.', 'good'],
      fit: ['💪', 12600, 'Members of an online fitness community encourage each other to exercise.', 'good'],
    };
    async function day(k) {
      show('active');
      const g = ++gen, [e, s, t, cls] = DAYS[k];
      FD.segSet($('#day'), k);
      $('#aE').textContent = e; $('#aT').textContent = t;
      $('#aBar').classList.toggle('bad', cls === 'bad');
      await FD.tween(900, (x) => { if (g === gen) { $('#aSteps').textContent = FD.fmt(s * x); $('#aBar').style.width = (100 * s * x / 13000) + '%'; } });
    }
    $('#day').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) day(b.dataset.v); });

    function reset() { gen++; w = {}; burst(); $('#msg').innerHTML = ''; root.querySelectorAll('.so-b circle').forEach((c, i) => c.setAttribute('r', R(POP[i][1]).toFixed(1))); pick(0); show('pop'); }
    reset();
    return { grow, pick, like, burst, spread, trace, day, show, reset, destroy() { dead = true; } };
  },
  steps: [
    {
      title: 'A huge impact on the way people socialise',
      text: `<p>The internet has had a huge impact on the way people socialise, particularly thanks to <b>social media</b> sites such as Facebook and Twitter.</p>
             <p>In November 2016, Facebook had <b>1.79 billion</b> monthly active users spending 50 minutes a day. If Facebook were a country, it would have the biggest population on the planet (Figure 7.2).</p>`,
      tip: 'Try it: press the bubbles to compare.',
      async on(a) { a.reset(); await a.grow(); },
    },
    {
      title: 'Social interaction',
      text: `<p>Humans are naturally social: we need <strong>social interaction</strong> (communication with and reaction to others).</p>
             <p>The internet lets us communicate with <b>any other connected person on the planet</b>, through online gaming, video, instant messaging, social networking and online spaces for work and learning.</p>`,
      tip: 'Society is a network of people and the internet is a network of devices (Figure 7.3).',
      async on(a) { a.show('pop'); a.pick(0); },
    },
    {
      title: 'Is socialising online a good thing?',
      text: `<p>Some people worry that virtual environments are <b>replacing face-to-face interaction</b>, damaging people’s ability to talk to each other and understand emotions, especially young children.</p>
             <p>Others say being able to connect with <b>more people and information</b> is a good thing, and that it does not matter whether it is online or face to face. A wider community can make people more aware of <b>other cultures</b>.</p>`,
      async on(a) { a.show('bubble'); a.burst(); },
    },
    {
      title: 'Filter bubbles',
      text: `<p>Some people argue that we tend to connect with people <b>who think like us</b>, or with people suggested to us by <strong>social network applications</strong>.</p>
             <p>The code behind websites decides the content that users see and the connections they make: a <b>filter bubble</b>.</p>`,
      tip: 'Try it: keep liking football posts and watch your feed.',
      async on(a, ctx) { a.burst(); for (let i = 0; i < 4; i++) { if (!(await ctx.sleep(900))) return; a.like('foot'); } },
    },
    {
      title: 'Cyberbullying',
      text: `<p><strong>Cyberbullying</strong> is using the internet to send text, images or multimedia to <b>upset or embarrass</b> someone. It can be as upsetting, or even more distressing, than offline bullying.</p>
             <p>Bullies may send hurtful messages, share upsetting (even edited) images, or <b>isolate</b> victims by keeping them out of online events.</p>`,
      tip: 'Information spreads very quickly and to more people, which can make the victim feel worse.',
      async on(a) { await a.spread(); },
    },
    {
      title: 'Finding the bully',
      text: `<p>Bullies who use the internet often <b>hide their identity</b>, making it even worse for the victim.</p>
             <p>However, most online communication is easily monitored, and it is often possible to find bullies by <b>identifying the device</b> they used (see Unit 2 Connectivity).</p>`,
      async on(a) { await a.trace(); },
    },
    {
      title: 'Physical activity',
      text: `<p>Online goods and services mean people do not have to leave home to shop, bank or even go to school. This <b>reduced need for physical activity</b> could harm health and wellbeing.</p>
             <p>However, <b>location-based games</b> such as Pokémon Go promote physical activity, and <b>online fitness communities</b> motivate people to exercise.</p>`,
      tip: 'Hint: in extended exam answers, show both the benefits and the drawbacks.',
      async on(a, ctx) { await a.day('home'); if (!(await ctx.sleep(1500))) return; await a.day('game'); if (!(await ctx.sleep(1500))) return; await a.day('fit'); },
    },
  ],
});

FD.activities({
  section: 'social',
  items: [
    {
      id: 'social-bubbles',
      title: 'Filter bubbles',
      task: '<p>Carry out an internet search using the key terms ‘Eli Pariser TED talk’ to find a video of the author Eli Pariser discussing the concept of ‘filter bubbles’. He explores how the code behind websites decides the content that users see online and the connections that users make with others.</p><p>Write down the main ideas of the talk.</p>',
      lines: 5,
      sim: ['social', 'Try the filter bubble simulation'],
    },
    {
      id: 'social-debate',
      title: 'Debating the impact of the internet',
      task: '<p>Prepare for and take part in a class debate on the topic: ‘the internet has had a positive impact on individuals’.</p>',
      fields: ['Arguments for', 'Arguments against'],
      lines: 4,
      hint: 'Your conclusion: do you agree? Why?',
    },
  ],
});

FD.check({
  section: 'social',
  items: [
    { type: 'mcq', q: 'What is <b>cyberbullying</b>?', opts: ['Using the internet to send text, images or multimedia to upset or embarrass someone', 'Hacking into someone’s account', 'Playing violent online games', 'Sending spam emails'], why: 'Bullying exists offline too, but online bullying can be even more distressing.' },
    { type: 'mcq', q: 'Explain <b>one</b> reason why cyberbullying can be more distressing than in-person bullying. <small>(Chapter question 5)</small>', opts: ['Information spreads very quickly and to more people, so the victim feels worse', 'It only happens at school', 'The bully can always be seen', 'Messages disappear after one minute'], why: 'Also: bullies can hide their identity, and can isolate victims from online events.' },
    { type: 'tf', q: 'Social network applications may suggest people who think like us, so we may mostly connect with similar people.', a: true, why: 'This is the idea behind filter bubbles.' },
    { type: 'multi', q: 'Which <b>two</b> uses of the internet can <b>increase</b> physical activity?', need: 2, opts: [['Location-based games, such as Pokémon Go', true], ['Online fitness communities', true], ['Online shopping', false], ['Online banking', false]], why: 'But access to online goods and services has reduced the need to travel.' },
  ],
});
