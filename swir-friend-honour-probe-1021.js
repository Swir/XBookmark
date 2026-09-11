/* SWIR 10.21 BETA — HONOUR PATH PROBE
 * Safe diagnostic/repair layer: never changes perm/isHonour/isAdmin.
 * Scans every native UserData list (including honours/admins) for exact canonical login,
 * seeds the existing trusted identity cache from real UserCard UID, then retries normal friend sync.
 */
(()=>{try{
if(window.__SWIR_HONOUR_PROBE1021)return;window.__SWIR_HONOUR_PROBE1021=1;
const K_LOCAL='czateria_znajomi',K_IDS='swir_friend_identity_cache_97',K_PROBE='swir_friend_honour_probe_1021';
const rows=new Map();
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch(e){return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};
const guard=()=>window.SWIR_FRIEND_GUARD1020||null;
const canon=v=>guard()?.canonical?.(v)||String(v||'').trim();
const key=v=>canon(v).toLocaleLowerCase('pl-PL');
const uid=v=>{v=Number(v);return Number.isInteger(v)&&v>0?v:0};
function friends(){const a=load(K_LOCAL,[]);return Array.isArray(a)?a.filter(Boolean).map(canon).filter(Boolean):[]}
function boolCall(o,n){try{return typeof o?.[n]==='function'?!!o[n]():null}catch(e){return null}}
function getUid(u){let id=0;try{id=uid(u?.getUcUserId?.())}catch(e){};if(!id)try{id=uid(u?.userCardData?.getUid?.())}catch(e){};if(!id)try{id=uid(u?.getUserCardData?.()?.getUid?.())}catch(e){};return id}
function login(u){try{return canon(u?.getLogin?.()||u?.login||'')}catch(e){return''}}
function allConns(){const out=[],seen=new Set(),add=c=>{if(c&&!seen.has(c)){seen.add(c);out.push(c)}};try{const m=window.CHNS?.connManager;if(!m)return[];add(m.getFirstConnection?.());add(m.getCurrentConnection?.());Object.values(window.CHNS?.channelManager?.channels||{}).forEach(ch=>{try{add(m.getConnectionRelatedWithId?.(ch?.getChannelId?.()))}catch(e){}})}catch(e){}return out}
function room(c){try{return String(c?.channelName||c?.getChannelName?.()||c?.channelMain?.getChannelName?.()||'').trim()}catch(e){return''}}
function flatten(v,out=[],seen=new Set()){if(!v||seen.has(v))return out;seen.add(v);if(typeof v?.getLogin==='function'){out.push(v);return out}if(Array.isArray(v)){v.forEach(x=>flatten(x,out,seen));return out}if(v instanceof Set){v.forEach(x=>flatten(x,out,seen));return out}if(v instanceof Map){v.forEach(x=>flatten(x,out,seen));return out}return out}
function listEntries(c){const out=[];const add=(name,v)=>{for(const u of flatten(v,[]))out.push({list:name,user:u,connection:c,room:room(c)})};
 for(const name of ['meList','adminsList','honoursList','registeredList','ordinaryList','closestList','userSet'])try{add(name,c?.[name])}catch(e){}
 try{add('getUsers',c?.getUsers?.())}catch(e){}
 return out}
function findNative(n){const wanted=key(n),hits=[];for(const c of allConns())for(const e of listEntries(c)){const l=login(e.user);if(l&&key(l)===wanted)hits.push({...e,login:l,uid:getUid(e.user),mobile:boolCall(e.user,'isMobile'),honour:boolCall(e.user,'isHonour'),admin:boolCall(e.user,'isAdmin'),registered:boolCall(e.user,'isRegistered'),privs:boolCall(e.user,'hasPrivs'),hidden:boolCall(e.user,'isHiddenAdmin')})}return hits}
function seed(n,hit){const id=uid(hit?.uid);if(!id)return false;const all=load(K_IDS,{}),k=key(n),old=all[k]||{};all[k]={...old,nick:canon(n),id,ts:Date.now(),source:'CHNS-user',probe1021:true,list:hit.list,room:hit.room,mobile:hit.mobile,honour:hit.honour,admin:hit.admin,registered:hit.registered,privs:hit.privs};save(K_IDS,all);return true}
function probeOne(n,retry=true){n=canon(n);if(!n)return null;const hits=findNative(n);const ids=[...new Set(hits.map(h=>uid(h.uid)).filter(Boolean))];const best=hits.find(h=>uid(h.uid))||hits[0]||null;const core=window.SWIR_FRIENDS_PRIMARY1017;const serverRooms=core?.serverRooms?.(n)||[];const rec={nick:n,hits:hits.length,lists:[...new Set(hits.map(h=>h.list))],rooms:[...new Set(hits.map(h=>h.room).filter(Boolean))],uids:ids,uid:best?.uid||0,mobile:best?.mobile??null,honour:best?.honour??null,admin:best?.admin??null,registered:best?.registered??null,privs:best?.privs??null,hidden:best?.hidden??null,serverRooms:[...serverRooms],serverConfirmed:serverRooms.length>0,status:'NO_NATIVE_USER',ts:Date.now()};
 if(ids.length>1)rec.status='UID_CONFLICT';else if(best&&best.uid){seed(n,best);rec.status=rec.serverConfirmed?'SERVER_OK':'SEEDED_NATIVE_UID';if(retry&&!rec.serverConfirmed){try{core?.syncOne?.(n);setTimeout(()=>core?.refresh?.(),500)}catch(e){}}}else if(best)rec.status='NATIVE_WITHOUT_UID';
 rows.set(key(n),rec);persist();return rec}
function probeAll(retry=true){const out=friends().map(n=>probeOne(n,retry));setTimeout(()=>refreshServerState(),1800);return out}
function refreshServerState(){const core=window.SWIR_FRIENDS_PRIMARY1017;for(const n of friends()){const r=rows.get(key(n))||{nick:n};const s=core?.serverRooms?.(n)||[];r.serverRooms=[...s];r.serverConfirmed=s.length>0;if(r.serverConfirmed)r.status='SERVER_OK';r.ts=Date.now();rows.set(key(n),r)}persist();return diagnostics(false)}
function persist(){save(K_PROBE,{ts:Date.now(),rows:[...rows.values()]})}
function diagnostics(log=true){const a=[...rows.values()].map(r=>({nick:r.nick,uid:r.uid||0,mobile:r.mobile,honour:r.honour,admin:r.admin,registered:r.registered,privs:r.privs,hidden:r.hidden,hits:r.hits||0,lists:(r.lists||[]).join('|'),localRooms:(r.rooms||[]).join(', '),server:(r.serverRooms||[]).join(', '),status:r.status}));if(log)console.table(a);return a}
function installUi(){if(document.getElementById('swHonourProbe1021'))return;const p=document.getElementById('friends-panel');if(!p?.classList?.contains('swir-rooms1017'))return;const box=document.createElement('div');box.id='swHonourProbe1021';box.style.cssText='margin:8px 0;padding:7px;border:1px solid #9b7cff66;border-radius:8px;background:#100d1e;color:#d9ceff;font:10px Arial;line-height:1.35';box.innerHTML='<b>10.21 HONOUR PATH PROBE</b><br>Nie zmienia rang. Skanuje wszystkie natywne listy UserData i ponawia normalne rooms[]. <button id="swProbeRun1021" style="float:right;background:#19142a;color:#fff;border:1px solid #9b7cff88;border-radius:6px;padding:4px 7px;cursor:pointer">SKANUJ</button><div style="clear:both"></div>';
 const info=p.querySelector('.rrinfo');(info?.parentNode||p).insertBefore(box,info?.nextSibling||p.firstChild);box.querySelector('#swProbeRun1021').onclick=()=>{probeAll(true);setTimeout(()=>window.SWIR_ROOMS_PANEL1017?.render?.(true),2200)}}
window.addEventListener('swir-primary-friends-updated',()=>setTimeout(()=>{refreshServerState();installUi()},50));document.addEventListener('click',e=>{if(e.target?.closest?.('#friends'))setTimeout(installUi,100)},true);
setTimeout(()=>{probeAll(true);installUi()},1800);setInterval(()=>{installUi();refreshServerState()},5000);
window.SWIR_HONOUR_PROBE1021={version:'10.21 HONOUR PATH PROBE',probeOne,probeAll,findNative,refreshServerState,diagnostics,rows:()=>[...rows.values()]};
console.log('SWIR 10.21 Honour Path Probe active — no rank spoofing');
}catch(e){console.error('SWIR Honour Probe 10.21',e)}})();