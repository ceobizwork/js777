/* main.js - logic for jackpot, stats, notifications, games, reviews, swiper init, provider list animation */
document.addEventListener('DOMContentLoaded', function() {
  function formatNumber(n){ return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
  function animateNumber(id, target, isCurrency) {
    const el = document.getElementById(id);
    if(!el) return;
    const start = parseInt(el.textContent.replace(/[^0-9]/g,'')) || 0;
    const diff = target - start;
    const steps = 20;
    let i = 0;
    if(diff === 0) return;
    el.parentElement && el.parentElement.classList.add('updated');
    const iv = setInterval(() => {
      i++;
      if(i < steps) {
        const v = Math.floor(start + diff * (i/steps));
        el.textContent = isCurrency ? ('฿' + formatNumber(v)) : formatNumber(v);
      } else {
        el.textContent = isCurrency ? ('฿' + formatNumber(target)) : formatNumber(target);
        clearInterval(iv);
        setTimeout(()=> { el.parentElement && el.parentElement.classList.remove('updated'); },300);
      }
    }, 40);
  }

  function randomDelta(base, range) {
    return base + Math.floor(Math.random()*range - (range/2));
  }

  function updateStatsLoop(){
    const oEl = document.getElementById('onlineCount');
    const wEl = document.getElementById('todayWinners');
    const pEl = document.getElementById('todayPrize');
    setInterval(()=> {
      animateNumber('onlineCount', Math.max(480000, randomDelta(parseInt(oEl.textContent.replace(/[^0-9]/g,''))||487000, 400)));
    }, 1200);
    setInterval(()=> {
      animateNumber('todayWinners', Math.max(3000, randomDelta(parseInt(wEl.textContent.replace(/[^0-9]/g,''))||3050, 30)));
    }, 1500);
    setInterval(()=> {
      animateNumber('todayPrize', Math.max(30000000, randomDelta(parseInt(pEl.textContent.replace(/[^0-9]/g,''))||39000000, 100000)), true);
    }, 1400);
  }

  function createCoin(x,y,container,rect,collect=false){
    const coin = document.createElement('div');
    coin.className = 'coin golden' + (collect ? ' collect' : '');
    coin.textContent = '฿';
    if(collect){
      const cx = rect.width/2, cy = rect.height/2;
      coin.style.left = x + 'px';
      coin.style.top = y + 'px';
      coin.style.setProperty('--sx', x + 'px');
      coin.style.setProperty('--sy', y + 'px');
      coin.style.setProperty('--tx', (cx - x) + 'px');
      coin.style.setProperty('--ty', (cy - y) + 'px');
    } else {
      const tx = (Math.random()-0.5)*300;
      const ty = (Math.random()-0.5)*300;
      coin.style.left = x + 'px';
      coin.style.top = y + 'px';
      coin.style.setProperty('--tx', tx + 'px');
      coin.style.setProperty('--ty', ty + 'px');
    }
    container.appendChild(coin);
    setTimeout(()=> coin.remove(), 2000);
  }

  window.burstCoins = function(e){
    const el = document.getElementById('jackpotBox');
    const rect = el.getBoundingClientRect();
    const container = el.querySelector('.coin-container') || document.getElementById('coinContainer');
    for(let i=0;i<30;i++){
      setTimeout(()=> { createCoin(Math.random()*rect.width, Math.random()*rect.height, container, rect, false); }, i*20);
    }
  };

  function collectCoins(){
    const b = document.getElementById('jackpotBox');
    const rect = b.getBoundingClientRect();
    const container = b.querySelector('.coin-container') || document.getElementById('coinContainer');
    for(let i=0;i<12;i++){
      setTimeout(()=> {
        const a = Math.random()*Math.PI*2;
        const m = Math.min(rect.width, rect.height)*0.7;
        const x = Math.cos(a)*m + rect.width/2;
        const y = Math.sin(a)*m + rect.height/2;
        createCoin(x,y,container,rect,true);
      }, i*100);
    }
  }

  function updateJackpotLoop(){
    const jEl = document.getElementById('jackpotValue');
    const wEl = document.getElementById('winnerCount');
    const mEl = document.getElementById('maxPrize');
    setInterval(()=> {
      animateNumber('jackpotValue', Math.max(8888888, randomDelta(parseInt(jEl.textContent.replace(/[^0-9]/g,''))||9900000, 80000)), true);
      collectCoins();
    }, 2500);
    setInterval(()=> {
      animateNumber('winnerCount', Math.max(150, randomDelta(parseInt(wEl.textContent)||150, 6)));
    }, 3000);
    setInterval(()=> {
      animateNumber('maxPrize', Math.max(50000, randomDelta(parseInt(mEl.textContent.replace(/[^0-9]/g,''))||88000, 4000)));
    }, 3500);
  }
  updateStatsLoop();
  updateJackpotLoop();

  /* Notifications */
  const IMAGES = [
    'https://img5.pic.in.th/file/secure-sv1/BAY138edb003404738c.png',
    'https://img2.pic.in.th/pic/BBL5623288bf3514827.png',
    'https://img2.pic.in.th/pic/KBANK188fb398741a931e.png',
    'https://img5.pic.in.th/file/secure-sv1/KTBff6b13926bd4e486.png',
    'https://img2.pic.in.th/pic/SCBb0fa8bfb34956394.png',
    'https://img5.pic.in.th/file/secure-sv1/TTB3c0909ac0f482074.png'
  ];
  const BANKS = ['BAY','BBL','KBANK','KTB','SCB','TTB'];
  const MAX_NOTIF = 6;
  function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
  function addNotification(initial=false){
    const container = document.getElementById('notifications');
    const idx = randInt(0,IMAGES.length-1);
    const user = `js777c${randInt(10,99)}xx`;
    const amount = randInt(100,10000).toFixed(2);
    const now = new Date();
    const date = now.toLocaleDateString('th-TH',{day:'2-digit',month:'short',year:'numeric'});
    const time = now.toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
    const div = document.createElement('div');
    div.className = 'notification';
    div.innerHTML = `<img decoding="async" src="${IMAGES[idx]}" class="icon" alt="${BANKS[idx]}">
      <div class="title-highlight">
        <p>ยูส: <span class="highlight">${user}</span></p>
        <p>ยอดถอน: <span class="highlight">${amount}</span> บาท</p>
        <p>วันที่: <span class="highlight">${date} ${time}</span></p>
      </div>
      <div class="status processing"><i class="fas fa-spinner"></i> กำลังโอน...</div>`;
    container.prepend(div);
    setTimeout(()=> {
      const status = div.querySelector('.status');
      if(status){ status.className='status'; status.innerHTML = '<i class="fas fa-check-circle"></i> โอนแล้ว'; }
    }, 2000);
    if(!initial && container.children.length > MAX_NOTIF){
      const oldest = container.lastElementChild;
      oldest && oldest.remove();
    }
  }
  function initNotifications(){
    for(let i=0;i<MAX_NOTIF;i++) addNotification(true);
    updateLastUpdated();
    setInterval(()=> { addNotification(); updateLastUpdated(); }, 3000);
  }
  function updateLastUpdated(){
    const now = new Date();
    const dt = now.toLocaleString('th-TH',{dateStyle:'short',timeStyle:'short'});
    document.getElementById('lastUpdated').textContent = dt;
  }
  initNotifications();

  /* Games grid */
  const games = [
    { name: 'Fortune Tiger', img: 'https://static.rocketpot.io/static-content/live/logo/FortuneTiger.Nb7BXmnZnNYNDw2f4VCaeg.png' },
    { name: 'Wild Ape', img: 'https://hideousslots.com/wp-content/uploads/2024/07/Wild-Ape-Logo.jpg' },
    { name: 'Lucky Neko', img: 'https://static.rocketpot.io/static-content/live/logo/LuckyNeko.gFzERv9mMfdr3wCQGMN4ap.png' },
    { name: 'Mahjong Ways2', img: 'https://shorturl.asia/jsT7S' },
    { name: 'Yakuza Honor', img: 'https://static.rocketpot.io/static-content/live/logo/YakuzaHonor.N4Q7QXwALg9Adjp3d8soAt.png' },
    { name: 'Aztec', img: 'https://static.rocketpot.io/static-content/live/logo/TreasuresofAztec.5vkLmQ6ahb28KD8ScWEJ9G.png' },
    { name: 'Jurassic', img: 'https://static.rocketpot.io/static-content/live/logo/JurassicKingdom.TtGcVKVahVfk2rpFGARWpD.png' },
    { name: 'Ways of the Qilin', img: 'https://shorturl.asia/FwNOK' }
  ];
  const gameContainer = document.getElementById('gameContainer');
  function makeGameBox(game){
    const box = document.createElement('div');
    box.className = 'game-box';
    const perc = (Math.random()*10+90).toFixed(2);
    box.innerHTML = `<img src="${game.img}" class="game-image" alt="${game.name}">
      <div class="game-name">${game.name}</div>
      <div class="percent">${perc}%</div>`;
    return box;
  }
  games.forEach(g=> gameContainer.appendChild(makeGameBox(g)));
  function updatePercents(){
    document.querySelectorAll('.game-box').forEach(box=>{
      const el = box.querySelector('.percent');
      const cur = parseFloat(el.textContent) || 95;
      if(Math.random()>0.1){
        const delta = Math.random()>0.2 ? Math.random()*0.4+0.1 : -Math.random()*0.1;
        let nv = Math.min(99.99, Math.max(90, cur + delta));
        nv = nv.toFixed(2);
        el.classList.remove('flash','updated');
        el.textContent = nv + '%';
        el.classList.add('updated');
        if(parseFloat(nv) >= 98){
          el.classList.add('flash');
          el.textContent += ' 🔥';
        }
        setTimeout(()=> el.classList.remove('updated'), 300);
      }
    });
  }
  setInterval(updatePercents, 1000);

  /* Reviews */
  const reviews = [
    { text: "แตกดีจนไม่รู้จะซ่อนเงิยเมียยังไงแล้ว 👍", name: "เด็กแมนยู (กำแพงเพชร)", avatar: "https://img5.pic.in.th/file/secure-sv1/444482004_7798764536813604_3664008989486408448_n.md.jpg" },
    { text: "แตกจริง รีวิวแบบไม่อวย!", name: "มานพกระจก (ชลบุรี)", avatar: "https://img5.pic.in.th/file/secure-sv1/475123597_1840156400121833_6730770239917510843_n.md.jpg" },
    { text: "แอดมินบริการดีมากครับ 👍", name: "มาวิน (ตาก)", avatar: "https://i.postimg.cc/5NL0yYhK/486532696-1889300071839488-81617494742818319-n.jpg" },
    { text: "ปั่นเข้าง่าย แตกตั้งแต่ครั้งแรก", name: "กล้วยจ้า (แพร่)", avatar: "https://img2.pic.in.th/pic/470536763_27921601147486332_6803791846541991171_n.jpg" }
  ];
  const chatContainer = document.getElementById('chatContainer');
  let reviewIndex = 0;
  function appendReview(){
    const r = reviews[Math.floor(Math.random()*reviews.length)];
    const msg = document.createElement('div');
    msg.className = 'chat-message ' + (reviewIndex%2===0 ? 'left' : 'right');
    msg.innerHTML = `<img src="${r.avatar}" class="avatar"><div><div class="username">${r.name}</div><div class="bubble">${r.text}</div></div>`;
    chatContainer.appendChild(msg);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    reviewIndex++;
    if(chatContainer.children.length > 6) chatContainer.removeChild(chatContainer.children[0]);
  }
  document.getElementById('addReviewBtn').addEventListener('click', appendReview);
  for(let i=0;i<4;i++) appendReview();
  setInterval(appendReview, 2500);

  /* Swiper */
  try {
    const swiper = new Swiper('.mySwiper', {
    slidesPerView: 1, // แสดงทีละ 1
    spaceBetween: 16,
    centeredSlides: true,
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
  });

  }catch(e){}
});
