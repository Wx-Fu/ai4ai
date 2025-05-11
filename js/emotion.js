let lang = localStorage.getItem("lang") || "en";

// 添加分页相关变量
let currentPaperPage = 1;
let currentProjectPage = 1;
const itemsPerPage = 4;
let paginationInitialized = false; // 添加标志避免重复初始化
let speechData = null;

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

fetch("../data/emotion.json")
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
  // 添加空值检查
  if (!conference) return 'conf-other';
  
  // 从会议名称中提取缩写
  const confName = conference.toLowerCase();
  
  if (confName.includes('neurips')) return 'conf-neurips';
  if (confName.includes('taslp')) return 'conf-taslp';
  if (confName.includes('icml')) return 'conf-icml';
  if (confName.includes('iclr')) return 'conf-iclr';
  if (confName.includes('acl')) return 'conf-acl';
  if (confName.includes('tac')) return 'conf-tac';
  if (confName.includes('iccv')) return 'conf-iccv';
  if (confName.includes('eccv')) return 'conf-eccv';
  if (confName.includes('emnlp')) return 'conf-emnlp';
  if (confName.includes('iscslp')) return 'conf-iscslp';
  if (confName.includes('aaai')) return 'conf-aaai';
  if (confName.includes('acmmm')) return 'conf-acmmm';
  if (confName.includes('interspeech')) return 'conf-interspeech';
  if (confName.includes('icassp')) return 'conf-icassp';
  if (confName.includes('iccip')) return 'conf-iccip';
  if (confName.includes('arxiv')) return 'conf-arxiv';
  
  return 'conf-other';
}

// 完整的论文模板函数
function paperTemplate(paper) {
  // 使用conference而不是conf
  const confClass = getConferenceClass(paper.conference);
  
  return `
    <div class="paper-card">
      <div class="paper-header">
        <span class="paper-conf ${confClass}">${paper.conference || 'Unknown'}</span>
      </div>
      <div class="paper-title-container">
        <h3 class="paper-title">${paper.title || ''}</h3>
        <div class="paper-links">
          ${paper.paper_link ? `<a href="${paper.paper_link}" target="_blank" class="paper-link"><img src="../assets/arXiv.svg" alt="PDF" class="link-icon arxiv-icon"></a>` : ''}
          ${paper.github_link ? `<a href="${paper.github_link}" target="_blank" class="paper-link"><img src="../assets/github.svg" alt="Code" class="link-icon"></a>` : ''}
        </div>
      </div>
      <p class="paper-authors">${paper.authors || ''}</p>
      <p class="paper-abstract">${paper.abstract || ''}</p>
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

// 修改 renderData 函数 - 删除了参数，避免变量名冲突
function renderData() {
  if (!speechData) return;
  const data = speechData[lang];
  
  // 标题不动
  document.getElementById("direction-title").textContent = data.direction_title;
  // 描述这里用 innerHTML，id 也要和 HTML 对上
  document.getElementById("direction-desc").innerHTML = data.direction_desc;
  
  document.getElementById("papers-title").textContent = data.papers_title;
  document.getElementById("projects-title").textContent = data.projects_title;

  // 存储完整数据以便分页使用
  window.allPapers = data.papers;
  window.allProjects = data.projects;
  
  // 重置为第一页
  currentPaperPage = 1;
  currentProjectPage = 1;
  
  // 初始渲染第一页
  renderPaperPage(currentPaperPage);
  renderProjectPage(currentProjectPage);
  
  // 只在第一次渲染时初始化分页控制器
  if (!paginationInitialized) {
    setupPaginationControls();
    paginationInitialized = true;
  }
}

// 添加论文分页渲染函数
function renderPaperPage(page) {
  const papers = window.allPapers;
  if (!papers || !papers.length) return;
  
  const totalPages = Math.ceil(papers.length / itemsPerPage);
  // 确保页码有效
  page = Math.max(1, Math.min(page, totalPages));
  
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageItems = papers.slice(startIndex, endIndex);
  
  document.getElementById("paper-list").innerHTML = pageItems.map(paperTemplate).join("");
  
  // 更新分页信息
  if (document.getElementById("paper-pagination-info")) {
    document.getElementById("paper-pagination-info").textContent = 
      `Page ${page} of ${totalPages}`;
  }
  
  // 更新按钮状态
  if (document.getElementById("prev-paper-page")) {
    document.getElementById("prev-paper-page").disabled = page <= 1;
  }
  if (document.getElementById("next-paper-page")) {
    document.getElementById("next-paper-page").disabled = page >= totalPages;
  }
}

// 添加项目分页渲染函数
function renderProjectPage(page) {
  const projects = window.allProjects;
  if (!projects || !projects.length) return;
  
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  // 确保页码有效
  page = Math.max(1, Math.min(page, totalPages));
  
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageItems = projects.slice(startIndex, endIndex);
  
  document.getElementById("project-list").innerHTML = pageItems.map(projectTemplate).join("");
  
  // 更新分页信息
  if (document.getElementById("project-pagination-info")) {
    document.getElementById("project-pagination-info").textContent = 
      `Page ${page} of ${totalPages}`;
  }
  
  // 更新按钮状态
  if (document.getElementById("prev-project-page")) {
    document.getElementById("prev-project-page").disabled = page <= 1;
  }
  if (document.getElementById("next-project-page")) {
    document.getElementById("next-project-page").disabled = page >= totalPages;
  }
}

// 设置分页控制器 - 只会被调用一次
function setupPaginationControls() {
  // 检查并创建分页控件，如果不存在
  if (!document.querySelector('#papers-section .pagination-controls')) {
    const paperPagination = document.createElement('div');
    paperPagination.className = 'pagination-controls';
    paperPagination.innerHTML = `
      <button id="prev-paper-page" class="prev-btn">&lt; Previous</button>
      <span id="paper-pagination-info">Page 1 of 1</span>
      <button id="next-paper-page" class="next-btn">Next &gt;</button>
    `;
    document.getElementById('papers-section').appendChild(paperPagination);
  }
  
  if (!document.querySelector('#projects-section .pagination-controls')) {
    const projectPagination = document.createElement('div');
    projectPagination.className = 'pagination-controls';
    projectPagination.innerHTML = `
      <button id="prev-project-page" class="prev-btn">&lt; Previous</button>
      <span id="project-pagination-info">Page 1 of 1</span>
      <button id="next-project-page" class="next-btn">Next &gt;</button>
    `;
    document.getElementById('projects-section').appendChild(projectPagination);
  }
  
  // 为论文部分添加分页控制
  document.getElementById("prev-paper-page").addEventListener("click", () => {
    if (currentPaperPage > 1) {
      currentPaperPage--;
      renderPaperPage(currentPaperPage);
    }
  });
  
  document.getElementById("next-paper-page").addEventListener("click", () => {
    const maxPage = Math.ceil((window.allPapers || []).length / itemsPerPage);
    if (currentPaperPage < maxPage) {
      currentPaperPage++;
      renderPaperPage(currentPaperPage);
    }
  });
  
  // 为项目部分添加分页控制
  document.getElementById("prev-project-page").addEventListener("click", () => {
    if (currentProjectPage > 1) {
      currentProjectPage--;
      renderProjectPage(currentProjectPage);
    }
  });
  
  document.getElementById("next-project-page").addEventListener("click", () => {
    const maxPage = Math.ceil((window.allProjects || []).length / itemsPerPage);
    if (currentProjectPage < maxPage) {
      currentProjectPage++;
      renderProjectPage(currentProjectPage);
    }
  });
}
