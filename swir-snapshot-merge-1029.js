/* SWIR 10.29 BETA — SYMBOL-SAFE SNAPSHOT MERGE
 * 10.25 logic with exact nickname identity. Punctuation is never stripped.
 */
(()=>{try{
if(window.__SWIR_SNAPSHOT_MERGE1029)return;window.__SWIR_SNAPSHOT_MERGE1029=1;
const K_STATE='swir_friend_ack_state_1022',K_DIAG='swir_snapshot_merge_diag_1029',TTL=15000;
const hooked=new WeakSet(),ids=new WeakMap(),snapshots=new Map();let seq=0,lastDecision='boot',lastMergedAt=0;
const now=()=>Date.now();
const clean=v=>{let s=String(v??'');try{s=s.normalize('NFC')}catch(e){}return s.replace(/[\u200B-\u200D\u2060\uFEFF]/g,'').replace(/\u00A0/g,' ').replace(/(?:📱|📲|☎)\uFE0F?/gu,'').replace(/\s+/g,' ').trim()};
const key=v=>clean(v).toLocaleLowerCase('pl-PL');
const uid=v=>{v=Number(v);return Number.isInteger(v)&&v>0?v:0};
const uniq=a=>[...new Set((a||[]).map(x=>String(x||'').trim()).filter(Boolean))];
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch(e){return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};
function parse(v){try{let p=v?.data??v;if(typeof p==='string')p=JSON.parse(p);return p&&typeof p==='object'?p:null}catch(e){return null}}
function cid(c){if(!c)return 0;if(!ids.has(c))ids.set(c,++seq);return ids.get(c)}
function ws(c){return c?.webSocket||c?.ws||c?.socket||null}
function room(c){try{return String(c?.channelName||c?.getChannelName?.()||c?.channelMain?.getChannelName?.()||'').trim()||'-'}catch(e){return'-'}}
function channelId(c){try{return Number(c?.getChannelId?.()||c?.channelId||c?.channelMain?.getChannelId?.()||0)||0}catch(e){return 0}}
function conns(){const out=[],seen=new Set(),add=c=>{if(c&&!seen.has(c)){seen.add(c);out.push(c)}};try{const m=CHNS?.connManager;if(!m)return out;add(m.getFirstConnection?.());add(m.getCurrentConnection?.());Object.values(CHNS?.channelManager?.channels||{}).forEach(ch=>{try{add(m.getConnectionRelatedWithId?.(ch?.getChannelId?.()))}catch(e){}})}catch(e){}return out}
function roomsOf(u){return uniq((Array.isArray(u?.rooms)?u.rooms:[]).map(r=>typeof r==='string'?r:r?.name))}
function normalizeUsers(arr,t){const users={};for(const u of Array.isArray(arr)?arr:[]){const n=clean(u?.name||u?.username||u?.login||'');if(!n)continue;users[key(n)]={name:n,id:uid(u?.id||u?.userId),rooms:roomsOf(u),ts:t}}return users}
function prune(t){for(const [id,s] of snapshots)if(t-s.ts>TTL)snapshots.delete(id)}
function mergeFresh(t){prune(t);const merged={},used=[];for(const s of snapshots.values()){if(t-s.ts>TTL)continue;used.push({connId:s.connId,room:s.room,channelId:s.channelId,count:Object.keys(s.users).length,age:t-s.ts});for(const [k,u] of Object.entries(s.users)){const old=merged[k];merged[k]=old?{name:u.name||old.name,id:u.id||old.id,rooms:uniq([...(old.rooms||[]),...(u.rooms||[])]),ts:Math.max(Number(old.ts||0),Number(u.ts||0))}:{...u,rooms:[...(u.rooms||[])]}}}return{users:merged,used}}
function apply(reason){const t=now(),m=mergeFresh(t),count=Object.keys(m.users).length;if(!m.used.length)return false;const before=load(K_STATE,{updatedAt:0,users:{}}),beforeCount=Object.keys(before?.users||{}).length;save(K_STATE,{updatedAt:t,users:m.users});lastMergedAt=t;lastDecision=count>beforeCount?'merged-expanded':count<beforeCount?'merged-shrunk':'merged-stable';save(K_DIAG,{ts:t,reason,decision:lastDecision,beforeCount,mergedCount:count,sources:m.used});try{dispatchEvent(new CustomEvent('swir-ack-friends-updated',{detail:{source:'1029-merge',count,reason}}));dispatchEvent(new CustomEvent('swir-primary-friends-updated',{detail:{source:'1029-merge',count,reason}}))}catch(e){}return true}
function ingest(p,c){if(Number(p?.code)!==159||!Array.isArray(p.users))return false;const t=now(),id=cid(c);snapshots.set(id,{ts:t,connId:id,room:room(c),channelId:channelId(c),users:normalizeUsers(p.users,t)});setTimeout(()=>apply('incoming-159'),0);return true}
function hook(){for(const c of conns()){const w=ws(c);if(!w||hooked.has(w)||typeof w.addEventListener!=='function')continue;hooked.add(w);w.addEventListener('message',e=>{const p=parse(e);if(p)ingest(p,c)})}}
function diagnostics(){hook();const t=now(),m=mergeFresh(t),out={version:'10.29 SYMBOL SAFE MERGE',decision:lastDecision,ttlMs:TTL,lastMergedAt,sources:m.used,mergedCount:Object.keys(m.users).length,mergedUsers:Object.values(m.users).map(u=>({name:u.name,id:u.id,rooms:u.rooms})),last:load(K_DIAG,null)};console.log('[SWIR 10.29] symbol-safe merge',out);return out}
setTimeout(hook,1700);setInterval(()=>{hook();prune(now())},1500);
window.SWIR_SNAPSHOT_MERGE1029={version:'10.29',hook,apply,diagnostics};window.SWIR_SNAPSHOT_MERGE1025=window.SWIR_SNAPSHOT_MERGE1029;
console.log('SWIR 10.29 Symbol-Safe Snapshot Merge active');
}catch(e){console.error('SWIR 10.29 Symbol-Safe Snapshot Merge',e)}})();