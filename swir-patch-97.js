/* SWIR 9.7 — MOBILE FRIEND STATE ENGINE + STABLE CHAT NEON + MOBILE BADGE */
(function(){
'use strict';
try{
  if(window._swirPatch97){console.log('SWIR 9.7 patch już aktywny');return}
  window._swirPatch97=true;
  window.SWIR_CLOUD_VERSION='9.7 MOBILE FRIEND STATE ENGINE';

  const K_STATE='swir_friend_server_state';
  const K_OFF='swir_friend_official_97';
  const K_STATS='swir_friend_protocol_stats';
  const K_LAST='swir_friend_last_seen';
  const K_IDS='swir_friend_identity_cache';
  const K_PENDING='swir_friend_pending_sync_97';
  const K_LOCAL='czateria_znajomi';
  const errors=[];
  const pendingCards=new WeakMap();
  const armedThisSession=new Set();
  const packetCounters={};
  const syncQueue=[];
  let syncBusy=false,postSync85Timer=0,last85=0,lastCode8=0;
  const MIN_85=8000,MIN_CODE8=2200;

  try{if(window._swirFriendTracker){clearInterval(window._swirFriendTracker);window._swirFriendTracker=null}}catch(e){}

  const key=n=>String(n||'').trim().toLocaleLowerCase('pl-PL');
  const uniq=a=>[...new Set((a||[]).map(x=>String(x||'').trim()).filter(Boolean))];
  const load=(k,d)=>{try{const r=localStorage.getItem(k);if(!r)return d;const v=JSON.parse(r);return v!==null&&typeof v==='object'?v:d}catch(e){return d}};
  const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const note=(where,e)=>{errors.push({time:new Date().toLocaleTimeString(),where,msg:String(e&&e.message||e)});if(errors.length>40)errors.shift();console.warn('[SWIR 9.7]',where,e)};
  const stats=patch=>{const s=load(K_STATS,{});if(patch){Object.assign(s,patch);save(K_STATS,s)}return s};
  const state=()=>{const s=load(K_STATE,{updatedAt:0,users:{}});if(!s.users||typeof s.users!=='object')s.users={};return s};
  const official=()=>{const o=load(K_OFF,{updatedAt:0,friends:{},enemies:{}});if(!o.friends||typeof o.friends!=='object')o.friends={};if(!o.enemies||typeof o.enemies!=='object')o.enemies={};return o};
  const pending=()=>{const p=load(K_PENDING,{});return p&&typeof p==='object'?p:{}};
  const localFriends=()=>{const a=load(K_LOCAL,[]);return Array.isArray(a)?a.map(x=>String(x||'').trim()).filter(Boolean):[]};
  const roomNames=a=>uniq((Array.isArray(a)?a:[]).map(r=>typeof r==='string'?r:(r&&r.name)||''));
  const identity=n=>load(K_IDS,{})[key(n)]||null;
  const officialFriend=n=>official().friends[key(n)]||null;
  const serverRec=n=>state().users[key(n)]||null;
  const serverRooms=n=>{const r=serverRec(n);return r&&Array.isArray(r.rooms)?uniq(r.rooms):[]};

  function rememberIdentity(n,id,source,mobile){
    try{
      const name=String(n||'').trim(),uid=Number(id)||0;if(!name)return;
      const ids=load(K_IDS,{}),k=key(name),old=ids[k]||{};
      if(uid>0||typeof mobile==='boolean'){
        ids[k]={nick:name,id:uid||Number(old.id)||0,ts:Date.now(),source:source||old.source||'unknown',mobile:typeof mobile==='boolean'?mobile:old.mobile};
        save(K_IDS,ids);
      }
    }catch(e){note('rememberIdentity',e)}
  }
  function rememberLast(n,rooms,id){
    try{const rs=uniq(rooms);if(!rs.length)return;const a=load(K_LAST,{});a[key(n)]={nick:String(n),room:rs[0],rooms:rs,ts:Date.now(),id:Number(id)||null};save(K_LAST,a)}catch(e){}
  }
  function setRoomRecord(n,rooms,id,source){
    try{const name=String(n||'').trim();if(!name)return;const s=state(),k=key(name),rs=uniq(rooms),old=s.users[k]||{};s.users[k]={id:Number(id)||Number(old.id)||Number(identity(name)&&identity(name).id)||null,name,rooms:rs,ts:Date.now(),source:source||old.source||''};s.updatedAt=Date.now();save(K_STATE,s);if(rs.length)rememberLast(name,rs,id);if(Number(id)>0)rememberIdentity(name,id,source);refreshPanelSoon()}catch(e){note('setRoomRecord',e)}
  }
  function addRoom(n,room,source){const name=String(n||'').trim(),r=String(room||'').trim();if(!name||!r)return;setRoomRecord(name,[...serverRooms(name),r],null,source)}
  function removeRoom(n,room,source){const name=String(n||'').trim(),r=String(room||'').trim();if(!name||!r)return;setRoomRecord(name,serverRooms(name).filter(x=>key(x)!==key(r)),null,source)}
  function clearRooms(n,source){const name=String(n||'').trim();if(!name)return;setRoomRecord(name,[],null,source)}

  function ingest156(p,source){
    try{
      const now=Date.now(),next={updatedAt:now,friends:{},enemies:{}};
      const put=(arr,isFriend)=>{(Array.isArray(arr)?arr:[]).forEach(u=>{const name=String(u&&u.name||'').trim();if(!name)return;const id=Number(u.id)||0,rec={id:id||null,name,isIgnored:!!u.isIgnored,hasPhone:!!u.hasPhone,ts:now,source};(isFriend?next.friends:next.enemies)[key(name)]=rec;rememberIdentity(name,id,'156')})};
      put(p.friends,true);put(p.enemies,false);save(K_OFF,next);
      const s=state(),seed={updatedAt:now,users:{}};
      Object.values(next.friends).forEach(f=>{const old=s.users[key(f.name)]||{};seed.users[key(f.name)]={id:f.id||old.id||null,name:f.name,rooms:Array.isArray(old.rooms)?uniq(old.rooms):[],ts:now,source:old.source||'156'}});
      save(K_STATE,seed);
      const pend=pending();let changed=false;Object.values(next.friends).forEach(f=>{const k=key(f.name);if(pend[k]&&pend[k].status!=='confirmed'){pend[k]={...pend[k],status:'confirmed',confirmedAt:now,id:f.id||pend[k].id||null};changed=true}armedThisSession.delete(k)});if(changed)save(K_PENDING,pend);
      stats({lastCode156:now,lastOfficialFriends:Object.keys(next.friends).length,lastOfficialEnemies:Object.keys(next.enemies).length,last156Source:source});
      refreshPanelSoon();return true;
    }catch(e){note('156',e);return false}
  }
  function ingest159(p,source){
    try{
      const now=Date.now(),o=official(),next={updatedAt:now,users:{}};
      Object.values(o.friends||{}).forEach(f=>{next.users[key(f.name)]={id:f.id||null,name:f.name,rooms:[],ts:now,source:'159-empty'}});
      const users=Array.isArray(p.users)?p.users:[];
      users.forEach(u=>{const name=String(u&&u.name||'').trim();if(!name)return;const id=Number(u.id)||0,rs=roomNames(u.rooms);next.users[key(name)]={id:id||null,name,rooms:rs,ts:now,source};rememberIdentity(name,id,'159');if(rs.length)rememberLast(name,rs,id);
        if(!o.friends[key(name)])o.friends[key(name)]={id:id||null,name,isIgnored:false,hasPhone:false,ts:now,source:'159'};
      });
      o.updatedAt=now;save(K_OFF,o);save(K_STATE,next);window._swirFriendServerFresh=true;
      const pend=pending();let changed=false;Object.values(next.users).forEach(f=>{const k=key(f.name);if(pend[k]&&pend[k].status!=='confirmed'){pend[k]={...pend[k],status:'confirmed',confirmedAt:now,id:f.id||pend[k].id||null};changed=true}armedThisSession.delete(k)});if(changed)save(K_PENDING,pend);
      stats({lastCode159:now,lastServerCount:users.length,lastStatus:'OK_9.7_STATE_ENGINE',last159Source:source});
      refreshPanelSoon();return true;
    }catch(e){note('159',e);return false}
  }
  function ingest163(p,source){
    try{const users=Array.isArray(p.users)?p.users:[];users.forEach(u=>{const name=String(u&&u.name||'').trim();if(!name)return;const id=Number(u.id)||0,rs=roomNames(u.rooms);setRoomRecord(name,rs,id,'163');rememberIdentity(name,id,'163')});stats({lastCode163:Date.now(),last163Source:source});return true}catch(e){note('163',e);return false}
  }

  function parse(x){try{if(!x)return null;if(typeof x==='string')return JSON.parse(x);if(typeof x.data==='string')return JSON.parse(x.data);if(x.data&&typeof x.data==='object')return x.data;if(typeof x==='object')return x}catch(e){}return null}
  function packetLogin(u){return String(u&&((u.login??u.name??u.username??u.userName))||'').trim()}
  function countPacket(code){packetCounters[code]=(packetCounters[code]||0)+1}
  function handlePacket(x,source,conn){
    const p=parse(x);if(!p)return;const code=Number(p.code);if(!Number.isFinite(code))return;countPacket(code);
    try{
      if(code===156){ingest156(p,source);return}
      if(code===157){const n=String(p.username||p.userName||'').trim(),r=String(p.roomName||roomFor(conn)||'').trim();if(n&&r)addRoom(n,r,'157');stats({lastCode157:Date.now(),last157Nick:n,last157Room:r});return}
      if(code===158){const n=String(p.username||p.userName||'').trim();if(n)clearRooms(n,'158');stats({lastCode158:Date.now(),last158Nick:n});return}
      if(code===159){ingest159(p,source);return}
      if(code===163){ingest163(p,source);return}
      if(code===183&&Array.isArray(p.cards)){pendingCards.set(conn,p.cards.map(c=>({id:Number(c&&c.uid)||0,raw:c})));stats({lastCode183:Date.now(),lastCards183:p.cards.length});return}
      if(code===132&&Array.isArray(p.users)){
        const cards=pendingCards.get(conn)||[];p.users.forEach((u,i)=>{const n=packetLogin(u),id=Number(cards[i]&&cards[i].id)||0,m=typeof u.isMobileUser==='boolean'?u.isMobileUser:undefined;if(n)rememberIdentity(n,id,'183+132',m)});setTimeout(()=>{harvestConnections();processArmedPending()},0);stats({lastCode132:Date.now(),lastUsers132:p.users.length});return
      }
      if(code===184){const n=String(p.userName||p.username||'').trim(),id=Number(p.uid||p.id)||0;if(n)rememberIdentity(n,id,'184');setTimeout(()=>{harvestConnections();processArmedPending()},0);stats({lastCode184:Date.now(),last184Nick:n});return}
      if(code===128){setTimeout(()=>{harvestConnections();processArmedPending()},0);stats({lastCode128:Date.now()});return}
      if(code===130){const n=String(p.login||p.username||'').trim(),r=roomFor(conn);if(n&&r&&officialFriend(n))removeRoom(n,r,'130');stats({lastCode130:Date.now(),last130Nick:n,last130Room:r});return}
    }catch(e){note('packet '+code,e)}
  }

  function connections(){
    const z=new Set();try{if(!window.CHNS||!CHNS.connManager)return[];
      try{const c=CHNS.connManager.getFirstConnection&&CHNS.connManager.getFirstConnection();if(c)z.add(c)}catch(e){}
      try{const c=CHNS.connManager.getCurrentConnection&&CHNS.connManager.getCurrentConnection();if(c)z.add(c)}catch(e){}
      try{const chs=CHNS.channelManager&&CHNS.channelManager.channels||{};Object.keys(chs).forEach(k=>{try{const ch=chs[k],id=ch&&ch.getChannelId&&ch.getChannelId(),c=id!=null&&CHNS.connManager.getConnectionRelatedWithId&&CHNS.connManager.getConnectionRelatedWithId(id);if(c)z.add(c)}catch(e){}})}catch(e){}
    }catch(e){note('connections',e)}return[...z]
  }
  function openConn(c){return!!(c&&c.webSocket&&Number(c.webSocket.readyState)===1)}
  function channelFor(c){try{if(c&&c.channelMain)return c.channelMain;const id=c&&c.getChannelId&&c.getChannelId();if(id!=null&&CHNS.channelManager&&CHNS.channelManager.getChannelsRelatedWithId){const a=CHNS.channelManager.getChannelsRelatedWithId(id)||[];return a.find(ch=>ch&&ch.isRoom&&ch.isRoom())||a[0]||null}}catch(e){}return null}
  function roomFor(c){try{const ch=channelFor(c);if(ch&&typeof ch.isRoom==='function'&&!ch.isRoom())return'';if(ch&&typeof ch.getChannelName==='function')return String(ch.getChannelName()||'').trim();if(c&&c.channelName)return String(c.channelName).trim()}catch(e){}return''}
  function userId(u){let id=0;try{id=Number(u&&u.getUcUserId&&u.getUcUserId())||0}catch(e){}if(!id)try{id=Number(u&&u.userCardData&&u.userCardData.getUid&&u.userCardData.getUid())||0}catch(e){}return id}
  function userMobile(u){try{return!!(u&&typeof u.isMobile==='function'&&u.isMobile())}catch(e){return false}}
  function harvestUser(u,room,source){try{if(!u)return;const n=String(u.getLogin&&u.getLogin()||u.login||'').trim();if(!n)return;const id=userId(u),mob=userMobile(u);rememberIdentity(n,id,source,mob);if(id>0&&room)rememberLast(n,[room],id)}catch(e){}}
  function harvestConnections(){
    try{connections().forEach(c=>{const r=roomFor(c);['meList','closestList','adminsList','honoursList','registeredList','ordinaryList'].forEach(k=>{const a=c&&c[k];if(Array.isArray(a))a.forEach(u=>harvestUser(u,r,'connection.'+k))});localFriends().forEach(n=>{try{const u=c&&c.getUserWithName&&c.getUserWithName(n);if(u)harvestUser(u,r,'getUserWithName')}catch(e){}})})}catch(e){note('harvest',e)}
  }
  function hook(c){try{if(!c||!c.webSocket)return;const w=c.webSocket;if(w._swir97)return;w._swir97=true;w.addEventListener('message',e=>handlePacket(e,'websocket97',c));}catch(e){note('hook',e)}}
  function installHooks(){connections().forEach(hook);harvestConnections()}
  function liveUser(nick){const n=String(nick||'').trim();for(const c of connections())try{const u=c&&c.getUserWithName&&c.getUserWithName(n);if(u){const id=userId(u),room=roomFor(c);rememberIdentity(n,id,'liveUser',userMobile(u));return{user:u,connection:c,id,room}}}catch(e){}return null}
  function visibleRooms(nick){const rs=[];for(const c of connections())try{const u=c&&c.getUserWithName&&c.getUserWithName(nick);if(u){const r=roomFor(c);if(r)rs.push(r)}}catch(e){}return uniq(rs)}
  function meRegistered(){try{const m=CHNS&&CHNS.connManager&&CHNS.connManager.getMeUser&&CHNS.connManager.getMeUser();return!!(m&&m.isRegistered&&m.isRegistered())}catch(e){return false}}

  function sendNormal(packet){
    try{installHooks();const c=connections().find(openConn)||connections()[0];if(!c||typeof c.send!=='function')return{ok:false,reason:'no-connection'};const ok=c.send(JSON.stringify(packet))===true;return{ok,reason:ok?'ok':'connection-refused',connection:c}}catch(e){note('sendNormal',e);return{ok:false,reason:e.message||'error'}}
  }
  function request85(feedback,opts){
    const say=typeof feedback==='function'?feedback:()=>{},o=opts||{};
    try{const now=Date.now(),remain=MIN_85-(now-last85);if(remain>0&&!o.force){say('⏳ Odświeżenie APP za '+Math.ceil(remain/1000)+' s.');return false}const r=sendNormal({code:85});if(!r.ok){say('⏳ Connection.send nie wysłał 85 ('+r.reason+'). Nie używam obejścia WebSocket.');return false}last85=now;stats({lastCode85:now,last85Reason:o.reason||'manual',last85Transport:'Connection.send'});if(!o.quiet)say('📡 85 wysłane. Czekam na stan 159 i zdarzenia 157/158…');return true}catch(e){note('85',e);say('Błąd 85: '+e.message);return false}
  }

  function pendingSet(nick,patch,arm){const n=String(nick||'').trim();if(!n)return;const p=pending(),k=key(n),old=p[k]||{nick:n,requestedAt:Date.now(),status:'waiting'};p[k]={...old,...patch,nick:n,updatedAt:Date.now()};save(K_PENDING,p);if(arm)armedThisSession.add(k);refreshPanelSoon()}
  function pendingDel(nick){const p=pending(),k=key(nick);if(p[k]){delete p[k];save(K_PENDING,p)}armedThisSession.delete(k)}
  function queueSync(nick,reason){
    const n=String(nick||'').trim(),k=key(n);if(!n||officialFriend(n))return false;if(!armedThisSession.has(k))return false;
    const pe=pending()[k];if(pe&&['sent','confirmed','error'].includes(pe.status))return false;
    harvestConnections();const live=liveUser(n),id=Number(live&&live.id||identity(n)&&identity(n).id)||0;
    if(!id){pendingSet(n,{status:'waiting-id',reason:reason||'waiting',id:null},true);return false}
    if(syncQueue.some(x=>key(x.nick)===k)||syncBusy&&window.__swir97SyncingKey===k)return true;
    pendingSet(n,{status:'queued',reason:reason||'queued',id},true);syncQueue.push({nick:n,id});pumpSyncQueue();return true
  }
  function pumpSyncQueue(){
    if(syncBusy||!syncQueue.length)return;const wait=Math.max(0,MIN_CODE8-(Date.now()-lastCode8));syncBusy=true;
    setTimeout(()=>{const item=syncQueue.shift();if(!item){syncBusy=false;return}const n=item.nick,k=key(n);window.__swir97SyncingKey=k;
      try{
        if(officialFriend(n)){pendingSet(n,{status:'confirmed',confirmedAt:Date.now()},false);armedThisSession.delete(k)}else if(!meRegistered()){pendingSet(n,{status:'error',error:'APP Sync wymaga zarejestrowanego nicka'},false)}else{
          const currentId=Number(identity(n)&&identity(n).id)||Number(item.id)||0;
          if(!currentId){pendingSet(n,{status:'waiting-id'},true)}else{
            const r=sendNormal({code:8,subcode:4,userId:currentId,username:n,isFriend:true});
            if(r.ok){lastCode8=Date.now();pendingSet(n,{status:'sent',id:currentId,sentAt:lastCode8,error:null},false);stats({lastCode8Add:lastCode8,lastCode8Nick:n,lastCode8UserId:currentId,lastCode8Transport:'Connection.send'});schedulePostSync85()}
            else pendingSet(n,{status:'error',id:currentId,error:'Connection.send: '+r.reason},false);
          }
        }
      }catch(e){note('code8',e);pendingSet(n,{status:'error',error:String(e.message||e)},false)}
      window.__swir97SyncingKey='';syncBusy=false;setTimeout(pumpSyncQueue,MIN_CODE8);
    },wait)
  }
  function schedulePostSync85(){clearTimeout(postSync85Timer);postSync85Timer=setTimeout(()=>request85(null,{force:true,quiet:true,reason:'after-user-sync'}),3800)}
  function processArmedPending(){for(const k of [...armedThisSession]){const p=pending()[k];if(!p){armedThisSession.delete(k);continue}if(officialFriend(p.nick)){pendingSet(p.nick,{status:'confirmed',confirmedAt:Date.now()},false);armedThisSession.delete(k);continue}if(['sent','queued','error'].includes(p.status))continue;if(identity(p.nick)&&Number(identity(p.nick).id))queueSync(p.nick,'ID became available')}}
  function armSync(nick,feedback){const say=typeof feedback==='function'?feedback:()=>{},n=String(nick||'').trim();if(!n)return false;if(officialFriend(n)){say('✅ '+n+' jest już na liście APP.');return true}if(!meRegistered()){say('⚠️ APP Sync wymaga zarejestrowanego własnego nicka.');return false}pendingSet(n,{status:'waiting-id',requestedAt:Date.now(),error:null},true);harvestConnections();const id=Number(identity(n)&&identity(n).id)||0;if(id){queueSync(n,'user action');say('☁️ '+n+': ID '+id+' znalezione — wysyłam jedno normalne „Dodaj znajomego”.')}else say('🔑 '+n+': zapisane do synchronizacji. ID pojawi się dopiero, gdy normalny klient pozna użytkownika w otwartym pokoju/privie.');return true}
  function syncAll(feedback){const say=typeof feedback==='function'?feedback:()=>{};let ready=0,wait=0,already=0;harvestConnections();localFriends().forEach(n=>{if(officialFriend(n)){already++;return}pendingSet(n,{status:'waiting-id',requestedAt:Date.now(),error:null},true);if(identity(n)&&Number(identity(n).id)){queueSync(n,'sync all');ready++}else wait++});say(`☁ APP 9.7: kolejka ${ready}, czeka na ID ${wait}, już APP ${already}. Pakiety idą pojedynczo z przerwą.`);return{ready,wait,already}}

  let knownLocal=new Set(localFriends().map(key));
  function monitorLocalList(){
    try{const now=localFriends(),cur=new Set(now.map(key));now.forEach(n=>{const k=key(n);if(!knownLocal.has(k)){pendingSet(n,{status:'waiting-id',requestedAt:Date.now(),reason:'local-list-add'},true);harvestConnections();queueSync(n,'local friend added')}});for(const k of knownLocal)if(!cur.has(k)){const p=pending();if(p[k]&&p[k].status!=='sent'&&p[k].status!=='confirmed'){delete p[k];save(K_PENDING,p)}armedThisSession.delete(k)}knownLocal=cur}catch(e){note('monitorLocal',e)}
  }

  function patchRadarApi(){try{const a=window.SWIR_FRIEND_RADAR;if(!a)return;a.requestServerState=(fb)=>request85(fb,{reason:'api'});a.serverRooms=serverRooms;a.serverState=state;a.isOfficialFriend=n=>!!officialFriend(n);a.addToOfficialApp=armSync;a.syncVisibleLocal=syncAll;a.identity=identity;a.visibleRooms=n=>uniq([...serverRooms(n),...visibleRooms(n)]);a.refreshAll=()=>{installHooks();harvestConnections()};a.diagnostics=diagnostics}catch(e){note('patchRadarApi',e)}}

  let panelTimer=0;
  function refreshPanelSoon(){clearTimeout(panelTimer);panelTimer=setTimeout(()=>{const p=document.getElementById('friends-panel');if(p&&p.dataset.swir97==='1')renderPanel(p)},90)}
  function formatLast(n){const x=load(K_LAST,{})[key(n)];if(!x||!x.ts)return'';return '🕘 '+(x.rooms&&x.rooms.length?x.rooms.join(', '):x.room||'—')+' • '+new Date(x.ts).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}
  function friendType(n){const local=localFriends().some(x=>key(x)===key(n)),app=!!officialFriend(n);return app&&local?'APP + SWIR':app?'APP':'SWIR'}
  function friendStatus(n){const srv=serverRooms(n);if(srv.length)return'📡 APP: '+srv.join(', ');const vis=visibleRooms(n);if(vis.length)return'✅ PC: '+vis.join(', ');if(officialFriend(n))return'⚪ APP: brak aktywnego pokoju';const p=pending()[key(n)];if(p){if(p.status==='waiting-id')return'🔑 Czekam na ID użytkownika';if(p.status==='queued')return'☁ APP: w kolejce';if(p.status==='sent')return'☁ APP: wysłano, czekam na potwierdzenie serwera';if(p.status==='error')return'⚠️ APP Sync: '+(p.error||'błąd')}
    return formatLast(n)||'○ SWIR lokalny — brak globalnych danych'}
  function allNames(){const m=new Map();localFriends().forEach(n=>m.set(key(n),n));Object.values(official().friends||{}).forEach(x=>x&&x.name&&m.set(key(x.name),x.name));Object.values(state().users||{}).forEach(x=>x&&x.name&&m.set(key(x.name),x.name));return[...m.values()].sort((a,b)=>a.localeCompare(b,'pl'))}
  function panelSummary(){const o=official(),s=state(),st=stats(),p=pending();return `APP: ${Object.keys(o.friends).length} • rooms-state: ${Object.keys(s.users).length} • SWIR: ${localFriends().length} • ID: ${Object.keys(load(K_IDS,{})).length} • pending: ${Object.values(p).filter(x=>x&&['waiting-id','queued','sent'].includes(x.status)).length} • 159: ${st.lastCode159?new Date(st.lastCode159).toLocaleTimeString():'—'}`}
  function renderPanel(p){
    try{const list=p.querySelector('#swir97List'),proto=p.querySelector('#swir97Proto');if(!list||!proto)return;
      proto.innerHTML='<b style="color:#8ff0c7">MOBILE STATE ENGINE 9.7</b> • 156 lista+ID • 159 snapshot pokoi • 157 wejście • 130 wyjście z pokoju • 158 wylogowanie<br><span style="color:#7890a7">'+esc(panelSummary())+'</span><br><span style="color:#6f8297">Sieć: tylko akcja użytkownika. Bez code86 dla zwykłego konta i bez direct WebSocket.</span>';
      list.innerHTML='';const names=allNames();if(!names.length){list.innerHTML='<div style="padding:24px 8px;text-align:center;color:#91a5b8">Brak znajomych. Dodaj nick poniżej albo odśwież APP.</div>';return}
      names.forEach(n=>{const type=friendType(n),id=Number(identity(n)&&identity(n).id)||Number(officialFriend(n)&&officialFriend(n).id)||0,mob=identity(n)&&identity(n).mobile===true;
        const row=document.createElement('div');row.style.cssText='display:flex;align-items:flex-start;gap:8px;padding:9px 3px;border-bottom:1px solid rgba(255,255,255,.06)';
        const box=document.createElement('div');box.style.cssText='min-width:0;flex:1';
        const name=document.createElement('div');name.style.cssText='font-weight:800;color:#eef7ff;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';name.innerHTML=esc(n)+(mob?' <span title="Użytkownik mobilny" style="opacity:.7;font-size:9px">📱</span>':'')+' <span style="font-size:9px;color:'+(type.includes('APP')?'#79e7b7':'#70c9ff')+';border:1px solid rgba(120,220,200,.22);padding:1px 4px;border-radius:5px">'+esc(type)+'</span>'+(id?' <span style="font-size:9px;color:#758ba0">ID '+id+'</span>':'');
        const loc=document.createElement('div');loc.style.cssText='font-size:10px;color:#8298ad;margin-top:3px;line-height:1.35';loc.textContent=friendStatus(n);box.appendChild(name);box.appendChild(loc);
        const actions=document.createElement('div');actions.style.cssText='display:flex;gap:4px;flex-wrap:nowrap';
        const find=document.createElement('button');find.textContent='🔍';find.title='Pokaż dane Radaru';find.style.cssText='padding:4px 6px;background:#142033;border:1px solid #254b66;color:#fff;border-radius:7px;cursor:pointer';find.onclick=()=>{loc.textContent=friendStatus(n)};actions.appendChild(find);
        if(type.includes('SWIR')&&!type.includes('APP')){const cloud=document.createElement('button');cloud.textContent='☁';cloud.title='Synchronizuj do normalnej listy APP';cloud.style.cssText='padding:4px 6px;background:#10231d;border:1px solid #2a7457;color:#a6f5cf;border-radius:7px;cursor:pointer';cloud.onclick=()=>armSync(n,m=>{loc.textContent=m;setTimeout(()=>renderPanel(p),500)});actions.appendChild(cloud)}
        if(localFriends().some(x=>key(x)===key(n))){const del=document.createElement('button');del.textContent='❌';del.title='Usuń tylko z lokalnej listy SWIR';del.style.cssText='padding:4px 6px;background:#24151c;border:1px solid #6b2b3b;color:#ff9baa;border-radius:7px;cursor:pointer';del.onclick=()=>{const arr=localFriends().filter(x=>key(x)!==key(n));save(K_LOCAL,arr);pendingDel(n);knownLocal=new Set(arr.map(key));renderPanel(p)};actions.appendChild(del)}
        row.appendChild(box);row.appendChild(actions);list.appendChild(row)
      });
      const t=p.querySelector('#swir97Title');if(t)t.textContent='🧑‍🤝‍🧑 Znajomi — RADAR 9.7';
    }catch(e){note('renderPanel',e)}
  }
  function openPanel(){
    try{let old=document.getElementById('friends-panel');if(old){old.remove();return}installHooks();harvestConnections();
      const f=document.getElementById('friends'),br=f?f.getBoundingClientRect():{right:window.innerWidth-10,bottom:40};const p=document.createElement('div');p.id='friends-panel';p.dataset.swir97='1';p.className='swir-ui';p.style.cssText=`position:absolute;width:455px;max-width:95vw;height:540px;background:linear-gradient(180deg,#101928,#0b1320);border:1px solid var(--swir-a,#00e5ff);border-radius:14px;padding:11px;overflow-y:auto;right:${Math.max(8,window.innerWidth-br.right)}px;top:${br.bottom+6}px;z-index:999999;box-shadow:0 18px 50px rgba(0,0,0,.48),0 0 22px rgba(var(--swir-rgb,0,229,255),.14);color:#eef7ff`;
      p.innerHTML='<div style="display:flex;align-items:center;gap:6px;margin-bottom:9px"><div id="swir97Title" style="font-weight:800;color:var(--swir-a,#00e5ff);font-size:15px;flex:1">🧑‍🤝‍🧑 Znajomi — RADAR 9.7</div><button id="swir97Sync" title="Synchronizuj SWIR → APP" style="background:#10231d;border:1px solid #2a7457;color:#a6f5cf;border-radius:8px;padding:5px 8px;cursor:pointer">☁ APP</button><button id="swir97Refresh" title="Odśwież globalny stan APP" style="background:#10261f;border:1px solid #2b6a55;color:#88f5c7;border-radius:8px;padding:5px 8px;cursor:pointer">📡</button><button id="swir97Close" style="background:#142033;border:1px solid #33445a;color:#fff;border-radius:8px;padding:5px 8px;cursor:pointer">✕</button></div><div id="swir97Proto" style="font-size:10px;color:#8aa0b5;margin-bottom:10px;padding:7px 8px;border-radius:8px;background:#08111c;border:1px solid rgba(255,255,255,.055);line-height:1.45"></div><div id="swir97List"></div><div style="display:flex;gap:6px;position:sticky;bottom:-11px;background:#0b1320;padding:10px 0 2px;margin-top:8px"><input id="swir97AddInput" type="text" placeholder="Dodaj nick do SWIR" style="flex:1;min-width:0;padding:7px 9px;background:#08111c;border:1px solid rgba(var(--swir-rgb,0,229,255),.25);color:#fff;border-radius:8px;outline:none"><button id="swir97Add" style="padding:7px 10px;background:#142033;border:1px solid var(--swir-a,#00e5ff);color:#eaffff;border-radius:8px;cursor:pointer;font-weight:700">➕ Dodaj</button></div>';
      document.body.appendChild(p);renderPanel(p);
      p.querySelector('#swir97Close').onclick=()=>p.remove();
      p.querySelector('#swir97Refresh').onclick=()=>request85(m=>{const x=p.querySelector('#swir97Proto');if(x)x.innerHTML='<b style="color:#8ff0c7">'+esc(m)+'</b><br><span style="color:#7890a7">'+esc(panelSummary())+'</span>';setTimeout(()=>renderPanel(p),1200)},{reason:'panel-refresh'});
      p.querySelector('#swir97Sync').onclick=()=>syncAll(m=>{const x=p.querySelector('#swir97Proto');if(x)x.innerHTML='<b style="color:#a6f5cf">'+esc(m)+'</b><br><span style="color:#7890a7">'+esc(panelSummary())+'</span>';setTimeout(()=>renderPanel(p),500)});
      const inp=p.querySelector('#swir97AddInput'),add=()=>{const n=inp.value.trim();if(!n)return;const arr=localFriends();if(!arr.some(x=>key(x)===key(n))){arr.push(n);save(K_LOCAL,arr)}knownLocal.add(key(n));inp.value='';armSync(n,m=>{const x=p.querySelector('#swir97Proto');if(x)x.innerHTML='<b style="color:#9fd8ff">'+esc(m)+'</b><br><span style="color:#7890a7">'+esc(panelSummary())+'</span>';renderPanel(p)})};p.querySelector('#swir97Add').onclick=add;inp.addEventListener('keydown',e=>{if(e.key==='Enter')add()});
      request85(null,{reason:'panel-open',quiet:true});
    }catch(e){note('openPanel',e)}
  }
  const friendsClick97=e=>{try{e&&e.preventDefault();openPanel()}catch(x){note('friends click',x)}};
  function installFriendButton(){try{const f=document.getElementById('friends');if(!f)return;f.dataset.swir97='1';f.value='Znajomi';if(f.onclick!==friendsClick97)f.onclick=friendsClick97}catch(e){}}

  const COLORS=['#63DDF5','#7BE6A2','#F18BC5','#F1CC72','#B8A3EF','#F39B74','#72C9F2','#F08394','#A8DD7C','#91A9E9','#D99BE9','#75D9BD'];
  function hashName(n){let h=2166136261>>>0;for(const ch of String(n||'').toLocaleLowerCase('pl-PL')){h^=ch.codePointAt(0);h=Math.imul(h,16777619)}return h>>>0}
  function nickColor(n){return COLORS[hashName(n)%COLORS.length]}
  function nickText(el){return String(el&&el.textContent||'').replace(/[:\s]+$/,'').trim()}
  function getUser(n){for(const c of connections())try{const u=c&&c.getUserWithName&&c.getUserWithName(n);if(u)return u}catch(e){}return null}
  function isMobile(n){try{const u=getUser(n);if(u&&typeof u.isMobile==='function')return!!u.isMobile();const x=identity(n);return!!(x&&x.mobile===true)}catch(e){return false}}
  function addMobileBadge(el,n){try{if(!isMobile(n))return;if(el.nextElementSibling&&el.nextElementSibling.classList.contains('swir-mobile-badge-97'))return;const b=document.createElement('span');b.className='swir-mobile-badge-97';b.textContent='📱';b.title='Użytkownik mobilny';el.insertAdjacentElement('afterend',b)}catch(e){}}
  function decorateNick(el){if(!el||el.dataset.swirChatNick97==='1')return;const n=nickText(el);if(!n)return;const c=nickColor(n);el.dataset.swirChatNick97='1';el.style.setProperty('--swir-chat-nick97',c);el.style.setProperty('--swir-chat-glow97',c+'30');addMobileBadge(el,n)}
  function decorateNode(node){try{if(!node||node.nodeType!==1)return;if(node.matches&&node.matches('[id^="m-messages_"] .m-msg-item-user-login'))decorateNick(node);node.querySelectorAll&&node.querySelectorAll('[id^="m-messages_"] .m-msg-item-user-login:not([data-swir-chat-nick97])').forEach(decorateNick)}catch(e){}}
  function decorateExisting(){document.querySelectorAll('[id^="m-messages_"] .m-msg-item-user-login:not([data-swir-chat-nick97])').forEach(decorateNick)}
  function refreshMobileBadges(){document.querySelectorAll('[id^="m-messages_"] .m-msg-item-user-login[data-swir-chat-nick97]').forEach(el=>addMobileBadge(el,nickText(el)))}
  function installNickCss(){
    ['swir-chat-nicks-95','swir-chat-nicks-96'].forEach(id=>document.getElementById(id)?.remove());
    document.querySelectorAll('[data-swir-chat-nick95],[data-swir-chat-nick96]').forEach(el=>{el.removeAttribute('data-swir-chat-nick95');el.removeAttribute('data-swir-chat-nick96');el.style.removeProperty('color');el.style.removeProperty('font-weight');el.style.removeProperty('text-shadow')});
    document.querySelectorAll('.swir-mobile-badge-96').forEach(x=>x.remove());
    if(document.getElementById('swir-chat-nicks-97'))return;const st=document.createElement('style');st.id='swir-chat-nicks-97';st.textContent=`[id^="m-messages_"] .m-msg-item-user-login[data-swir-chat-nick97="1"]{color:var(--swir-chat-nick97)!important;font-weight:750!important;text-shadow:0 0 3px var(--swir-chat-glow97)!important;animation:none!important;transition:none!important;filter:none!important}[id^="m-messages_"] .swir-mobile-badge-97{font-size:9px!important;opacity:.62!important;margin-left:3px!important;margin-right:2px!important;vertical-align:1px!important;text-shadow:none!important;animation:none!important;filter:none!important;color:inherit!important}`;document.head.appendChild(st)
  }
  function polishMod(){try{const p=document.getElementById('configPanel');if(!p)return;const h=p.querySelector('h2 span:first-child');if(h&&!h.dataset.swir97){h.dataset.swir97='1';h.innerHTML='<span style="display:inline-flex;align-items:center;gap:6px;white-space:nowrap"><b style="color:var(--swir-a,#00f5ff);text-shadow:0 0 6px rgba(0,245,255,.22)">SWIR //</b><span>Czateria MOD by Swir</span><span style="font-size:10px;color:#7f94aa">v9.7</span></span><span class="swir-ui-badge">GAMING UI</span>'}}catch(e){note('mod',e)}}

  function diagnostics(){
    installHooks();harvestConnections();const o=official(),s=state(),st=stats(),ids=load(K_IDS,{}),p=pending(),loc=localFriends();
    const d={version:'9.7 MOBILE FRIEND STATE ENGINE',networkMode:'USER ACTION + live incoming events',connections:connections().length,openSockets:connections().filter(openConn).length,localFriends:loc.length,officialFriends:Object.keys(o.friends).length,officialEnemies:Object.keys(o.enemies).length,serverRoomRecords:Object.keys(s.users).length,cachedIds:Object.keys(ids).length,pendingSync:Object.values(p).filter(x=>x&&['waiting-id','queued','sent'].includes(x.status)).length,last156:st.lastCode156?new Date(st.lastCode156).toLocaleTimeString():'—',last157:st.lastCode157?new Date(st.lastCode157).toLocaleTimeString():'—',last158:st.lastCode158?new Date(st.lastCode158).toLocaleTimeString():'—',last159:st.lastCode159?new Date(st.lastCode159).toLocaleTimeString():'—',last85:st.lastCode85?new Date(st.lastCode85).toLocaleTimeString():'—',lastCode8:st.lastCode8Add?new Date(st.lastCode8Add).toLocaleTimeString():'—',mobileBadges:document.querySelectorAll('.swir-mobile-badge-97').length,errors:errors.length};
    console.table(d);console.table(loc.map(n=>({nick:n,id:Number(identity(n)&&identity(n).id)||'—',type:friendType(n),rooms:serverRooms(n).join(', ')||visibleRooms(n).join(', ')||'—',pending:(p[key(n)]&&p[key(n)].status)||'—'})));console.table(Object.entries(packetCounters).map(([code,count])=>({code,count})));return d
  }
  window.SWIR_RADAR_DEBUG97={diagnostics,official,state,pending,ids:()=>load(K_IDS,{}),request85:(fb)=>request85(fb,{reason:'debug-manual'}),sync:syncAll,addOfficial:armSync,rooms:serverRooms,visibleRooms,errors,packetCounters};

  installHooks();patchRadarApi();installNickCss();decorateExisting();installFriendButton();polishMod();
  setInterval(()=>{installHooks();patchRadarApi();installFriendButton();monitorLocalList();processArmedPending();refreshMobileBadges();polishMod()},2500);
  const mo=new MutationObserver(ms=>{ms.forEach(m=>m.addedNodes&&m.addedNodes.forEach(decorateNode));clearTimeout(window._swir97UiTimer);window._swir97UiTimer=setTimeout(()=>{installFriendButton();polishMod();refreshPanelSoon()},150)});mo.observe(document.body,{childList:true,subtree:true});
  console.log('✅ SWIR 9.7 aktywny — MOBILE FRIEND STATE ENGINE (156/157/158/159 + 130), bez polling-floodu');
}catch(e){console.error('SWIR 9.7 fatal',e)}
})();
