/* SWIR 10.4 BETA — FAST THEMES: render theme controls immediately */
(()=>{try{
if(window.__SWIR_THEME_FAST104)return;window.__SWIR_THEME_FAST104=1;
function api(){return window.SWIR_UI99||window.SWIR_UI98}
function current(){return document.documentElement.dataset.swirTheme99||document.documentElement.dataset.swirTheme98||localStorage.getItem('swir_theme_98')||'gaming'}
function updateButtons(p){const c=current();p?.querySelectorAll?.('[data-swir-theme99-btn]').forEach(b=>b.classList.toggle('active',b.dataset.swirTheme99Btn===c))}
function make(page){const u=api();if(!u?.themes||!u?.applyTheme)return null;let d=document.getElementById('swirTheme99');if(!d){d=document.createElement('div');d.id='swirTheme99';d.innerHTML='<h3>🎨 Motyw całego czatu</h3><div class="swir99-theme-grid">'+Object.entries(u.themes).map(([id,t])=>`<button type="button" class="swir99-theme-btn" data-swir-theme99-btn="${id}">${t.name||id}</button>`).join('')+'</div><div style="margin-top:7px;font-size:9px;color:var(--sw99-muted,#71869a)">⚡ FAST THEMES 10.4 — panel jest gotowy od razu po otwarciu MOD-a. Wybór zapisuje się automatycznie.</div>';d.querySelectorAll('[data-swir-theme99-btn]').forEach(b=>b.onclick=()=>{u.applyTheme?.(b.dataset.swirTheme99Btn);updateButtons(d)})}if(page&&d.parentElement!==page)page.appendChild(d);updateButtons(d);return d}
function install(){try{const shell=document.querySelector('#configPanel #swirModTabs100'),page=shell?.querySelector('.sw10-page[data-page="motywy"]');if(!shell||!page||!api()?.themes)return false;page.querySelectorAll('.sw10-empty').forEach(x=>x.remove());const d=make(page);if(!d)return false;const tab=shell.querySelector('.sw10-tab[data-tab="motywy"]');if(tab&&!tab.dataset.sw104fast){tab.dataset.sw104fast='1';tab.addEventListener('click',()=>requestAnimationFrame(()=>{make(page);updateButtons(d)}),true)}return true}catch(e){return false}}
let tries=0,t=setInterval(()=>{tries++;if(install()||tries>50)clearInterval(t)},100);install();
document.addEventListener('click',e=>{if(e.target?.closest?.('#btnConfig'))requestAnimationFrame(install)},true);
new MutationObserver(()=>updateButtons(document.getElementById('swirTheme99'))).observe(document.documentElement,{attributes:true,attributeFilter:['data-swir-theme99','data-swir-theme98']});
window.SWIR_THEME_FAST104={version:'10.4 BETA — FAST THEMES',install,refresh:()=>{const ok=install();updateButtons(document.getElementById('swirTheme99'));return ok}};
console.log('✅ SWIR 10.4 FAST THEMES aktywny');
}catch(e){console.error('SWIR Theme Fast 10.4',e)}})();
