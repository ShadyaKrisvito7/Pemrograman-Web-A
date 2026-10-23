const judulSitus = document.querySelector("header h1");
console.log(judulSitus);
console.log(judulSitus.textContent);


function bacaJSON(storage, kunci, nilaiDefault) {
  try {
    const hasil = JSON.parse(storage.getItem(kunci));
    return hasil === null ? nilaiDefault : hasil;
  } catch (err) {
    return nilaiDefault;
  }
}

const tombolTema = document.querySelector("#btn-tema");

function perbaruiTeksTombolTema() {
  const modeGelapAktif = document.body.classList.contains("dark-mode");
  tombolTema.textContent = modeGelapAktif ? "Mode Terang" : "Mode Gelap";
}

function toggleTema() {
  document.body.classList.toggle("dark-mode");

  const temaSekarang = document.body.classList.contains("dark-mode")
    ? "dark"
    : "light";
  localStorage.setItem("tema", temaSekarang); 

  perbaruiTeksTombolTema();
}

function muatPreferensiTema() {
  const tema = localStorage.getItem("tema");
  if (tema === "dark") {
    document.body.classList.add("dark-mode");
  }
  perbaruiTeksTombolTema();
}

tombolTema.addEventListener("click", toggleTema);
muatPreferensiTema();




const tombolInfo = document.querySelector("#btn-info");
const kotakAside = document.querySelector("aside");

function muatPreferensiAside() {
  if (localStorage.getItem("asideTersembunyi") === "true") {
    kotakAside.classList.add("tersembunyi");
  }
}

tombolInfo.addEventListener("click", () => {
  const tersembunyi = kotakAside.classList.toggle("tersembunyi");
  localStorage.setItem("asideTersembunyi", tersembunyi);
});

muatPreferensiAside();

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

function simpanLike(judulArtikel, jumlah) {
  const semuaLike = bacaJSON(localStorage, "semuaLike", {});
  semuaLike[judulArtikel] = jumlah;
  localStorage.setItem("semuaLike", JSON.stringify(semuaLike));
}

function buatItemPortofolio(data) {
  const article = document.createElement("article");

  const judul = document.createElement("h3");
  judul.textContent = data.judul;

  const waktu = document.createElement("time");
  waktu.textContent = data.tanggal;

  const isi = document.createElement("p");
  isi.textContent = data.isi;

  const semuaLike = bacaJSON(localStorage, "semuaLike", {});
  const jumlahLike = semuaLike[data.judul] || 0;

  const tombolLike = document.createElement("button");
  tombolLike.classList.add("btn-like");
  tombolLike.dataset.like = jumlahLike;
  tombolLike.textContent = `Like (${jumlahLike})`;

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


const tombolTambah = document.querySelector("#btn-tambah");

tombolTambah.addEventListener("click", () => {
  const judulBaru = prompt("Masukkan judul portofolio/pengalaman:");
  if (judulBaru === null) return;

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

containerPortofolio.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-hapus")) {
    e.target.closest("article").remove();
  }

  if (e.target.classList.contains("btn-like")) {
    let jumlah = parseInt(e.target.dataset.like || 0);
    jumlah++;
    e.target.dataset.like = jumlah;
    e.target.textContent = `Like (${jumlah})`;

    const judul = e.target.closest("article").querySelector("h3").textContent;
    simpanLike(judul, jumlah); // simpan setiap perubahan
  }
});

containerPortofolio.addEventListener("mouseover", (e) => {
  const article = e.target.closest("article");
  if (article) article.classList.add("artikel-hover");
});

containerPortofolio.addEventListener("mouseout", (e) => {
  const article = e.target.closest("article");
  if (article) article.classList.remove("artikel-hover");
});

const formKomentar = document.querySelector("#form-komentar");
const inputNama = document.querySelector("#input-nama");
const inputPesan = document.querySelector("#input-pesan");
const pesanError = document.querySelector("#pesan-error");
const daftarKomentar = document.querySelector("#daftar-komentar");

const MIN_KARAKTER_PESAN = 5;

function ambilKomentar() {
  return bacaJSON(localStorage, "komentar", []);
}

function simpanSemuaKomentar(daftar) {
  localStorage.setItem("komentar", JSON.stringify(daftar));
}

function simpanKomentar(nama, pesan) {
  const daftar = ambilKomentar();
  daftar.push({ nama, pesan });
  simpanSemuaKomentar(daftar);
}

function buatItemKomentar(k) {
  const itemKomentar = document.createElement("li");

  const teksKomentar = document.createElement("span");
  teksKomentar.textContent = `${k.nama}: ${k.pesan}`;

  const tombolHapusKomentar = document.createElement("button");
  tombolHapusKomentar.classList.add("btn-hapus-komentar");
  tombolHapusKomentar.textContent = "Hapus";

  itemKomentar.appendChild(teksKomentar);
  itemKomentar.appendChild(tombolHapusKomentar);
  return itemKomentar;
}

function muatKomentar() {
  daftarKomentar.innerHTML = "";
  ambilKomentar().forEach((k) => {
    daftarKomentar.appendChild(buatItemKomentar(k));
  });
}

muatKomentar();

function simpanDraft() {
  sessionStorage.setItem(
    "draftKomentar",
    JSON.stringify({ nama: inputNama.value, pesan: inputPesan.value })
  );
}

function muatDraft() {
  const draft = bacaJSON(sessionStorage, "draftKomentar", null);
  if (draft) {
    inputNama.value = draft.nama || "";
    inputPesan.value = draft.pesan || "";
  }
}

inputNama.addEventListener("input", simpanDraft);
inputPesan.addEventListener("input", simpanDraft);
muatDraft();


formKomentar.addEventListener("submit", (e) => {
  e.preventDefault();

  const nama = inputNama.value.trim();
  const pesan = inputPesan.value.trim();

  if (nama === "" || pesan === "") {
    pesanError.textContent = "Nama dan komentar wajib diisi!";
    return;
  }

  if (pesan.length < MIN_KARAKTER_PESAN) {
    pesanError.textContent = `Komentar minimal ${MIN_KARAKTER_PESAN} karakter.`;
    return;
  }

  pesanError.textContent = "";

  simpanKomentar(nama, pesan); 
  daftarKomentar.appendChild(buatItemKomentar({ nama, pesan }));

  formKomentar.reset();
  sessionStorage.removeItem("draftKomentar"); 
});



daftarKomentar.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-hapus-komentar")) {
    const item = e.target.closest("li");
    const indeks = Array.from(daftarKomentar.children).indexOf(item);

    const daftar = ambilKomentar();
    daftar.splice(indeks, 1);
    simpanSemuaKomentar(daftar);

    item.remove();
  }
});


const tombolHapusSemua = document.querySelector("#btn-hapus-semua");

tombolHapusSemua.addEventListener("click", () => {
  localStorage.removeItem("komentar");
  daftarKomentar.innerHTML = "";
});




document.addEventListener("keydown", (e) => {
  const tag = e.target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return;

  if (e.key.toLowerCase() === "d") {
    toggleTema();
  }
});

const tombolAtas = document.querySelector("#btn-atas");
const BATAS_SCROLL = 300;

window.addEventListener("scroll", () => {
  tombolAtas.classList.toggle("tampil", window.scrollY > BATAS_SCROLL);
});

tombolAtas.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelector("#btn-reset").addEventListener("click", () => {
  const konfirmasi = confirm(
    "Hapus semua data tersimpan (tema, like, komentar)?"
  );
  if (konfirmasi) {
    localStorage.clear();
    sessionStorage.clear();
    location.reload(); 
  }
});