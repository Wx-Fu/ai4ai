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
      <img src="assets/arxiv.svg" width="18" height="18" alt="arXiv Icon" style="margin-right:3px;vertical-align:-3px;">
      Paper
    </a>`;
    if(p.github_link) links += `<a target="_blank" rel="noopener" class="paper-link-btn github" href="${p.github_link}">
      <img src="assets/github.svg" width="18" height="18" alt="GitHub Icon" style="margin-right:3px;vertical-align:-3px;">
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
