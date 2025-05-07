let currentLang = 'en'; // or 'zh'

const CATEGORIES = [
  { id: "speech", en: "Speech", zh: "语音" },
  { id: "emotion", en: "Emotion", zh: "情感" },
  { id: "dialogue", en: "Dialogue", zh: "对话" },
  { id: "digitalhuman", en: "Digital Human", zh: "数字人" },
];

// 定义按钮多语言
const BUTTON_NAMES = {
  'paper': {en: 'Paper', zh: '论文'},
  'demo': {en: 'Demo', zh: '演示'},
  // 可以继续扩展
};

document.getElementById('langBtn').addEventListener('click', (e) => {
  currentLang = currentLang === 'en' ? 'zh' : 'en';
  updateLanguage();
});

function updateLanguage() {
  // 1. Title
  document.getElementById('title').textContent =
    currentLang === 'en' ? 'Lab Project Navigator' : '实验室项目导航';

  // 2. 分类标题
  CATEGORIES.forEach(cat => {
    let h2 = document.querySelector(`#${cat.id} h2`);
    h2.textContent = h2.dataset[currentLang];
  });

  // 3. 按钮
  document.getElementById('langBtn').textContent = currentLang === 'en' ? '中文' : 'English';
}

function createProjectCard(projectObj) {
  let card = document.createElement('div');
  card.className = 'project-card';

  let name = document.createElement('div');
  name.className = 'project-name';
  name.textContent = projectObj.name;
  card.appendChild(name);

  let btnGrp = document.createElement('div');
  btnGrp.className = 'button-group';
  for (let btn of (projectObj.buttons || [])) {
    let b = document.createElement('button');
    b.className = 'project-btn';
    b.textContent = BUTTON_NAMES[btn.type] ? BUTTON_NAMES[btn.type][currentLang] : btn.type;
    b.onclick = () => window.open(btn.url, "_blank");
    btnGrp.appendChild(b);
  }

  card.appendChild(btnGrp);
  return card;
}

function loadProjects() {
  fetch('project.json')
    .then(res => res.json())
    .then(updateProjects)
    .catch(() => alert('项目数据加载失败'));
}

function updateProjects(data) {
  // 清除旧内容
  CATEGORIES.forEach(cat => {
    let box = document.getElementById(`${cat.id}-box`);
    box.innerHTML = "";
    const projects = data[cat.en] || [];
    for (let proj of projects) {
      box.appendChild(createProjectCard(proj));
    }
  });
}

window.onload = function() {
  loadProjects();
  updateLanguage();
};
