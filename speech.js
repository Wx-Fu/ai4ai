let lang = localStorage.getItem("lang") || "en";
function setLangSwitchBtn(lang) {
  document.getElementById('lang-switch').textContent = lang === "en" ? '中文' : 'English';
}
setLangSwitchBtn(lang);


document.getElementById("lang-switch").onclick = function() {
  lang = lang === "en" ? "zh" : "en";
  localStorage.setItem("lang", lang);
  setLangSwitchBtn(lang);
  renderData();
};

let speechData = null;

fetch("data/speech.json")
  .then(r=>r.json())
  .then(data=>{
    speechData = data;
    renderData();
  });

function renderData() {
  if (!speechData) return;
  const d = speechData[lang];

  // 方向区
  document.getElementById('direction-title').textContent = d.direction_title;
  document.getElementById('direction-desc').textContent = d.direction_desc;
  document.getElementById('papers-title').textContent = d.papers_title || "Papers";
  document.getElementById('projects-title').textContent = d.projects_title || "Projects";

  // Papers
  let paperListHtml = "";
  d.papers.forEach(p=>{
    // tag + abbr
    let tag = p.conference ? `<span class="paper-tag tag-${(p.conference||'').replace(/\s+/g,'')}">${p.conference}</span>` : "";
    let abbr = p.abbr ? `<span class="paper-short-abbr">${p.abbr}</span>` : "";

    // links with icon
    let links = "";
    if(p.paper_link) links += `<a target="_blank" rel="noopener" class="paper-link-btn" href="${p.paper_link}">
      <svg viewBox="0 0 24 24"><image xlink:href="assets/arxiv.svg" width="24" height="24"/></svg>
      Paper
    </a>`;
    if(p.github_link) links += `<a target="_blank" rel="noopener" class="paper-link-btn github" href="${p.github_link}">
      <svg viewBox="0 0 24 24"><image xlink:href="assets/github.svg" width="24" height="24"/></svg>
      Github
    </a>`;

    paperListHtml += `<div class="paper-card">
      <div class="paper-tags">${tag}${abbr}</div>
      <div class="paper-title">${p.title}</div>
      <div class="paper-links">${links}</div>
      <div class="paper-authors">${p.authors||""}</div>
      <div class="paper-abstract">${p.abstract||""}</div>
    </div>`;
  });
  document.getElementById('paper-list').innerHTML = paperListHtml;

  // Projects
  let proListHtml = "";
  d.projects.forEach(pro=>{
    let links = pro.demo_link ? 
      `<a target="_blank" class="project-link" href="${pro.demo_link}">
         <svg viewBox="0 0 24 24" width="20" height="20" style="margin-right:2px"><circle cx="12" cy="12" r="10" fill="#41b2f4"/>
           <polygon points="10,8 18,12 10,16" fill="#fff"/>
         </svg>
         Demo
       </a>`:"";
    proListHtml += `<div class="project-card">
      <div class="project-title">${pro.title}</div>
      <div class="project-desc">${pro.desc||""}</div>
      <div class="project-links">${links}</div>
    </div>`;
  });
  document.getElementById('project-list').innerHTML = proListHtml;
}

// papersData 是你的数据：[{title, conf, authors, abstract, links: [{type, url}], ...}]
function renderPaperList(papers) {
  const container = document.getElementById('papers-list');
  container.innerHTML = papers.map(p => `
    <div class="paper-item">
      ${p.conf ? `<span class="paper-meta">${p.conf}</span>` : ""}
      <span class="paper-title">${p.title}</span>
      <span class="paper-authors">${p.authors}</span>
      <span class="paper-abstract">${p.abstract||''}</span>
      ${p.links ? `<span class="paper-links">
        ${p.links.map(l=>`<a href="${l.url}" target="_blank">
            <img src="${l.type}.svg" alt="${l.type}"> 
            ${l.type.charAt(0).toUpperCase()+l.type.slice(1)}
          </a>`).join('')}
      </span>` : ""}
    </div>
  `).join('');
}

