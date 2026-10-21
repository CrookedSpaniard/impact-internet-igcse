FD.add({
  id: 'safety',
  title: 'Staying safe online',
  tab: 'Staying safe',
  icon: 'safety',
  color: '--c9',
  section: true,
  interactive: true,
  vocab: [
    ['Zip it', 'Keep your personal information private and think about what you say and do online.'],
    ['Privacy settings', 'A method that allows users to control who can see information from their online profiles.'],
    ['Block it', 'Block people who send offensive messages, and do not open unknown links and attachments.'],
    ['Flag it', 'Tell someone you trust if anything upsets you or if someone asks to meet you offline.'],
    ['Grooming', 'Creating an emotional connection with someone with the intention of making them less cautious, making it easier to do them harm.'],
    ['Digital footprint', 'All the data that a user creates online, which is recorded and stored.'],
  ],
  mount(el) {
    const INFO = [
      ['loc', '📍 Location', '14 Park Road, Riverton', true], ['school', '🏫 School name', 'Riverton High School', true], ['phone', '📞 Phone number', '612 345 678', true],
      ['name', '🪪 Real name', 'Laura Martínez', true], ['photos', '🖼️ Photos', '24 photos', true], ['addr', '✉️ Email address', 'laura.m@example.com', true],
      ['band', '🎸 Favourite band', 'The Weekenders', false], ['hobby', '♟️ Hobby', 'Chess', false],
    ];
    const MAIL = [
      ['req', '👤', 'Friend request from <b>jake_15_cool</b>', '“Hi, I’m 15 too 😊 add me”', 'block', 'A friend request from a stranger: block it.'],
      ['rude', '😡', 'Message from <b>xx_hater</b>', '“Nobody likes you, just leave the group”', 'block', 'An offensive message: block it (and tell someone).'],
      ['att', '📎', 'Email: <b>You won a prize!</b>', 'Attachment: prize_claim.exe', 'block', 'A suspicious attachment: do not open it.'],
      ['link', '🔗', 'Message: <b>Free game skins</b>', 'free-skins.example/login', 'block', 'A suspicious link: do not open it.'],
      ['ok', '🧑‍🤝‍🧑', 'Message from <b>Marta (classmate)</b>', '“Don’t forget the ICT homework for Friday!”', 'open', 'A message from a friend you know: fine to open.'],
    ];
    const Q = ['Would I show this to my parents or grandparents?', 'When I am looking for a job, what will employers think if they see this?', 'Could people misinterpret this, now or in the future?', 'Am I happy for this to be shared by people I don’t know?'];
    const MIN = [['close', '🗑️ Close old social media accounts and request that all archive data is deleted'], ['search', '🔎 Search for your own name online to see what is publicly available'], ['ask', '✉️ Ask website owners to remove old content that is out of date, irrelevant or false'], ['terms', '📜 Read the terms and conditions when you create accounts']];
    el.innerHTML = `
      <div class="sim sf-s">
        <div class="sf-rules"><button class="sf-rule" data-p="zip"><span>🤐</span><b>Zip it</b><small>Keep your personal stuff private</small></button><button class="sf-rule" data-p="block"><span>🛡️</span><b>Block it</b><small>Block nasty messages, don’t open unknown links</small></button><button class="sf-rule" data-p="flag"><span>🚩</span><b>Flag it</b><small>Tell someone you trust</small></button><button class="sf-rule" data-p="foot"><span>👣</span><b>Footprint</b><small>What you leave online</small></button></div>
        <div class="ptabs" hidden><button data-p="zip"></button><button data-p="block"></button><button data-p="flag"></button><button data-p="foot"></button></div>
        <div data-panel="zip">
          <div class="two-col">
            <div class="win"><div class="win-bar">⚙️ Edit your profile</div><div class="win-body"><ul class="sf-info" id="info">${INFO.map(([k, n, v]) => `<li data-k="${k}"><span>${n}<small>${v}</small></span><span class="seg"><button data-v="pub">🌍 Public</button><button data-v="priv">🔒 Private</button></span></li>`).join('')}</ul></div></div>
            <div class="sim-box"><h5 class="mw-h">Privacy settings</h5>
              <span class="seg" id="who"><span class="seg-l">Who can see my profile?</span><button data-v="all">Everyone</button><button data-v="friends">Friends only</button></span>
              <label class="sf-pw"><span>Password</span><input type="text" id="pw" value="laura2010" autocomplete="off" spellcheck="false"></label>
              <div class="rm-meter"><i id="pwBar"></i></div><p class="note" id="pwT"></p>
              <div class="readout"><span class="ro" id="scRo"><small>Safety score</small><b id="sc">0%</b></span></div></div>
          </div>
        </div>
        <div data-panel="block" hidden>
          <div class="two-col">
            <div class="win"><div class="win-bar">📥 Inbox and requests</div><div class="win-body"><ul class="sf-mail" id="mail">${MAIL.map(([k, e, h, s]) => `<li data-k="${k}"><span class="sf-e">${e}</span><div><p>${h}</p><small>${s}</small><em class="note"></em></div><span class="sf-acts"><button class="mini-btn" data-a="block">⛔ Block / don’t open</button><button class="mini-btn" data-a="open">Open</button></span></li>`).join('')}</ul></div></div>
            <div class="win"><div class="win-bar"><span class="url">🔎 search: “funny videos”</span></div><div class="win-body">
              <label class="tgl"><input type="checkbox" id="safe"> SafeSearch filter</label>
              <ul class="sf-res" id="res"></ul></div></div>
          </div>
        </div>
        <div data-panel="flag" hidden>
          <div class="two-col">
            <div class="win"><div class="win-bar">💬 Chat with <b>&nbsp;game_buddy_77</b></div><div class="win-body">
              <div class="sf-chat" id="chat"></div>
              <div class="chk-btns"><button class="btn" data-f="meet">🙂 Agree to meet</button><button class="btn" data-f="adult">🧑‍🏫 Tell a trusted adult</button><button class="btn sf-ra" data-f="report">Report Abuse</button></div></div></div>
            <div class="sim-box"><h5 class="mw-h">🚩 Flag it</h5><p class="note">Always tell an adult if something online upsets you, or if someone you don’t know asks to meet you. Users can report <b>grooming</b> to national crime agencies.</p>
              <p class="note">The <b>Virtual Global Taskforce</b> is an international organisation that protects young people online. Its <b>Report Abuse</b> button (Figure 7.8) is on many social media sites.</p></div>
          </div>
        </div>
        <div data-panel="foot" hidden>
          <div class="two-col">
            <div class="win"><div class="win-bar">✏️ New post</div><div class="win-body">
              <p class="sf-post">🎉 Party at mine tonight!! 14 Elm Street, everyone come 🍾 (sorry Mr Ruiz, no homework done 😜)</p>
              <ul class="sf-qs" id="qs">${Q.map((q, i) => `<li><label class="tgl"><input type="checkbox" data-q="${i}"> ${q}</label></li>`).join('')}</ul>
              <div class="chk-btns"><button class="btn primary" id="post">↗ Share it</button><button class="btn ghost" id="del">🗑 Delete the post</button></div></div></div>
            <div class="sim-box"><h5 class="mw-h">👣 Your digital footprint</h5>
              <div class="sf-foot"><div class="sf-fp" id="fp">👣</div><ul class="sf-copies" id="copies"></ul></div>
              <h5 class="mw-h">Minimise your footprint</h5><div class="sf-min" id="min">${MIN.map(([k, t]) => `<button class="mini-btn" data-m="${k}">${t}</button>`).join('')}</div></div>
          </div>
        </div>
        <p class="verdict" id="msg"></p>
      </div>`;
    const root = el.querySelector('.sf-s'), $ = (s) => root.querySelector(s);
    let dead = false, gen = 0, who = 'all', priv = {}, size = 1, done = {};
    const show = FD.panels(root, (p) => {
      gen++;
      root.querySelectorAll('.sf-rule').forEach((b) => b.classList.toggle('on', b.dataset.p === p));
      $('#msg').innerHTML = '';
    });
    root.querySelectorAll('.sf-rule').forEach((b) => b.addEventListener('click', () => show(b.dataset.p)));

    // ---- zip it ----
    function pwScore(p) { let s = 0; if (p.length >= 10) s++; if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++; if (/\d/.test(p)) s++; if (/[^\w]/.test(p)) s++; if (/laura|2010|password|1234/i.test(p)) s = Math.min(s, 1); return s; }
    function zip() {
      root.querySelectorAll('#info li').forEach((li) => FD.segSet(li, priv[li.dataset.k] ? 'priv' : 'pub'));
      FD.segSet($('#who'), who);
      const p = $('#pw').value, s = pwScore(p);
      $('#pwBar').style.width = (25 * s) + '%'; $('#pwBar').classList.toggle('bad', s < 3);
      $('#pwT').innerHTML = s >= 3 ? '<span class="good-t">Strong. Change it regularly and never give it to anyone, even your friends.</span>' : 'Weak: it is easy to guess (name, year of birth). Use a strong password.';
      const risky = INFO.filter((i) => i[3]);
      const ok = risky.filter((i) => priv[i[0]]).length + (who === 'friends' ? 2 : 0) + (s >= 3 ? 2 : 0);
      const pc = Math.round(100 * ok / (risky.length + 4));
      $('#sc').textContent = pc + '%'; $('#scRo').className = 'ro ' + (pc === 100 ? 'good' : pc < 50 ? 'bad' : '');
      $('#msg').className = 'verdict' + (pc === 100 ? ' good' : '');
      $('#msg').innerHTML = pc === 100 ? '🤐 <b>Zip it</b>: personal information private, profile hidden from strangers, strong password.' : 'Keep your <b>personal information</b> private and do not share it with strangers.';
    }
    $('#info').addEventListener('click', (e) => {
      const b = e.target.closest('button[data-v]'); if (!b) return;
      const k = b.closest('li').dataset.k; priv[k] = b.dataset.v === 'priv';
      const it = INFO.find((i) => i[0] === k);
      zip();
      if (!priv[k] && it[3]) { $('#msg').className = 'verdict bad'; $('#msg').innerHTML = `⚠️ Your ${it[1].slice(3).toLowerCase()} is personal information: strangers could use it to find or contact you.`; }
    });
    $('#who').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) { who = b.dataset.v; zip(); } });
    $('#pw').addEventListener('input', zip);
    function lock(k) { show('zip'); if (k === 'who') who = 'friends'; else if (k === 'pw') $('#pw').value = 'Gr33n-Kite!Moon'; else priv[k] = true; zip(); }

    // ---- block it ----
    function act(k, a) {
      show('block');
      const m = MAIL.find((x) => x[0] === k), li = root.querySelector(`#mail [data-k="${k}"]`), ok = m[4] === a;
      li.className = ok ? 'ok' : 'no';
      li.querySelector('em').innerHTML = (ok ? '✓ ' : '✗ ') + m[5];
      li.querySelectorAll('button').forEach((b) => { b.disabled = true; });
      const left = root.querySelectorAll('#mail li:not(.ok):not(.no)').length;
      $('#msg').className = 'verdict' + (ok ? ' good' : ' bad');
      $('#msg').innerHTML = ok ? (left ? 'Good choice.' : '🛡️ <b>Block it</b>: always block offensive messages and friend requests from strangers, and do not open suspicious attachments or links.') : 'Careful! ' + m[5];
    }
    $('#mail').addEventListener('click', (e) => { const b = e.target.closest('[data-a]'); if (b) act(b.closest('li').dataset.k, b.dataset.a); });
    function search() {
      const on = $('#safe').checked;
      const R = [['😂 Cats falling off sofas', 0], ['🎬 Top 10 football bloopers', 0], ['🔞 Shocking real fights (18+)', 1], ['🐶 Dog learns to skateboard', 0], ['🩸 Gory horror prank (18+)', 1]];
      $('#res').innerHTML = R.map(([t, bad]) => `<li class="${bad ? (on ? 'hid' : 'bad-t') : ''}">${on && bad ? '— hidden by SafeSearch —' : t}</li>`).join('');
    }
    $('#safe').addEventListener('change', () => { search(); if ($('#safe').checked) { $('#msg').className = 'verdict good'; $('#msg').innerHTML = 'Safe search filters reduce the chance of seeing <b>age-inappropriate content</b>.'; } });
    function safeOn() { show('block'); $('#safe').checked = true; search(); $('#msg').className = 'verdict good'; $('#msg').innerHTML = 'Safe search filters reduce the chance of seeing <b>age-inappropriate content</b>.'; }

    // ---- flag it ----
    const CHAT = [['them', 'You’re really good at this game 😃'], ['me', 'Thanks!'], ['them', 'You can tell me anything, I understand you better than your parents do'], ['them', 'Let’s meet at the park on Saturday. Don’t tell anyone, it’s our secret 🤫']];
    async function chat() {
      show('flag');
      const g = ++gen;
      $('#chat').innerHTML = '';
      root.querySelectorAll('[data-f]').forEach((b) => { b.disabled = false; });
      for (const [w, t] of CHAT) { $('#chat').appendChild(FD.h(`<p class="sf-b ${w} new">${t}</p>`)); await FD.wait(700); if (dead || g !== gen) return; }
    }
    function flag(f) {
      show('flag');
      const m = $('#msg');
      if (f === 'meet') { m.className = 'verdict bad'; m.innerHTML = '✗ Never meet someone you only know online. Asking you to keep a secret and to meet offline are signs of <b>grooming</b>.'; return; }
      root.querySelectorAll('[data-f]').forEach((b) => { b.disabled = true; });
      $('#chat').appendChild(FD.h(`<p class="sf-sys new">${f === 'report' ? '🚩 Report sent to the Virtual Global Taskforce and the site moderators. This user has been blocked.' : '🧑‍🏫 You showed the chat to a trusted adult. They will help you report it.'}</p>`));
      m.className = 'verdict good'; m.innerHTML = '🚩 <b>Flag it</b>: tell someone you trust if anything upsets you or if someone asks to meet you offline.';
    }
    root.querySelectorAll('[data-f]').forEach((b) => b.addEventListener('click', () => flag(b.dataset.f)));

    // ---- digital footprint ----
    function foot() {
      $('#fp').style.fontSize = (1.4 + size * 0.75) + 'rem';
      const C = ['🗄️ Copy in an archive site', '💾 Copy in the site’s backups', '📸 Screenshot by a classmate', '↗ Shared by 37 people you don’t know', '🔎 Shows up when you search your name'];
      $('#copies').innerHTML = C.slice(0, Math.max(0, Math.round(size) - 1)).map((c) => `<li class="new">${c}</li>`).join('');
    }
    async function share() {
      show('foot');
      const g = ++gen;
      const ticks = root.querySelectorAll('#qs input:checked').length;
      if (ticks === 4) { $('#msg').className = 'verdict good'; $('#msg').innerHTML = 'You asked yourself the four questions… and decided <b>not</b> to share it. Good decision!'; return; }
      for (let s = 2; s <= 6; s++) { size = s; foot(); await FD.wait(500); if (dead || g !== gen) return; }
      $('#msg').className = 'verdict bad';
      $('#msg').innerHTML = 'Much of what you share online can be <b>recorded forever</b>, on archive sites or as backups, and copied and shared to more people than you expect.';
    }
    function del() { show('foot'); $('#msg').className = 'verdict bad'; $('#msg').innerHTML = 'You deleted the post… but the copies are still out there. Deleting does not remove your <b>digital footprint</b>.'; }
    function minimise(k) {
      show('foot');
      if (done[k]) return;
      done[k] = true; size = Math.max(1, size - 1.2); foot();
      root.querySelector(`[data-m="${k}"]`).classList.add('ok');
      $('#msg').className = 'verdict good'; $('#msg').innerHTML = 'Your footprint is smaller. Some services still have rights over your data even after you close your account, so read the terms and conditions.';
    }
    $('#post').addEventListener('click', share);
    $('#del').addEventListener('click', del);
    $('#min').addEventListener('click', (e) => { const b = e.target.closest('[data-m]'); if (b) minimise(b.dataset.m); });

    function reset() {
      gen++; who = 'all'; priv = {}; size = 1; done = {};
      $('#pw').value = 'laura2010'; zip();
      root.querySelectorAll('#mail li').forEach((li) => { li.className = ''; li.querySelector('em').innerHTML = ''; li.querySelectorAll('button').forEach((b) => { b.disabled = false; }); });
      $('#safe').checked = false; search();
      $('#chat').innerHTML = ''; root.querySelectorAll('[data-f]').forEach((b) => { b.disabled = false; });
      root.querySelectorAll('#qs input').forEach((c) => { c.checked = false; }); root.querySelectorAll('[data-m]').forEach((b) => b.classList.remove('ok')); foot();
      show('zip'); $('#msg').innerHTML = '';
    }
    reset();
    return { show, lock, zip, act, safeOn, chat, flag, share, del, minimise, reset, destroy() { dead = true; } };
  },
  steps: [
    {
      title: 'Three rules: zip it, block it, flag it',
      text: `<p>Governments in many countries run campaigns to help young people stay safe online (Figure 7.6). To stay safe when using the internet, follow three main rules:</p>
             <ul><li><strong>zip it</strong></li><li><strong>block it</strong></li><li><strong>flag it</strong>.</li></ul>`,
      tip: 'Try it: press each rule at the top.',
      async on(a) { a.reset(); },
    },
    {
      title: 'Zip it: personal information',
      text: `<p>Keep your personal information private and do not share it with strangers. Do not share your:</p>
             <ul><li>location · school name · phone number</li><li>real name · photos</li><li>mailing address or email address.</li></ul>`,
      tip: 'Try it: make every piece of personal information private. Which ones are fine to share?',
      async on(a, ctx) { a.show('zip'); for (const k of ['loc', 'school', 'phone', 'name', 'photos', 'addr']) { if (!(await ctx.sleep(500))) return; a.lock(k); } },
    },
    {
      title: 'Zip it: privacy settings and passwords',
      text: `<p>Use <strong>privacy settings</strong> on social networks to stop strangers from viewing your profile.</p>
             <p>Use a <b>strong password</b> that you change regularly and never give to anyone, even your friends.</p>`,
      async on(a, ctx) { a.lock('who'); if (!(await ctx.sleep(900))) return; a.lock('pw'); },
    },
    {
      title: 'Block it',
      text: `<p>Always <b>block offensive messages</b> or friend requests from <b>strangers</b> on social networking sites.</p>
             <p>Do not open <b>suspicious attachments or links</b>. Use <b>safe search filters</b> to reduce the chance of seeing <b>age-inappropriate content</b>.</p>`,
      tip: 'Try it: decide what to do with each message, then switch SafeSearch on.',
      async on(a, ctx) { a.show('block'); for (const k of ['req', 'rude', 'att']) { if (!(await ctx.sleep(800))) return; a.act(k, 'block'); } if (!(await ctx.sleep(900))) return; a.safeOn(); },
    },
    {
      title: 'Flag it',
      text: `<p>Always <b>tell an adult</b> if something online upsets you or if someone you don’t know asks to <b>meet you</b>.</p>
             <p>Users can report <strong>grooming</strong> behaviour to national crime agencies. The Virtual Global Taskforce’s <b>Report Abuse</b> button is found on many social media sites.</p>`,
      tip: 'Try it: what would you do?',
      async on(a, ctx) { await a.chat(); if (!(await ctx.sleep(1400))) return; a.flag('report'); },
    },
    {
      title: 'Your digital footprint',
      text: `<p>Your <strong>digital footprint</strong> is the impression you leave online. Much of what you share can be <b>recorded forever</b>, on archive sites or as backups. It can be viewed by people you did not expect, and copied and shared easily.</p>
             <p>Before sharing, ask yourself the four questions.</p>`,
      tip: 'Key point: the things you post now may not be the same as your views in the future.',
      async on(a) { a.show('foot'); await a.share(); },
    },
    {
      title: 'Minimise your digital footprint',
      text: `<ul><li>close old social media accounts and ask for archive data to be deleted</li><li>search for your own name online</li><li>ask website owners to remove old content that is out of date, irrelevant or false</li><li>read the <b>terms and conditions</b>: some services keep rights over your data even after you close your account.</li></ul>`,
      async on(a, ctx) { for (const k of ['close', 'search', 'ask', 'terms']) { a.minimise(k); if (!(await ctx.sleep(800))) return; } },
    },
  ],
});

FD.activities({
  section: 'safety',
  items: [
    {
      id: 'safety-ceop',
      title: 'Staying safe on the internet',
      task: '<p>Carry out an internet search using the key terms ‘CEOP Jigsaw video’ to find a video aimed at helping 8–10-year-olds stay safe online. What are the key messages of the video?</p>',
      lines: 4,
    },
    {
      id: 'safety-archive',
      title: 'The Internet Archive',
      task: '<p>Go online and search for the ‘Internet Archive’ to see what sort of content is made available on their website.</p>',
      lines: 3,
    },
    {
      id: 'safety-leaflet',
      title: 'Guidelines for online safety',
      task: '<p>Create a leaflet for students in your school that explains how they can stay safe online. It should contain <b>no more than 200 words</b> and use no more than four images.</p><p class="note">Plan the text of your leaflet here (describe where your images go).</p>',
      lines: 8,
    },
  ],
});

FD.check({
  section: 'safety',
  items: [
    { type: 'sort', q: 'Which rule does each piece of advice belong to?', bins: ['Zip it', 'Block it', 'Flag it'], rows: [['Do not share your school name or phone number', 0], ['Do not open suspicious attachments or links', 1], ['Tell an adult if someone you don’t know asks to meet you', 2], ['Use privacy settings so strangers cannot see your profile', 0], ['Block friend requests from strangers', 1], ['Report grooming behaviour', 2]], why: 'Zip it = keep personal stuff private · Block it = block nasty messages and unknown links · Flag it = tell someone you trust.' },
    { type: 'mcq', q: 'What is a <b>digital footprint</b>?', opts: ['All the data that a user creates online, which is recorded and stored', 'A fingerprint scanner on a phone', 'The number of websites you visit in a day', 'A list of your passwords'], why: 'Much of what you share online can be recorded forever.' },
    { type: 'mcq', q: 'What do safe search filters do?', opts: ['Reduce the chance of seeing age-inappropriate content', 'Make searches faster', 'Delete your digital footprint', 'Block all advertising'], why: 'They are part of “block it”.' },
    { type: 'multi', q: 'Which <b>two</b> actions minimise your digital footprint?', need: 2, opts: [['Close old accounts and request that archive data is deleted', true], ['Ask website owners to remove content that is out of date or false', true], ['Post more photos', false], ['Use the same password everywhere', false]], why: 'Also search for your own name, and read the terms and conditions.' },
  ],
});
