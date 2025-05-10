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

fetch("./data/speech.json")
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
  if (confName.includes('taslp')) return 'conf-taslp';
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
  if (confName.includes('icassp')) return 'conf-icassp';
  if (confName.includes('ieee')) return 'conf-ieee';
  if (confName.includes('arxiv')) return 'conf-arxiv';
  
  return 'conf-other';
}


// 完整的论文模板函数
function paperTemplate(paper) {
  const confClass = getConfClass(paper.conf);
  
  return `
    <div class="paper-card">
      <div class="paper-header">
        <span class="paper-conf ${confClass}">${paper.conf}</span>
      </div>
      <div class="paper-title-container">
        <h3 class="paper-title">${paper.title}</h3>
        <div class="paper-links">
          ${paper.pdf ? `<a href="${paper.pdf}" target="_blank" class="paper-link"><img src="assets/arXiv.svg" alt="PDF" class="link-icon"></a>` : ''}
          ${paper.code ? `<a href="${paper.code}" target="_blank" class="paper-link"><img src="assets/github.svg" alt="Code" class="link-icon"></a>` : ''}
        </div>
      </div>
      <p class="paper-authors">${paper.authors}</p>
      <p class="paper-abstract">${paper.abstract}</p>
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

// 渲染函数
function renderData() {
  if (!speechData) return;
  const data = speechData[lang];

  // 标题不动
  document.getElementById("direction-title").textContent = data.direction_title;
  // 描述这里用 innerHTML，id 也要和 HTML 对上
  document.getElementById("direction-desc").innerHTML = data.direction_desc;

  document.getElementById("papers-title").textContent   = data.papers_title;
  document.getElementById("projects-title").textContent = data.projects_title;

  document.getElementById("paper-list").innerHTML   = data.papers.map(paperTemplate).join("");
  document.getElementById("project-list").innerHTML = data.projects.map(projectTemplate).join("");
}

