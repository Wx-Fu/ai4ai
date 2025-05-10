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

// speech.js
function renderData() {
  if (!speechData) return;
  const d = speechData[lang] || speechData.en; // 增加fallback

  // 处理空数据状态
  const paperListHtml = d.papers?.length ? 
    d.papers.map(p => paperTemplate(p)).join('') :
    '<div class="empty-state">No papers found</div>';

  const proListHtml = d.projects?.length ? 
    d.projects.map(p => projectTemplate(p)).join('') :
    '<div class="empty-state">No projects found</div>';
}

// 提取模板函数
function paperTemplate(p) {
  return `<div class="paper-card">
    <div class="paper-header">
      <div class="paper-title">${p.title}</div>
      <div class="paper-links">
        ${p.paper_link ? `<a href="${p.paper_link}" target="_blank"><img src="assets/arxiv.svg" width="18"></a>` : ''}
        ${p.github_link ? `<a href="${p.github_link}" target="_blank"><img src="assets/github.svg" width="18"></a>` : ''}
      </div>
    </div>
    <div class="paper-authors">${p.authors}</div>
    <div class="paper-conference">${p.conference}</div>
    <div class="paper-abstract">${p.abstract}</div>
  </div>`;
}
