/* SWIR 10.15 — GLOBAL ROOMS CORE
 * Goal: every local friend with known userId is synchronized to the normal server friend list.
 * Location is taken from code 159 rooms[] only; mobile/PC status never changes the sync path.
 * No panel rebuilding, no emoji/badges injected into nick/message DOM.
 */
(()=>{try{
if(window.__SWIR_FRIENDS_GLOBAL1015)return;window.__SWIR_FRIENDS_GLOBAL1015=1;
const L='czateria_znajomi',I='swir_friend_identity_cache_97',S='swir_friend_server_state_97',D='swir_friend_global_diag_1015';
const jobs=new Map(),hooked=new WeakSet();
let active='',last85=0,last159=0,lastSend=0,bootSnapshot=false;
const key=n=>String(n||'').trim().toLocaleLowerCase('pl-PL');
const uid=x=>{x=parseInt(x,10);return Number.isFinite(x)&&x>0?x:0};
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch(e){return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const locals=()=>{const a=load(L,[]);return Array.isArray(a)?a.filter(Boolean):[]};
const ids=()=>load(I,{});
const idof=n=>ids()[key(n)]||null;
const server=()=>{const s=load(S,{updatedAt:0,users:{}});s.users=s.users&&typeof s.users==='object'?s.users:{};return s};
const srv=n=>server().users[key(n)]||null;
function meRegistered(){try{const m=window.CHNS?.connManager?.getMeUser?.();return!!(m&&m.isRegistered?.())}catch(e){return false}}
function ws(c){return c?.webSocket||c?.ws||c?.socket||null}
function isOpen(c){try{return Number(ws(c)?.readyState)===1}catch(e){return false}}
function conns(){const z=new Set();try{const m=window.CHNS?.connManager;if(!m)return[];const c1=m.getCurrentConnection?.(),c2=m.getFirstConnection?.();c1&&z.add(c1);c2&&z.add(c2);Object.values(window.CHNS?.channelManager?.channels||{}).forEach(ch=>{try{const c=m.getConnectionRelatedWithId?.(ch?.getChannelId?.());c&&z.add(c)}catch(e){}})}catch(e){}return[...z]}
function openConns(){return conns().filter(isOpen)}
function connFor(n){const a=openConns();for(const c of a)try{if(c.getUserWithName?.(n))return c}catch(e){}const ch=Number(idof(n)?.channelId||0);if(ch)try{const c=window.CHNS?.connManager?.getConnectionRelatedWithId?.(ch);if(isOpen(c))return c}catch(e){}const cur=window.CHNS?.connManager?.getCurrentConnection?.();return isOpen(cur)?cur:(a[0]||null)}
function gate(fn){window.__SWIR_ALLOW_FRIEND_SEND96=(+window.__SWIR_ALLOW_FRIEND_SEND96||0)+1;try{return fn()}finally{window.__SWIR_ALLOW_FRIEND_SEND96=Math.max(0,(+window.__SWIR_ALLOW_FRIEND_SEND96||1)-1)}}
function send(c,p){if(!isOpen(c))return false;try{const raw=JSON.stringify(p);if(typeof c.send==='function')return gate(()=>c.send(raw))!==false;const w=ws(c);if(w&&Number(w.readyState)===1){gate(()=>w.send(raw));return true}}catch(e){}return false}
function saveDiag(extra={}){const st=server();save(D,{version:'10.15',last85,last159,active,registered:meRegistered(),connections:conns().length,openSockets:openConns().length,localFriends:locals().length,serverFriends:Object.keys(st.users||{}).length,jobs:[...jobs.values()].map(j=>({nick:j.nick,id:j.id,mobile:!!idof(j.nick)?.mobile,state:j.state,attempts:j.attempts||0,lastRooms:j.lastRooms||[]})),updatedAt:Date.now(),...extra})}
function ingest159(x){try{let p=x?.data??x;if(typeof p==='string')p=JSON.parse(p);if(Number(p?.code)!==159||!Array.isArray(p.users))return false;const now=Date.now(),users={};for(const u of p.users){const n=String(u?.name||u?.username||u?.login||'').trim();if(!n)continue;const rooms=[...new Set((Array.isArray(u?.rooms)?u.rooms:[]).map(r=>typeof r==='string'?r:r?.name).map(v=>String(v||'').trim()).filter(Boolean))];users[key(n)]={name:n,id:uid(u?.id||u?.userId),rooms,ts:now}}
save(S,{updatedAt:now,users});last159=now;bootSnapshot=true;
for(const [k,j] of jobs){if(users[k]){j.state='CONFIRMED';j.lastRooms=users[k].rooms.slice();j.updated=now;jobs.set(k,j);if(active===k)active=''}}
saveDiag({last159Count:Object.keys(users).length});return true}catch(e){saveDiag({lastError:'159 '+String(e?.message||e)});return false}}
function hook(){for(const c of conns()){const w=ws(c);if(!w||hooked.has(w)||typeof w.addEventListener!=='function')continue;hooked.add(w);w.addEventListener('message',ingest159)}}
function request85(force=false){const now=Date.now();if(!force&&now-last85<3500)return false;const c=openConns()[0];if(!c)return false;if(!send(c,{code:85}))return false;last85=now;saveDiag({lastAction:'85'});return true}
function enqueue(n,manual=false){n=String(n||'').trim();if(!n)return false;const k=key(n),r=srv(n),id=uid(idof(n)?.id);if(r){jobs.set(k,{nick:n,id:id||uid(r.id),mobile:!!idof(n)?.mobile,state:'CONFIRMED',attempts:0,lastRooms:[...(r.rooms||[])],manual,updated:Date.now()});return true}const old=jobs.get(k);jobs.set(k,{nick:n,id:id||old?.id||0,mobile:!!idof(n)?.mobile,state:old&&['WAIT_159','WAIT_VERIFY'].includes(old.state)?old.state:'QUEUED',attempts:old?.attempts||0,nextAt:old?.nextAt||0,deadline:old?.deadline||0,lastRooms:old?.lastRooms||[],manual:manual||old?.manual||false,updated:Date.now()});saveDiag();return true}
function enqueueAll(){for(const n of locals())if(!srv(n))enqueue(n,false)}
function processActive(now){if(!active)return;const j=jobs.get(active);if(!j){active='';return}const r=srv(j.nick);if(r){j.state='CONFIRMED';j.lastRooms=[...(r.rooms||[])];j.updated=now;jobs.set(active,j);active='';saveDiag();return}
if(j.state==='WAIT_VERIFY'&&now>=j.nextAt){if(request85(true)){j.state='WAIT_159';j.deadline=now+6500;j.updated=now;jobs.set(active,j)}else{j.nextAt=now+2000;j.updated=now;jobs.set(active,j)}return}
if(j.state==='WAIT_159'&&now>=j.deadline){if(j.attempts>=3){j.state='UNCONFIRMED';j.updated=now;jobs.set(active,j);active=''}else{j.state='RETRY';j.nextAt=now+4000;j.updated=now;jobs.set(active,j);active=''}saveDiag()}}
function pick(now){if(active||now-lastSend<1600)return;for(const [k,j] of jobs){if(['CONFIRMED','UNCONFIRMED','WAIT_159','WAIT_VERIFY'].includes(j.state))continue;if((j.state==='RETRY'||j.state==='WAIT_SOCKET')&&j.nextAt>now)continue;if(srv(j.nick)){const r=srv(j.nick);j.state='CONFIRMED';j.lastRooms=[...(r.rooms||[])];jobs.set(k,j);continue}j.id=uid(idof(j.nick)?.id)||j.id;if(!j.id){j.state='WAIT_ID';jobs.set(k,j);continue}if(!meRegistered()){j.state='WAIT_SELF_REGISTERED';jobs.set(k,j);continue}const c=connFor(j.nick);if(!c){j.state='WAIT_SOCKET';j.nextAt=now+2500;jobs.set(k,j);continue}j.attempts=(j.attempts||0)+1;const ok=send(c,{code:8,subcode:4,userId:j.id,username:j.nick,isFriend:true});lastSend=now;j.updated=now;if(ok){j.state='WAIT_VERIFY';j.nextAt=now+2200;active=k}else{j.state=j.attempts>=3?'UNCONFIRMED':'RETRY';j.nextAt=now+3500}jobs.set(k,j);saveDiag({lastAction:'8/4 '+j.nick});break}}
function tick(){try{hook();const now=Date.now();processActive(now);pick(now)}catch(e){saveDiag({lastError:'tick '+String(e?.message||e)})}}
function syncOne(n){const ok=enqueue(n,true);tick();return ok}
function patchApi(){const a=window.SWIR_RADAR_DEBUG97||window.SWIR_FRIEND_RADAR;if(!a)return;a.requestServerState=()=>request85(false);a.syncOne=syncOne;a.globalRooms1015=window.SWIR_FRIENDS_GLOBAL1015}
function diagnostics(){const st=server();const out={version:'10.15 GLOBAL ROOMS',registered:meRegistered(),connections:conns().length,openSockets:openConns().length,localFriends:locals().length,serverFriends:Object.keys(st.users||{}).length,identityCache:Object.keys(ids()).length,active:active||'-',last85:last85?new Date(last85).toLocaleTimeString():'-',last159:last159?new Date(last159).toLocaleTimeString():'-'};console.table(out);console.table([...jobs.values()].map(j=>({nick:j.nick,id:j.id,mobile:j.mobile,state:j.state,attempts:j.attempts,rooms:(j.lastRooms||[]).join(', ')})));return out}
document.addEventListener('click',e=>{const cloud=e.target?.closest?.('#friends-panel.swir97 [data-x="c"]');if(cloud){e.preventDefault();e.stopImmediatePropagation();const n=cloud.closest('.r97r')?.dataset.n;if(n)syncOne(n);return}if(e.target?.closest?.('#friends-panel.swir97 #r97ref')){e.preventDefault();e.stopImmediatePropagation();request85(false);return}if(e.target?.closest?.('#friends-panel.swir97 #r97add'))setTimeout(()=>{enqueueAll();tick()},250);if(e.target?.closest?.('#friends'))setTimeout(()=>{request85(false);setTimeout(()=>{enqueueAll();tick()},1800)},180)},true);
document.addEventListener('keyup',e=>{if(e.key==='Enter'&&e.target?.id==='r97in')setTimeout(()=>{enqueueAll();tick()},250)},true);
window.addEventListener('focus',()=>{if(Date.now()-last85>15000)request85(false)});
window.SWIR_FRIENDS_GLOBAL1015={version:'10.15 GLOBAL ROOMS',syncOne,syncAll:()=>{enqueueAll();tick()},refresh:()=>request85(false),diagnostics,jobs:()=>[...jobs.values()]};
hook();patchApi();setTimeout(()=>{request85(false);setTimeout(()=>{enqueueAll();tick()},2200)},900);setInterval(()=>{tick();patchApi()},1000);
console.log('SWIR 10.15 Global Rooms active');
}catch(e){console.error('SWIR 10.15 Global Rooms',e)}})();
