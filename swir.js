/* XBookmark SWIR Cloud Bootstrap 9.4 */
(function(){try{
  const base='https://cdn.jsdelivr.net/gh/Swir/XBookmark@main/';
  const v=Date.now();
  function load(src,ok){const s=document.createElement('script');s.src=base+src+'?v='+v;s.onload=()=>ok&&ok();s.onerror=()=>console.error('SWIR CLOUD: nie udało się załadować '+src);document.head.appendChild(s)}
  function patchAlert(){const old=window.alert;window._swirOriginalAlert94=old;window.alert=function(m){try{m=String(m).replace(/9\.2 COLOR LAB \+ IMAGE DIAGNOSTICS/g,'9.4 FRIEND RADAR + NEON UI').replace(/MOBILE RADAR 9\.2/g,'FRIEND RADAR 9.4')}catch(e){}return old.call(window,m)}}
  function restoreAlert(){if(window._swirOriginalAlert94){window.alert=window._swirOriginalAlert94;delete window._swirOriginalAlert94}}
  if(window._swirModIsRunning){load('swir-patch-94.js');return}
  patchAlert();load('swir-core.js',()=>{restoreAlert();load('swir-patch-94.js')});setTimeout(restoreAlert,6000);
}catch(e){console.error('SWIR CLOUD bootstrap 9.4:',e)}})();