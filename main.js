// ====== 语言切换支持 ======
let lang = localStorage.getItem("lang") || "en";
const langData = {
  en: {
    introTitle: 'About Our Lab',
    introPara: `Our laboratory focuses on cutting-edge and interdisciplinary research in speech, emotion, dialogue,<br>and digital humans, and strives to promote the innovative development of human-computer interaction technology.`,
    directions: [
      { title: 'Speech', desc: 'Research in speech recognition, synthesis and cross-disciplinary fields.' },
      { title: 'Emotion', desc: 'Emotion detection, analysis, and affective computing applications.' },
      { title: 'Dialogue', desc: 'Dialogue system, natural language understanding and generation, empathetic response.' },
      { title: 'Digital Human', desc: 'Virtual human modeling and motion generation, human-computer interaction.' }
    ],
    patentTitle: 'Patents',
    langBtn: '中文'
  },
  zh: {
    introTitle: '实验室简介',
    introPara: `我们的实验室专注于语音、情感、对话、数字人类等领域的前沿和跨学科研究，<br>致力于推动人机交互技术的创新发展。`,
    directions: [
      { title: '语音', desc: '聚焦于语音识别、合成和交叉领域的研究。' },
      { title: '情感', desc: '情感识别与分析，以及情感计算实际应用。' },
      { title: '对话', desc: '对话系统、自然语言理解与生成，共情回复。' },
      { title: '数字人', desc: '虚拟人体建模与运动生成，人机交互。' }
    ],
    patentTitle: '专利',
    langBtn: 'English'
  }
};

// ========== 专利数据按需动态加载 ==========
let patentsData = { en: [], zh: [] }; // 缓存，一次加载

function fetchPatents(callback) {
  fetch("data/patents.json").then(r => r.json()).then(data => {
    patentsData = data;
    if(typeof callback === "function") callback();
  });
}

function renderPatentList() {
  const ul = document.getElementById("patent-list");
  if (!ul) return;
  ul.innerHTML = (patentsData[lang] || []).map(txt => `<li>${txt}</li>`).join("");
}

function setLang(newLang) {
  lang = newLang;
  localStorage.setItem("lang", lang);
  applyLang();
}

function toggleLang() {
  setLang(lang === "en" ? "zh" : "en");
}

function applyLang() {
  // 基本内容
  const d = langData[lang];
  document.getElementById('intro-title').innerHTML = d.introTitle;
  document.getElementById('intro-para').innerHTML = d.introPara;
  for (let i = 0; i < 4; i++) {
    document.getElementById('dir-title-' + (i + 1)).textContent = d.directions[i].title;
    document.getElementById('dir-para-' + (i + 1)).textContent = d.directions[i].desc;
  }
  document.getElementById('patent-title').textContent = d.patentTitle;
  document.getElementById('lang-switch').textContent = d.langBtn;
  // 动态专利列表内容
  renderPatentList();
}

// 初始化
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById('lang-switch').onclick = toggleLang;
  fetchPatents(applyLang);
});

// ========== 首页四方向栏跳转 ==========
function navigateDirection(dir) {
  window.location.href = dir + ".html";
}

// ========== 方向页数据填充 ==========
// 仅在子页面自动起效
if(typeof direction !== "undefined") {
  fetch(`data/${direction}.json`).then(r => r.json()).then(data => {
    renderPaperList(data.papers || []);
    renderProjectList(data.projects || []);
  })
}

// ========== 方向页卡片渲染 ==========
function renderPaperList(papers){
  const cont = document.getElementById("paper-list");
  if (!cont) return;
  cont.innerHTML = "";
  papers.forEach(p => cont.appendChild(paperCard(p)));
  cont.classList.toggle("overflow", papers.length > 8);
}
function renderProjectList(projects){
  const cont = document.getElementById("project-list");
  if (!cont) return;
  cont.innerHTML = "";
  projects.forEach(p => cont.appendChild(projectCard(p)));
  cont.classList.toggle("overflow", projects.length > 8);
}
function paperCard(p) {
  let card = document.createElement("div");
  card.className = "ppt-card anim-card";
  card.innerHTML = `
    <div class="ppt-row">
      <span class="ppt-abbr">${p.abbr || ""}</span>
      <span class="ppt-conf ${conferenceClass(p.conf)}">${p.conf||""}</span>
    </div>
    <div class="ppt-title">
      ${(typeof p.title === "string" ? p.title : p.title[lang] || "")}
    </div>
    <div class="ppt-links">
      ${p.paper ? `<a href="${p.paper}" class="ppt-link ppt-link-paper" target="_blank">Paper</a>` : ""}
      ${p.demo ? `<a href="${p.demo}" class="ppt-link ppt-link-demo" target="_blank">Demo</a>` : ""}
    </div>
    <div class="ppt-authors">${p.authors || ""}</div>
  `;
  return card;
}
function projectCard(p) {
  let card = document.createElement("div");
  card.className = "ppt-card anim-card";
  card.innerHTML = `
    <div class="ppt-row">
      <span class="ppt-project-title">${typeof p.name === "string" ? p.name : p.name[lang]}</span>
    </div>
    <div class="ppt-links">
      ${p.demo ? `<a href="${p.demo}" class="ppt-link ppt-link-demo" target="_blank">Demo</a>` : ""}
      ${p.github ? `<a href="${p.github}" class="ppt-link ppt-link-github" target="_blank">GitHub</a>` : ""}
    </div>
    <div class="ppt-desc">${typeof p.desc === "string" ? p.desc : p.desc[lang]}</div>
  `;
  return card;
}
function conferenceClass(c) {
  if (!c) return "conf-default";
  let map = {
    "ICML": "conf-yellow", "AAAI": "conf-blue", "ACL": "conf-pink", "INTERSPEECH": "conf-violet",
    "CVPR": "conf-green", "EMNLP": "conf-pink", "ICASSP": "conf-sky"
  };
  return map[c] || "conf-default";
}

function renderCards(list, target, type) {
  /*
  list: array of paper/project objects from .json
  target: dom node
  type: "paper" or "project"
  */
  let final = '';
  list.forEach(item => {
    final += `<div class="${type}-card">
      <div class="${type}-title">${item.title}</div>
      <div class="card-authors">${item.authors || ''}</div>
      <div class="resource-links">
        ${item.links?.map(l =>
          `<a href="${l.url}" target="_blank">${l.label}</a>`
        ).join(' ') || ''}
      </div>
      <div class="card-desc">${item.desc || ''}</div>
    </div>`;
  });
  target.innerHTML = final;
}


// ====== 卡片动效 =============
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.fade-in').forEach(e => {
    e.style.opacity = '0';
    e.style.transform = 'translateY(40px)';
    setTimeout(() => {
      e.style.transition = "all .66s cubic-bezier(.4,2,.4,1)";
      e.style.opacity = '1';
      e.style.transform = 'none';
    }, 100);
  });
});
