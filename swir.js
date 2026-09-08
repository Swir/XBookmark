/* SWIR XBookmark — Launcher entrypoint */
(function(){try{
  const current=(document.currentScript&&document.currentScript.src)||'';
  const m=current.match(/\/gh\/Swir\/XBookmark@([^/]+)\//);
  const ref=m&&m[1]?m[1]:'main';
  const s=document.createElement('script');
  s.src='https://cdn.jsdelivr.net/gh/Swir/XBookmark@'+ref+'/launcher.js?v='+Date.now();
  s.onerror=()=>alert('SWIR Launcher: nie udało się pobrać launchera. Spróbuj ponownie lub użyj 9.9 STABLE.');
  document.head.appendChild(s);
}catch(e){console.error('SWIR launcher entrypoint',e);alert('SWIR Launcher: '+e.message)}})();