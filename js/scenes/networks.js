FD.add({
  id: 'networks',
  title: 'Less restricted access to networks',
  tab: 'Networks',
  icon: 'networks',
  color: '--c5',
  section: true,
  interactive: true,
  vocab: [
    ['Media', 'Mass communication such as broadcasting, publishing and the internet.'],
    ['Moderators', 'People who enforce the service owners’ policies on what kinds of content should be published.'],
    ['User-generated', 'Created by the individuals who use the service.'],
    ['Digital humanitarian movement', 'A group of people working together using ICT to promote human welfare.'],
    ['Crowd-mapped', 'Data provided by many individuals (a ‘crowd’), superimposed on a map using geolocation information from their submissions.'],
  ],
  mount(el) {
    const RIOT = [
      ['bad', '📱', 'Riots spread across parts of England (2011)', 'Messages spread through social media and instant messaging helped rioters organise themselves and avoid the police.'],
      ['good', '📹', 'The police use the CCTV network', 'Cameras recorded the actions of rioters.'],
      ['good', '📸', 'Citizens share smartphone footage', 'Footage uploaded to photo blogging websites and spread through social media helped communities identify those responsible.'],
      ['good', '📞', 'The police ask phone companies for data', 'The phones’ owners, where calls were made from, and lists of calls made to and from the phones.'],
      ['good', '🧹', '#riotcleanup', 'By 10am on the morning after the third day, #riotcleanup was the top trending tag in the UK and second worldwide: citizens organised clean-up events.'],
    ];
    const KENYA = [[150, 20], [205, 30], [255, 18], [270, 70], [250, 110], [262, 170], [230, 230], [200, 262], [160, 240], [95, 200], [60, 130], [70, 70], [110, 45]];
    const CAT = [['🔥', 'Attack'], ['🏚️', 'Homes burnt'], ['🚑', 'People need help'], ['🛣️', 'Road blocked']];
    el.innerHTML = `
      <div class="sim nw-s">
        <div class="ptabs"><button data-p="media">📢 Who can broadcast?</button><button data-p="wiki">📖 User-generated content</button><button data-p="riots">🚓 The 2011 riots</button><button data-p="map">🗺️ Ushahidi</button></div>
        <div data-panel="media">
          <div class="ctrls"><span class="seg" id="how"><span class="seg-l">How will you broadcast your message?</span><button data-v="tv">📺 Persuade a media organisation</button><button data-v="street">📣 Shout in the street</button><button data-v="video">▶️ Upload to a video streaming service</button></span></div>
          <div class="two-col">
            <div class="sim-box nw-msg"><h5 class="mw-h">Your message</h5><span class="seg" id="kind"><button data-v="ok">🎉 A video about your town’s festival</button><button data-v="bad">🤬 A video full of insults about a group of people</button></span>
              <label class="tgl"><input type="checkbox" id="paid"> 💶 Pay to promote it</label></div>
            <div class="sim-box"><h5 class="mw-h">Audience</h5><div class="nw-aud" id="aud"></div><div class="readout"><span class="ro"><small>People reached</small><b id="reach">0</b></span></div></div>
          </div>
        </div>
        <div data-panel="wiki" hidden>
          <div class="win"><div class="win-bar"><span class="url">🌐 wiki.example/Toledo</span></div><div class="win-body">
            <b>Toledo</b><ul class="nw-wiki" id="wiki"><li>Toledo is a city in central Spain.</li><li>The river Tagus flows around the old town.</li></ul>
            <div class="chk-btns"><button class="btn" data-ed="t">✏️ Add: “It is about 70 km south of Madrid.”</button><button class="btn" data-ed="f">✏️ Add: “It has the tallest tower in Europe.”</button></div></div></div>
        </div>
        <div data-panel="riots" hidden>
          <div class="ctrls"><button class="btn primary" id="rNext">▶ Next event</button><button class="btn ghost" id="rAgain">↺ From the start</button></div>
          <ol class="nw-tl" id="tl"></ol>
        </div>
        <div data-panel="map" hidden>
          <div class="two-col">
            <div class="sim-box"><svg viewBox="0 0 320 280" id="ke" role="img" aria-label="A crowd-mapped map of Kenya"><polygon class="nw-land" points="${KENYA.map((p) => p.join(',')).join(' ')}"/><text class="svg-sm" x="165" y="140">KENYA</text><g id="pins"></g></svg></div>
            <div class="sim-box"><h5 class="mw-h">📱 Send a report (witness)</h5><div class="chips" id="cats">${CAT.map(([e, n], i) => `<button class="mini-btn" data-c="${i}">${e} ${n}</button>`).join('')}</div>
              <div class="readout"><span class="ro"><small>Reports on the map</small><b id="nRep">0</b></span></div>
              <p class="note">Ushahidi (Swahili for ‘witness’) was co-founded in 2007 by the blogger Ory Okolloh. Since then it has tracked thousands of human rights violations and mapped victims of the earthquakes in Haiti (2010) and Nepal (2015), and the Japanese tsunami (2011, Figure 7.21).</p></div>
          </div>
        </div>
        <p class="verdict" id="msg"></p>
      </div>`;
    const root = el.querySelector('.nw-s'), $ = (s) => root.querySelector(s);
    let dead = false, gen = 0, how = 'tv', kind = 'ok', ri = 0, reps = 0;
    const show = FD.panels(root, () => { gen++; $('#msg').innerHTML = ''; });

    // ---- media ----
    async function media(h, k, paid) {
      show('media');
      const g = ++gen;
      if (h) how = h; if (k) kind = k; if (paid != null) $('#paid').checked = paid;
      FD.segSet($('#how'), how); FD.segSet($('#kind'), kind);
      const m = $('#msg');
      let to = 0, txt = '';
      if (how === 'tv') { to = 0; txt = '📺 “Sorry, your story is not newsworthy.” Before the internet, you had to <b>own</b> or <b>persuade</b> a media organisation to broadcast your message.'; }
      else if (how === 'street') { to = 40; txt = '📣 Before the internet, you could go into the street and start shouting… and reach a few dozen people.'; }
      else if (kind === 'bad') { to = 0; txt = '🛑 Removed by a <b>moderator</b>: online content is still controlled to an extent by moderators, who enforce the service owners’ policies.'; }
      else { to = $('#paid').checked ? 2400000 : 180000; txt = $('#paid').checked ? '💶 Organisations and individuals can <b>pay to promote</b> their content, so programs push it onto more people’s viewing lists.' : '▶️ Social media and video streaming services let people <b>broadcast their own messages</b> and interact with global audiences. Programs decide what is promoted to viewers, based on their browsing history and their friends’.'; }
      m.className = 'verdict' + (how === 'video' && kind === 'ok' ? ' good' : how === 'video' ? ' bad' : '');
      m.innerHTML = txt;
      const n = Math.min(60, Math.round(to ? Math.log10(to) * 9 : 0));
      $('#aud').innerHTML = Array.from({ length: 60 }, (_, i) => `<span class="${i < n ? 'on' : ''}">👤</span>`).join('');
      await FD.tween(1000, (t) => { if (g === gen) $('#reach').textContent = FD.fmt(to * t); });
    }
    $('#how').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) media(b.dataset.v); });
    $('#kind').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) media(null, b.dataset.v); });
    $('#paid').addEventListener('change', () => media());

    // ---- user-generated ----
    function edit(t) {
      show('wiki');
      const b = root.querySelector(`[data-ed="${t}"]`); b.disabled = true;
      $('#wiki').appendChild(FD.h(`<li class="new">${t === 't' ? 'It is about 70 km south of Madrid.' : 'It has the tallest tower in Europe. <sup class="bad-t">[citation needed]</sup>'} <span class="pill">edited by a user just now</span></li>`));
      $('#msg').className = 'verdict' + (t === 'f' ? ' bad' : '');
      $('#msg').innerHTML = t === 'f' ? 'Anyone can add information, so it <b>may or may not be true</b>. <b>User-generated</b> reference sites like Wikipedia have challenged society’s ideas about expertise.' : 'Truth, knowledge and accuracy are no longer checked by a limited number of experts or editors: <b>ordinary people</b> can now put information online.';
    }
    root.querySelectorAll('[data-ed]').forEach((b) => b.addEventListener('click', () => edit(b.dataset.ed)));

    // ---- the 2011 riots ----
    function riot() {
      show('riots');
      if (ri >= RIOT.length) return;
      const [c, e, t, d] = RIOT[ri++];
      $('#tl').appendChild(FD.h(`<li class="nw-ev ${c} new"><span>${e}</span><div><b>${t}</b><p>${d}</p></div></li>`));
      $('#rNext').disabled = ri >= RIOT.length;
      $('#msg').className = 'verdict' + (c === 'bad' ? ' bad' : ' good');
      $('#msg').innerHTML = c === 'bad' ? 'The internet has had an impact on <b>law enforcement</b>: networks helped the rioters…' : ri === RIOT.length ? 'Citizens used the internet to organise clean-up events: social media can be used for <b>positive purposes</b>. The police have since developed ways to monitor these communication methods.' : '…but the police and citizens also used networks.';
    }
    function riotsAgain() { show('riots'); ri = 0; $('#tl').innerHTML = ''; $('#rNext').disabled = false; }
    $('#rNext').addEventListener('click', riot);
    $('#rAgain').addEventListener('click', riotsAgain);

    // ---- Ushahidi ----
    const inside = (x, y) => { let c = false; for (let i = 0, j = KENYA.length - 1; i < KENYA.length; j = i++) { const [xi, yi] = KENYA[i], [xj, yj] = KENYA[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; };
    let seed = 7;
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    function report(c) {
      show('map');
      let x, y;
      do { x = 60 + rnd() * 210; y = 20 + rnd() * 240; } while (!inside(x, y));
      $('#pins').appendChild(FD.h(`<svg><g class="nw-pin new"><circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="11"/><text x="${x.toFixed(0)}" y="${(y + 1).toFixed(0)}" class="emo" font-size="12">${CAT[c][0]}</text></g></svg>`).firstElementChild);
      $('#nRep').textContent = ++reps;
      $('#msg').className = 'verdict good';
      $('#msg').innerHTML = '🗺️ <b>Crowd-mapped</b>: reports from many people are placed on the map using geolocation. In 2007, Ushahidi gave people in Kenya a voice and put the authorities under pressure to act: the <b>digital humanitarian movement</b>.';
    }
    $('#cats').addEventListener('click', (e) => { const b = e.target.closest('[data-c]'); if (b) report(+b.dataset.c); });

    function reset() {
      gen++; how = 'tv'; kind = 'ok'; $('#paid').checked = false; $('#aud').innerHTML = ''; $('#reach').textContent = '0'; FD.segSet($('#how'), ''); FD.segSet($('#kind'), 'ok');
      $('#wiki').querySelectorAll('li.new').forEach((li) => li.remove()); root.querySelectorAll('[data-ed]').forEach((b) => { b.disabled = false; });
      ri = 0; $('#tl').innerHTML = ''; $('#rNext').disabled = false; reps = 0; seed = 7; $('#pins').innerHTML = ''; $('#nRep').textContent = '0';
      show('media'); $('#msg').innerHTML = '';
    }
    reset();
    return { media, edit, riot, riotsAgain, report, show, reset, destroy() { dead = true; } };
  },
  steps: [
    {
      title: 'A shift in power: the media',
      text: `<p>Less restricted access to networks has affected many parts of society, such as the <strong>media</strong>.</p>
             <p>Before the internet, to broadcast a message you had to own or persuade a <b>media organisation</b>, or go into the street and start shouting!</p>`,
      tip: 'Try it: try each way of broadcasting.',
      async on(a, ctx) { a.reset(); await a.media('tv'); if (!(await ctx.sleep(1800))) return; await a.media('street'); },
    },
    {
      title: 'Everyone can broadcast',
      text: `<p>Social media and video streaming services like YouTube let people <b>broadcast their own messages</b> and interact with global audiences.</p>
             <p>Programs decide which stories and videos are promoted to users, based on their <b>browsing history</b> or their friends’, and sometimes on who has <b>paid to promote</b> them.</p>`,
      async on(a, ctx) { await a.media('video', 'ok', false); if (!(await ctx.sleep(1800))) return; await a.media('video', 'ok', true); },
    },
    {
      title: 'Moderators',
      text: `<p>Online content is still controlled to an extent by <b>moderators</b>, who enforce the service owners’ policies on what kinds of content should be published.</p>`,
      tip: 'Try it: upload the video full of insults.',
      async on(a) { await a.media('video', 'bad', false); },
    },
    {
      title: 'User-generated content',
      text: `<p><strong>User-generated</strong> reference sites such as Wikipedia have challenged society’s ideas about expertise: truth, knowledge and accuracy are no longer checked by a few experts or editors. Ordinary people can put information online that <b>may or may not be true</b>.</p>
             <p>The internet has created billionaires, and also gives millions of <b>volunteers</b> opportunities to work for free for good causes.</p>`,
      async on(a, ctx) { a.show('wiki'); if (!(await ctx.sleep(900))) return; a.edit('t'); if (!(await ctx.sleep(1500))) return; a.edit('f'); },
    },
    {
      title: 'Law enforcement: the 2011 riots',
      text: `<p>In 2011, riots spread across parts of England. Social media and instant messaging helped rioters <b>organise themselves and avoid the police</b>.</p>
             <p>But the police used <b>CCTV</b>, citizens shared <b>smartphone footage</b>, phone companies provided call data, and citizens organised <b>#riotcleanup</b> events.</p>`,
      tip: 'Try it: press “Next event”.',
      async on(a, ctx) { a.riotsAgain(); for (let i = 0; i < 5; i++) { a.riot(); if (!(await ctx.sleep(1300))) return; } },
    },
    {
      title: 'Ushahidi: the digital humanitarian movement',
      text: `<p>The <strong>digital humanitarian movement</strong> uses ICT to promote human welfare. In 2007, during violence in Kenya, Ory Okolloh co-founded <b>Ushahidi</b> (Swahili for ‘witness’), where people recorded and mapped attacks.</p>
             <p>This <strong>crowd-mapped</strong> data gave people a voice and put the authorities under pressure to act.</p>`,
      tip: 'Try it: send some reports and watch the map fill up.',
      async on(a, ctx) { a.show('map'); for (const c of [0, 1, 2, 0, 3, 2, 1]) { if (!(await ctx.sleep(600))) return; a.report(c); } },
    },
  ],
});

FD.check({
  section: 'networks',
  items: [
    { type: 'mcq', q: 'How has the internet caused a shift in power in the media?', opts: ['People can broadcast their own messages to global audiences', 'Only TV stations can publish news', 'Moderators no longer exist', 'Newspapers have more readers than ever'], why: 'Before, you had to own or persuade a media organisation.' },
    { type: 'mcq', q: 'What does <b>user-generated</b> mean?', opts: ['Created by the individuals who use the service', 'Checked by experts before publication', 'Created by the website’s owner', 'Generated automatically by a computer'], why: 'Information on user-generated sites may or may not be true.' },
    { type: 'sort', q: '2011 riots: did each use of networks help the <b>rioters</b> or <b>law and order</b>?', bins: ['Rioters', 'Law and order'], rows: [['Messages on social media to organise and avoid the police', 0], ['CCTV recordings', 1], ['Smartphone footage shared to identify those responsible', 1], ['#riotcleanup to organise clean-up events', 1]], why: 'Social media can also be used for positive purposes.' },
    { type: 'mcq', q: 'What is <b>crowd-mapped</b> data?', opts: ['Data from many individuals placed on a map using geolocation', 'A map of crowded places', 'Data stored on many servers', 'A satellite photograph'], why: 'Ushahidi used crowd-mapping during the crisis in Kenya in 2007.' },
  ],
});
