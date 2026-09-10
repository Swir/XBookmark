/* SWIR 10.6 BETA — 10.0 core + clean nicks + Writing/MIX tabs */
(()=>{try{
if(window.__SWIR_BETA106_BOOT)return;window.__SWIR_BETA106_BOOT=1;
const current=(document.currentScript&&document.currentScript.src)||'';
const m=current.match(/\/gh\/Swir\/XBookmark@([^/]+)\//);
const selfRef=m&&m[1]?m[1]:'main';
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@';
const BASE99='8ef1a5773f98780094c65042c2e622852ea6eb29';
const WORKING10='0ed4f9710a435444b8299a03cf6181785c3c66e6';
const SAFE104='f4889bec729f080f193abbaa71376cfb8ae7ade3';
function add(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=()=>resolve(src);s.onerror=()=>{console.error('SWIR 10.6 load fail',src);reject(new Error('load fail: '+src))};document.head.appendChild(s)})}
function waitReady(){return new Promise(resolve=>{let n=0;const t=setInterval(()=>{n++;if(((window.SWIR_UI99||window.SWIR_UI98)&&window.SWIR_RADAR_DEBUG97)||n>50){clearInterval(t);resolve()}},180)})}
(async()=>{
 await add(CDN+BASE99+'/swir.js?beta106='+Date.now());
 await waitReady();
 await add(CDN+WORKING10+'/swir-notify-100-beta.js?v=106');
 await add(CDN+WORKING10+'/swir-mod-tabs-100-beta.js?v=106');
 await add(CDN+WORKING10+'/swir-mod-tabs-100-polish.js?v=106');
 await add(CDN+SAFE104+'/swir-theme-fast-104.js?v=106');
 await add(CDN+selfRef+'/swir-ui-fix-106.js?v='+Date.now());
 await add(CDN+selfRef+'/swir-nicks-106.js?v='+Date.now());
 await add(CDN+selfRef+'/swir-writing-106.js?v='+Date.now());
 window.SWIR_CLOUD_VERSION='10.6 BETA — 10.0 RADAR + CLEAN NICKS + WRITING MIX';
 console.log('✅ SWIR 10.6 BETA gotowy — skaner znajomych z 10.0 pozostaje bazą');
})().catch(e=>console.error('SWIR 10.6 bootstrap',e));
}catch(e){console.error('SWIR 10.6 BETA bootstrap',e)}})();
