/* SWIR 10.23 BETA — FRIEND QUEUE WATCH
 * Isolated scheduler/diagnostics overlay for the proven 10.22 ACK core.
 * Does not change packet format or MIX. It retries only terminal friend jobs,
 * one at a time, with cooldown and a strict per-friend budget.
 */
(()=>{try{
if(window.__SWIR_QUEUE1023)return;window.__SWIR_QUEUE1023=1;
const K='swir_friend_queue_diag_1023';
const retry=new Map();
let lastServerCount=-1,lastServerFresh=false,lastAutoRefresh=0,lastDecision='boot';
const now=()=>Date.now();
const core=()=>window.SWIR_FRIENDS_ACK1022||window.SWIR_FRIENDS_PRIMARY1017||null;
const load=()=>{try{return JSON.parse(localStorage.getItem(K)||'null')||{history:[],drops:[]}}catch(e){return{history:[],drops:[]}}};
const save=d=>{try{localStorage.setItem(K,JSON.stringify(d))}catch(e){}};
function push(type,data={}){const d=load();d.history=Array.isArray(d.history)?d.history:[];d.history.push({ts:now(),type,...data});if(d.history.length>120)d.history=d.history.slice(-120);save(d)}
function busy(jobs){return jobs.some(j=>['WAIT_ACK','ACKED','WAIT_159'].includes(j?.state))}
function inspect(){const c=core();if(!c)return null;const jobs=c.jobs?.()||[],st=c.state?.()||{updatedAt:0,users:{}},serverCount=Object.keys(st?.users||{}).length,fresh=Number(st?.updatedAt||0)>0,active=jobs.find(j=>['WAIT_ACK','ACKED','WAIT_159'].includes(j?.state))?.nick||'',primary=c.primary?.()||null;
 if(lastServerCount>=0&&fresh&&lastServerFresh&&serverCount<lastServerCount){const d=load();d.drops=Array.isArray(d.drops)?d.drops:[];d.drops.push({ts:now(),from:lastServerCount,to:serverCount,primary,active});if(d.drops.length>30)d.drops=d.drops.slice(-30);save(d);push('snapshot-drop',{from:lastServerCount,to:serverCount,active})}
 lastServerCount=serverCount;lastServerFresh=fresh;return{c,jobs,serverCount,fresh,active,primary}}
function choose(jobs){const t=now();for(const j of jobs){if(!j?.nick||!['NO_ACK','ACK_NO_159'].includes(j.state))continue;const r=retry.get(j.nick)||{count:0,nextAt:0,lastState:''};if(r.count>=2||t<r.nextAt)continue;return{j,r}}return null}
function tick(){try{const x=inspect();if(!x)return;const {c,jobs,serverCount}=x;if(busy(jobs)){lastDecision='busy';return}
 const pick=choose(jobs);if(pick){const {j,r}=pick;r.count++;r.lastState=j.state;r.nextAt=now()+(j.state==='NO_ACK'?30000:18000);retry.set(j.nick,r);lastDecision=`retry ${j.nick} ${j.state} #${r.count}`;push('retry',{nick:j.nick,state:j.state,count:r.count});c.syncOne?.(j.nick);return}
 const unresolved=jobs.some(j=>!['CONFIRMED','ID_CONFLICT'].includes(j?.state));if(unresolved&&now()-lastAutoRefresh>15000){lastAutoRefresh=now();lastDecision='refresh85';push('refresh85',{serverFriends:serverCount});c.refresh?.();return}
 lastDecision='idle';
}catch(e){push('error',{message:String(e?.message||e)})}}
function reset(nick){if(nick)retry.delete(String(nick));else retry.clear();return true}
function diagnostics(){const x=inspect(),d=load();let coreDiag=null;try{coreDiag=x?.c?.diagnostics?.()||null}catch(e){}const out={version:'10.23 QUEUE WATCH',decision:lastDecision,retries:[...retry.entries()].map(([nick,v])=>({nick,...v})),snapshotDrops:d.drops||[],history:(d.history||[]).slice(-25),serverFriends:x?.serverCount||0,active:x?.active||'',primary:x?.primary||null,core:coreDiag};console.log('[SWIR 10.23] queue watch',out);return out}
setTimeout(tick,3500);setInterval(tick,1200);
window.SWIR_QUEUE1023={version:'10.23 QUEUE WATCH',tick,reset,diagnostics};
console.log('SWIR 10.23 Queue Watch active — bounded retry + snapshot-drop diagnostics');
}catch(e){console.error('SWIR 10.23 Queue Watch',e)}})();