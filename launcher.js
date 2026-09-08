/* SWIR XBookmark Launcher 1.0 */
(()=>{try{
if(window.__SWIR_LAUNCHER_OPEN){document.getElementById('swirLauncher100')?.remove();window.__SWIR_LAUNCHER_OPEN=0}
window.__SWIR_LAUNCHER_OPEN=1;
const current=(document.currentScript&&document.currentScript.src)||'';
const m=current.match(/\/gh\/Swir\/XBookmark@([^/]+)\//);
const selfRef=m&&m[1]?m[1]:'main';
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@';
const versions=[
 {id:'10.0-beta',label:'10.0 BETA',tag:'BETA',icon:'🧪',ref:selfRef,file:'swir-beta-10.js',desc:'Powiadomienia PRIV + znajomi online + VIP + DND + reconnect',accent:'#ff5ad9'},
 {id:'9.9',label:'9.9',tag:'RECOMMENDED',icon:'⭐',ref:'8ef1a5773f98780094c65042c2e622852ea6eb29',file:'swir.js',desc:'Final Polish + Ice Light + slim Friends + działający Radar',accent:'#00e5ff'},
 {id:'9.8',label:'9.8',tag:'STABLE',icon:'🟢',ref:'bf0ae7562016d82699baf834664b0945320102ba',file:'swir.js',desc:'Friend UX + prawy klik + 5 motywów',accent:'#56e6a5'},
 {id:'9.7',label:'9.7',tag:'STABLE',icon:'🟢',ref:'868963711b94d373eee7d6cc1a7444da3c89ef45',file:'swir.js',desc:'Friend Radar Rebuild + trwały cache userId',accent:'#72b7ff'},
 {id:'9.6',label:'9.6',tag:'SAFE',icon:'🛟',ref:'9c4528f269d931f483989dd4dff591bb2a93fa31',file:'swir.js',desc:'Passive Radar + spokojniejsza, starsza baza',accent:'#a8b5c2'}
];
function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function css(){if(document.getElementById('swirLauncherCss'))return;const s=document.createElement('style');s.id='swirLauncherCss';s.textContent=`
#swirLauncher100{position:fixed;inset:0;z-index:2147483646;background:rgba(3,7,13,.72);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;font-family:Inter,Segoe UI,Arial,sans-serif;color:#ecf8ff}
#swirLauncher100 *{box-sizing:border-box}#swirLauncherCard{width:min(720px,94vw);max-height:90vh;overflow:auto;background:linear-gradient(180deg,#0b1421,#07101a);border:1px solid #00dfff88;border-radius:20px;box-shadow:0 28px 90px #000c,0 0 40px #00dfff16;padding:18px}
.sxl-head{display:flex;align-items:center;gap:12px;padding-bottom:13px;border-bottom:1px solid #ffffff12}.sxl-logo{font-size:24px;font-weight:1000;color:#55eaff;text-shadow:0 0 14px #00dfff66}.sxl-title{font-weight:900;font-size:17px}.sxl-sub{font-size:10px;color:#7791a8;margin-top:2px}.sxl-x{margin-left:auto;width:34px;height:34px;border-radius:10px;border:1px solid #ffffff18;background:#111d2a;color:#fff;cursor:pointer;font-size:18px}
.sxl-warn{margin:12px 0 8px;padding:9px 11px;border-radius:10px;background:#2a171c;border:1px solid #ff6b7c55;color:#ffc1c8;font-size:11px;display:none}.sxl-status{margin:10px 0;color:#8fa8bc;font-size:10px}.sxl-grid{display:grid;gap:8px}.sxl-row{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;padding:11px 12px;border:1px solid #ffffff13;background:#0d1926;border-radius:13px;transition:.15s}.sxl-row:hover{border-color:var(--a);transform:translateY(-1px);box-shadow:0 8px 22px #0005}.sxl-name{font-size:14px;font-weight:900}.sxl-tag{display:inline-block;margin-left:7px;font-size:8px;padding:2px 5px;border-radius:99px;border:1px solid var(--a);color:var(--a)}.sxl-desc{font-size:10px;color:#8da4b7;margin-top:4px}.sxl-run{min-width:112px;padding:8px 10px;border-radius:9px;border:1px solid var(--a);background:#101d2c;color:#fff;font-weight:900;cursor:pointer}.sxl-run:hover{background:color-mix(in srgb,var(--a) 18%,#101d2c)}
.sxl-foot{display:flex;gap:8px;align-items:center;margin-top:12px;padding-top:11px;border-top:1px solid #ffffff10;font-size:9px;color:#6f869a}.sxl-last{margin-left:auto;background:none;border:0;color:#88ddff;cursor:pointer;font-size:9px}@media(max-width:580px){.sxl-row{grid-template-columns:1fr}.sxl-run{width:100%}}
`;document.head.appendChild(s)}
function close(){document.getElementById('swirLauncher100')?.remove();window.__SWIR_LAUNCHER_OPEN=0}
function load(v){
 if(window._swirModIsRunning){const w=document.querySelector('#swirLauncher100 .sxl-warn');if(w){w.style.display='block';w.textContent='⚠️ SWIR jest już uruchomiony. Zrób F5, a potem wybierz inną wersję z Launchera.'}return}
 localStorage.setItem('swir_launcher_last',v.id);
 const st=document.querySelector('#swirLauncher100 .sxl-status');if(st)st.textContent='⏳ Ładuję SWIR '+v.label+'…';
 const s=document.createElement('script');s.src=CDN+v.ref+'/'+v.file+'?v='+Date.now();s.onload=()=>{if(st)st.textContent='✅ SWIR '+v.label+' załadowany';setTimeout(close,550)};s.onerror=()=>{if(st){st.textContent='❌ Błąd ładowania '+v.label;st.style.color='#ff8b9a'}};document.head.appendChild(s)
}
css();document.getElementById('swirLauncher100')?.remove();
const d=document.createElement('div');d.id='swirLauncher100';
const last=localStorage.getItem('swir_launcher_last')||'9.9';
d.innerHTML=`<div id="swirLauncherCard"><div class="sxl-head"><div class="sxl-logo">⚡ SWIR</div><div><div class="sxl-title">XBOOKMARK LAUNCHER</div><div class="sxl-sub">Wybierz wersję • STABLE jest zamrożone • BETA = nowe funkcje</div></div><button class="sxl-x">×</button></div><div class="sxl-warn"></div><div class="sxl-status">GitHub/CDN: gotowy • ostatnio: ${esc(last)}</div><div class="sxl-grid">${versions.map(v=>`<div class="sxl-row" style="--a:${v.accent}"><div><div class="sxl-name">${v.icon} SWIR ${v.label}<span class="sxl-tag">${v.tag}</span></div><div class="sxl-desc">${esc(v.desc)}</div></div><button class="sxl-run" data-v="${v.id}">URUCHOM</button></div>`).join('')}</div><div class="sxl-foot"><span>🔒 9.9–9.6 są przypięte do konkretnych commitów.</span><button class="sxl-last">Uruchom ostatnią wersję →</button></div></div>`;
d.addEventListener('click',e=>{if(e.target===d)close()});d.querySelector('.sxl-x').onclick=close;d.querySelectorAll('.sxl-run').forEach(b=>b.onclick=()=>load(versions.find(v=>v.id===b.dataset.v)));d.querySelector('.sxl-last').onclick=()=>load(versions.find(v=>v.id===last)||versions.find(v=>v.id==='9.9'));document.body.appendChild(d);
window.SWIR_LAUNCHER={version:'1.0',versions,open:()=>location.reload(),close,load:id=>load(versions.find(v=>v.id===id))};
}catch(e){console.error('SWIR Launcher',e);alert('SWIR Launcher: '+e.message)}})();