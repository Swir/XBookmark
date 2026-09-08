/* XBookmark SWIR Cloud Bootstrap 9.5 */
(function(){try{
  const current=(document.currentScript&&document.currentScript.src)||'';
  const match=current.match(/\/gh\/Swir\/XBookmark@([^/]+)\//);
  const ref=match&&match[1]?match[1]:'main';
  const base='https://cdn.jsdelivr.net/gh/Swir/XBookmark@'+ref+'/';
  const v=Date.now();
  function load(src,ok){const s=document.createElement('script');s.src=base+src+'?v='+v;s.onload=()=>ok&&ok();s.onerror=()=>console.error('SWIR CLOUD: nie udało się załadować '+src+' @ '+ref);document.head.appendChild(s)}
  function patchAlert(){const old=window.alert;window._swirOriginalAlert95=old;window.alert=function(m){try{m=String(m).replace(/9\.2 COLOR LAB \+ IMAGE DIAGNOSTICS/g,'9.5 FRIEND RADAR REAL SYNC + CHAT NEON').replace(/MOBILE RADAR 9\.2/g,'FRIEND RADAR 9.5')}catch(e){}return old.call(window,m)}}
  function restoreAlert(){if(window._swirOriginalAlert95){window.alert=window._swirOriginalAlert95;delete window._swirOriginalAlert95}}
  if(window._swirModIsRunning){load('swir-patch-95.js');return}
  patchAlert();load('swir-core.js',()=>{restoreAlert();load('swir-patch-95.js')});setTimeout(restoreAlert,6000);
}catch(e){console.error('SWIR CLOUD bootstrap 9.5:',e)}})();
