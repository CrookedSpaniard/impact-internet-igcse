FD.add({
  id: 'working',
  title: 'Working practices',
  tab: 'Working',
  icon: 'working',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Working practices', 'The ways in which people carry out the tasks that are part of their jobs.'],
    ['Collaborative working', 'Working together.'],
    ['Flexible working', 'A way of working that suits an employee’s needs, e.g. choosing their hours or working from home.'],
    ['Mobile working', 'Working while travelling, e.g. on the way to and from the office or at a client’s location.'],
    ['On-site', 'At a particular place of work or a place where something is being built.'],
  ],
  mount(el) {
    const BD = {
      split: { good: ['Each employee can focus on one task.', 'Employees become experts in their area through (narrow) experience or training.'], bad: ['Employees do not share their skills and expertise.', 'Employees have reduced understanding of the whole project.'] },
      same: { good: ['Expertise is shared.', 'Employees can check each other’s work.'], bad: ['It can be difficult for lots of people to agree.', 'It can be difficult to co-ordinate the work of many employees.'] },
      flex: { good: ['Work at a time of day that is right for them and take breaks whenever they need to.', 'Fit their work around their family life.'], bad: ['Do not meet face to face as much, which can reduce their understanding of each other and their employer.', 'May not manage their work effectively, which could affect their home life or cause exhaustion.'] },
      mobile: { good: ['Access up-to-date information.', 'Work from anywhere with an internet connection.'], bad: ['Could become exhausted if they work longer hours than expected when travelling.', 'May not have access to the same facilities or resources as employees who only work in one place.'] },
    };
    const TASKS = [['🔎', 'Research', '#1c7ed6'], ['✍️', 'Write', '#7048e8'], ['🎨', 'Design', '#d6336c'], ['✅', 'Check', '#2f9e44']];
    const STOPS = [['🏢', 'Office', 'All facilities: printer, meeting rooms, colleagues.', true], ['🚆', 'Train', 'Reply to emails and update the job list on the way.', false], ['🏭', 'Client’s site', 'Repair engineer on-site: download the latest manual and check parts in stock.', false], ['🏠', 'Home', 'Write the report… it is now 21:00.', false]];
    el.innerHTML = `
      <div class="sim wk-s">
        <div class="ptabs"><button data-p="collab">🤝 Collaborative working</button><button data-p="flex">🕘 Flexible working</button><button data-p="mobile">🚆 Mobile working</button></div>
        <div data-panel="collab">
          <div class="ctrls"><span class="seg" id="mode"><button data-v="split">✂️ Split into individual tasks</button><button data-v="same">👥 Several people on one task</button></span><button class="btn primary" id="cGo">▶ Start the project</button></div>
          <div class="sim-box" id="board"></div>
        </div>
        <div data-panel="flex" hidden>
          <div class="ctrls">
            <label class="rng"><span>Start work at <output id="stOut">09:00</output></span><input type="range" id="st" min="6" max="12" value="9"></label>
            <label class="rng"><span>Hours worked today <output id="hrOut">8 h</output></span><input type="range" id="hr" min="4" max="13" value="8"></label>
            <label class="tgl"><input type="checkbox" id="fHome"> Work from home today</label>
          </div>
          <div class="sim-box"><div class="wk-day" id="dayBar"></div><div class="wk-hours">${[0, 3, 6, 9, 12, 15, 18, 21, 24].map((h) => `<span style="left:${(h / 24) * 100}%">${String(h).padStart(2, '0')}</span>`).join('')}</div>
            <div class="readout" id="fRo"></div></div>
        </div>
        <div data-panel="mobile" hidden>
          <div class="wk-route" id="route">${STOPS.map(([e, n], i) => `<button class="wk-stop" data-s="${i}"><span>${e}</span><b>${n}</b></button>`).join('<i class="wk-arr">→</i>')}</div>
          <div class="sim-box wk-dev"><div class="wk-ph">📱</div><div><h5 class="mw-h" id="mN">Press a stop on the route</h5><p class="note" id="mT">A repair engineer works on the move.</p>
            <button class="btn" id="mData" disabled>⬇ Get up-to-date data</button><p class="note" id="mOut"></p></div></div>
        </div>
        <div class="two-col" id="bd"></div>
        <p class="verdict" id="msg"></p>
      </div>`;
    const root = el.querySelector('.wk-s'), $ = (s) => root.querySelector(s);
    let dead = false, gen = 0, mode = 'split';
    const lists = (k) => {
      $('#bd').innerHTML = `<div class="mini" style="--c:var(--good)"><h5>✓ Benefits</h5><ul class="wk-l">${BD[k].good.map((t) => `<li>${t}</li>`).join('')}</ul></div>
        <div class="mini" style="--c:var(--bad)"><h5>✗ Drawbacks</h5><ul class="wk-l">${BD[k].bad.map((t) => `<li>${t}</li>`).join('')}</ul></div>`;
    };
    const show = FD.panels(root, (p) => { gen++; $('#msg').innerHTML = ''; lists(p === 'collab' ? mode : p); if (p === 'flex') flex(); });

    // ---- collaborative working ----
    function board() {
      FD.segSet($('#mode'), mode);
      lists(mode);
      $('#board').innerHTML = mode === 'split'
        ? TASKS.map(([e, n, c], i) => `<div class="wk-row"><span class="av" style="--av:${c}">${'ADKS'[i]}</span><b>${e} ${n}</b><div class="rm-meter"><i style="background:${c}" data-b="${i}"></i></div></div>`).join('')
        : `<div class="wk-doc"><div class="wk-doc-h">📄 Shared report · 3 people editing now ${['#1c7ed6', '#d6336c', '#2f9e44'].map((c, i) => `<span class="av" style="--av:${c}">${'ADK'[i]}</span>`).join('')}</div><p id="docTxt" class="wk-txt"></p><div class="chips" id="docNotes"></div></div>`;
    }
    async function collab(m) {
      show('collab');
      const g = ++gen;
      mode = m || mode;
      board();
      $('#msg').className = 'verdict'; $('#msg').innerHTML = 'The internet connects people in real time, so sharing work is more efficient and work can be done more quickly, even 24 hours a day.';
      if (mode === 'split') {
        const sp = [1, 1.3, 0.9, 1.15];
        await FD.tween(2600, (t) => { if (g === gen) root.querySelectorAll('[data-b]').forEach((b, i) => { b.style.width = Math.min(100, 100 * t * sp[i] * 1.1) + '%'; }); });
        if (dead || g !== gen) return;
        root.querySelectorAll('[data-b]').forEach((b) => { b.style.width = '100%'; });
        $('#msg').innerHTML = '✂️ The project was split into tasks, each done by a different employee <b>at the same time</b>.';
      } else {
        const words = 'Our new product will help people save energy at home by switching off devices they forget about.'.split(' ');
        for (let i = 0; i < words.length; i++) {
          $('#docTxt').innerHTML = words.slice(0, i + 1).join(' ') + `<i class="wk-cur" style="background:${['#1c7ed6', '#d6336c', '#2f9e44'][i % 3]}"></i>`;
          await FD.wait(170); if (dead || g !== gen) return;
          if (i === 6) $('#docNotes').innerHTML = '<span class="pill g">✓ Kai checked Ana’s paragraph</span>';
          if (i === 12) $('#docNotes').innerHTML += ' <span class="pill r">💬 Dev: “I don’t agree with ‘forget’…”</span>';
        }
        $('#msg').innerHTML = '👥 More than one person works on the <b>same task at the same time</b>.';
      }
    }
    $('#mode').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) { gen++; mode = b.dataset.v; board(); } });
    $('#cGo').addEventListener('click', () => collab());

    // ---- flexible working ----
    function flex() {
      const st = +$('#st').value, hr = +$('#hr').value, home = $('#fHome').checked;
      $('#stOut').textContent = String(st).padStart(2, '0') + ':00'; $('#hrOut').textContent = hr + ' h';
      const seg = (a, b, cls, t) => `<span class="wk-b ${cls}" style="left:${(a / 24) * 100}%;width:${((b - a) / 24) * 100}%" title="${t}">${t}</span>`;
      let html = seg(15.5, 16.5, 'fam', '👧');
      const com = home ? 0 : 1;
      if (com) html += seg(st - 1, st, 'trv', '🚗') ;
      const half = Math.min(hr, 15.5 - st);
      html += seg(st, st + half, 'wrk', '💼 Work');
      let end = st + half;
      if (hr > half) { const s2 = Math.max(end, 16.5); html += seg(s2, s2 + (hr - half), 'wrk', '💼'); end = s2 + (hr - half); }
      if (com) html += seg(end, end + 1, 'trv', '🚗');
      $('#dayBar').innerHTML = html;
      const tired = hr >= 11;
      $('#fRo').innerHTML = `<span class="ro"><small>Starts</small><b>${String(st).padStart(2, '0')}:00</b></span><span class="ro ${home ? 'good' : ''}"><small>Travel</small><b>${home ? '0 h' : '2 h'}</b></span><span class="ro ${tired ? 'bad' : 'good'}"><small>Finishes</small><b>${String(Math.floor(end) % 24).padStart(2, '0')}:${end % 1 ? '30' : '00'}</b></span>`;
      $('#msg').className = 'verdict' + (tired ? ' bad' : '');
      $('#msg').innerHTML = tired ? '⚠️ Working this many hours could affect home life or cause <b>exhaustion</b>: the employee is not managing their work effectively.'
        : `The employee decides the hours they work${home ? ' and works from home' : ''}, using the internet to access systems from anywhere at any time of day.`;
    }
    function setFlex(st, hr, home) { show('flex'); $('#st').value = st; $('#hr').value = hr; $('#fHome').checked = home; flex(); }
    ['#st', '#hr', '#fHome'].forEach((s) => $(s).addEventListener('input', flex));

    // ---- mobile working ----
    let at = -1;
    function stop(i) {
      show('mobile');
      at = i;
      root.querySelectorAll('.wk-stop').forEach((b) => b.classList.toggle('on', +b.dataset.s === i));
      const [e, n, t, office] = STOPS[i];
      $('#mN').textContent = `${e} ${n}`; $('#mT').textContent = t; $('#mOut').innerHTML = '';
      $('#mData').disabled = false;
      $('#msg').className = 'verdict' + (i === 3 ? ' bad' : '');
      $('#msg').innerHTML = office ? 'In the office there are facilities and resources that mobile workers may not have.'
        : i === 3 ? '⚠️ Mobile workers could become <b>exhausted</b> if they work longer hours than expected when travelling.' : 'Mobile working: employees work on the move or on-site, connected to the internet.';
    }
    async function data() {
      const g = ++gen;
      $('#mOut').innerHTML = 'Connecting…';
      await FD.wait(700); if (dead || g !== gen) return;
      $('#mOut').innerHTML = at === 0 ? '<span class="good-t">✓ Latest data, and a printer and meeting room too.</span>'
        : '<span class="good-t">✓ Boiler manual v5 (updated today) · 3 spare valves in stock</span><br><span class="bad-t">✗ No printer or meeting room here</span>';
    }
    $('#route').addEventListener('click', (e) => { const b = e.target.closest('[data-s]'); if (b) stop(+b.dataset.s); });
    $('#mData').addEventListener('click', data);

    function reset() { gen++; mode = 'split'; show('collab'); board(); $('#msg').innerHTML = ''; }
    reset();
    return { collab, setFlex, stop, data, show, reset, destroy() { dead = true; } };
  },
  steps: [
    {
      title: 'Working practices and collaborative working',
      text: `<p><strong>Working practices</strong> are the ways in which people carry out the tasks that are part of their jobs.</p>
             <p>The internet connects people in <b>real time</b>, so sharing work is more efficient. This <strong>collaborative working</strong> (working together) lets work be done more quickly or <b>24 hours a day</b>.</p>`,
      async on(a) { a.reset(); },
    },
    {
      title: 'Splitting work into individual tasks',
      text: `<p>Collaborative working allows work to be <b>split into individual tasks</b>, each done by a different employee.</p>
             <p><b>Benefits:</b> each employee can focus on one task and becomes an expert. <b>Drawbacks:</b> employees do not share their skills and have a reduced understanding of the whole project.</p>`,
      tip: 'Try it: start the project.',
      async on(a) { await a.collab('split'); },
    },
    {
      title: 'Several people on one task',
      text: `<p>It also allows <b>more than one person to work on a task at the same time</b>.</p>
             <p><b>Benefits:</b> expertise is shared and employees can check each other’s work. <b>Drawbacks:</b> it can be difficult for lots of people to agree and to co-ordinate their work.</p>`,
      async on(a) { await a.collab('same'); },
    },
    {
      title: 'Flexible working',
      text: `<p><strong>Flexible working</strong> suits an employee’s needs: they can decide the <b>hours</b> they work or work <b>from home</b>, because the internet gives access to systems from anywhere at any time of day.</p>
             <p><b>Benefits:</b> work at a time that is right for them, take breaks when needed and fit work around family life.</p>`,
      tip: 'Try it: change the start time and tick “Work from home”.',
      async on(a, ctx) { a.setFlex(9, 8, false); if (!(await ctx.sleep(1600))) return; a.setFlex(7, 8, true); },
    },
    {
      title: 'Drawbacks of flexible working',
      text: `<p>Employees do not <b>meet face to face</b> as much, which can reduce their understanding of each other and their employer.</p>
             <p>They may not <b>manage their work effectively</b>, which could affect their home life or cause <b>exhaustion</b>.</p>`,
      tip: 'Try it: push “Hours worked today” to 11 or more.',
      async on(a) { a.setFlex(7, 12, true); },
    },
    {
      title: 'Mobile working',
      text: `<p><strong>Mobile working</strong> lets employees work while travelling, and lets people who work on the move, like repair engineers and salespeople, access <b>up-to-date data</b> when <strong>on-site</strong> or at a client’s location.</p>
             <p><b>Benefits:</b> up-to-date information; work from anywhere with an internet connection.</p>`,
      tip: 'Try it: go to the client’s site and get up-to-date data.',
      async on(a, ctx) { a.stop(1); if (!(await ctx.sleep(1400))) return; a.stop(2); await a.data(); },
    },
    {
      title: 'Drawbacks of mobile working',
      text: `<p>Mobile workers could become <b>exhausted</b> if they work longer hours than expected when travelling.</p>
             <p>They may not have access to the <b>same facilities or resources</b> as employees who only work in one place.</p>`,
      async on(a) { a.stop(3); },
    },
  ],
});

FD.check({
  section: 'working',
  items: [
    { type: 'mcq', q: 'What is meant by <b>collaborative working</b>? <small>(Chapter question 6)</small>', opts: ['Working together', 'Working from home', 'Working while travelling', 'Working at night'], why: 'The internet connects people in real time, so sharing work is more efficient.' },
    { type: 'sort', q: 'Work is split into individual tasks, one per employee. Benefit or drawback?', bins: ['Benefit', 'Drawback'], rows: [['Each employee can focus on one task', 0], ['Employees have reduced understanding of the whole project', 1], ['Employees become experts in their area', 0], ['Employees do not share their skills and expertise', 1]], why: 'When several people work on one task instead, expertise is shared but it is harder to agree.' },
    { type: 'mcq', q: 'Which is a <b>drawback</b> of flexible working?', opts: ['Employees do not meet face to face as much', 'Employees can fit work around family life', 'Employees can take breaks when they need to', 'Employees can choose their hours'], why: 'They may also not manage their work effectively and become exhausted.' },
    { type: 'tf', q: 'Mobile workers may not have access to the same facilities or resources as employees who only work in one place.', a: true, why: 'But they can access up-to-date information from anywhere with an internet connection.' },
  ],
});
