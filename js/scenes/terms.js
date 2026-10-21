FD.add({
  id: 'terms',
  title: 'Key terms',
  tab: 'Key terms',
  icon: 'terms',
  color: '--accent',
  page: true,
  mount(el) {
    const T = [
      ['internet', 'Internet', 'The interconnected network of computers that provides many online services to users. The internet is connected devices.'],
      ['internet', 'World Wide Web', 'Connected content: web pages joined by hyperlinks. It is just one use of the internet.'],
      ['internet', 'Protocols', 'Rules that allow the exchange and transmission of data between devices, e.g. IMAP, FTP, SSH, VoIP, XMPP and HTTP.'],
      ['info', 'On-demand', 'Whenever required (for example, catch-up television services).'],
      ['info', 'Interactivity', 'The ability of a computer to respond to input. Online interactivity became known as Web 2.0.'],
      ['info', 'Meme', 'A photo, a piece of video, a joke or similar content that spreads quickly on the internet.'],
      ['info', 'Beneficial', 'Resulting in good.'],
      ['jobs', 'Job losses', 'Employees who do not update their skills and are not willing or able to retrain could lose their jobs.'],
      ['working', 'Collaborative working', 'Working together.'],
      ['working', 'Flexible working', 'A way of working that suits an employee’s needs, e.g. deciding their hours or working from home.'],
      ['working', 'On-site', 'At a particular place of work or a place where something is being built (rather than away from that place).'],
      ['social', 'Social interaction', 'Communication with and reaction to others.'],
      ['social', 'Social network applications', 'Software that allows social interaction and the creation of links between users based on shared characteristics and interests.'],
      ['social', 'Cyberbullying', 'Using the internet to send text, images or multimedia in order to upset or embarrass someone.'],
      ['safety', 'Zip it', 'A colloquialism used to tell someone to say nothing about a particular subject, or to be quiet: keep personal information private.'],
      ['safety', 'Flag', 'To make a mark against some information to show that it is important.'],
      ['safety', 'Privacy settings', 'A method that allows users to control who can see information from their online profiles.'],
      ['safety', 'Offensive', 'Very rude or insulting and likely to upset people.'],
      ['safety', 'Age-inappropriate content', 'Materials (such as text, images, video and animations) that are not suitable for a particular age group.'],
      ['safety', 'Grooming', 'Creating an emotional connection with someone with the intention of making them less cautious, making it easier to do them harm.'],
      ['safety', 'Digital footprint', 'All the data that a user creates online, which is recorded and stored.'],
      ['safety', 'Misinterpret', 'To misunderstand the correct meaning of facts or of something that someone says or does.'],
      ['home', 'Decentralised', 'Not controlled by any one individual or organisation, like the internet.'],
      ['home', 'Perks', 'Something provided to employees by their employer in addition to their wages, such as goods, meals or a car.'],
      ['positive', 'Corporate communication', 'Providing information about a company for its employees, customers and the public, so they know what it is trying to achieve and have a good opinion of it.'],
      ['positive', 'In-video advertising', 'Advertisements that appear within online videos.'],
      ['positive', 'Viral marketing', 'Advertising in which computer users pass on advertising messages or images through email, sometimes without realising that they are doing so.'],
      ['positive', 'Cookies', 'Information that a website stores on a user’s computer so that the website recognises the user when they use it again.'],
      ['positive', 'Profile', 'A compilation of personal information about an individual.'],
      ['positive', 'Big data', 'The analysis of huge quantities of data collected from many sources (smartphones, online applications, social media and payment systems) to find patterns of behaviour and interactions.'],
      ['negative', 'Accountable', 'When someone is held responsible for the effects of their actions and must be willing to explain or be criticised for them.'],
      ['negative', 'Hacking', 'Accessing a system using malicious methods.'],
      ['divide', 'Digital divide', 'The gap between people who have access to digital devices and the internet and people who do not.'],
      ['divide', 'Inclusive', 'Making sure that all individuals and sections of society are included in or have access to something.'],
      ['networks', 'Media', 'Mass communication such as broadcasting, publishing and the internet.'],
      ['networks', 'User-generated', 'Created by the individuals who use the service.'],
      ['networks', 'Digital humanitarian movement', 'A group of people working together using ICT to promote human welfare.'],
      ['networks', 'Crowd-mapped', 'Data provided by many individuals, forming a ‘crowd’, which is then superimposed on a map using geolocation information from users’ data submissions.'],
      ['gap', 'Information rich', 'People with good access to information provided by communication technologies.'],
      ['gap', 'Information poor', 'People with limited access to information provided by communication technologies.'],
      ['gap', 'Status update', 'A message or post that a user adds to their own social media page to inform others of something that they consider important enough to share.'],
    ];
    const colorOf = (id) => (FD.section(id) || { color: '--accent' }).color;
    el.innerHTML = `
      <h2>Key terms</h2>
      <div class="terms-tools"><input type="search" id="tq" placeholder="Search a term…" aria-label="Search terms">
        <span class="seg" id="tp"><button data-v="all">All</button><button data-v="A">Part A</button><button data-v="B">Part B</button></span>
        <span class="small muted" id="tn"></span></div>
      <div class="terms" id="terms">${T.map(([f, t, d]) => `
        <article class="term" data-part="${FD.section(f).part}" style="--c:var(${colorOf(f)})"><h3>${t}</h3><p>${d}</p><button class="link-btn" data-go="${f}">${FD.icon[f]} See it</button></article>`).join('')}</div>`;
    const cards = [...el.querySelectorAll('.term')];
    const q = el.querySelector('#tq'), n = el.querySelector('#tn');
    let part = 'all';
    const filter = () => {
      const s = q.value.trim().toLowerCase();
      let k = 0;
      cards.forEach((c) => { const show = (!s || c.textContent.toLowerCase().includes(s)) && (part === 'all' || c.dataset.part === part); c.hidden = !show; k += show; });
      n.textContent = `${k} of ${cards.length} terms`;
      FD.segSet(el.querySelector('#tp'), part);
    };
    q.addEventListener('input', filter);
    el.querySelector('#tp').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) { part = b.dataset.v; filter(); } });
    filter();
    el.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => FD.goto(b.dataset.go)));
  },
});
