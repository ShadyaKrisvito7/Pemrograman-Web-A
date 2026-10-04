/* ==========================================================
   script.js - Profil Diri Shadya Krisvito Setiawan
   Modul 4 (JavaScript Dasar & DOM) + Modul 5 (Event Handling)
   ========================================================== */


/* ==========================================================
   MODUL 4 - LANGKAH 1: Variabel dan seleksi elemen dasar
   ========================================================== */
const judulSitus = document.querySelector("header h1");
console.log(judulSitus);
console.log(judulSitus.textContent);


/* ==========================================================
   MODUL 4 - LANGKAH 2: Fungsi dan tombol Dark Mode
   ========================================================== */
const tombolTema = document.querySelector("#btn-tema");

function toggleTema() {
  document.body.classList.toggle("dark-mode");

  // Sesuaikan teks tombol dengan mode yang sedang aktif
  const modeGelapAktif = document.body.classList.contains("dark-mode");
  tombolTema.textContent = modeGelapAktif ? "Mode Terang" : "Mode Gelap";
}

tombolTema.addEventListener("click", toggleTema);


/* ==========================================================
   MODUL 4 - LANGKAH 3: Tombol tampilkan/sembunyikan aside
   ========================================================== */
const tombolInfo = document.querySelector("#btn-info");
const kotakAside = document.querySelector("aside");

tombolInfo.addEventListener("click", () => {
  kotakAside.classList.toggle("tersembunyi");
});


/* ==========================================================
   MODUL 4 - LANGKAH 4: Render daftar portofolio dari data JS
   (Tugas mandiri: bagian pengalaman dirender dari array)
   ========================================================== */
const daftarPortofolio = [
  {
    judul: "Mulai Belajar Pemrograman",
    tanggal: "Awal Perkuliahan",
    isi: "Sebagai mahasiswa Informatika, saya mulai mempelajari dasar-dasar pemrograman dan berbagai hal yang berkaitan dengan teknologi.",
  },
  {
    judul: "Belajar Pengembangan Web",
    tanggal: "Saat Ini",
    isi: "Saya terus mencoba memahami cara membuat website sederhana menggunakan HTML, CSS, dan JavaScript.",
  },
  {
    judul: "Tujuan ke Depan",
    tanggal: "Rencana",
    isi: "Saya ingin meningkatkan kemampuan di bidang pemrograman dan pengembangan web sebagai bekal mencapai tujuan di bidang teknologi.",
  },
];

const containerPortofolio = document.querySelector("#daftar-portofolio");

// Fungsi pembuat satu item portofolio (dipakai oleh render awal & tombol tambah)
function buatItemPortofolio(data) {
  const article = document.createElement("article");

  const judul = document.createElement("h3");
  judul.textContent = data.judul;

  const waktu = document.createElement("time");
  waktu.textContent = data.tanggal;

  const isi = document.createElement("p");
  isi.textContent = data.isi;

  // Modul 5 - Langkah 2: tombol Like pada tiap item
  const tombolLike = document.createElement("button");
  tombolLike.classList.add("btn-like");
  let jumlahLike = 0;
  tombolLike.dataset.like = jumlahLike;
  tombolLike.textContent = `Like (${jumlahLike})`;

  // Modul 4 - Langkah 5: tombol Hapus pada tiap item
  const tombolHapus = document.createElement("button");
  tombolHapus.classList.add("btn-hapus");
  tombolHapus.textContent = "Hapus";

  article.appendChild(judul);
  article.appendChild(waktu);
  article.appendChild(isi);
  article.appendChild(tombolLike);
  article.appendChild(tombolHapus);

  return article;
}

daftarPortofolio.forEach((data) => {
  containerPortofolio.appendChild(buatItemPortofolio(data));
});


/* ==========================================================
   TUGAS MANDIRI MODUL 4: Tombol tambah item portofolio baru
   ========================================================== */
const tombolTambah = document.querySelector("#btn-tambah");

tombolTambah.addEventListener("click", () => {
  const judulBaru = prompt("Masukkan judul portofolio/pengalaman:");
  if (judulBaru === null) return; // pengguna menekan Cancel

  const isiBaru = prompt("Masukkan deskripsi singkat:");
  if (isiBaru === null) return;

  if (judulBaru.trim() === "" || isiBaru.trim() === "") {
    alert("Judul dan deskripsi tidak boleh kosong!");
    return;
  }

  const dataBaru = {
    judul: judulBaru.trim(),
    tanggal: new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    isi: isiBaru.trim(),
  };

  containerPortofolio.appendChild(buatItemPortofolio(dataBaru));
});


/* ==========================================================
   MODUL 4 LANGKAH 5 + MODUL 5 LANGKAH 2:
   Event delegation (satu listener untuk tombol Hapus & Like)
   ========================================================== */
containerPortofolio.addEventListener("click", (e) => {
  // Tombol Hapus
  if (e.target.classList.contains("btn-hapus")) {
    e.target.closest("article").remove();
  }

  // Tombol Like (diperiksa lewat class agar tidak tertukar dengan Hapus)
  if (e.target.classList.contains("btn-like")) {
    let jumlah = parseInt(e.target.dataset.like || 0);
    jumlah++;
    e.target.dataset.like = jumlah;
    e.target.textContent = `Like (${jumlah})`;
  }
});


/* ==========================================================
   MODUL 5 - LANGKAH 1: Efek hover pada artikel (mouseover/out)
   ========================================================== */
containerPortofolio.addEventListener("mouseover", (e) => {
  const article = e.target.closest("article");
  if (article) article.classList.add("artikel-hover");
});

containerPortofolio.addEventListener("mouseout", (e) => {
  const article = e.target.closest("article");
  if (article) article.classList.remove("artikel-hover");
});


/* ==========================================================
   MODUL 5 - LANGKAH 3 & 4: Form komentar + preventDefault
   + render komentar ke DOM
   ========================================================== */
const formKomentar = document.querySelector("#form-komentar");
const inputNama = document.querySelector("#input-nama");
const inputPesan = document.querySelector("#input-pesan");
const pesanError = document.querySelector("#pesan-error");
const daftarKomentar = document.querySelector("#daftar-komentar");

const MIN_KARAKTER_PESAN = 5;

formKomentar.addEventListener("submit", (e) => {
  e.preventDefault(); // cegah halaman reload

  const nama = inputNama.value.trim();
  const pesan = inputPesan.value.trim();

  // Tugas mandiri Modul 5: validasi dengan pesan error di halaman (bukan alert)
  if (nama === "" || pesan === "") {
    pesanError.textContent = "Nama dan komentar wajib diisi!";
    return;
  }

  if (pesan.length < MIN_KARAKTER_PESAN) {
    pesanError.textContent = `Komentar minimal ${MIN_KARAKTER_PESAN} karakter.`;
    return;
  }

  pesanError.textContent = ""; // validasi lolos, hapus pesan error

  // Render komentar baru ke DOM
  const itemKomentar = document.createElement("li");

  const teksKomentar = document.createElement("span");
  teksKomentar.textContent = `${nama}: ${pesan}`;

  // Tugas mandiri Modul 5: tombol hapus pada tiap komentar
  const tombolHapusKomentar = document.createElement("button");
  tombolHapusKomentar.classList.add("btn-hapus-komentar");
  tombolHapusKomentar.textContent = "Hapus";

  itemKomentar.appendChild(teksKomentar);
  itemKomentar.appendChild(tombolHapusKomentar);
  daftarKomentar.appendChild(itemKomentar);

  formKomentar.reset(); // kosongkan form setelah dikirim
});

// Event delegation: hapus satu komentar
daftarKomentar.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-hapus-komentar")) {
    e.target.closest("li").remove();
  }
});

// Tugas mandiri Modul 5: tombol hapus semua komentar
const tombolHapusSemua = document.querySelector("#btn-hapus-semua");

tombolHapusSemua.addEventListener("click", () => {
  daftarKomentar.innerHTML = "";
});


/* ==========================================================
   MODUL 5 - LANGKAH 5: Keyboard shortcut dark mode (tombol "d")
   ========================================================== */
document.addEventListener("keydown", (e) => {
  // Abaikan jika sedang mengetik di form agar tidak mengganggu
  const tag = e.target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return;

  if (e.key.toLowerCase() === "d") {
    toggleTema();
  }
});


/* ==========================================================
   MODUL 5 - OPSIONAL: Tombol "kembali ke atas" (event scroll)
   ========================================================== */
const tombolAtas = document.querySelector("#btn-atas");
const BATAS_SCROLL = 300;

window.addEventListener("scroll", () => {
  tombolAtas.classList.toggle("tampil", window.scrollY > BATAS_SCROLL);
});

tombolAtas.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
