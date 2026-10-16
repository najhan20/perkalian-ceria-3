/* ====================================================================
   PERKALIAN CERIA - LOGIKA KURIKULUM MERDEKA MATEMATIKA SD
   ==================================================================== */

const AppState = {
  user: {
    name: "Budi Petualang",
    avatar: "🦁",
    level: "Kelas 2 SD",
    stars: 12,
    coins: 35
  },
  simulator: {
    numGroups: 3,
    itemsPerGroup: 4,
    currentEmoji: '🍎'
  },
  duniaBendaIndex: 0,
  quiz: {
    totalQuestions: 5,
    currentStep: 0,
    score: 0
  }
};

/* --- PENYIMPANAN DATA LOKAL (LOCALSTORAGE) --- */
function loadData() {
  try {
    const saved = localStorage.getItem('perkalian_ceria_storage');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.user) AppState.user = Object.assign(AppState.user, parsed.user);
    }
  } catch (err) {
    console.warn("Storage lokal tidak dapat diakses.");
  }
  updateHeader();
}

function saveData() {
  try {
    localStorage.setItem('perkalian_ceria_storage', JSON.stringify({ user: AppState.user }));
  } catch (err) {}
  updateHeader();
}

function updateHeader() {
  document.getElementById('header-name').textContent = AppState.user.name;
  document.getElementById('header-level').textContent = AppState.user.level;
  document.getElementById('header-avatar').textContent = AppState.user.avatar;
  document.getElementById('header-stars').textContent = AppState.user.stars;
  document.getElementById('header-coins').textContent = AppState.user.coins;

  const bigAvatar = document.getElementById('profile-avatar-big');
  const bigName = document.getElementById('profile-name-big');
  const inputName = document.getElementById('input-student-name');
  if (bigAvatar) bigAvatar.textContent = AppState.user.avatar;
  if (bigName) bigName.textContent = AppState.user.name;
  if (inputName && !inputName.value) inputName.value = AppState.user.name;
}

/* --- NAVIGASI LAYAR (SPA ROUTER) --- */
function switchScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    window.scrollTo(0, 0);
  }

  // Perbarui status tombol navigasi bawah
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  if (screenId === 'screen-home') document.getElementById('nav-home')?.classList.add('active');
  else if (screenId === 'screen-visualizer') document.getElementById('nav-belajar')?.classList.add('active');
  else if (screenId === 'screen-akademi') document.getElementById('nav-akademi')?.classList.add('active');
  else if (screenId === 'screen-games') document.getElementById('nav-games')?.classList.add('active');
  else if (screenId === 'screen-rapor') document.getElementById('nav-rapor')?.classList.add('active');

  if (screenId === 'screen-visualizer') renderSimulator();
  if (screenId === 'screen-dunia-benda') loadDuniaBenda();
}

/* --- FITUR 1: SIMULATOR PENJUMLAHAN BERULANG (INTI APLIKASI) --- */
function setObject(emoji, elementId) {
  AppState.simulator.currentEmoji = emoji;
  document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(elementId)?.classList.add('active');
  renderSimulator();
}

function updateGroups(val) {
  const next = AppState.simulator.numGroups + val;
  if (next >= 1 && next <= 6) {
    AppState.simulator.numGroups = next;
    renderSimulator();
  }
}

function updateItemsPerGroup(val) {
  const next = AppState.simulator.itemsPerGroup + val;
  if (next >= 1 && next <= 6) {
    AppState.simulator.itemsPerGroup = next;
    renderSimulator();
  }
}

function renderSimulator() {
  const a = AppState.simulator.numGroups;       // jumlah wadah
  const b = AppState.simulator.itemsPerGroup;   // isi tiap wadah
  const total = a * b;
  const emoji = AppState.simulator.currentEmoji;

  document.getElementById('label-num-groups').textContent = a;
  document.getElementById('label-num-items').textContent = b;

  const displayArea = document.getElementById('basket-display-area');
  displayArea.innerHTML = '';

  for (let i = 1; i <= a; i++) {
    const basket = document.createElement('div');
    basket.className = 'basket';

    let itemIcons = '';
    for (let j = 0; j < b; j++) {
      itemIcons += `<span>${emoji}</span>`;
    }

    basket.innerHTML = `
      <div class="basket-title">Wadah ${i}</div>
      <div class="basket-items">${itemIcons}</div>
      <div style="font-size:10px; font-weight:bold; color:#B45309; margin-top:4px;">(${b} benda)</div>
    `;
    displayArea.appendChild(basket);
  }

  // Bentuk Penjumlahan Berulang: b + b + ... (sebanyak a kali)
  const addArray = Array(a).fill(b);
  document.getElementById('formula-addition').textContent = `${addArray.join(' + ')} = ${total}`;

  // Bentuk Perkalian: a x b = total
  document.getElementById('formula-multiplication').textContent = `${a} × ${b} = ${total}`;

  // Penjelasan Bimo Sesuai Kurikulum Merdeka
  document.getElementById('formula-explanation').innerHTML = `
    💡 <strong>Makna Matematika:</strong><br>
    Ada <strong>${a} wadah</strong> (kelompok). Setiap wadah berisi <strong>${b} benda</strong>.<br>
    Artinya, bilangan <strong>${b}</strong> dijumlahkan berulang sebanyak <strong>${a} kali</strong>.<br>
    Jumlah seluruh benda adalah <strong>${total}</strong>.
  `;
}

/* --- FITUR 2: DUNIA BENDA (SOAL KONTEKSTUAL) --- */
const bankDuniaBenda = [
  { cat: "PERALATAN SEKOLAH", q: "Ada 4 kotak pensil. Setiap kotak berisi 2 pensil. Berapa jumlah seluruh pensil?", a: 4, b: 2, icon: "✏️", opts: [6, 8, 10, 12], ans: 8 },
  { cat: "BUAH SEGAR", q: "Ibu membeli 3 kantong jeruk. Tiap kantong berisi 5 buah jeruk manis. Berapa jumlah seluruh jeruk?", a: 3, b: 5, icon: "🍊", opts: [12, 15, 18, 20], ans: 15 },
  { cat: "MAKANAN & KUE", q: "Ada 5 piring kue donat. Setiap piring berisi 3 donat cokelat. Berapa donat seluruhnya?", a: 5, b: 3, icon: "🧁", opts: [10, 12, 15, 18], ans: 15 },
  { cat: "HEWAN PIARAAN", q: "Kakek memiliki 2 kolam ikan. Tiap kolam berisi 6 ekor ikan mas. Berapa seluruh ikan kakek?", a: 2, b: 6, icon: "🐟", opts: [8, 12, 14, 16], ans: 12 },
  { cat: "KENDARAAN", q: "Ada 6 garasi mobil kecil. Setiap garasi memuat 2 mobil mini. Berapa total mobil tersebut?", a: 6, b: 2, icon: "🚗", opts: [10, 12, 14, 16], ans: 12 }
];

function loadDuniaBenda() {
  const item = bankDuniaBenda[AppState.duniaBendaIndex % bankDuniaBenda.length];
  document.getElementById('db-category').textContent = `KATEGORI: ${item.cat}`;
  document.getElementById('db-question').textContent = item.q;

  let visual = "";
  for (let i = 0; i < item.a; i++) {
    visual += `📦(${item.icon.repeat(item.b)}) `;
  }
  document.getElementById('db-visual-preview').textContent = visual;

  const optBox = document.getElementById('db-options');
  optBox.innerHTML = '';
  const fb = document.getElementById('db-feedback');
  fb.style.display = 'none';

  item.opts.forEach(val => {
    const btn = document.createElement('div');
    btn.className = 'quiz-option';
    btn.textContent = `${val} Benda`;
    btn.onclick = () => checkDuniaBenda(val, item.ans, item.a, item.b);
    optBox.appendChild(btn);
  });
}

function checkDuniaBenda(chosen, correct, a, b) {
  const fb = document.getElementById('db-feedback');
  fb.style.display = 'block';

  if (chosen === correct) {
    fb.style.background = "#DCFCE7";
    fb.style.color = "#166534";
    fb.innerHTML = `
      🎉 <strong>Hebat Sekali! Benar!</strong><br>
      Ada ${a} kelompok yang masing-masing berisi ${b} benda.<br>
      Penjumlahan: ${Array(a).fill(b).join(' + ')} = ${correct}.<br>
      Perkalian: <strong>${a} × ${b} = ${correct}</strong>.
    `;
    AppState.user.stars += 2;
    AppState.user.coins += 5;
    saveData();
    setTimeout(() => {
      AppState.duniaBendaIndex++;
      loadDuniaBenda();
    }, 2500);
  } else {
    fb.style.background = "#FEF3C7";
    fb.style.color = "#92400E";
    fb.innerHTML = `
      💡 <strong>Petunjuk dari Bimo:</strong><br>
      Tiap wadah berisi ${b} benda. Tambahkan sebanyak ${a} kali (${Array(a).fill(b).join(' + ')}). Ayo coba lagi!
    `;
  }
}

/* --- FITUR 3: ARENA BERMAIN (2 MINI GAMES) --- */
let game1Score = 0;
function initGame1() {
  game1Score = 0;
  nextGame1();
}

function nextGame1() {
  const a = Math.floor(Math.random() * 5) + 2;
  const b = Math.floor(Math.random() * 4) + 1;
  const ans = a * b;

  document.getElementById('game1-problem').textContent = `${a} × ${b} = ?`;
  document.getElementById('game1-score').textContent = `Skor Kamu: ${game1Score}`;

  const opts = [ans, ans + 2, Math.max(1, ans - 3), ans + 4].sort(() => Math.random() - 0.5);
  const box = document.getElementById('game1-buttons');
  box.innerHTML = '';

  opts.forEach(val => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-outline';
    btn.style.minHeight = '44px';
    btn.textContent = val;
    btn.onclick = () => {
      if (val === ans) {
        game1Score += 10;
        AppState.user.coins += 2;
        saveData();
        nextGame1();
      } else {
        alert('Bimo: "Hampir tepat! Yuk kita hitung kelompoknya bersama."');
      }
    };
    box.appendChild(btn);
  });
}

function initGame2() {
  const area = document.getElementById('game2-area');
  area.innerHTML = '';
  const cards = [
    { id: 1, text: "2 × 3" },
    { id: 1, text: "3 + 3" },
    { id: 2, text: "3 × 4" },
    { id: 2, text: "4 + 4 + 4" }
  ].sort(() => Math.random() - 0.5);

  let selected = [];
  cards.forEach(c => {
    const cardEl = document.createElement('div');
    cardEl.className = 'quiz-option';
    cardEl.style.justifyContent = 'center';
    cardEl.textContent = c.text;

    cardEl.onclick = () => {
      if (selected.length < 2 && !cardEl.classList.contains('correct')) {
        cardEl.style.borderColor = 'var(--primary)';
        selected.push({ el: cardEl, id: c.id });

        if (selected.length === 2) {
          if (selected[0].id === selected[1].id) {
            selected[0].el.classList.add('correct');
            selected[1].el.classList.add('correct');
            AppState.user.stars += 3;
            saveData();
            selected = [];
          } else {
            setTimeout(() => {
              selected[0].el.style.borderColor = '#E2E8F0';
              selected[1].el.style.borderColor = '#E2E8F0';
              selected = [];
            }, 700);
          }
        }
      }
    };
    area.appendChild(cardEl);
  });
}

/* --- FITUR 4: TANTANGAN KILAT --- */
const bankKuis = [
  { q: "Bentuk penjumlahan 3 + 3 + 3 + 3 jika diubah ke bentuk perkalian adalah...", opts: ["3 × 4", "4 × 3", "4 + 3", "3 × 3"], ans: "4 × 3" },
  { q: "Ada 5 sarang burung. Tiap sarang berisi 2 butir telur. Berapa telur semuanya?", opts: ["5 × 2 = 10", "2 × 5 = 7", "5 + 2 = 7", "2 × 2 = 4"], ans: "5 × 2 = 10" },
  { q: "Arti sebenarnya dari perkalian 2 × 6 adalah...", opts: ["6 + 6", "2 + 2 + 2", "6 × 6", "2 + 6"], ans: "6 + 6" },
  { q: "Ada 4 piring kue. Masing-masing piring berisi 4 kue nastar. Seluruh kue ada...", opts: ["8", "12", "16", "20"], ans: "16" },
  { q: "Bentuk penjumlahan berulang dari perkalian 3 × 5 adalah...", opts: ["3 + 3 + 3 + 3 + 3", "5 + 5 + 5", "5 × 3", "3 + 5"], ans: "5 + 5 + 5" }
];

function selectQuizCount(num) {
  AppState.quiz.totalQuestions = num;
  alert(`Mode ${num} Soal telah dipilih. Siap berhitung ceria!`);
}

function startQuiz() {
  document.getElementById('quiz-setup').style.display = 'none';
  document.getElementById('quiz-result').style.display = 'none';
  document.getElementById('quiz-play').style.display = 'block';
  AppState.quiz.currentStep = 0;
  AppState.quiz.score = 0;
  showQuizStep();
}

function showQuizStep() {
  const current = bankKuis[AppState.quiz.currentStep % bankKuis.length];
  document.getElementById('quiz-progress-text').textContent = `Soal ${AppState.quiz.currentStep + 1} dari ${AppState.quiz.totalQuestions}`;
  document.getElementById('quiz-question-title').textContent = current.q;

  const box = document.getElementById('quiz-answers-box');
  box.innerHTML = '';

  current.opts.forEach(choice => {
    const btn = document.createElement('div');
    btn.className = 'quiz-option';
    btn.textContent = choice;
    btn.onclick = () => {
      if (choice === current.ans) {
        AppState.quiz.score += 100 / AppState.quiz.totalQuestions;
        AppState.user.stars += 1;
      }
      AppState.quiz.currentStep++;
      if (AppState.quiz.currentStep < AppState.quiz.totalQuestions) {
        showQuizStep();
      } else {
        finishQuiz();
      }
    };
    box.appendChild(btn);
  });
}

function finishQuiz() {
  document.getElementById('quiz-play').style.display = 'none';
  document.getElementById('quiz-result').style.display = 'block';
  const final = Math.round(AppState.quiz.score);
  document.getElementById('quiz-final-score').textContent = final;

  const msg = document.getElementById('quiz-remedial-msg');
  if (final >= 80) {
    msg.textContent = "Bimo sangat bangga! Kamu sudah menguasai makna perkalian sebagai penjumlahan berulang!";
    document.getElementById('badge-4')?.classList.remove('locked');
  } else {
    msg.textContent = "Hebat sudah mencoba! Kamu disarankan membuka Lab Visual Benda untuk memperkuat pemahaman kelompok.";
  }
  saveData();
}

/* --- AKADEMI, PETUALANGAN, PROFIL, DAN RESET GURU --- */
function openAkademiLesson(lvl) {
  alert(`Membuka Modul Level ${lvl}. Mari kita pelajari peragaan kelompoknya di Lab Visual!`);
  switchScreen('screen-visualizer');
}

function openWorldMission(worldId) {
  alert(`Selamat datang di Misi Dunia ${worldId}! Selesaikan latihan menghitung kelompok untuk membantunya.`);
  switchScreen('screen-dunia-benda');
}

function selectAvatar(emoji) {
  AppState.user.avatar = emoji;
  document.getElementById('profile-avatar-big').textContent = emoji;
}

function saveStudentProfile() {
  const nameVal = document.getElementById('input-student-name').value.trim();
  if (nameVal) AppState.user.name = nameVal;
  saveData();
  alert('Profil petualang berhasil disimpan!');
  switchScreen('screen-home');
}

function resetProgressData() {
  if (confirm("Ibu/Bapak Guru, apakah ingin membersihkan seluruh data belajar pada perangkat ini?")) {
    localStorage.removeItem('perkalian_ceria_storage');
    AppState.user.stars = 0;
    AppState.user.coins = 0;
    saveData();
    alert('Data kemajuan perangkat telah dibersihkan.');
    location.reload();
  }
}

/* --- INISIALISASI SAAT HALAMAN DIMUAT --- */
window.addEventListener('DOMContentLoaded', () => {
  loadData();
  renderSimulator();

  // Pendaftaran Service Worker untuk Mode Offline / Median.co
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => {
      console.log('SW registration note:', err);
    });
  }
});