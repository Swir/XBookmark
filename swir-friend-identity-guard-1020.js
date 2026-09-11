/* SWIR 10.20 BETA — FRIEND IDENTITY GUARD
 * Canonical nick layer for Friend Radar. Does NOT modify MIX/Writing.
 * Fixes legacy dirty friend names, native/SWIR phone markers and broken context-menu friend add path.
 */
(()=>{try{
if(window.__SWIR_FRIEND_ID_GUARD1020)return;window.__SWIR_FRIEND_ID_GUARD1020=1;
const K_LOCAL='czateria_znajomi',K_IDS='swir_friend_identity_cache_97',K_BACKUP='swir_friend_guard_backup_1020';
let migrated=0,patchedConnections=0,lastContextNick='',lastContextAt=0,lastCleanup=0;
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch(e){return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};
function canonical(v){
 let s=String(v??'');
 try{s=s.normalize('NFC')}catch(e){}
 s=s.replace(/[\u200B-\u200D\u2060\uFEFF]/g,'').replace(/\u00A0/g,' ');
 s=s.replace(/(?:📱|📲|☎)\uFE0F?/gu,'');
 s=s.replace(/\s+/g,' ').trim();
 s=s.replace(/:\s*$/,'').trim();
 return s;
}
const key=v=>canonical(v).toLocaleLowerCase('pl-PL');
function backupOnce(){try{if(localStorage.getItem(K_BACKUP))return;save(K_BACKUP,{ts:Date.now(),friends:load(K_LOCAL,[]),ids:load(K_IDS,{})})}catch(e){}}
function cleanFriends(){
 const src=load(K_LOCAL,[]),arr=Array.isArray(src)?src:[],out=[],seen=new Set();let changes=0,junk=0;
 for(const raw of arr){const n=canonical(raw);if(!n){changes++;continue}if(key(n)==='menu'){/* known legacy SWIR context-menu bug; preserved in backup */junk++;changes++;continue}const k=key(n);if(seen.has(k)){changes++;continue}seen.add(k);out.push(n);if(String(raw)!==n)changes++}
 if(changes||JSON.stringify(arr)!==JSON.stringify(out)){backupOnce();save(K_LOCAL,out);migrated+=changes;lastCleanup=Date.now()}
 return{before:arr.length,after:out.length,changes,junk,list:out};
}
function cleanIdCache(){
 const src=load(K_IDS,{});if(!src||typeof src!=='object')return{changes:0};const out={};let changes=0;
 for(const [oldKey,rec0] of Object.entries(src)){const rec=rec0&&typeof rec0==='object'?{...rec0}:{};const n=canonical(rec.nick||oldKey);if(!n){changes++;continue}const k=key(n);rec.nick=n;const prev=out[k];if(!prev||Number(rec.ts||0)>=Number(prev.ts||0))out[k]=rec;if(k!==oldKey||String(rec0?.nick||'')!==n)changes++}
 if(changes){backupOnce();save(K_IDS,out);migrated+=changes;lastCleanup=Date.now()}
 return{changes};
}
function usersFrom(c){const out=[],seen=new Set();const add=v=>{if(!v||seen.has(v))return;seen.add(v);if(typeof v?.getLogin==='function'){out.push(v);return}if(Array.isArray(v)){v.forEach(add);return}if(v instanceof Set){v.forEach(add);return}if(v instanceof Map){v.forEach(add)}};try{add(c?.getUsers?.())}catch(e){};['meList','adminsList','honoursList','registeredList','ordinaryList','closestList','userSet'].forEach(p=>{try{add(c?.[p])}catch(e){}});return out}
function patchConnection(c){
 try{if(!c||typeof c.getUserWithName!=='function'||c.__swirFriendGuard1020)return false;const original=c.getUserWithName;
  Object.defineProperty(c,'__swirFriendGuard1020',{value:true,configurable:true});
  Object.defineProperty(c,'__swirFriendGuardOriginal',{value:original,configurable:true});
  c.getUserWithName=function(name){
   let u;try{u=original.apply(this,arguments)}catch(e){}if(u)return u;
   const n=canonical(name);if(n&&n!==String(name??'')){try{u=original.call(this,n)}catch(e){}if(u)return u}
   const wanted=key(n||name);if(!wanted)return u;
   try{for(const x of usersFrom(this)){let login='';try{login=x.getLogin?.()||''}catch(e){}if(key(login)===wanted)return x}}catch(e){}
   return u;
  };patchedConnections++;return true;
 }catch(e){return false}
}
function allConns(){const out=[],seen=new Set(),add=c=>{if(c&&!seen.has(c)){seen.add(c);out.push(c)}};try{const m=window.CHNS?.connManager;if(!m)return[];add(m.getFirstConnection?.());add(m.getCurrentConnection?.());Object.values(window.CHNS?.channelManager?.channels||{}).forEach(ch=>{try{const id=ch?.getChannelId?.();if(id!==undefined&&id!==null)add(m.getConnectionRelatedWithId?.(id))}catch(e){}})}catch(e){}return out}
function patchConnections(){let n=0;for(const c of allConns())if(patchConnection(c))n++;return n}
function nickFromTarget(t){try{
 const row=t?.closest?.('.m-list-user-item');if(row){const sp=row.querySelector(':scope > span')||row.querySelector('span');const n=canonical(sp?.textContent||'');if(n)return n}
 const msg=t?.closest?.('.m-msg-item-user-login:not(.m-msg-item-image-user-login)');if(msg){const n=canonical(msg.dataset?.swirCanonicalNick||msg.textContent||'');if(n)return n}
 const info=t?.closest?.('.info-user-login,.info-user-left');if(info){const n=canonical(info.textContent||'');if(n)return n}
 return'';
}catch(e){return''}}
function rememberTarget(e){const n=nickFromTarget(e.target);if(n){lastContextNick=n;lastContextAt=Date.now()}}
document.addEventListener('contextmenu',rememberTarget,true);
document.addEventListener('click',e=>{const friend=e.target?.closest?.('.context-menu-item--friend');if(friend&&lastContextNick&&Date.now()-lastContextAt<10000){
 e.preventDefault();e.stopImmediatePropagation();const n=canonical(lastContextNick),arr=cleanFriends().list,exists=arr.some(x=>key(x)===key(n)),core=window.SWIR_FRIENDS_PRIMARY1017;
 if(exists){if(core?.removeLocal)core.removeLocal(n);else save(K_LOCAL,arr.filter(x=>key(x)!==key(n)))}else{if(core?.addLocal)core.addLocal(n);else save(K_LOCAL,[...arr,n])}
 cleanFriends();document.querySelector('.context-menu')?.remove();setTimeout(()=>window.SWIR_ROOMS_PANEL1017?.render?.(true),20);return
 }
 rememberTarget(e)
},true);
function patchMenuLabel(){try{const item=document.querySelector('.context-menu .context-menu-item--friend');if(!item||!lastContextNick||Date.now()-lastContextAt>10000)return;const arr=cleanFriends().list,has=arr.some(x=>key(x)===key(lastContextNick));item.textContent=has?'Usuń ze znajomych':'Dodaj do znajomych';item.dataset.swirFriendGuard1020='1'}catch(e){}}
new MutationObserver(ms=>{let menu=false;for(const m of ms)for(const n of m.addedNodes||[])if(n?.nodeType===1&&(n.matches?.('.context-menu')||n.querySelector?.('.context-menu')))menu=true;if(menu)setTimeout(patchMenuLabel,0)}).observe(document.body,{childList:true,subtree:true});
function hidePhoneCss(){if(document.getElementById('swirFriendGuard1020Css'))return;const s=document.createElement('style');s.id='swirFriendGuard1020Css';s.textContent=`.m-list-user-item-icon-mobile{display:none!important}.m-msg-item-user-login .swir-mobile-99,.m-msg-item-user-login .swir-mobile-98,.m-msg-item-user-login [class*="swir-mobile"],.m-msg-item-user-login [data-swir-mobile-badge]{display:none!important}`;document.head.appendChild(s)}
function patchCoreApi(){const c=window.SWIR_FRIENDS_PRIMARY1017;if(!c||c.__guard1020)return false;const add=c.addLocal?.bind(c),del=c.removeLocal?.bind(c),sync=c.syncOne?.bind(c),rooms=c.serverRooms?.bind(c),res=c.resolveId?.bind(c);if(add)c.addLocal=n=>add(canonical(n));if(del)c.removeLocal=n=>del(canonical(n));if(sync)c.syncOne=n=>sync(canonical(n));if(rooms)c.serverRooms=n=>rooms(canonical(n));if(res)c.resolveId=n=>res(canonical(n));c.canonicalNick=canonical;c.__guard1020=true;return true}
function maintenance(){cleanFriends();cleanIdCache();patchConnections();patchCoreApi();hidePhoneCss();patchMenuLabel()}
backupOnce();maintenance();setTimeout(maintenance,250);setTimeout(maintenance,1200);setInterval(maintenance,1500);
window.SWIR_FRIEND_GUARD1020={version:'10.20 FRIEND IDENTITY GUARD',canonical,cleanFriends,cleanIdCache,patchConnections,diagnostics(){const f=cleanFriends(),ids=load(K_IDS,{}),d={version:'10.20',friends:f.list.length,migrated,patchedConnections,connections:allConns().length,lastContextNick,lastContextAt,lastCleanup,idCache:Object.keys(ids||{}).length,nativePhoneIcons:document.querySelectorAll('.m-list-user-item-icon-mobile').length,hiddenPhoneIcons:[...document.querySelectorAll('.m-list-user-item-icon-mobile')].filter(x=>getComputedStyle(x).display==='none').length};console.table(d);return d}};
console.log('SWIR 10.20 Friend Identity Guard active');
}catch(e){console.error('SWIR Friend Identity Guard 10.20',e)}})();