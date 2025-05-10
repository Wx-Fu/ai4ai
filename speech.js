let lang = localStorage.getItem('lang') || 'en';
const langBtn = document.getElementById('lang-switch');

const labelMap = {
  en: { papers: "Papers", projects: "Projects", langBtn: "中文" },
  zh: { papers: "论文", projects: "项目", langBtn: "English" }
};

function renderAll(data) {
  // Direction title/desc
  document.getElementById('direction-title').textContent = data.directionTitle;
  document.getElementById('direction-desc').textContent = data.directionDesc;

  // Papers/projects title
  document.getElementById('papers-title').textContent = labelMap[lang].papers;
  document.getElementById('projects-title').textContent = labelMap[lang].projects;
  // 论文卡片
  document.getElementById('paper-list').innerHTML = (data.papers||[]).map(item=>`
    <div class="paper-card">
      <div class="paper-title">${item.title}</div>
      <div class="card-authors">${item.authors||''}</div>
      <div class="resource-links">
        ${(item.links||[]).map(l=> `<a href="${l.url}" target="_blank">${l.label}</a>`).join(' ')}
      </div>
      <div class="card-desc">${item.desc||''}</div>
    </div>
  `).join('');
  // 项目卡片
  document.getElementById('project-list').innerHTML = (data.projects||[]).map(item=>`
    <div class="project-card">
      <div class="project-title">${item.title}</div>
      <div class="resource-links">
        ${(item.links||[]).map(l=> `<a href="${l.url}" target="_blank">${l.label}</a>`).join(' ')}
      </div>
      <div class="card-desc">${item.desc||''}</div>
    </div>
  `).join('');

  langBtn.textContent = labelMap[lang].langBtn;
}

function loadAndRender() {
  fetch('data/speech.json')
    .then(res => res.json())
    .then(obj => renderAll(obj[lang]||obj.en));
}

langBtn.addEventListener('click', ()=>{
  lang = lang==='en'?'zh':'en';
  localStorage.setItem('lang', lang);
  loadAndRender();
});

document.addEventListener('DOMContentLoaded', loadAndRender);
