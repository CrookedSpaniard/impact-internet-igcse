FD.add({
  id: 'jobs',
  title: 'Employment',
  tab: 'Employment',
  icon: 'jobs',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Skill requirements', 'The new skills employees must learn because employers now require them to use the internet for work.'],
    ['New job opportunities', 'Work created as the internet changes jobs: extending skills to new technologies, or training, creating, installing and maintaining the systems.'],
    ['Job losses', 'If employees do not keep updating their skills and are not willing or able to retrain, they could lose their jobs.'],
  ],
  mount(el) {
    const J = {
      jour: { e: '📰', n: 'Journalist', then: ['Write articles with a word processor', 'Submit them to the editor for publication'], now: ['Post and update stories on social media', 'Write blogs', 'Send broadcasts from a smartphone', 'Interact with the audience', 'React quickly to stories'], skills: ['Social media', 'Blogging', 'Fast typing', 'Accurate proofreading'] },
      teach: { e: '👩‍🏫', n: 'Teacher', then: ['Teach from textbooks', 'Mark paper homework'], now: ['Use information and services on the internet', 'Teach students about them', 'Help students manage online risks'], skills: ['Online services', 'Online safety'] },
      plumb: { e: '🔧', n: 'Plumber', then: ['Install pipework', 'Repair pipework'], now: ['Install pipework', 'Set up smart heating systems controlled from digital devices over the internet'], skills: ['Smart home systems', 'Apps on digital devices'] },
      photo: { e: '📷', n: 'Photographer', then: ['Develop films', 'Post prints to clients'], now: ['Clients want immediate access to photos', 'Upload and share files online'], skills: ['Uploading and sharing files online'] },
    };
    const SUPPORT = [['🧑‍🏫', 'Train and advise unskilled workers'], ['💻', 'Create the digital devices and software that workers use'], ['🛠️', 'Install and maintain the systems'], ['🗄️', 'Maintain and update servers']];
    el.innerHTML = `
      <div class="sim jb-s">
        <div class="ptabs"><button data-p="change">🔄 How jobs change</button><button data-p="race">🏃 Keep your skills up to date</button></div>
        <div data-panel="change">
          <div class="ctrls"><span class="seg" id="job">${Object.entries(J).map(([k, j]) => `<button data-v="${k}">${j.e} ${j.n}</button>`).join('')}</span>
            <span class="seg" id="era"><button data-v="then">Before the internet</button><button data-v="now">Now</button></span></div>
          <div class="jb-grid">
            <div class="sim-box"><h5 class="mw-h" id="jT"></h5><ul class="jb-tasks" id="tasks"></ul></div>
            <div class="sim-box"><h5 class="mw-h">🎓 New skills needed</h5><div class="chips" id="skills"></div></div>
            <div class="sim-box"><h5 class="mw-h">✨ New jobs for people who support these skills</h5><ul class="jb-tasks" id="supp"></ul></div>
          </div>
        </div>
        <div data-panel="race" hidden>
          <div class="ctrls"><button class="btn primary" id="go">▶ Run 10 years</button><span class="ro"><small>Year</small><b id="yr">Year 0</b></span></div>
          <div class="jb-race">
            ${['ana', 'ben'].map((w) => `
            <div class="sim-box jb-w" id="w-${w}"><div class="jb-face">${w === 'ana' ? '👩' : '👨'}</div>
              <div><b>${w === 'ana' ? 'Ana keeps updating her skills' : 'Ben does not retrain'}</b>
              <div class="rm-meter"><i id="m-${w}"></i></div><small class="note" id="s-${w}">Skills match the job: 100%</small></div></div>`).join('')}
          </div>
          <div class="sim-box"><h5 class="mw-h">Skills the job requires</h5><div class="chips" id="req"></div></div>
        </div>
        <p class="verdict" id="msg"></p>
      </div>`;
    const root = el.querySelector('.jb-s'), $ = (s) => root.querySelector(s);
    let dead = false, gen = 0, job = 'jour', era = 'then';
    const show = FD.panels(root, () => { gen++; });

    function draw() {
      show('change');
      const j = J[job];
      FD.segSet($('#job'), job); FD.segSet($('#era'), era);
      $('#jT').textContent = `${j.e} ${j.n}: ${era === 'then' ? 'before the internet' : 'now'}`;
      $('#tasks').innerHTML = j[era].map((t) => `<li class="new">${t}</li>`).join('');
      $('#skills').innerHTML = era === 'now' ? j.skills.map((s) => `<span class="pill new">${s}</span>`).join('') : '<span class="note">—</span>';
      $('#supp').innerHTML = era === 'now' ? SUPPORT.map(([e, t]) => `<li class="new">${e} ${t}</li>`).join('') : '<li class="note">—</li>';
    }
    function pick(k, e) { job = k; era = e; draw(); }
    $('#job').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) pick(b.dataset.v, era); });
    $('#era').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) pick(job, b.dataset.v); });

    const REQ = ['Word processing', 'Email', 'Online forms', 'Cloud storage', 'Video calls', 'Social media', 'Smart systems', 'Online safety'];
    async function race() {
      show('race');
      const g = ++gen;
      $('#msg').className = 'verdict'; $('#msg').innerHTML = '';
      ['ana', 'ben'].forEach((w) => { $('#w-' + w).classList.remove('lost'); });
      for (let y = 0; y <= 10; y++) {
        const need = 2 + Math.floor(y * 0.6), ben = Math.min(need, 2);
        $('#yr').textContent = 'Year ' + y;
        $('#req').innerHTML = REQ.slice(0, need).map((s, i) => `<span class="pill ${i >= 2 ? 'r' : ''}">${s}</span>`).join('');
        const pa = 100, pb = Math.round(100 * ben / need);
        $('#m-ana').style.width = pa + '%'; $('#s-ana').textContent = `Skills match the job: ${pa}%`;
        $('#m-ben').style.width = pb + '%'; $('#m-ben').classList.toggle('bad', pb < 60); $('#s-ben').textContent = `Skills match the job: ${pb}%`;
        await FD.wait(650);
        if (dead || g !== gen) return;
      }
      $('#w-ben').classList.add('lost');
      $('#s-ben').innerHTML = '<span class="bad-t">✗ Does not have the skills for the new work: job lost</span>';
      $('#msg').className = 'verdict bad';
      $('#msg').innerHTML = 'If employees do not keep updating their skills in the use of the internet, and are not willing or able to retrain, they could <b>lose their jobs</b>.';
    }
    $('#go').addEventListener('click', race);
    function reset() { gen++; pick('jour', 'then'); $('#msg').innerHTML = ''; $('#yr').textContent = 'Year 0'; $('#req').innerHTML = ''; ['ana', 'ben'].forEach((w) => { $('#m-' + w).style.width = '100%'; $('#w-' + w).classList.remove('lost'); $('#m-' + w).classList.remove('bad'); $('#s-' + w).textContent = 'Skills match the job: 100%'; }); }
    reset();
    return { pick, race, reset, destroy() { dead = true; } };
  },
  steps: [
    {
      title: 'The internet changes the way people work',
      text: `<p>The internet has had an impact on individuals’ <b>employment</b>, often requiring people to <b>learn new skills</b> so they can change the way they work.</p>`,
      tip: 'Try it: choose a job and switch between “Before the internet” and “Now”.',
      async on(a, ctx) { a.reset(); if (!(await ctx.sleep(1800))) return; a.pick('jour', 'now'); },
    },
    {
      title: 'Skill requirements: journalists',
      text: `<p>Journalists used to write articles with a word processor and submit them to their editor. Now they also <b>post and update stories on social media</b>, write <b>blogs</b>, send broadcasts from their <b>smartphones</b> and <b>interact with their audience</b>.</p>
             <p>They must react quickly, so their <b>typing and proofreading</b> skills must be of a good standard.</p>`,
      async on(a, ctx) { a.pick('jour', 'then'); if (!(await ctx.sleep(1600))) return; a.pick('jour', 'now'); },
    },
    {
      title: 'Skill requirements: teachers',
      text: `<p>Modern teachers must be familiar with the information and services available on the internet so that they can <b>teach their students</b> about them.</p>
             <p>They must also help students <b>manage the risks</b> that they face in the online world.</p>`,
      async on(a, ctx) { a.pick('teach', 'then'); if (!(await ctx.sleep(1400))) return; a.pick('teach', 'now'); },
    },
    {
      title: 'New job opportunities',
      text: `<p>As the internet changes the work people do, it provides <b>new job opportunities</b>. A plumber is no longer limited to pipework: homeowners buy <b>smart systems</b> controlled from digital devices over the internet, so plumbers can extend their skills to these new technologies.</p>`,
      tip: 'Whatever the job, people who can offer modern services find more employment opportunities.',
      async on(a, ctx) { a.pick('plumb', 'then'); if (!(await ctx.sleep(1400))) return; a.pick('plumb', 'now'); },
    },
    {
      title: 'Skilled workers to support the change',
      text: `<p>As the use of the internet at work grows, skilled workers are needed to support it. People are required to:</p>
             <ul><li><b>train and advise</b> unskilled workers</li><li><b>create</b> the digital devices and software that workers use</li><li><b>install and maintain</b> the systems that they use.</li></ul>`,
      tip: 'Table 7.2: a photographer’s clients want immediate access to photos → new skill: uploading and sharing files online → new job: maintaining and updating servers.',
      async on(a) { a.pick('photo', 'now'); },
    },
    {
      title: 'Job losses',
      text: `<p>If employees do not keep updating their skills in the use of the internet, they may not have the skills required to carry out new work.</p>
             <p>If they are <b>not willing or able to retrain</b>, they could <b>lose their jobs</b>.</p>`,
      tip: 'Try it: run 10 years and compare Ana and Ben.',
      async on(a) { await a.race(); },
    },
  ],
});

FD.activities({
  section: 'jobs',
  items: [
    {
      id: 'jobs-table',
      title: 'Technology and jobs · 1 (Table 7.2)',
      task: `<p>Complete Table 7.2. For each job, add a way in which the internet has changed that job, suggest a new skill to meet the change, and identify a new job opportunity for someone who could support the new skill. Then add a job of your choice.</p>
             <p class="note">Example: <b>Photographer</b> → clients want immediate access to photos → uploading and sharing files online → maintaining and updating servers.</p>`,
      fields: ['Medical scientist · nature of change', 'Medical scientist · new skill', 'Medical scientist · job opportunity', 'Teacher · nature of change', 'Teacher · new skill', 'Teacher · job opportunity', 'Your choice of job', 'Your job · nature of change', 'Your job · new skill', 'Your job · job opportunity'],
      lines: 2,
      hint: 'Notes (optional)…',
    },
    {
      id: 'jobs-photo',
      title: 'Technology and jobs · 2',
      task: '<p>Use the example of the photographer given in Table 7.2 to explain how the internet has led to the creation of new jobs.</p>',
      lines: 5,
    },
  ],
});

FD.check({
  section: 'jobs',
  items: [
    { type: 'mcq', q: 'Why must many employees learn new skills?', opts: ['Employers now require them to use the internet for work', 'Word processors no longer exist', 'The internet does all the work for them', 'They can no longer type'], why: 'For example, journalists now post stories on social media and write blogs.' },
    { type: 'mcq', q: 'A plumber learns to install smart heating controlled over the internet. This is an example of…', opts: ['a new job opportunity as the nature of jobs changes', 'a job loss', 'collaborative working', 'the digital divide'], why: 'People who can offer modern services find more employment opportunities.' },
    { type: 'multi', q: 'Which <b>two</b> are jobs created to support the use of the internet at work?', need: 2, opts: [['Training and advising unskilled workers', true], ['Installing and maintaining systems', true], ['Developing camera film', false], ['Delivering paper letters', false]], why: 'Also creating the digital devices and software that workers use.' },
    { type: 'tf', q: 'Employees who are not willing or able to retrain could lose their jobs.', a: true, why: 'They may not have the skills required to carry out new work.' },
  ],
});
