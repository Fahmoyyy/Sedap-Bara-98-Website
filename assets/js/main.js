// Nomor WhatsApp pemesanan (format internasional tanpa +)
const WA_NUMBER = '6281223378422';

const rupiah = (n) => 'Rp ' + n.toLocaleString('id-ID');

/* ---------- Data ---------- */
const SAMBAL = [
  {
    nama: 'Bara Asap BBQ',
    tag: 'Gurih Smokey',
    desc: 'Saus barbekyu dengan aroma bakaran khas, cocok untuk tingkat pedas sedang.',
    img: 'assets/img/sambal-bbq.jpg',
    alt: 'Sate bakar berlumur saus mengilap',
  },
  {
    nama: 'Sambal Garlic Pedas Bikin Nagih',
    tag: 'Spicy Garlic',
    desc: 'Sambal pedas dengan rasa bawang putih yang gurih dan pekat.',
    img: 'assets/img/sambal-garlic.jpg',
    alt: 'Sambal bawang dalam mangkuk kayu',
  },
  {
    nama: 'Sambal Korek Daun Jeruk',
    tag: 'Pedas Segar',
    desc: 'Sambal ulek cabai rawit asli dengan aroma daun jeruk segar yang menggugah selera.',
    img: 'assets/img/sambal-korek.jpg',
    alt: 'Cabai diulek di atas cobek',
  },
];

const PAKET = [
  {
    id: 1, nama: 'Paket 1', harga: 5000,
    isi: ['Bakso Besar 1 atau Sosis Bakar 1'],
    pilih: ['Bakso Besar', 'Sosis Bakar'],
  },
  {
    id: 2, nama: 'Paket 2', harga: 10000,
    isi: ['Bakso Besar 1', 'Sosis Bakar 1'],
  },
  {
    id: 3, nama: 'Paket 3', harga: 15000,
    isi: ['Bakso Besar 1', 'Sosis Bakar 1', 'Jamur Kuping atau Kancing'],
    pilih: ['Jamur Kuping', 'Jamur Kancing'],
  },
  {
    id: 4, nama: 'Paket 4', harga: 18000, rec: true,
    isi: ['Bakso Besar 1', 'Sosis Bakar 1', 'Jamur Kuping 1', 'Jamur Kancing atau Dumpling 1', 'Gratis 1 Es Teh'],
    pilih: ['Jamur Kancing', 'Dumpling'],
  },
];

const CREDITS = window.PHOTO_CREDITS || [];

/* ---------- Navigasi ---------- */
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const menuBtn = document.getElementById('menuBtn');
const mobileNav = document.getElementById('mobileNav');
const setMenu = (open) => {
  mobileNav.classList.toggle('hidden', !open);
  menuBtn.setAttribute('aria-expanded', String(open));
};
menuBtn.addEventListener('click', () => setMenu(mobileNav.classList.contains('hidden')));
mobileNav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });

/* ---------- Animasi muncul saat di-scroll ---------- */
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('in'));
}

/* ---------- Tab sambal ---------- */
const tabs = document.querySelectorAll('.sambal-tab');
const sambalImg = document.getElementById('sambalImg');
const showSambal = (i) => {
  const s = SAMBAL[i];
  tabs.forEach((t, k) => t.setAttribute('aria-selected', String(k === i)));
  document.getElementById('sambalTag').textContent = s.tag;
  document.getElementById('sambalDesc').textContent = s.desc;
  sambalImg.style.opacity = 0;
  setTimeout(() => {
    sambalImg.src = s.img;
    sambalImg.alt = s.alt;
    sambalImg.style.opacity = 1;
  }, 180);
};
tabs.forEach((t) => t.addEventListener('click', () => showSambal(Number(t.dataset.sambal))));
showSambal(0);
SAMBAL.forEach((s) => { new Image().src = s.img; });

/* ---------- Racik pesanan ---------- */
const state = {
  qty: Object.fromEntries(PAKET.map((p) => [p.id, 0])),
  opsi: Object.fromEntries(PAKET.filter((p) => p.pilih).map((p) => [p.id, p.pilih[0]])),
  sambal: SAMBAL[0].nama,
};

const paketList = document.getElementById('paketList');
paketList.innerHTML = PAKET.map((p) => `
  <article class="paket reveal ${p.rec ? 'rec' : ''}" data-id="${p.id}">
    <div class="flex items-start justify-between gap-3">
      <div>
        ${p.rec ? '<span class="mb-2 inline-block rounded-full bg-api px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-arang">Recommended</span>' : ''}
        <h3>${p.nama}</h3>
      </div>
      <span class="harga">${p.harga / 1000}K</span>
    </div>
    <ul>${p.isi.map((x) => `<li>${x}</li>`).join('')}</ul>
    ${p.pilih ? `<div class="flex flex-wrap gap-2" role="group" aria-label="Pilihan ${p.nama}">
      ${p.pilih.map((o) => `<button type="button" class="chip" data-opsi="${o}" aria-pressed="${o === state.opsi[p.id]}">${o}</button>`).join('')}
    </div>` : ''}
    <div class="stepper" role="group" aria-label="Jumlah ${p.nama}">
      <button type="button" data-step="-1" aria-label="Kurangi ${p.nama}">&minus;</button>
      <output>0</output>
      <button type="button" data-step="1" aria-label="Tambah ${p.nama}">+</button>
    </div>
  </article>`).join('');
paketList.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));

document.getElementById('sambalPick').innerHTML = SAMBAL.map((s, i) => `
  <label class="sbm"><input type="radio" name="sambal" value="${s.nama}" ${i === 0 ? 'checked' : ''}> ${s.nama}</label>`).join('');

paketList.addEventListener('click', (e) => {
  const card = e.target.closest('.paket');
  if (!card) return;
  const id = Number(card.dataset.id);
  const step = e.target.closest('[data-step]');
  const chip = e.target.closest('[data-opsi]');
  if (step) {
    state.qty[id] = Math.max(0, Math.min(99, state.qty[id] + Number(step.dataset.step)));
    render();
  } else if (chip) {
    state.opsi[id] = chip.dataset.opsi;
    card.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    render();
  }
});
document.getElementById('sambalPick').addEventListener('change', (e) => {
  state.sambal = e.target.value;
  render();
});

/* Bar total di HP hanya muncul di bagian menu, dan hilang saat kotak pesanan sudah terlihat */
const barState = { ada: false, diMenu: false, diKeranjang: false };
function syncBar() {
  const show = barState.ada && barState.diMenu && !barState.diKeranjang;
  const bar = document.getElementById('mobileBar');
  bar.classList.toggle('hidden', !show);
  bar.classList.toggle('flex', show);
}
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([e]) => { barState.diMenu = e.isIntersecting; syncBar(); }).observe(document.getElementById('menu'));
  new IntersectionObserver(([e]) => { barState.diKeranjang = e.isIntersecting; syncBar(); }, { threshold: 0.25 }).observe(document.getElementById('keranjang'));
}

function render() {
  const lines = PAKET.filter((p) => state.qty[p.id] > 0).map((p) => {
    const q = state.qty[p.id];
    const opsi = state.opsi[p.id] ? ` (${state.opsi[p.id]})` : '';
    return { label: `${q}x ${p.nama}${opsi}`, sub: p.harga * q };
  });
  const total = lines.reduce((a, l) => a + l.sub, 0);

  paketList.querySelectorAll('.paket').forEach((c) => {
    const q = state.qty[c.dataset.id];
    c.querySelector('output').textContent = q;
    c.classList.toggle('has-qty', q > 0);
  });

  document.getElementById('cartLines').innerHTML = lines.length
    ? lines.map((l) => `<li class="flex justify-between gap-3"><span>${l.label}</span><b class="whitespace-nowrap">${rupiah(l.sub)}</b></li>`).join('')
    : '<li class="opacity-60">Belum ada paket yang dipilih.</li>';
  document.getElementById('cartTotal').textContent = rupiah(total);

  const jumlah = PAKET.reduce((n, p) => n + state.qty[p.id], 0);
  const bar = document.getElementById('mobileBar');
  barState.ada = jumlah > 0;
  syncBar();
  document.getElementById('mobileBarText').textContent = `${jumlah} paket, ${rupiah(total)}`;

  const wa = document.getElementById('waBtn');
  if (lines.length) {
    const msg = ['Halo Sedap Bara 98, saya mau pesan:', ...lines.map((l) => `- ${l.label}`),
      `Sambal: ${state.sambal}`, `Total: ${rupiah(total)}`].join('\n');
    wa.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    wa.setAttribute('aria-disabled', 'false');
    wa.removeAttribute('tabindex');
    document.getElementById('waLabel').textContent = 'Kirim Pesanan ke WhatsApp';
  } else {
    wa.href = '#menu';
    wa.setAttribute('aria-disabled', 'true');
    wa.setAttribute('tabindex', '-1');
    document.getElementById('waLabel').textContent = 'Pilih paket dulu';
  }
}
render();

/* ---------- Salin kode warna ---------- */
const toast = document.getElementById('toast');
let toastTimer;
document.querySelectorAll('.swatch').forEach((b) => b.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(b.dataset.hex);
    toast.textContent = `${b.dataset.hex} disalin`;
  } catch {
    toast.textContent = b.dataset.hex;
  }
  toast.style.opacity = 1;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.style.opacity = 0; }, 1500);
}));

/* ---------- Kredit foto ---------- */
document.getElementById('credits').innerHTML = CREDITS.map((c) =>
  `<li><a class="underline underline-offset-2 hover:text-api" href="${c.url}" target="_blank" rel="noopener">${c.judul}</a>: ${c.oleh}, ${c.lisensi}</li>`).join('');

/* ---------- Percikan bara di hero ---------- */
(function embers() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cv = document.getElementById('embers');
  if (reduce || !cv) return;
  const ctx = cv.getContext('2d');
  let w, h, dpr, parts = [], running = true;
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = cv.clientWidth; h = cv.clientHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(70, w / 16));
    parts = Array.from({ length: n }, () => make(true));
  };
  const make = (any) => ({
    x: Math.random() * w,
    y: any ? Math.random() * h : h + 10,
    r: 0.8 + Math.random() * 2.2,
    v: 0.4 + Math.random() * 1.3,
    s: Math.random() * 6.28,
    l: 0.4 + Math.random() * 0.6,
  });
  const tick = () => {
    if (running) {
      ctx.clearRect(0, 0, w, h);
      parts.forEach((p, i) => {
        p.y -= p.v; p.s += 0.03; p.x += Math.sin(p.s) * 0.5; p.l -= 0.0016;
        if (p.y < -10 || p.l <= 0) { parts[i] = make(false); return; }
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,${120 + Math.round(p.l * 110)},0,${Math.min(1, p.l)})`;
        ctx.shadowBlur = 10; ctx.shadowColor = '#E62E00';
        ctx.arc(p.x, p.y, p.r, 0, 6.28);
        ctx.fill();
      });
    }
    requestAnimationFrame(tick);
  };
  new IntersectionObserver(([e]) => { running = e.isIntersecting; }).observe(cv);
  window.addEventListener('resize', resize);
  resize();
  tick();
})();
