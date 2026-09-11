/* SWIR 10.17 — FRIENDS APK EXACT CORE
 * Reverse-engineered against CZATeria Android 2.6.3:
 * - add friend = code 8 / subcode 4 / userId / username / isFriend:true
 * - friend snapshot = code 85 -> code 159 users[].rooms[]
 * - userId resolution mirrors APK: existing server friend -> live opened room/priv UserCard UID -> short trusted cache fallback
 * - transport mirrors APK: first normal/open session connection, not the connection where the target happens to be visible
 * - no phone/mobile badges and no message-nick DOM changes
 */
(()=>{try{
if(window.__SWIR_FRIENDS_PRIMARY1017)return;window.__SWIR_FRIENDS_PRIMARY1017=1;
const K_LOCAL='czateria_znajomi';
const K_IDS='swir_friend_identity_cache_97';
const K_STATE='swir_friend_primary_state_1017';
const K_DIAG='swir_friend_primary_diag_1017';
const TRUST_CACHE_MS=180000;
const hookedWs=new WeakSet(), jobs=new Map(), connIds=new WeakMap();
let connSeq=0,last85=0,last159=0,activeKey='',lastAdd=0,lastPrimaryId=0;
const key=n=>String(n||'').trim().toLocaleLowerCase('pl-PL');
const uid=v=>{v=Number(v);return Number.isInteger(v)&&v>0?v:0};
const uniq=a=>[...new Set((a||[]).map(x=>String(x||'').trim()).filter(Boolean))];
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch(e){return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const localFriends=()=>{const a=load(K_LOCAL,[]);return Array.isArray(a)?a.filter(Boolean):[]};
const idCache=()=>{const x=load(K_IDS,{});return x&&typeof x==='object'?x:{}};
const state=()=>{const x=load(K_STATE,{updatedAt:0,users:{}});x.users=x?.users&&typeof x.users==='object'?x.users:{};return x};
const serverRec=n=>state().users[key(n)]||null;
function ws(c){return c?.webSocket||c?.ws||c?.socket||null}
function isOpen(c){try{return Number(ws(c)?.readyState)===1}catch(e){return false}}
function connId(c){if(!c)return 0;if(!connIds.has(c))connIds.set(c,++connSeq);return connIds.get(c)}
function roomName(c){try{return String(c?.channelName||c?.getChannelName?.()||c?.channelMain?.getChannelName?.()||'').trim()}catch(e){return''}}
function channelId(c){try{return Number(c?.getChannelId?.()||c?.channelId||c?.channelMain?.getChannelId?.()||0)||0}catch(e){return 0}}
function connInfo(c){return c?{id:connId(c),room:roomName(c)||'-',channelId:channelId(c)||0,open:isOpen(c)}:null}
function allConns(){const out=[],seen=new Set(),add=c=>{if(c&&!seen.has(c)){seen.add(c);out.push(c)}};try{const m=window.CHNS?.connManager;if(!m)return[];add(m.getFirstConnection?.());add(m.getCurrentConnection?.());Object.values(window.CHNS?.channelManager?.channels||{}).forEach(ch=>{try{const id=ch?.getChannelId?.();if(id!==undefined&&id!==null)add(m.getConnectionRelatedWithId?.(id))}catch(e){}})}catch(e){}return out}
function openConns(){return allConns().filter(isOpen)}
/* APK service sends ordinary protocol messages over the first NORMAL connection. */
function primaryConn(){try{const first=window.CHNS?.connManager?.getFirstConnection?.();if(isOpen(first)){lastPrimaryId=connId(first);return first}}catch(e){}const c=openConns()[0]||null;if(c)lastPrimaryId=connId(c);return c}
function meRegistered(){try{const m=window.CHNS?.connManager?.getMeUser?.();return!!m?.isRegistered?.()}catch(e){return false}}
function friendPacket(data){try{let p=data;if(typeof p==='string')p=JSON.parse(p);if(!p||typeof p!=='object')return false;const code=Number(p.code);return code===85||(code===8&&Number(p.subcode)===4&&p.isFriend===true)}catch(e){return false}}
/* Stop legacy 9.7/9.6 friend writes while the APK-exact core owns this protocol. */
const nativeOrPreviousWsSend=WebSocket.prototype.send;
if(!nativeOrPreviousWsSend.__swirPrimary1017){const isolated=function(data){try{if(friendPacket(data)&&!(+window.__SWIR_PRIMARY_SEND1017>0)){console.debug('[SWIR 10.17] blocked legacy friend packet',data);return}}catch(e){}return nativeOrPreviousWsSend.apply(this,arguments)};isolated.__swirPrimary1017=true;isolated.__previous=nativeOrPreviousWsSend;WebSocket.prototype.send=isolated}
function permitted(fn){window.__SWIR_PRIMARY_SEND1017=(+window.__SWIR_PRIMARY_SEND1017||0)+1;window.__SWIR_ALLOW_FRIEND_SEND96=(+window.__SWIR_ALLOW_FRIEND_SEND96||0)+1;try{return fn()}finally{window.__SWIR_ALLOW_FRIEND_SEND96=Math.max(0,(+window.__SWIR_ALLOW_FRIEND_SEND96||1)-1);window.__SWIR_PRIMARY_SEND1017=Math.max(0,(+window.__SWIR_PRIMARY_SEND1017||1)-1)}}
/* Direct OPEN websocket write: unlike Connection.send(), success now means bytes were handed to an OPEN socket. */
function send(c,p){const w=ws(c);if(!w||Number(w.readyState)!==1)return false;try{const raw=JSON.stringify(p);permitted(()=>w.send(raw));return true}catch(e){writeDiag({lastError:'send '+String(e?.message||e)});return false}}
function extractPacket(ev){try{let p=ev?.data??ev;if(typeof p==='string')p=JSON.parse(p);return p&&typeof p==='object'?p:null}catch(e){return null}}
function roomList(a){return uniq((Array.isArray(a)?a:[]).map(r=>typeof r==='string'?r:r?.name))}
function rememberId(n,id,source,extra={}){n=String(n||'').trim();id=uid(id);if(!n||!id)return false;const all=idCache(),k=key(n),old=all[k]||{};all[k]={...old,nick:n,id,ts:Date.now(),source:source||old.source||'1017',...extra};save(K_IDS,all);return true}
/* APK a2.o(username): existing friend ID first, then currently opened room/priv user card ID. */
function liveIdCandidates(n){const vals=[];for(const c of openConns())try{const u=c?.getUserWithName?.(n);if(!u)continue;let id=0;try{id=uid(u?.getUcUserId?.())}catch(e){};if(!id)try{id=uid(u?.userCardData?.getUid?.())}catch(e){};if(id){vals.push({id,connection:c,room:roomName(c),source:'live-user-card'});rememberId(n,id,'1017-live-card',{room:roomName(c),channelId:channelId(c)})}}catch(e){}return vals}
function trustedCachedId(n){const c=idCache()[key(n)],id=uid(c?.id),age=Date.now()-Number(c?.ts||0),src=String(c?.source||'');if(!id||age<0||age>TRUST_CACHE_MS)return null;if(!/(1017-live-card|1017-159|CHNS-user|183\+132|184)/i.test(src))return null;return{id,source:'fresh-cache',cached:c,age}}
function resolveId(n){const sr=serverRec(n),sid=uid(sr?.id);if(sid)return{id:sid,source:'159'};const live=liveIdCandidates(n),ids=[...new Set(live.map(x=>uid(x.id)).filter(Boolean))];if(ids.length>1)return{id:0,source:'conflict',conflict:ids,live};if(ids.length===1)return{id:ids[0],source:'live-user-card',live};const cached=trustedCachedId(n);return cached||{id:0,source:'none'}}
function emit(detail={}){try{window.dispatchEvent(new CustomEvent('swir-primary-friends-updated',{detail}))}catch(e){}}
function ingest159(p,c){try{if(Number(p?.code)!==159||!Array.isArray(p.users))return false;const now=Date.now(),users={};for(const u of p.users){const n=String(u?.name||u?.username||u?.login||'').trim();if(!n)continue;const id=uid(u?.id||u?.userId),rooms=roomList(u?.rooms);users[key(n)]={name:n,id,rooms,ts:now};if(id)rememberId(n,id,'1017-159',{rooms})}save(K_STATE,{updatedAt:now,users});last159=now;for(const [k,j] of jobs){const r=users[k];if(r){j.state='CONFIRMED';j.rooms=[...(r.rooms||[])];j.serverId=uid(r.id);j.updatedAt=now;jobs.set(k,j);if(activeKey===k)activeKey=''}}writeDiag({last159Count:Object.keys(users).length,lastAction:'159',last159Connection:connInfo(c)});emit({source:'159',count:Object.keys(users).length});return true}catch(e){writeDiag({lastError:'159 '+String(e?.message||e)});return false}}
function hookSockets(){for(const c of allConns()){const w=ws(c);if(!w||hookedWs.has(w)||typeof w.addEventListener!=='function')continue;hookedWs.add(w);w.addEventListener('message',ev=>{const p=extractPacket(ev);if(Number(p?.code)===159)ingest159(p,c)})}}
function request85(force=false){hookSockets();const now=Date.now();if(!force&&now-last85<4000)return false;const c=primaryConn();if(!c)return false;if(!send(c,{code:85}))return false;last85=now;writeDiag({lastAction:'85',last85Connection:connInfo(c)});emit({source:'85'});return true}
function enqueue(n,manual=false){n=String(n||'').trim();if(!n)return false;const k=key(n),r=serverRec(n),old=jobs.get(k)||{};if(r){jobs.set(k,{nick:n,id:uid(r.id),idSource:'159',state:'CONFIRMED',attempts:old.attempts||0,rooms:[...(r.rooms||[])],manual:manual||old.manual||false,updatedAt:Date.now()});emit({source:'job'});return true}const res=resolveId(n);jobs.set(k,{nick:n,id:res.id||0,idSource:res.source,conflict:res.conflict||null,state:res.source==='conflict'?'ID_CONFLICT':(['WAIT_VERIFY','WAIT_159'].includes(old.state)?old.state:'QUEUED'),attempts:old.attempts||0,nextAt:old.nextAt||0,deadline:old.deadline||0,rooms:old.rooms||[],manual:manual||old.manual||false,updatedAt:Date.now()});writeDiag();emit({source:'job'});return true}
function enqueueAll(){for(const n of localFriends())if(!serverRec(n))enqueue(n,false)}
function processActive(now){if(!activeKey)return;const j=jobs.get(activeKey);if(!j){activeKey='';return}const r=serverRec(j.nick);if(r){j.state='CONFIRMED';j.rooms=[...(r.rooms||[])];j.updatedAt=now;jobs.set(activeKey,j);activeKey='';writeDiag();emit({source:'confirmed'});return}if(j.state==='WAIT_VERIFY'&&now>=j.nextAt){if(request85(true)){j.state='WAIT_159';j.deadline=now+8000;j.updatedAt=now}else{j.nextAt=now+2500;j.updatedAt=now}jobs.set(activeKey,j);emit({source:'verify'});return}if(j.state==='WAIT_159'&&now>=j.deadline){j.state=j.attempts>=3?'UNCONFIRMED':'RETRY';j.nextAt=now+(j.state==='RETRY'?5000:0);j.updatedAt=now;jobs.set(activeKey,j);activeKey='';writeDiag();emit({source:'timeout'});return}}
function pick(now){if(activeKey||now-lastAdd<2000)return;for(const [k,j] of jobs){if(['CONFIRMED','UNCONFIRMED','WAIT_VERIFY','WAIT_159','ID_CONFLICT'].includes(j.state))continue;if(Number(j.nextAt||0)>now)continue;const r=serverRec(j.nick);if(r){j.state='CONFIRMED';j.rooms=[...(r.rooms||[])];j.updatedAt=now;jobs.set(k,j);continue}const res=resolveId(j.nick);if(res.source==='conflict'){j.state='ID_CONFLICT';j.conflict=res.conflict;j.updatedAt=now;jobs.set(k,j);emit({source:'id-conflict'});continue}j.id=res.id||0;j.idSource=res.source;if(!j.id){j.state='WAIT_ID';j.nextAt=now+3000;j.updatedAt=now;jobs.set(k,j);continue}if(!meRegistered()){j.state='WAIT_SELF_REGISTERED';j.nextAt=now+5000;j.updatedAt=now;jobs.set(k,j);continue}const c=primaryConn();if(!c){j.state='WAIT_SOCKET';j.nextAt=now+2500;j.updatedAt=now;jobs.set(k,j);continue}j.attempts=(j.attempts||0)+1;const packet={code:8,subcode:4,userId:j.id,username:j.nick,isFriend:true};const ok=send(c,packet);lastAdd=now;j.updatedAt=now;if(ok){j.state='WAIT_VERIFY';j.nextAt=now+2800;activeKey=k;writeDiag({lastAction:'8/4 '+j.nick,lastAddConnection:connInfo(c),lastAddUserId:j.id,lastAddIdSource:j.idSource})}else{j.state=j.attempts>=3?'UNCONFIRMED':'RETRY';j.nextAt=now+4500;writeDiag({lastError:'8/4 send failed '+j.nick})}jobs.set(k,j);emit({source:'8/4',nick:j.nick});break}}
function tick(){try{hookSockets();const now=Date.now();processActive(now);pick(now)}catch(e){writeDiag({lastError:'tick '+String(e?.message||e)})}}
function syncOne(n){enqueue(n,true);tick();return true}
function syncAll(){enqueueAll();tick();return true}
function writeDiag(extra={}){const s=state(),c=primaryConn();const d={version:'10.17 APK EXACT',primary:connInfo(c),primaryId:lastPrimaryId,openSockets:openConns().length,connections:allConns().length,registered:meRegistered(),last85,last159,active:activeKey||'',localFriends:localFriends().length,serverFriends:Object.keys(s.users||{}).length,jobs:[...jobs.values()].map(j=>({nick:j.nick,id:j.id,idSource:j.idSource,state:j.state,attempts:j.attempts,rooms:j.rooms||[],conflict:j.conflict||null})),updatedAt:Date.now(),...extra};save(K_DIAG,d);return d}
function diagnostics(){const d=writeDiag();console.table({version:d.version,primary:d.primary?`${d.primary.id}:${d.primary.room}`:'-',openSockets:d.openSockets,registered:d.registered,last85:d.last85?new Date(d.last85).toLocaleTimeString():'-',last159:d.last159?new Date(d.last159).toLocaleTimeString():'-',localFriends:d.localFriends,serverFriends:d.serverFriends});console.table(d.jobs);return d}
function addLocal(n){n=String(n||'').trim();if(!n)return false;const a=localFriends();if(!a.some(x=>key(x)===key(n))){a.push(n);save(K_LOCAL,a)}enqueue(n,true);tick();return true}
function removeLocal(n){save(K_LOCAL,localFriends().filter(x=>key(x)!==key(n)));jobs.delete(key(n));emit({source:'remove'});return true}
function patchLegacyApi(){const a=window.SWIR_RADAR_DEBUG97||window.SWIR_FRIEND_RADAR;if(!a)return;a.requestServerState=()=>request85(false);a.syncOne=syncOne}
window.SWIR_FRIENDS_PRIMARY1017={version:'10.17 APK EXACT',refresh:()=>request85(false),syncOne,syncAll,addLocal,removeLocal,state,serverRooms:n=>roomList(serverRec(n)?.rooms),resolveId,diagnostics,jobs:()=>[...jobs.values()],primary:()=>connInfo(primaryConn())};
hookSockets();patchLegacyApi();setTimeout(()=>request85(true),700);setTimeout(()=>{enqueueAll();tick()},2300);setInterval(()=>{tick();patchLegacyApi()},1000);
console.log('SWIR 10.17 Friends APK Exact core active');
}catch(e){console.error('SWIR 10.17 Friends APK Exact',e)}})();
