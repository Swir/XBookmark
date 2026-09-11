/* SWIR 10.22 BETA — FRIEND ACK SYNC CORE
 * APK-aligned relation flow:
 *   send 8/4 -> WAIT for server 8/4 ACK -> request 85 -> ingest 159 rooms[]
 * Replaces the old fixed-delay verification race. No honour/admin spoofing.
 */
(()=>{try{
if(window.__SWIR_FRIENDS_ACK1022)return;window.__SWIR_FRIENDS_ACK1022=1;
const K_LOCAL='czateria_znajomi';
const K_IDS='swir_friend_identity_cache_97';
const K_STATE='swir_friend_ack_state_1022';
const K_DIAG='swir_friend_ack_diag_1022';
const K_PROBE='swir_friend_honour_probe_1021';
const TRUST_CACHE_MS=180000;
const hookedWs=new WeakSet(),jobs=new Map(),connIds=new WeakMap();
let connSeq=0,last85=0,last159=0,lastAck=0,lastAdd=0,activeKey='',sessionFresh=false,lastPrimaryId=0;
const canonical=v=>{let s=String(v??'');try{s=s.normalize('NFC')}catch(e){}return s.replace(/[\u200B-\u200D\u2060\uFEFF]/g,'').replace(/\u00A0/g,' ').replace(/(?:📱|📲|☎)\uFE0F?/gu,'').replace(/\s+/g,' ').trim().replace(/:\s*$/,'').trim()};
const key=v=>canonical(v).toLocaleLowerCase('pl-PL');
const uid=v=>{v=Number(v);return Number.isInteger(v)&&v>0?v:0};
const uniq=a=>[...new Set((a||[]).map(x=>String(x||'').trim()).filter(Boolean))];
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch(e){return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};
function cleanupLegacy(){
 try{localStorage.removeItem(K_PROBE)}catch(e){}
 try{const src=load(K_IDS,{}),out={};let changed=0;for(const [k0,r0] of Object.entries(src||{})){const r=r0&&typeof r0==='object'?{...r0}:r0;if(r&&r.probe1021){changed++;continue}out[k0]=r}if(changed)save(K_IDS,out)}catch(e){}
 try{const a=load(K_LOCAL,[]),out=[],seen=new Set();if(Array.isArray(a)){for(const raw of a){const n=canonical(raw);if(!n||key(n)==='menu'||seen.has(key(n)))continue;seen.add(key(n));out.push(n)}save(K_LOCAL,out)}}catch(e){}
}
cleanupLegacy();
const localFriends=()=>{const a=load(K_LOCAL,[]);return Array.isArray(a)?a.map(canonical).filter(Boolean):[]};
const idCache=()=>{const x=load(K_IDS,{});return x&&typeof x==='object'?x:{}};
const state=()=>{const x=load(K_STATE,{updatedAt:0,users:{}});x.users=x?.users&&typeof x.users==='object'?x.users:{};return x};
const serverRec=n=>sessionFresh?(state().users[key(n)]||null):null;
function ws(c){return c?.webSocket||c?.ws||c?.socket||null}
function isOpen(c){try{return Number(ws(c)?.readyState)===1}catch(e){return false}}
function connId(c){if(!c)return 0;if(!connIds.has(c))connIds.set(c,++connSeq);return connIds.get(c)}
function roomName(c){try{return String(c?.channelName||c?.getChannelName?.()||c?.channelMain?.getChannelName?.()||'').trim()}catch(e){return''}}
function channelId(c){try{return Number(c?.getChannelId?.()||c?.channelId||c?.channelMain?.getChannelId?.()||0)||0}catch(e){return 0}}
function connInfo(c){return c?{id:connId(c),room:roomName(c)||'-',channelId:channelId(c),open:isOpen(c)}:null}
function allConns(){const out=[],seen=new Set(),add=c=>{if(c&&!seen.has(c)){seen.add(c);out.push(c)}};try{const m=window.CHNS?.connManager;if(!m)return[];add(m.getFirstConnection?.());add(m.getCurrentConnection?.());Object.values(window.CHNS?.channelManager?.channels||{}).forEach(ch=>{try{add(m.getConnectionRelatedWithId?.(ch?.getChannelId?.()))}catch(e){}})}catch(e){}return out}
function openConns(){return allConns().filter(isOpen)}
function primaryConn(){try{const c=window.CHNS?.connManager?.getFirstConnection?.();if(isOpen(c)){lastPrimaryId=connId(c);return c}}catch(e){}const c=openConns()[0]||null;if(c)lastPrimaryId=connId(c);return c}
function meRegistered(){try{return!!window.CHNS?.connManager?.getMeUser?.()?.isRegistered?.()}catch(e){return false}}
function parsePacket(v){try{let p=v?.data??v;if(typeof p==='string')p=JSON.parse(p);return p&&typeof p==='object'?p:null}catch(e){return null}}
function isFriendPacket(v){const p=parsePacket(v);if(!p)return false;return Number(p.code)===85||(Number(p.code)===8&&[4,5].includes(Number(p.subcode)))}
const previousWsSend=WebSocket.prototype.send;
if(!previousWsSend.__swirAck1022){const guarded=function(data){try{if(isFriendPacket(data)&&!(+window.__SWIR_ACK_SEND1022>0)){console.debug('[SWIR 10.22] legacy friend packet blocked',data);return}}catch(e){}return previousWsSend.apply(this,arguments)};guarded.__swirAck1022=true;guarded.__previous=previousWsSend;WebSocket.prototype.send=guarded}
function permitted(fn){window.__SWIR_ACK_SEND1022=(+window.__SWIR_ACK_SEND1022||0)+1;window.__SWIR_ALLOW_FRIEND_SEND96=(+window.__SWIR_ALLOW_FRIEND_SEND96||0)+1;try{return fn()}finally{window.__SWIR_ALLOW_FRIEND_SEND96=Math.max(0,(+window.__SWIR_ALLOW_FRIEND_SEND96||1)-1);window.__SWIR_ACK_SEND1022=Math.max(0,(+window.__SWIR_ACK_SEND1022||1)-1)}}
function send(c,p){if(!c||!isOpen(c))return false;const raw=JSON.stringify(p);try{if(typeof c.send==='function')return permitted(()=>c.send(raw)===true);const w=ws(c);permitted(()=>w.send(raw));return true}catch(e){writeDiag({lastError:'send '+String(e?.message||e)});return false}}
function roomList(a){return uniq((Array.isArray(a)?a:[]).map(r=>typeof r==='string'?r:r?.name))}
function rememberId(n,id,source,extra={}){n=canonical(n);id=uid(id);if(!n||!id)return false;const all=idCache(),k=key(n),old=all[k]||{};all[k]={...old,nick:n,id,ts:Date.now(),source:source||old.source||'1022',...extra};delete all[k].probe1021;save(K_IDS,all);return true}
function liveIdCandidates(n){n=canonical(n);const out=[];for(const c of openConns())try{const u=c?.getUserWithName?.(n);if(!u)continue;let id=0;try{id=uid(u?.getUcUserId?.())}catch(e){};if(!id)try{id=uid(u?.userCardData?.getUid?.())}catch(e){};if(id){out.push({id,connection:c,room:roomName(c)});rememberId(n,id,'1022-live-card',{room:roomName(c),channelId:channelId(c)})}}catch(e){}return out}
function trustedCachedId(n){const c=idCache()[key(n)],id=uid(c?.id),age=Date.now()-Number(c?.ts||0),src=String(c?.source||'');if(c?.probe1021||!id||age<0||age>TRUST_CACHE_MS)return null;if(!/(1022-live-card|1022-ack|1017-live-card|1017-159|183\+132|184)/i.test(src))return null;return{id,source:'fresh-cache',cached:c,age}}
function resolveId(n){n=canonical(n);const sr=serverRec(n),sid=uid(sr?.id);if(sid)return{id:sid,source:'159'};const live=liveIdCandidates(n),ids=[...new Set(live.map(x=>uid(x.id)).filter(Boolean))];if(ids.length>1)return{id:0,source:'conflict',conflict:ids,live};if(ids.length===1)return{id:ids[0],source:'live-user-card',live};return trustedCachedId(n)||{id:0,source:'none'}}
function emit(detail={}){try{window.dispatchEvent(new CustomEvent('swir-ack-friends-updated',{detail}));window.dispatchEvent(new CustomEvent('swir-primary-friends-updated',{detail}))}catch(e){}}
function confirmJob(k,r,now=Date.now()){const j=jobs.get(k);if(!j)return;j.state='CONFIRMED';j.rooms=[...(r?.rooms||[])];j.serverId=uid(r?.id);j.updatedAt=now;jobs.set(k,j);if(activeKey===k)activeKey=''}
function ingest159(p,c){try{if(Number(p?.code)!==159||!Array.isArray(p.users))return false;const now=Date.now(),users={};for(const u of p.users){const n=canonical(u?.name||u?.username||u?.login||'');if(!n)continue;const id=uid(u?.id||u?.userId),rooms=roomList(u?.rooms);users[key(n)]={name:n,id,rooms,ts:now};if(id)rememberId(n,id,'1017-159',{rooms})}save(K_STATE,{updatedAt:now,users});last159=now;sessionFresh=true;for(const [k,j] of jobs){const r=users[k];if(r)confirmJob(k,r,now)}writeDiag({lastAction:'159',last159Count:Object.keys(users).length,last159Connection:connInfo(c)});emit({source:'159',count:Object.keys(users).length});return true}catch(e){writeDiag({lastError:'159 '+String(e?.message||e)});return false}}
function ingestAck(p,c){try{if(Number(p?.code)!==8||Number(p?.subcode)!==4||p?.isFriend===false)return false;const n=canonical(p?.username||p?.name||''),id=uid(p?.userId||p?.id);if(!n&&!id)return false;let k=n?key(n):'';if(!jobs.has(k)&&id){for(const [kk,jj] of jobs)if(uid(jj.id)===id){k=kk;break}}if(n&&id)rememberId(n,id,'1022-ack');lastAck=Date.now();let j=jobs.get(k);if(!j&&n&&localFriends().some(x=>key(x)===k)){j={nick:n,id,attempts:0,rooms:[],manual:false}}if(j){j.nick=n||j.nick;j.id=id||j.id;j.state='ACKED';j.ackAt=lastAck;j.ackConnection=connInfo(c);j.nextAt=lastAck+250;j.deadline=0;j.serverPolls=0;j.updatedAt=lastAck;jobs.set(k,j);activeKey=k}writeDiag({lastAction:'ACK 8/4 '+(n||'#'+id),lastAckNick:n,lastAckUserId:id,lastAckConnection:connInfo(c)});emit({source:'ack',nick:n,id});return true}catch(e){writeDiag({lastError:'ack '+String(e?.message||e)});return false}}
function hookSockets(){for(const c of allConns()){const w=ws(c);if(!w||hookedWs.has(w)||typeof w.addEventListener!=='function')continue;hookedWs.add(w);w.addEventListener('message',ev=>{const p=parsePacket(ev);if(!p)return;if(Number(p.code)===159)ingest159(p,c);else if(Number(p.code)===8&&Number(p.subcode)===4)ingestAck(p,c)})}}
function request85(force=false){hookSockets();const now=Date.now();if(!force&&now-last85<3000)return false;const c=primaryConn();if(!c)return false;if(!send(c,{code:85}))return false;last85=now;writeDiag({lastAction:'85',last85Connection:connInfo(c)});emit({source:'85'});return true}
function enqueue(n,manual=false){n=canonical(n);if(!n)return false;const k=key(n),r=serverRec(n),old=jobs.get(k)||{};if(r){jobs.set(k,{...old,nick:n,id:uid(r.id),idSource:'159',state:'CONFIRMED',rooms:[...(r.rooms||[])],updatedAt:Date.now()});return true}const res=resolveId(n);jobs.set(k,{nick:n,id:res.id||0,idSource:res.source,conflict:res.conflict||null,state:['WAIT_ACK','ACKED','WAIT_159'].includes(old.state)?old.state:(res.source==='conflict'?'ID_CONFLICT':'QUEUED'),attempts:old.attempts||0,nextAt:old.nextAt||0,deadline:old.deadline||0,serverPolls:old.serverPolls||0,ackAt:old.ackAt||0,rooms:old.rooms||[],manual:manual||old.manual||false,updatedAt:Date.now()});emit({source:'job'});return true}
function enqueueAll(){for(const n of localFriends())if(!serverRec(n))enqueue(n,false)}
function processActive(now){if(!activeKey)return;const j=jobs.get(activeKey);if(!j){activeKey='';return}const r=serverRec(j.nick);if(r){confirmJob(activeKey,r,now);emit({source:'confirmed',nick:j.nick});return}if(j.state==='WAIT_ACK'&&now>=j.deadline){j.state=j.attempts>=3?'NO_ACK':'RETRY';j.nextAt=now+(j.state==='RETRY'?3500:0);j.updatedAt=now;jobs.set(activeKey,j);activeKey='';writeDiag({lastAction:'ACK timeout '+j.nick});emit({source:'ack-timeout',nick:j.nick});return}if(j.state==='ACKED'&&now>=j.nextAt){if(request85(true)){j.state='WAIT_159';j.serverPolls=1;j.deadline=now+5000}else{j.nextAt=now+1200}j.updatedAt=now;jobs.set(activeKey,j);emit({source:'post-ack-85',nick:j.nick});return}if(j.state==='WAIT_159'&&now>=j.deadline){if((j.serverPolls||0)<3&&request85(true)){j.serverPolls=(j.serverPolls||0)+1;j.deadline=now+4500;j.updatedAt=now;jobs.set(activeKey,j);emit({source:'159-repoll',nick:j.nick,poll:j.serverPolls});return}j.state='ACK_NO_159';j.updatedAt=now;jobs.set(activeKey,j);activeKey='';writeDiag({lastAction:'ACK but absent from 159 '+j.nick});emit({source:'ack-no-159',nick:j.nick});return}}
function pick(now){if(activeKey||now-lastAdd<1800)return;for(const [k,j] of jobs){if(['CONFIRMED','NO_ACK','ACK_NO_159','WAIT_ACK','ACKED','WAIT_159','ID_CONFLICT'].includes(j.state))continue;if(Number(j.nextAt||0)>now)continue;const r=serverRec(j.nick);if(r){confirmJob(k,r,now);continue}const res=resolveId(j.nick);if(res.source==='conflict'){j.state='ID_CONFLICT';j.conflict=res.conflict;j.updatedAt=now;jobs.set(k,j);continue}j.id=res.id||0;j.idSource=res.source;if(!j.id){j.state='WAIT_ID';j.nextAt=now+2500;j.updatedAt=now;jobs.set(k,j);continue}if(!meRegistered()){j.state='WAIT_SELF_REGISTERED';j.nextAt=now+4000;j.updatedAt=now;jobs.set(k,j);continue}const c=primaryConn();if(!c){j.state='WAIT_SOCKET';j.nextAt=now+2000;j.updatedAt=now;jobs.set(k,j);continue}j.attempts=(j.attempts||0)+1;const packet={code:8,subcode:4,userId:j.id,username:j.nick,isFriend:true};const ok=send(c,packet);lastAdd=now;j.updatedAt=now;if(ok){j.state='WAIT_ACK';j.deadline=now+7000;activeKey=k;writeDiag({lastAction:'8/4 '+j.nick,lastAddConnection:connInfo(c),lastAddUserId:j.id,lastAddIdSource:j.idSource})}else{j.state=j.attempts>=3?'NO_ACK':'RETRY';j.nextAt=now+3500}jobs.set(k,j);emit({source:'8/4',nick:j.nick});break}}
function tick(){try{hookSockets();const now=Date.now();processActive(now);pick(now)}catch(e){writeDiag({lastError:'tick '+String(e?.message||e)})}}
function syncOne(n){const k=key(n);const old=jobs.get(k);if(old&&['NO_ACK','ACK_NO_159','ID_CONFLICT'].includes(old.state)){old.state='RETRY';old.attempts=0;old.nextAt=0;jobs.set(k,old)}else enqueue(n,true);tick();return true}
function syncAll(){enqueueAll();for(const j of jobs.values())if(['NO_ACK','ACK_NO_159'].includes(j.state)){j.state='RETRY';j.attempts=0;j.nextAt=0}tick();return true}
function addLocal(n){n=canonical(n);if(!n)return false;const a=localFriends();if(!a.some(x=>key(x)===key(n))){a.push(n);save(K_LOCAL,a)}enqueue(n,true);tick();return true}
function removeLocal(n){n=canonical(n);save(K_LOCAL,localFriends().filter(x=>key(x)!==key(n)));jobs.delete(key(n));emit({source:'remove'});return true}
function writeDiag(extra={}){const s=state(),c=primaryConn();const d={version:'10.22 ACK SYNC',primary:connInfo(c),primaryId:lastPrimaryId,openSockets:openConns().length,connections:allConns().length,registered:meRegistered(),last85,lastAck,last159,active:activeKey||'',localFriends:localFriends().length,serverFresh:sessionFresh,serverFriends:sessionFresh?Object.keys(s.users||{}).length:0,jobs:[...jobs.values()].map(j=>({nick:j.nick,id:j.id,idSource:j.idSource,state:j.state,attempts:j.attempts,ackAt:j.ackAt||0,serverPolls:j.serverPolls||0,rooms:j.rooms||[],conflict:j.conflict||null})),updatedAt:Date.now(),...extra};save(K_DIAG,d);return d}
function diagnostics(){const d=writeDiag();console.table({version:d.version,primary:d.primary?`${d.primary.id}:${d.primary.room}`:'-',registered:d.registered,last85:d.last85?new Date(d.last85).toLocaleTimeString():'-',lastAck:d.lastAck?new Date(d.lastAck).toLocaleTimeString():'-',last159:d.last159?new Date(d.last159).toLocaleTimeString():'-',localFriends:d.localFriends,serverFriends:d.serverFriends});console.table(d.jobs);return d}
function patchLegacyApi(){const a=window.SWIR_RADAR_DEBUG97||window.SWIR_FRIEND_RADAR;if(!a)return;a.requestServerState=()=>request85(false);a.syncOne=syncOne;a.serverRooms=n=>roomList(serverRec(n)?.rooms)}
save(K_STATE,{updatedAt:0,users:{}});
const API={version:'10.22 ACK SYNC',refresh:()=>request85(false),syncOne,syncAll,addLocal,removeLocal,state,serverRec,hasServerRecord:n=>!!serverRec(n),serverRooms:n=>roomList(serverRec(n)?.rooms),resolveId,diagnostics,jobs:()=>[...jobs.values()],primary:()=>connInfo(primaryConn()),cleanupLegacy};
window.SWIR_FRIENDS_ACK1022=API;window.SWIR_FRIENDS_PRIMARY1017=API;
hookSockets();patchLegacyApi();setTimeout(()=>request85(true),700);setTimeout(()=>{enqueueAll();tick()},2200);setInterval(()=>{tick();patchLegacyApi()},700);
console.log('SWIR 10.22 Friends ACK Sync active — waits for server 8/4 ACK before 85');
}catch(e){console.error('SWIR 10.22 Friends ACK Sync',e)}})();
