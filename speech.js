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
  })
  .catch(error => {
    console.error("Error loading speech.json:", error);
    document.getElementById("paper-list").innerHTML = '<p class="error-message">Error loading data. Please check console for details.</p>';
    document.getElementById("project-list").innerHTML = '<p class="error-message">Error loading data. Please check console for details.</p>';
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

// 完整的论文模板函数
function paperTemplate(p) {
  const confClass = getConferenceClass(p.conference);
  return `
    <div class="paper-card">
      <div class="paper-header">
        <span class="paper-conf ${confClass}">${p.abbr || p.conference}</span>
        <h3 class="paper-title">${p.title}</h3>
      </div>
      <p class="paper-authors">${p.authors}</p>
      <p class="paper-abstract">${p.abstract}</p>
      <div class="paper-links">
        ${p.paper_link ? `<a href="${p.paper_link}" target="_blank" class="btn paper-btn">Paper</a>` : ''}
        ${p.github_link ? `<a href="${p.github_link}" target="_blank" class="btn github-btn">GitHub</a>` : ''}
      </div>
    </div>
  `;
}

// 项目模板函数
function projectTemplate(p) {
  return `
    <div class="project-card">
      <h3 class="project-title">${p.title}</h3>
      <p class="project-desc">${p.desc}</p>
      ${p.demo_link ? `<a href="${p.demo_link}" target="_blank" class="btn demo-btn">Demo</a>` : ''}
    </div>
  `;
}

// 渲染函数 - 这是之前缺失的
function renderData() {
  if (!speechData) return;
  
  const data = speechData[lang];
  
  // 更新方向标题和描述
  document.getElementById("direction-title").textContent = data.direction_title;
  document.getElementById("direction_desc").textContent = data.direction_desc;
  
  // 更新论文标题
  document.getElementById("papers-title").textContent = data.papers_title;
  
  // 更新项目标题
  document.getElementById("projects-title").textContent = data.projects_title;
  
  // 渲染论文列表
  const paperListHtml = data.papers.map(paperTemplate).join('');
  document.getElementById("paper-list").innerHTML = paperListHtml;
  
  // 渲染项目列表
  const projectListHtml = data.projects.map(projectTemplate).join('');
  document.getElementById("project-list").innerHTML = projectListHtml;
}
