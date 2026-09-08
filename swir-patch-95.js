/* SWIR 9.5 — FRIEND RADAR REAL SYNC + CHAT-ONLY NEON NICKS + UI FIX */
(function(){
'use strict';
try{
  if(window._swirPatch95){ console.log('SWIR 9.5 patch już aktywny'); return; }
  window._swirPatch95=true;
  window.SWIR_CLOUD_VERSION='9.5 FRIEND RADAR REAL SYNC + CHAT NEON';

  const K_STATE='swir_friend_server_state';
  const K_STATS='swir_friend_protocol_stats';
  const K_LAST='swir_friend_last_seen';
  const K_IDS='swir_friend_identity_cache';
  const K_LOCAL='czateria_znajomi';
  const errors=[];
  const pendingCards=new WeakMap();
  const attempts=new Map();
  let last85=0;
  let lastAuto=0;

  const key=n=>String(n||'').trim().toLocaleLowerCase('pl-PL');
  const uniq=a=>[...new Set((a||[]).filter(Boolean))];
  const load=(k,d)=>{try{const raw=localStorage.getItem(k);if(!raw)return d;const v=JSON.parse(raw);return v!==null&&typeof v==='object'?v:d}catch(e){return d}};
  const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
  const roomNames=a=>uniq((Array.isArray(a)?a:[]).map(r=>typeof r==='string'?r:(r&&r.name)||'').map(x=>String(x).trim()).filter(Boolean));
  const state=()=>{const s=load(K_STATE,{updatedAt:0,users:{}});if(!s.users||typeof s.users!=='object')s.users={};return s};
  const stats=p=>{const s=load(K_STATS,{});if(p){Object.assign(s,p);save(K_STATS,s)}return s};
  function note(where,e){errors.push({time:new Date().toLocaleTimeString(),where,msg:String(e&&e.message||e)});if(errors.length>40)errors.shift();console.warn('[SWIR 9.5]',where,e)}
  function localFriends(){const x=load(K_LOCAL,[]);return Array.isArray(x)?x.filter(Boolean):[]}
  function rec(n){return state().users[key(n)]||null}
  function serverRooms(n){const r=rec(n);return r&&Array.isArray(r.rooms)?uniq(r.rooms):[]}
  function identity(n){const x=load(K_IDS,{});return x[key(n)]||null}
  function remember(n,rs,id,source){
    try{
      const name=String(n||'').trim();if(!name)return;
      const k=key(name),now=Date.now();
      if(rs&&rs.length){const a=load(K_LAST,{});a[k]={nick:name,room:rs[0],rooms:uniq(rs),ts:now,id:Number(id)||null};save(K_LAST,a)}
      if(Number(id)>0){const ids=load(K_IDS,{});ids[k]={nick:name,id:Number(id),ts:now,source:source||'unknown'};save(K_IDS,ids)}
    }catch(e){note('remember',e)}
  }

  function ingestFriends(packet,source){
    try{
      if(!packet||!Array.isArray(packet.users)||![159,163].includes(Number(packet.code)))return false;
      const now=Date.now();
      const s=Number(packet.code)===159?{updatedAt:now,users:{}}:state();
      packet.users.forEach(u=>{
        if(!u||!u.name)return;
        const rs=roomNames(u.rooms),id=Number(u.id)||null;
        s.users[key(u.name)]={id,name:String(u.name),rooms:rs,ts:now};
        remember(u.name,rs,id,'code'+packet.code);
      });
      s.updatedAt=now;save(K_STATE,s);window._swirFriendServerFresh=true;
      stats(Number(packet.code)===159?{lastCode159:now,lastServerCount:Object.keys(s.users).length,lastStatus:'OK_9.5',captureSource:source}:{lastCode163:now,last163Source:source});
      try{window.dispatchEvent(new CustomEvent('swir-friends-updated',{detail:{source:'swir95',count:Object.keys(s.users).length}}))}catch(e){}
      refreshFriendPanel();
      return true;
    }catch(e){note('ingestFriends',e);return false}
  }

  function parse(x){try{if(!x)return null;if(typeof x==='string')return JSON.parse(x);if(typeof x.data==='string')return JSON.parse(x.data);if(x.data&&typeof x.data==='object')return x.data;if(typeof x==='object')return x}catch(e){}return null}
  function packetLogin(u){return String(u&&((u.login??u.name??u.username??u.userName))||'').trim()}
  function handlePacket(x,src,conn){
    const p=parse(x);if(!p)return;
    const code=Number(p.code);
    if(code===159||code===163){ingestFriends(p,src);return}
    /* Web: 183 = cards[], potem 132 = users[]. Elementy są sparowane indeksami. */
    if(code===183&&Array.isArray(p.cards)){
      try{pendingCards.set(conn,p.cards.map(c=>Number(c&&c.uid)||0));stats({lastCode183:Date.now(),lastCards183:p.cards.length})}catch(e){note('183',e)}
      return;
    }
    if(code===132&&Array.isArray(p.users)){
      try{
        const cards=pendingCards.get(conn)||[];
        p.users.forEach((u,i)=>{const n=packetLogin(u),id=Number(cards[i])||0;if(n&&id>0)remember(n,[],id,'183+132')});
        setTimeout(()=>harvestConnections(),0);
      }catch(e){note('132',e)}
      return;
    }
    /* 184 = pojedyncza karta użytkownika: userName + uid. */
    if(code===184){
      try{const n=String(p.userName||p.username||'').trim(),id=Number(p.uid)||0;if(n&&id>0)remember(n,[],id,'184')}catch(e){note('184',e)}
    }
  }

  function connections(){
    const z=new Set();
    try{
      if(!window.CHNS||!CHNS.connManager)return [];
      try{const c=CHNS.connManager.getFirstConnection&&CHNS.connManager.getFirstConnection();if(c)z.add(c)}catch(e){}
      try{const c=CHNS.connManager.getCurrentConnection&&CHNS.connManager.getCurrentConnection();if(c)z.add(c)}catch(e){}
      try{const chans=CHNS.channelManager&&CHNS.channelManager.channels||{};Object.keys(chans).forEach(k=>{try{const ch=chans[k],id=ch&&ch.getChannelId&&ch.getChannelId(),c=id!=null&&CHNS.connManager.getConnectionRelatedWithId&&CHNS.connManager.getConnectionRelatedWithId(id);if(c)z.add(c)}catch(e){}})}catch(e){}
      try{document.querySelectorAll('[id^="m-users_"]').forEach(el=>{const h=String(el.id||'').replace(/^m-users_/,'');try{const ch=CHNS.channelManager.getChannelRelatedWithNameHash&&CHNS.channelManager.getChannelRelatedWithNameHash(h),id=ch&&ch.getChannelId&&ch.getChannelId(),c=id!=null&&CHNS.connManager.getConnectionRelatedWithId&&CHNS.connManager.getConnectionRelatedWithId(id);if(c)z.add(c)}catch(e){}})}catch(e){}
    }catch(e){note('connections',e)}
    return [...z];
  }
  function roomNameForConn(c){try{return String(c.channelName||c.getChannelName&&c.getChannelName()||'').trim()}catch(e){return ''}}
  function userIdFromObj(u){
    let id=0;
    try{id=Number(u&&u.getUcUserId&&u.getUcUserId())||0}catch(e){}
    if(!id)try{id=Number(u&&u.userCardData&&u.userCardData.getUid&&u.userCardData.getUid())||0}catch(e){}
    return id;
  }
  function harvestUser(u,room,src){
    try{if(!u)return;const n=String(u.getLogin&&u.getLogin()||u.login||'').trim();if(!n)return;const id=userIdFromObj(u);if(id>0)remember(n,room?[room]:[],id,src)}catch(e){}
  }
  function harvestConnections(){
    try{
      connections().forEach(c=>{
        const r=roomNameForConn(c);
        ['meList','closestList','adminsList','honoursList','registeredList','ordinaryList'].forEach(k=>{const a=c&&c[k];if(Array.isArray(a))a.forEach(u=>harvestUser(u,r,'connection.'+k))});
        localFriends().forEach(n=>{try{const u=c&&c.getUserWithName&&c.getUserWithName(n);if(u)harvestUser(u,r,'getUserWithName')}catch(e){}});
      });
    }catch(e){note('harvest',e)}
  }
  function hook(c){
    try{
      if(!c)return;
      const w=c.webSocket;
      if(w&&!w._swir95){w._swir95=true;w.addEventListener('message',e=>handlePacket(e,'websocket95',c))}
      if(typeof c.processMessage==='function'&&!c._swir95){const old=c.processMessage;c.processMessage=function(e){try{handlePacket(e,'processMessage95',this)}catch(x){}const ret=old.apply(this,arguments);setTimeout(harvestConnections,0);return ret};c._swir95=true}
    }catch(e){note('hook',e)}
  }
  function install(){connections().forEach(hook);harvestConnections()}
  function openSocket(c){return !!(c&&c.webSocket&&Number(c.webSocket.readyState)===1)}

  function request85(feedback,force){
    const say=typeof feedback==='function'?feedback:null;
    try{
      const now=Date.now();if(!force&&now-last85<2200)return false;last85=now;install();
      const cs=connections(),c=cs.find(openSocket)||cs[0];if(!c){say&&say('Brak aktywnego połączenia.');return false}
      const raw=JSON.stringify({code:85});let ok=false;
      if(typeof c.send==='function')try{ok=c.send(raw)===true}catch(e){note('send85',e)}
      if(!ok&&openSocket(c))try{c.webSocket.send(raw);ok=true;stats({last85Transport:'verified-direct-85'})}catch(e){note('ws85',e)}
      if(ok){stats({lastCode85:now,lastStatus:'REQUEST_9.5'});say&&say('📡 Odświeżam globalną listę APP (85 → 159)…');return true}
      say&&say('Nie udało się wysłać 85.');return false;
    }catch(e){note('request85',e);say&&say('Błąd 85: '+e.message);return false}
  }

  function meRegistered(){try{const m=CHNS&&CHNS.connManager&&CHNS.connManager.getMeUser&&CHNS.connManager.getMeUser();return!!(m&&m.isRegistered&&m.isRegistered())}catch(e){return false}}
  function liveUser(nick){
    const n=String(nick||'').trim();if(!n)return null;
    for(const c of connections())try{if(typeof c.getUserWithName!=='function')continue;const u=c.getUserWithName(n);if(!u)continue;const id=userIdFromObj(u),room=roomNameForConn(c);if(id>0)remember(n,room?[room]:[],id,'liveUser');return{user:u,connection:c,id,registered:!!(u.isRegistered&&u.isRegistered()),room}}catch(e){}
    return null;
  }

  /* APK 2.6.3 zweryfikowane binarnie:
     yk/f.e(id,nick,true) -> subcode 4 = DODAJ znajomego
     yk/f.f(...)          -> subcode 5 = USUŃ
     Tutaj nie ma arbitralnego sendera: tylko ten jeden, stały pakiet dodania znajomego. */
  function addOfficial(nick,feedback,automatic){
    const say=typeof feedback==='function'?feedback:()=>{};
    try{
      const n=String(nick||'').trim();if(!n)return false;
      if(rec(n))return true;
      if(!meRegistered()){if(!automatic)say('⚠️ APP Sync wymaga zarejestrowanego własnego nicka.');return false}
      harvestConnections();
      const live=liveUser(n),cached=identity(n),id=Number(live&&live.id||cached&&cached.id)||0;
      if(!id){if(!automatic)say('ℹ️ Brak ID dla '+n+'. SWIR złapie je automatycznie, gdy ten nick pojawi się w którymś otwartym pokoju.');return false}
      const c=(live&&live.connection)||connections().find(openSocket)||connections()[0];if(!c){if(!automatic)say('Brak połączenia.');return false}
      const raw=JSON.stringify({code:8,subcode:4,userId:id,username:n,isFriend:true});let ok=false,transport='';
      if(typeof c.send==='function')try{ok=c.send(raw)===true;if(ok)transport='Connection.send'}catch(e){note('send8',e)}
      /* Wąski fallback tylko dla zweryfikowanej operacji ADD FRIEND, bez API do własnych pakietów. */
      if(!ok&&openSocket(c))try{c.webSocket.send(raw);ok=true;transport='verified-direct-code8'}catch(e){note('ws8',e)}
      if(!ok){if(!automatic)say('❌ Serwer/połączenie nie przyjęło żądania APP.');return false}
      const a=attempts.get(key(n))||{count:0,last:0};a.count++;a.last=Date.now();attempts.set(key(n),a);
      stats({lastCode8Add:Date.now(),lastCode8Nick:n,lastCode8UserId:id,lastCode8Transport:transport});
      if(!automatic)say('☁️ Wysłano normalne „Dodaj znajomego” dla '+n+' (ID '+id+'). Sprawdzam 159…');
      [1100,3000,6500].forEach(ms=>setTimeout(()=>request85(null,true),ms));
      return true;
    }catch(e){note('addOfficial',e);if(!automatic)say('Błąd APP Sync: '+e.message);return false}
  }
  function autoSync(){
    try{
      if(!meRegistered()||Date.now()-lastAuto<1500)return;lastAuto=Date.now();harvestConnections();
      for(const n of localFriends()){
        if(rec(n))continue;
        const id=identity(n);if(!id||!Number(id.id))continue;
        const a=attempts.get(key(n));if(a&&a.count>=3)continue;if(a&&Date.now()-a.last<12000)continue;
        addOfficial(n,null,true);break;
      }
    }catch(e){note('autoSync',e)}
  }
  function syncLocal(feedback){
    const say=typeof feedback==='function'?feedback:()=>{};harvestConnections();
    const todo=localFriends().filter(n=>!rec(n));let sent=0,waiting=0;
    todo.forEach((n,i)=>{const x=identity(n);if(!x||!Number(x.id)){waiting++;return}setTimeout(()=>addOfficial(n,null,false),i*260);sent++});
    if(sent)setTimeout(()=>request85(null,true),Math.max(1200,sent*260+700));
    say(`☁ APP Sync 9.5: wysyłam ${sent}; czekam na ID: ${waiting}.`);
    return{sent,waiting};
  }

  function patchRadarApi(){
    try{
      const a=window.SWIR_FRIEND_RADAR;if(!a)return;
      const oldVisible=a._swir95OldVisible||a.visibleRooms;a._swir95OldVisible=oldVisible;
      a.requestServerState=request85;a.serverRooms=serverRooms;a.serverState=state;a.isOfficialFriend=n=>!!rec(n);a.addToOfficialApp=addOfficial;a.syncVisibleLocal=syncLocal;a.identity=identity;
      a.visibleRooms=n=>uniq([...serverRooms(n),...(typeof oldVisible==='function'?oldVisible(n):[])]);
      a.refreshAll=()=>{install();harvestConnections();request85(null,true)};
      a.diagnostics=diagnostics;
    }catch(e){note('patchRadarApi',e)}
  }

  function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
  function friendStatus(){const s=state(),st=stats(),app=Object.keys(s.users||{}).length,local=localFriends().length,ids=Object.keys(load(K_IDS,{})).length;return `APP: ${app} • SWIR: ${local} • ID cache: ${ids} • 159: ${st.lastCode159?new Date(st.lastCode159).toLocaleTimeString():'—'}`}
  function refreshFriendPanel(){
    try{
      const p=document.getElementById('friends-panel');if(!p)return;
      const head=p.firstElementChild;
      if(head){const title=head.firstElementChild;if(title)title.textContent='🧑‍🤝‍🧑 Znajomi — FRIEND RADAR 9.5';
        let b=p.querySelector('#swirAppSync95');if(!b){b=document.createElement('button');b.id='swirAppSync95';b.textContent='☁ APP';b.title='Synchronizuj lokalnych znajomych SWIR z normalną listą APP';b.style.cssText='background:#10231d;border:1px solid #46dca0;color:#a6f5cf;border-radius:8px;padding:5px 9px;cursor:pointer;font-weight:800;box-shadow:0 0 8px #46dca022';const close=head.querySelector('#swirFriendClose');head.insertBefore(b,close||null);b.onclick=()=>{const st=p.querySelector('#swirFriendProtocolStatus');syncLocal(m=>{if(st)st.innerHTML='<b style="color:#a6f5cf">'+esc(m)+'</b><br><span style="color:#8298ad">'+esc(friendStatus())+'</span>'})}}
      }
      const proto=p.querySelector('#swirFriendProtocolStatus');if(proto){let hint=p.querySelector('#swir95hint');if(!hint){hint=document.createElement('div');hint.id='swir95hint';hint.style.cssText='margin-top:6px;padding-top:6px;border-top:1px solid #ffffff12;color:#91a9bd;line-height:1.45';proto.appendChild(hint)}hint.innerHTML='🌍 <b style="color:#7ce7b7">APP</b> = globalne pokoje z serwera. <b style="color:#78c8ef">SWIR</b> = lokalna lista. 9.5 automatycznie łapie ID użytkowników z kart 183/132 i synchronizuje znanych znajomych do APP.<br><span style="color:#71869a">'+esc(friendStatus())+'</span>'}
      const r=p.querySelector('#swirFriendServerRefresh');if(r&&!r.dataset.swir95){r.dataset.swir95='1';r.onclick=()=>request85(null,true)}
    }catch(e){note('friendPanel',e)}
  }

  /* ===== NICKI: TYLKO AUTORZY WIADOMOŚCI W OKNIE CZATU ===== */
  const CHAT_COLORS=['#55DFFF','#7CE8A3','#FF82C8','#FFD36B','#B79CFF','#FF9C70','#6FC8FF','#FF7F91','#A7EC78','#91A8FF','#E99BFF','#72E0C1'];
  function hashName(n){let h=2166136261>>>0;for(const ch of String(n||'').toLocaleLowerCase('pl-PL')){h^=ch.codePointAt(0);h=Math.imul(h,16777619)}return h>>>0}
  function nickColor(n){return CHAT_COLORS[hashName(n)%CHAT_COLORS.length]}
  function nickText(el){return String(el&&el.textContent||'').replace(/[:\s]+$/,'').trim()}
  function paintChatNicks(){
    try{
      document.querySelectorAll('[id^="m-messages_"] .m-msg-item-user-login').forEach(el=>{
        const n=nickText(el);if(!n)return;const c=nickColor(n);el.dataset.swirChatNick95='1';el.style.setProperty('color',c,'important');el.style.setProperty('font-weight','750','important');el.style.setProperty('text-shadow',`0 0 4px ${c}55,0 0 8px ${c}26`,'important');
      });
    }catch(e){note('chatNicks',e)}
  }
  function installNickCss(){
    let st=document.getElementById('swir-chat-nicks-95');if(st)return;st=document.createElement('style');st.id='swir-chat-nicks-95';st.textContent=`
      /* Delikatny gamingowy neon WYŁĄCZNIE przy nicku autora wiadomości. */
      [id^="m-messages_"] .m-msg-item-user-login[data-swir-chat-nick95="1"]{letter-spacing:.05px!important;filter:none!important}
      /* Nie kolorujemy listy osób, panelu Znajomi, MOD ani tematów. */
      #friends-panel .m-msg-item-user-login,#configPanel .m-msg-item-user-login,[id^="m-users_"] .m-msg-item-user-login{color:inherit!important;text-shadow:none!important}
    `;document.head.appendChild(st)
  }

  function polishModPanel(){
    try{
      const p=document.getElementById('configPanel');if(!p)return;
      let fix=document.getElementById('swir-mod-title-95');if(!fix){fix=document.createElement('style');fix.id='swir-mod-title-95';fix.textContent='#configPanel.swir-ui>h2 span:first-child:before{content:""!important}#configPanel .swir-title95{display:inline-flex;align-items:center;gap:6px;white-space:nowrap}#configPanel .swir-title95 b{color:var(--swir-a,#00f5ff);text-shadow:0 0 8px rgba(0,245,255,.28)}';document.head.appendChild(fix)}
      const h=p.querySelector('h2 span:first-child');if(h&&!h.dataset.swir95){h.dataset.swir95='1';h.innerHTML='<span class="swir-title95"><b>SWIR //</b><span>Czateria MOD by Swir</span><span style="font-size:10px;color:#7f94aa">v9.5</span></span><span class="swir-ui-badge">GAMING UI</span>'}
    }catch(e){note('modPanel',e)}
  }

  function diagnostics(){
    harvestConnections();const s=state(),st=stats(),ids=load(K_IDS,{}),loc=localFriends();
    const o={version:'9.5 FRIEND RADAR REAL SYNC',connections:connections().length,openSockets:connections().filter(openSocket).length,localFriends:loc.length,officialAppFriends:Object.keys(s.users||{}).length,cachedIds:Object.keys(ids).length,last85:st.lastCode85?new Date(st.lastCode85).toLocaleTimeString():'—',last159:st.lastCode159?new Date(st.lastCode159).toLocaleTimeString():'—',lastCode8:st.lastCode8Add?new Date(st.lastCode8Add).toLocaleTimeString():'—',code8Transport:st.lastCode8Transport||'—',errors:errors.length};console.table(o);console.table(loc.map(n=>({nick:n,id:identity(n)&&identity(n).id||'—',type:rec(n)?'APP + SWIR':'SWIR',rooms:serverRooms(n).join(', ')||'—',attempts:(attempts.get(key(n))||{}).count||0})));return o
  }
  window.SWIR_RADAR_DEBUG95={diagnostics,state,ids:()=>load(K_IDS,{}),request85,sync:syncLocal,addOfficial,rooms:serverRooms,errors};

  install();installNickCss();paintChatNicks();patchRadarApi();refreshFriendPanel();polishModPanel();
  setTimeout(()=>{install();harvestConnections();request85(null,true);autoSync();paintChatNicks();polishModPanel()},700);
  setInterval(()=>{install();harvestConnections();patchRadarApi();refreshFriendPanel();autoSync();paintChatNicks();polishModPanel()},2200);
  const mo=new MutationObserver(()=>{clearTimeout(window._swir95DomTimer);window._swir95DomTimer=setTimeout(()=>{harvestConnections();paintChatNicks();refreshFriendPanel();polishModPanel()},90)});mo.observe(document.body,{childList:true,subtree:true});
  console.log('✅ SWIR 9.5 aktywny — Friend Radar REAL SYNC + delikatny neon tylko w wiadomościach');
}catch(e){console.error('SWIR 9.5 fatal',e)}
})();
