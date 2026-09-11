/* SWIR 10.14 — FRIENDS CORE
 * Reliability only. No panel rebuilding, no status badges, no emoji UI.
 * OPEN socket -> 8/4 -> 85 -> 159 confirmation with bounded retry.
 */
(()=>{try{
if(window.__SWIR_FRIENDS_CORE1014)return;window.__SWIR_FRIENDS_CORE1014=1;
const L='czateria_znajomi',I='swir_friend_identity_cache_97',S='swir_friend_server_state_97',LOG='swir_friend_core_1014';
const jobs=new Map(),hooked=new WeakSet();let active='',last85=0,last159=0,lastSend=0,bootSynced=false;
const key=n=>String(n||'').trim().toLocaleLowerCase('pl-PL');
const uid=x=>{x=parseInt(x,10);return Number.isFinite(x)&&x>0?x:0};
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch(e){return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const locals=()=>{const a=load(L,[]);return Array.isArray(a)?a.filter(Boolean):[]};
const ids=()=>load(I,{});
const idof=n=>ids()[key(n)]||null;
const state=()=>{const s=load(S,{updatedAt:0,users:{}});s.users=s.users&&typeof s.users==='object'?s.users:{};return s};
const app=n=>state().users[key(n)]||null;
function ws(c){return c?.webSocket||c?.ws||c?.socket||null}
function conns(){const z=new Set();try{const m=window.CHNS?.connManager;if(!m)return[];const a=m.getCurrentConnection?.();a&&z.add(a);const b=m.getFirstConnection?.();b&&z.add(b);Object.values(window.CHNS?.channelManager?.channels||{}).forEach(ch=>{try{const c=m.getConnectionRelatedWithId?.(ch?.getChannelId?.());c&&z.add(c)}catch(e){}})}catch(e){}return[...z]}
function isOpen(c){try{return Number(ws(c)?.readyState)===1}catch(e){return false}}
function openConns(){return conns().filter(isOpen)}
function connFor(n){const a=openConns();for(const c of a)try{if(c.getUserWithName?.(n))return c}catch(e){}const ch=Number(idof(n)?.channelId||0);if(ch)try{const c=CHNS.connManager?.getConnectionRelatedWithId?.(ch);if(isOpen(c))return c}catch(e){}return a[0]||null}
function gate(fn){window.__SWIR_ALLOW_FRIEND_SEND96=(+window.__SWIR_ALLOW_FRIEND_SEND96||0)+1;try{return fn()}finally{window.__SWIR_ALLOW_FRIEND_SEND96=Math.max(0,(+window.__SWIR_ALLOW_FRIEND_SEND96||1)-1)}}
function send(c,p){if(!isOpen(c))return false;try{const raw=JSON.stringify(p);if(typeof c.send==='function')return gate(()=>c.send(raw))!==false;const w=ws(c);if(w&&w.readyState===1){gate(()=>w.send(raw));return true}}catch(e){}return false}
function parse159(x){try{let p=x?.data??x;if(typeof p==='string')p=JSON.parse(p);if(Number(p?.code)!==159||!Array.isArray(p.users))return false;const users={},now=Date.now();for(const u of p.users){const n=String(u?.name||u?.username||u?.login||'').trim();if(!n)continue;const rooms=(Array.isArray(u?.rooms)?u.rooms:[]).map(r=>typeof r==='string'?r:r?.name).filter(Boolean);users[key(n)]={name:n,id:uid(u?.id||u?.userId),rooms:[...new Set(rooms)],ts:now}}save(S,{updatedAt:now,users});last159=now;for(const [k,j] of jobs)if(users[k]){j.state='CONFIRMED';j.updated=now;jobs.set(k,j);if(active===k)active=''}saveLog();return true}catch(e){return false}}
function hook(){for(const c of conns()){const w=ws(c);if(!w||hooked.has(w)||typeof w.addEventListener!=='function')continue;hooked.add(w);w.addEventListener('message',parse159)}}
function send85(force=false){const now=Date.now();if(!force&&now-last85<3000)return false;const c=openConns()[0];if(!c)return false;if(!send(c,{code:85}))return false;last85=now;return true}
function enqueue(n,manual=false){n=String(n||'').trim();if(!n)return false;const k=key(n);if(app(n)){jobs.set(k,{nick:n,id:uid(idof(n)?.id),state:'CONFIRMED',attempts:0,manual,updated:Date.now()});return true}const old=jobs.get(k);jobs.set(k,{nick:n,id:uid(idof(n)?.id)||old?.id||0,state:old?.state==='WAIT_159'?'WAIT_159':'QUEUED',attempts:old?.attempts||0,manual:manual||old?.manual||false,nextAt:old?.nextAt||0,deadline:old?.deadline||0,updated:Date.now()});saveLog();return true}
function enqueueMissing(){for(const n of locals())if(!app(n)&&uid(idof(n)?.id))enqueue(n,false)}
function saveLog(){save(LOG,{version:'10.14',last85,last159,active,jobs:[...jobs.values()].map(j=>({nick:j.nick,id:j.id,state:j.state,attempts:j.attempts,updated:j.updated}))})}
function processActive(now){if(!active)return;const j=jobs.get(active);if(!j){active='';return}if(app(j.nick)){j.state='CONFIRMED';j.updated=now;jobs.set(active,j);active='';saveLog();return}if(j.state==='WAIT_VERIFY'&&now>=j.nextAt){if(send85(true)){j.state='WAIT_159';j.deadline=now+5500;j.updated=now;jobs.set(active,j)}else{j.nextAt=now+1800;j.updated=now;jobs.set(active,j)}return}if(j.state==='WAIT_159'&&now>=j.deadline){if(j.attempts>=3){j.state='ERROR';j.updated=now;jobs.set(active,j);active=''}else{j.state='RETRY';j.nextAt=now+3500;j.updated=now;jobs.set(active,j);active=''}saveLog()}}
function pick(now){if(active)return;if(now-lastSend<1500)return;for(const [k,j] of jobs){if(['CONFIRMED','ERROR','WAIT_159','WAIT_VERIFY'].includes(j.state))continue;if((j.state==='RETRY'||j.state==='WAIT_SOCKET')&&j.nextAt>now)continue;if(app(j.nick)){j.state='CONFIRMED';jobs.set(k,j);continue}j.id=uid(idof(j.nick)?.id)||j.id;if(!j.id){j.state='WAIT_ID';jobs.set(k,j);continue}const c=connFor(j.nick);if(!c){j.state='WAIT_SOCKET';j.nextAt=now+2500;jobs.set(k,j);continue}j.attempts=(j.attempts||0)+1;const ok=send(c,{code:8,subcode:4,userId:j.id,username:j.nick,isFriend:true});lastSend=now;j.updated=now;if(ok){j.state='WAIT_VERIFY';j.nextAt=now+1800;active=k}else{j.state=j.attempts>=3?'ERROR':'RETRY';j.nextAt=now+3000}jobs.set(k,j);saveLog();break}}
function tick(){try{hook();const now=Date.now();processActive(now);pick(now)}catch(e){}}
function syncOne(n){const ok=enqueue(n,true);tick();return ok}
function refresh(){hook();return send85(false)}
function patchApi(){const a=window.SWIR_RADAR_DEBUG97||window.SWIR_FRIEND_RADAR;if(!a)return;a.requestServerState=refresh;a.syncOne=syncOne;a.friendCore1014=window.SWIR_FRIENDS_CORE1014}
function diagnostics(){const st=state();const out={version:'10.14 FRIENDS CORE',connections:conns().length,openSockets:openConns().length,localFriends:locals().length,officialAppFriends:Object.keys(st.users||{}).length,identityCache:Object.keys(ids()).length,jobs:jobs.size,active:active||'-',last85:last85?new Date(last85).toLocaleTimeString():'-',last159:last159?new Date(last159).toLocaleTimeString():'-'};console.table(out);console.table([...jobs.values()]);return out}
document.addEventListener('click',e=>{const cloud=e.target?.closest?.('#friends-panel.swir97 [data-x="c"]');if(cloud){e.preventDefault();e.stopImmediatePropagation();const n=cloud.closest('.r97r')?.dataset.n;if(n)syncOne(n);return}if(e.target?.closest?.('#friends-panel.swir97 #r97ref')){e.preventDefault();e.stopImmediatePropagation();refresh();return}if(e.target?.closest?.('#friends'))setTimeout(()=>{refresh();if(!bootSynced){bootSynced=true;setTimeout(enqueueMissing,1800)}},150)},true);
window.addEventListener('focus',()=>{if(Date.now()-last85>15000)refresh()});
window.SWIR_FRIENDS_CORE1014={version:'10.14 FRIENDS CORE',syncOne,syncMissing:()=>{enqueueMissing();tick()},refresh,diagnostics,jobs:()=>[...jobs.values()]};
hook();patchApi();setTimeout(()=>{refresh();setTimeout(()=>{enqueueMissing();bootSynced=true},2200)},900);setInterval(()=>{tick();patchApi()},900);
console.log('SWIR 10.14 Friends Core active');
}catch(e){console.error('SWIR 10.14 Friends Core',e)}})();
