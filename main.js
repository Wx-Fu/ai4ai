// ====== 语言支持 ======
let lang = "en"; // 页面全局语言
if (localStorage.getItem("lang")) lang = localStorage.getItem("lang");
function setLang(newLang) {
  lang = newLang;
  localStorage.setItem("lang", lang);
  applyLang();
}
function toggleLang() {
  setLang(lang === "en" ? "zh" : "en");
}
function applyLang() {
  // 实验室名
  document.getElementById("lab-title").textContent = lang === "en" ? "AI Interaction Lab" : "智能交互实验室";
  // 首页按钮
  let homeBtn=document.getElementById("homeBtn");
  if(homeBtn) homeBtn.textContent=lang==="en"?"Home":"首页";
  // 中文/English语言切换
  let langBtn=document.getElementById("langToggle");
  if(langBtn) langBtn.textContent=lang==="en"?"中文":"English";
  // 实验室简介
  let introTitle=document.getElementById("intro-title"), introTxt=document.getElementById("intro-txt");
  if(introTitle) introTitle.textContent = lang==="en" ? "About Our Lab" : "实验室简介";
  if(introTxt) introTxt.textContent = lang==="en"
      ?"Our laboratory focuses on cutting-edge research in speech, emotion, dialogue, and digital human, striving to drive innovative developments in human-machine interaction technology."
      :"实验室专注于语音、情感、对话和数字人等技术研究，致力于推动新一代人机交互技术创新。";
  // H3/P多语
  document.querySelectorAll("[data-en]").forEach(elem=>{
    elem.textContent = elem.getAttribute("data-"+lang);
  });
  // Card栏
  document.querySelectorAll(".card-list-title").forEach(elem=>{
    elem.textContent = elem.getAttribute("data-"+lang);
  });
}
let langBtn=document.getElementById("langToggle");
if(langBtn) langBtn.onclick=toggleLang;
// 初始应用
applyLang();

// 首页专利栏内容刷新
function loadPatentList() {
  fetch("data/patents.json").then(r=>r.json()).then(listObj=>{
    let langList = listObj[lang] || [];
    let ul = document.getElementById("patent-list");
    if(ul) ul.innerHTML = langList.map(item=>`<li>${item}</li>`).join("");
    let title = document.getElementById("patent-title");
    if(title) title.textContent = lang==="en"?"Patents":"专利";
  });
}
document.addEventListener("DOMContentLoaded", ()=>{
  if(document.getElementById("patent-list")) loadPatentList();
});


// ====== 首页跳转 ======
function navigateDirection(dir){
  window.location.href = dir+".html";
}

// ====== 方向页数据填充 ======
// 该段在每个方向页会自动起效
if(typeof direction!=="undefined") {
  fetch(`data/${direction}.json`).then(r=>r.json()).then(data=>{
    renderPaperList(data.papers||[]);
    renderProjectList(data.projects||[]);
  })
}

// ====== 卡片渲染 ======
function renderPaperList(papers){
  let cont = document.getElementById("paper-list");
  if(!cont) return;
  cont.innerHTML="";
  // 最多最多8个，超了出现滚动
  papers.forEach(p=>cont.appendChild(paperCard(p)));
  if(papers.length>8) cont.classList.add("overflow"); else cont.classList.remove("overflow");
}
function renderProjectList(projects){
  let cont = document.getElementById("project-list");
  if(!cont) return;
  cont.innerHTML="";
  projects.forEach(p=>cont.appendChild(projectCard(p)));
  if(projects.length>8) cont.classList.add("overflow"); else cont.classList.remove("overflow");
}

// ====== 卡片动态 ======
function paperCard(p){
  let card=document.createElement("div");
  card.className="ppt-card anim-card";
  card.innerHTML=`
    <div class="ppt-row">
      <span class="ppt-abbr">${p.abbr || ""}</span>
      <span class="ppt-conf ${conferenceClass(p.conf)}">${p.conf||""}</span>
    </div>
    <div class="ppt-title">
      ${(typeof p.title==="string"? p.title : p.title[lang] || "")}
    </div>
    <div class="ppt-links">
      ${p.paper?`<a href="${p.paper}" class="ppt-link ppt-link-paper" target="_blank">Paper</a>`:""}
      ${p.demo?`<a href="${p.demo}" class="ppt-link ppt-link-demo" target="_blank">Demo</a>`:""}
    </div>
    <div class="ppt-authors">${p.authors||""}</div>
  `;
  return card;
}
function projectCard(p){
  let card=document.createElement("div");
  card.className="ppt-card anim-card";
  card.innerHTML=`
    <div class="ppt-row">
      <span class="ppt-project-title">${typeof p.name==="string"?p.name:p.name[lang]}</span>
    </div>
    <div class="ppt-links">
      ${p.demo?`<a href="${p.demo}" class="ppt-link ppt-link-demo" target="_blank">Demo</a>`:""}
      ${p.github?`<a href="${p.github}" class="ppt-link ppt-link-github" target="_blank">GitHub</a>`:""}
    </div>
    <div class="ppt-desc">${typeof p.desc==="string"?p.desc:p.desc[lang]}</div>
  `;
  return card;
}

function conferenceClass(c){
  // 让不同会议显示不同色彩
  if(!c) return "conf-default";
  let map={"ICML":"conf-yellow", "AAAI":"conf-blue", "ACL":"conf-pink","INTERSPEECH":"conf-violet",
           "CVPR":"conf-green", "EMNLP":"conf-pink","ICASSP":"conf-sky"};
  return map[c] || "conf-default";
}

// ====== 卡片动效 =============
// 每个新加入卡片自带缓入动画
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('.fade-in').forEach(e=>{
    e.style.opacity='0';
    e.style.transform='translateY(40px)';
    setTimeout(()=>{
      e.style.transition="all .66s cubic-bezier(.4,2,.4,1)";
      e.style.opacity='1';
      e.style.transform='none';
    },100);
  });
});
