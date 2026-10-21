FD.add({
  id: 'internet',
  title: 'The internet and protocols',
  tab: 'Internet',
  icon: 'internet',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Internet', 'The interconnected network of computers that provides many online services to users.'],
    ['World Wide Web', 'Just one use of the internet: connected content (web pages).'],
    ['Protocols', 'Rules that allow the exchange and transmission of data between devices.'],
  ],
  mount(el) {
    // Device positions (top-left of each 60×46 drawing) and the links between them.
    const N = {
      lap: [20, 40, 'laptop', 'Laptop'], ph: [20, 200, 'phone', 'Smartphone'],
      s1: [290, 20, 'server', 'Server'], s2: [290, 220, 'server', 'Server'],
      pc: [560, 40, 'desktop', 'Desktop'], tab: [560, 200, 'tablet', 'Tablet'],
    };
    const c = (k) => [N[k][0] + 30, N[k][1] + 23];
    const LINKS = [['lap', 's1'], ['lap', 's2'], ['ph', 's2'], ['s1', 's2'], ['s1', 'pc'], ['s2', 'tab'], ['s1', 'tab'], ['pc', 's2']];
    const P = {
      IMAP: { full: 'internet message access protocol', use: 'Email', e: '✉️', path: ['s1', 'lap'], from: 'Mail server', to: 'laptop', what: 'The laptop’s email app downloads new messages from the mail server.' },
      FTP: { full: 'file transfer protocol', use: 'Sending files', e: '📁', path: ['lap', 's2'], from: 'Laptop', to: 'file server', what: 'A file is uploaded from the laptop to a file server.' },
      SSH: { full: 'secure shell', use: 'Secure remote logins', e: '🔒', path: ['pc', 's1'], from: 'Desktop', to: 'server', what: 'A technician logs in to the server from far away. Everything typed is secured.' },
      VoIP: { full: 'voice over internet protocol', use: 'Voice calls (e.g. Skype)', e: '📞', path: ['ph', 's2', 'tab'], from: 'Smartphone', to: 'tablet', what: 'A voice call travels across the internet as data, not over the phone network.' },
      XMPP: { full: 'extensible messaging presence protocol', use: 'Messaging (e.g. WhatsApp)', e: '💬', path: ['tab', 's2', 'ph'], from: 'Tablet', to: 'smartphone', what: 'An instant message, plus “online / typing…” presence information.' },
      HTTP: { full: 'hypertext transfer protocol', use: 'The World Wide Web', e: '📄', path: ['s1', 'pc'], from: 'Web server', to: 'desktop', what: 'A web page is sent from the web server to the desktop’s web browser.' },
    };
    el.innerHTML = `
      <div class="sim in-s">
        <div class="ctrls"><span class="seg" id="view"><span class="seg-l">Show</span><button data-v="net">💻 The internet: connected devices</button><button data-v="web">🔗 The Web: connected content</button></span></div>
        <div class="sim-box">
          <svg viewBox="0 0 640 290" role="img" aria-label="Devices connected by the internet">
            <g id="links">${LINKS.map(([a, b]) => `<line class="wire" data-l="${a}-${b}" x1="${c(a)[0]}" y1="${c(a)[1]}" x2="${c(b)[0]}" y2="${c(b)[1]}"/>`).join('')}</g>
            <g id="devs">${Object.entries(N).map(([k, [x, y, d, n]]) => `<g data-n="${k}">${FD.dv[d](x, y)}<text class="svg-sm" x="${x + 30}" y="${y + 60}">${n}</text></g>`).join('')}</g>
            <g id="web" opacity="0">
              <g class="in-page"><rect x="360" y="8" width="96" height="62" rx="6"/><text x="408" y="27">news.example</text><path d="M372 38h72M372 47h60M372 56h66"/></g>
              <g class="in-page"><rect x="360" y="216" width="96" height="62" rx="6"/><text x="408" y="235">school.example</text><path d="M372 246h72M372 255h50M372 264h66"/></g>
              <g class="in-page"><rect x="176" y="112" width="96" height="62" rx="6"/><text x="224" y="131">shop.example</text><path d="M188 142h72M188 151h44M188 160h60"/></g>
              <path class="in-link" d="M410 72 C 470 130, 470 160, 410 214"/>
              <path class="in-link" d="M358 50 C 300 60, 260 80, 240 110"/>
              <path class="in-link" d="M270 172 C 300 200, 330 220, 358 236"/>
              <text class="svg-lbl in-hl" x="500" y="148">hyperlinks</text>
            </g>
            <g id="pk" opacity="0"><circle r="15" class="pkt"/><text class="emo" id="pkE" font-size="15">✉️</text></g>
          </svg>
          <p class="in-key" id="key"></p>
        </div>
        <div class="in-protos" id="protos">${Object.entries(P).map(([k, p]) => `<button class="in-p" data-p="${k}"><b>${k}</b><small>${p.use}</small></button>`).join('')}</div>
        <p class="verdict" id="msg"></p>
      </div>`;
    const root = el.querySelector('.in-s'), $ = (s) => root.querySelector(s);
    let dead = false, gen = 0;

    function view(v) {
      FD.segSet($('#view'), v);
      $('#web').setAttribute('opacity', v === 'web' ? 1 : 0);
      $('#links').style.opacity = v === 'web' ? 0.25 : 1;
      $('#key').innerHTML = v === 'web'
        ? '🔗 <b>The World Wide Web is connected content</b>: web pages stored on servers, joined by hyperlinks. It is just <b>one use</b> of the internet.'
        : '💻 <b>The internet is connected devices</b>: an interconnected network of computers that provides many online services.';
    }
    async function send(k) {
      const g = ++gen, p = P[k];
      view('net');
      root.querySelectorAll('.in-p').forEach((b) => b.classList.toggle('on', b.dataset.p === k));
      const m = $('#msg');
      m.className = 'verdict';
      m.innerHTML = `<b>${k}</b> = ${p.full.replace(/\b(\w)/g, '<u>$1</u>')} · used for <b>${p.use.toLowerCase()}</b>.<br><span class="note">${p.what}</span>`;
      root.querySelectorAll('.wire').forEach((w) => w.classList.remove('on'));
      const pts = p.path.map(c);
      p.path.slice(1).forEach((b, i) => {
        const a = p.path[i];
        const w = root.querySelector(`[data-l="${a}-${b}"]`) || root.querySelector(`[data-l="${b}-${a}"]`);
        if (w) w.classList.add('on');
      });
      $('#pkE').textContent = p.e;
      $('#pk').setAttribute('opacity', 1);
      for (let r = 0; r < 2; r++) {
        await FD.tween(1500, (t) => {
          if (g !== gen || dead) return;
          const [x, y] = FD.along(pts, t);
          $('#pk').setAttribute('transform', `translate(${x} ${y})`);
        });
        if (g !== gen || dead) return;
      }
      $('#pk').setAttribute('opacity', 0);
    }
    $('#view').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) { gen++; $('#pk').setAttribute('opacity', 0); view(b.dataset.v); } });
    $('#protos').addEventListener('click', (e) => { const b = e.target.closest('[data-p]'); if (b) send(b.dataset.p); });
    function reset() { gen++; view('net'); $('#pk').setAttribute('opacity', 0); $('#msg').innerHTML = ''; root.querySelectorAll('.in-p').forEach((b) => b.classList.remove('on')); root.querySelectorAll('.wire').forEach((w) => w.classList.remove('on')); }
    reset();
    return { view, send, reset, destroy() { dead = true; } };
  },
  steps: [
    {
      title: 'The internet is not the World Wide Web',
      text: `<p>The <strong>internet</strong> is the <b>inter</b>connected <b>net</b>work of computers that provides many online services to users.</p>
             <p>The <strong>World Wide Web</strong> is just <b>one use</b> of the internet.</p>`,
      tip: 'Key point: the internet is connected devices. The World Wide Web is connected content.',
      async on(a, ctx) { a.reset(); if (!(await ctx.sleep(2200))) return; a.view('web'); if (!(await ctx.sleep(2600))) return; a.view('net'); },
    },
    {
      title: 'Protocols',
      text: `<p>Applications use <strong>protocols</strong> to transfer data across the internet. Protocols are <b>rules that allow the exchange and transmission of data between devices</b>.</p>
             <p>Each service has its own protocol.</p>`,
      tip: 'Try it: press each protocol button and watch the data travel.',
      async on(a) { a.reset(); await a.send('HTTP'); },
    },
    {
      title: 'IMAP, FTP and SSH',
      text: `<ul><li><b>IMAP</b> (internet message access protocol) for <b>email</b></li>
             <li><b>FTP</b> (file transfer protocol) for <b>sending files</b></li>
             <li><b>SSH</b> (secure shell) for <b>secure remote logins</b>.</li></ul>`,
      async on(a, ctx) { await a.send('IMAP'); if (!ctx.alive()) return; await a.send('FTP'); if (!ctx.alive()) return; await a.send('SSH'); },
    },
    {
      title: 'VoIP, XMPP and HTTP',
      text: `<ul><li><b>VoIP</b> (voice over internet protocol) for <b>voice call</b> services like Skype</li>
             <li><b>XMPP</b> (extensible messaging presence protocol) for <b>messaging</b> services like WhatsApp</li>
             <li><b>HTTP</b> (hypertext transfer protocol) for the <b>World Wide Web</b>.</li></ul>`,
      tip: 'Only HTTP is about the Web. The others are different uses of the internet.',
      async on(a, ctx) { await a.send('VoIP'); if (!ctx.alive()) return; await a.send('XMPP'); if (!ctx.alive()) return; await a.send('HTTP'); },
    },
  ],
});

FD.check({
  section: 'internet',
  items: [
    { type: 'mcq', q: 'Which statement is correct?', opts: ['The internet is connected devices; the World Wide Web is connected content', 'The internet and the World Wide Web are the same thing', 'The World Wide Web is connected devices; the internet is connected content', 'The internet is one use of the World Wide Web'], why: 'The World Wide Web is just one use of the internet.' },
    { type: 'mcq', q: 'What are <b>protocols</b>?', opts: ['Rules that allow the exchange and transmission of data between devices', 'Cables that connect computers', 'Web pages joined by hyperlinks', 'Apps that send messages'], why: 'Applications use protocols to transfer data across the internet.' },
    { type: 'sort', q: 'Match each protocol to its use.', bins: ['Email', 'Sending files', 'Secure remote logins', 'Voice calls', 'Messaging', 'World Wide Web'], rows: [['IMAP', 0], ['FTP', 1], ['SSH', 2], ['VoIP', 3], ['XMPP', 4], ['HTTP', 5]], why: 'IMAP email · FTP files · SSH secure shell · VoIP voice · XMPP messaging presence · HTTP hypertext.' },
    { type: 'tf', q: 'HTTP is the protocol used for voice calls like Skype.', a: false, why: 'Voice calls use VoIP. HTTP is used for the World Wide Web.' },
  ],
});
