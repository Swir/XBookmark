/* SWIR 10.1 BETA — small UI consistency hotfix */
(()=>{try{
if(window.__SWIR_101_HOTFIX)return;window.__SWIR_101_HOTFIX=1;
function fix(){
 const c=document.getElementById('swirColor92Section');
 if(c){const h=c.querySelector(':scope>h3');if(h)h.textContent='🌈 Kolorowe pisanie';[...c.querySelectorAll('h3,h4')].forEach(x=>{if(/image\s*lab/i.test(x.textContent||'')){const p=x.parentElement;if(p&&p!==c)p.remove()}});c.querySelectorAll('#swirImage92Native,#swirImage92Diag,#swirImage92Info').forEach(x=>x.remove())}
 try{delete window.SWIR_IMAGE_LAB}catch(e){window.SWIR_IMAGE_LAB=undefined}
 const n=document.getElementById('swirNotify100');if(n){const h=n.querySelector(':scope>h3');if(h)h.textContent='🔔 Powiadomienia'}
 const t=document.querySelector('#swirQuick101 [data-q="test"]');if(t&&!t.dataset.sw101fixed){t.dataset.sw101fixed='1';t.onclick=()=>{if(window.SWIR_NOTIFY100?.notifyTest)window.SWIR_NOTIFY100.notifyTest();else{const d=document.getElementById('swir101toast');if(d)d.textContent='Powiadomienia jeszcze się ładują'}}}
}
fix();new MutationObserver(()=>{clearTimeout(window.__sw101hf);window.__sw101hf=setTimeout(fix,60)}).observe(document.body,{childList:true,subtree:true});setInterval(fix,2500);
console.log('✅ SWIR 10.1 UI hotfix aktywny');
}catch(e){console.error('SWIR 10.1 hotfix',e)}})();