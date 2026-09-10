/* SWIR 10.8 — Friends 10.0 bridge over untouched 9.9.2 */
(()=>{try{
if(window.__SWIR_FRIENDS108)return;window.__SWIR_FRIENDS108=1;
let primed=false,lastPrime=0;
const radar=()=>window.SWIR_RADAR_DEBUG97||window.SWIR_FRIEND_RADAR;
function prime(silent=1){try{
 const r=radar();if(!r)return false;
 r.scan?.();
 const now=Date.now();
 if(now-lastPrime>8200){lastPrime=now;r.requestServerState?.(silent?1:0)}
 primed=true;return true;
}catch(e){console.warn('SWIR 10.8 friends prime',e);return false}}
function toggle(){try{
 const r=radar();if(!r)return false;
 const p=document.getElementById('friends-panel');
 if(p){p.remove();return true}
 prime(1);
 r.openPanel?.();
 setTimeout(()=>{try{r.scan?.()}catch(e){}},180);
 return true;
}catch(e){console.warn('SWIR 10.8 friends toggle',e);return false}}
function refresh(){try{const r=radar();if(!r)return false;r.scan?.();lastPrime=0;return r.requestServerState?.(0)!==false}catch(e){return false}}
function bind(){try{
 const b=document.getElementById('friends');if(!b)return false;
 if(b.dataset.swir108==='1')return true;
 b.dataset.r97='1';b.dataset.swir108='1';b.onclick=null;
 b.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();toggle()},true);
 return true;
}catch(e){return false}}
function patchPanel(){try{
 const p=document.getElementById('friends-panel');if(!p?.classList.contains('swir97'))return;
 const h=p.querySelector('.r97h');if(h&&!h.querySelector('.sw108mode')){const x=document.createElement('small');x.className='sw108mode';x.textContent='10.0 MODE';x.style.cssText='margin-left:7px;font-size:8px;font-weight:700;opacity:.62';h.insertBefore(x,h.querySelector('span')||null)}
 const ref=p.querySelector('#r97ref');if(ref&&!ref.dataset.swir108){ref.dataset.swir108='1';ref.title='Odśwież jak w BETA 10.0';ref.addEventListener('click',()=>setTimeout(()=>radar()?.scan?.(),50),true)}
}catch(e){}}
function tick(){bind();patchPanel()}
const ready=()=>{if(prime(1))setTimeout(()=>prime(1),1600);tick()};
let tries=0;const boot=setInterval(()=>{tries++;if(radar()){clearInterval(boot);ready()}else if(tries>60)clearInterval(boot)},150);
setInterval(tick,1200);
window.addEventListener('focus',()=>{try{prime(1)}catch(e){}});
window.SWIR_FRIENDS108={version:'10.8 FRIENDS 10.0 BRIDGE',prime,toggle,refresh,diagnostics:()=>({ready:!!radar(),primed,lastPrime,radarVersion:radar()?.version||null})};
}catch(e){console.error('SWIR 10.8 Friends bridge',e)}})();
