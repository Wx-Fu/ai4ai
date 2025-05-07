let currentLang = 'en';

const CATEGORIES = [
  { id: "speech", en: "Speech", zh: "语音" },
  { id: "emotion", en: "Emotion", zh: "情感" },
  { id: "dialogue", en: "Dialogue", zh: "对话" },
  { id: "digitalhuman", en: "Digital Human", zh: "数字人" },
];

const BUTTON_NAMES = {
  'paper': { en: 'Paper', zh: '论文' },
  'demo': { en: 'Demo', zh: '演示' },
};

const LAB_INFO = {
  en: {
    title: "About Our Lab",
    text: `<p>
      Our Laboratory is dedicated to exploring the frontiers of <b>intelligent speech, emotion, dialogue & digital human technologies</b>. 
      With a multidisciplinary research team, we aim to build innovative AI solutions for human-computer interaction.
    </p>`
  },
  zh: {
    title: "实验室简介",
    text: `<p>
      我们实验室专注智能语音、情感识别、对话系统及数字人前沿技术的探索与创新。<br>
      拥有多学科交叉的研究团队，致力于打造新一代人机交互AI解决方案。
    </p>`
  }
};

function switchLanguage() {
  currentLang = currentLang === 'en' ? 'zh' : 'en';
  document.getElementById('title').textContent =
    currentLang === 'en' ? 'Lab Project Navigator' : '实验室项目导航';

  // 分类标题
  CATEGORIES.forEach(cat => {
    let h2 = document.querySelector(`#${cat.id} h2`);
    h2.textContent = h2.dataset[currentLang];
  });

  // 切换按钮
  document.getElementById('langBtn').textContent =
    currentLang === 'en' ? '中文' : 'English';

  // 实验室简介
  document.getElementById('lab-info-title').textContent = LAB_INFO[currentLang].title;
  document.getElementById('lab-info-text').innerHTML = LAB_INFO[currentLang].text;

  // 项目区全刷新（按钮文字实现多语言）
  loadProjects();
}

document.getElementById('langBtn').onclick = switchLanguage;

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
    b.textContent = BUTTON_NAMES[btn.type]?.[currentLang] || btn.type;
    b.onclick = (e) => {
      window.open(btn.url, "_blank");
      e.stopPropagation();
    };
    btnGrp.appendChild(b);
  }

  card.appendChild(btnGrp);
  return card;
}

function loadProjects() {
  fetch('project.json')
    .then(res => res.json())
    .then(data => {
      // 先清空
      CATEGORIES.forEach(cat => {
        let box = document.getElementById(`${cat.id}-box`);
        box.innerHTML = "";
        const projects = data[cat.en] || [];
        for (let proj of projects) {
          box.appendChild(createProjectCard(proj));
        }
      });
    }).catch(() => alert('项目数据加载失败'));
}

// 加载动画处理
window.onload = function() {
  // 渐入main和lab-info
  document.getElementById('main-content').classList.add('fade-in');
  document.getElementById('lab-info').classList.add('fade-in');
  // 初始多语言渲染
  document.getElementById('lab-info-title').textContent = LAB_INFO[currentLang].title;
  document.getElementById('lab-info-text').innerHTML = LAB_INFO[currentLang].text;
  document.getElementById('langBtn').textContent = currentLang === 'en' ? '中文' : 'English';
  loadProjects();
};
