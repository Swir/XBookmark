/* SWIR 9.9.1 STABLE bootstrap — frozen 9.9 + native reply hotfix */
(()=>{try{
if(window.__SWIR_STABLE991_BOOT)return;window.__SWIR_STABLE991_BOOT=1;
const current=(document.currentScript&&document.currentScript.src)||'',m=current.match(/\/gh\/Swir\/XBookmark@([^/]+)\//),selfRef=m&&m[1]?m[1]:'main';
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@',BASE='8ef1a5773f98780094c65042c2e622852ea6eb29';
function add(src,onload){const s=document.createElement('script');s.src=src;s.onload=onload||null;s.onerror=()=>console.error('SWIR 9.9.1 load fail',src);document.head.appendChild(s)}
add(CDN+BASE+'/swir.js?stable991='+Date.now(),()=>{let n=0;const t=setInterval(()=>{n++;if(window.SWIR_UI99||n>32){clearInterval(t);add(CDN+selfRef+'/swir-hotfix-991.js?v='+Date.now(),()=>{window.SWIR_CLOUD_VERSION='9.9.1 STABLE HOTFIX'})}},250)});
}catch(e){console.error('SWIR 9.9.1 bootstrap',e)}})();
