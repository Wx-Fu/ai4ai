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

function getConferenceClass(conference) {
  // 从会议名称中提取缩写
  const confName = conference.toLowerCase();
  
  if (confName.includes('neurips')) return 'conf-neurips';
  if (confName.includes('icml')) return 'conf-icml';
  if (confName.includes('iclr')) return 'conf-iclr';
  if (confName.includes('acl')) return 'conf-acl';
  if (confName.includes('cvpr')) return 'conf-cvpr';
  if (confName.includes('iccv')) return 'conf-iccv';
  if (confName.includes('eccv')) return 'conf-eccv';
  if (confName.includes('emnlp')) return 'conf-emnlp';
  if (confName.includes('naacl')) return 'conf-naacl';
  if (confName.includes('aaai')) return 'conf-aaai';
  if (confName.includes('ijcai')) return 'conf-ijcai';
  if (confName.includes('interspeech')) return 'conf-interspeech';
  if (confName.includes('ieee')) return 'conf-ieee';
  if (confName.includes('arxiv')) return 'conf-arxiv';
  
  return 'conf-other';
}

// 提取模板函数
function paperTemplate(p) {
  const confClass = getConferenceClass(p.conference);
  
  return `<div class="paper-card">
    <span class="paper-conference ${confClass}">${p.conference}</span>
    <div class="paper-title">${p.title}</div>
    <div class="paper-links">
      ${p.paper_link ? `<a href="${p.paper_link}" target="_blank"><img src="assets/arXiv.svg" width="18"> arXiv</a>` : ''}
      ${p.github_link ? `<a href="${p.github_link}" target="_blank"><img src="assets/github.svg" width="18"> GitHub</a>` : ''}
    </div>
    <div class="paper-authors">${p.authors}</div>
    <div class="paper-abstract">${p.abstract}</div>
  </div>`;
}

// 添加项目模板函数
function projectTemplate(p) {
  return `<div class="project-card">
    <div class="project-title">${p.title}</div>
    <div class="project-desc">${p.desc}</div>
    ${p.demo_link ? `<a href="${p.demo_link}" target="_blank" class="project-demo-link">Demo</a>` : ''}
  </div>`;
}

// speech.js
function renderData() {
  if (!speechData) return;
  const d = speechData[lang] || speechData.en; // 增加fallback

  // 设置方向介绍
  document.getElementById('direction-title').textContent = d.direction_title || 'Speech';
  document.getElementById('direction-desc').textContent = d.direction_desc || 'Our research focuses on...';
  
  // 设置标题
  document.getElementById('papers-title').textContent = d.papers_title || 'Papers';
  document.getElementById('projects-title').textContent = d.projects_title || 'Projects';

  // 处理空数据状态
  const paperListHtml = d.papers?.length ? 
    d.papers.map(p => paperTemplate(p)).join('') :
    '<div class="empty-state">No papers found</div>';

  const proListHtml = d.projects?.length ? 
    d.projects.map(p => projectTemplate(p)).join('') :
    '<div class="empty-state">No projects found</div>';
    
  // 将内容插入DOM
  document.getElementById('paper-list').innerHTML = paperListHtml;
  document.getElementById('project-list').innerHTML = proListHtml;
}
