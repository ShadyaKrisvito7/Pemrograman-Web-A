const form = document.querySelector("#formDaftar");

// Simulasi data username yang sudah terdaftar (pada aplikasi nyata dicek ke server)
const usernameTerpakai = ["admin", "mahasiswa", "budi123", "siti_aminah", "user01"];

const USIA_MIN = 15;
const USIA_MAX = 60;


const pesan = {
  nama: {
    valueMissing: "Nama lengkap wajib diisi.",
    tooShort: "Nama minimal 3 karakter.",
    patternMismatch: "Nama hanya boleh berisi huruf, spasi, titik, apostrof, dan tanda hubung.",
  },
  email: {
    valueMissing: "Email wajib diisi.",
    typeMismatch: "Format email tidak valid, contoh: nama@email.com",
  },
  hp: {
    valueMissing: "Nomor HP wajib diisi.",
    patternMismatch: "Gunakan nomor seluler Indonesia, mis. 08123456789 atau +628123456789.",
  },
  tglLahir: {
    valueMissing: "Tanggal lahir wajib diisi.",
    badInput: "Tanggal tidak valid.",
    rangeOverflow: `Usia minimal ${USIA_MIN} tahun untuk mendaftar.`,
    rangeUnderflow: "Tanggal lahir terlalu lama, periksa kembali.",
  },
  gender: { valueMissing: "Pilih jenis kelamin." },
  agama: { valueMissing: "Pilih agama." },
  alamat: {
    valueMissing: "Alamat asal wajib diisi.",
    tooShort: "Alamat terlalu singkat, tulis minimal 10 karakter.",
  },
  kota: {
    valueMissing: "Kabupaten/kota wajib diisi.",
    tooShort: "Nama kabupaten/kota minimal 3 karakter.",
    patternMismatch: "Kabupaten/kota hanya boleh berisi huruf, spasi, titik, apostrof, dan tanda hubung.",
  },
  provinsi: {
    valueMissing: "Provinsi wajib diisi.",
    tooShort: "Nama provinsi minimal 3 karakter.",
    patternMismatch: "Provinsi hanya boleh berisi huruf, spasi, titik, apostrof, dan tanda hubung.",
  },
  sekolah: {
    valueMissing: "Asal sekolah wajib diisi.",
    tooShort: "Nama sekolah minimal 3 karakter.",
  },
  nilai: {
    valueMissing: "Rata-rata nilai rapor wajib diisi.",
    badInput: "Masukkan angka yang valid.",
    rangeUnderflow: "Nilai minimal 60 untuk dapat mendaftar.",
    rangeOverflow: "Nilai maksimal 100.",
    stepMismatch: "Gunakan paling banyak dua angka desimal.",
  },
  jalur: { valueMissing: "Pilih jalur pendaftaran." },
  prodi: { valueMissing: "Pilih program studi." },
  username: {
    valueMissing: "Username wajib diisi.",
    patternMismatch: "Username 4–15 karakter: hanya huruf kecil, angka, dan underscore (_).",
  },
  password: {
    valueMissing: "Password wajib diisi.",
    tooShort: "Password minimal 8 karakter.",
    patternMismatch: "Password harus mengandung huruf besar, huruf kecil, dan angka.",
  },
  konfirmasi: { valueMissing: "Ulangi password Anda." },
};


const urutanKesalahan = [
  "valueMissing", "badInput", "typeMismatch", "tooShort",
  "rangeUnderflow", "rangeOverflow", "stepMismatch", "patternMismatch",
];


const semuaKontrol = [...form.elements].filter(
  (el) => el.name && !["submit", "reset", "button"].includes(el.type)
);
const namaField = [...new Set(semuaKontrol.map((el) => el.name))];

const wakil = (nama) => semuaKontrol.find((el) => el.name === nama);
const grup = (nama) => semuaKontrol.filter((el) => el.name === nama);


function pesanBawaan(el) {
  const v = el.validity;
  const peta = pesan[el.name] || {};
  for (const jenis of urutanKesalahan) {
    if (v[jenis]) return peta[jenis] || el.validationMessage;
  }
  return el.validationMessage || "Isian tidak valid.";
}


function aturanKustom(el) {
  const nilai = el.value;
  const f = form.elements;

  
  if (["text", "textarea"].includes(el.type) && nilai.trim() === "") {
    return "Isian tidak boleh hanya berisi spasi.";
  }

  switch (el.name) {
    case "email":
      
      if (!/\.[a-z]{2,}$/i.test(nilai)) {
        return "Domain email tidak lengkap, contoh: nama@email.com";
      }
      break;

    case "username":
      if (usernameTerpakai.includes(nilai.toLowerCase())) {
        return `Username "${nilai}" sudah terdaftar, pilih yang lain.`;
      }
      break;

    case "password": {
      const user = f.username.value.trim().toLowerCase();
      if (user.length >= 4 && nilai.toLowerCase().includes(user)) {
        return "Password tidak boleh mengandung username.";
      }
      break;
    }

    case "konfirmasi":
      
      if (nilai !== f.password.value) {
        return "Konfirmasi password tidak sama dengan password.";
      }
      break;
  }
  return "";
}


function hitungPesan(nama) {
  const el = wakil(nama);
  el.setCustomValidity(""); 

  let msg = "";
  if (!el.checkValidity()) {
    msg = pesanBawaan(el);
  } else {
    msg = aturanKustom(el);
  }
  el.setCustomValidity(msg); 
  return msg;
}

function validasiField(nama) {
  const msg = hitungPesan(nama);
  document.querySelector(`#err-${nama}`).textContent = msg;
  grup(nama).forEach((el) => el.setAttribute("aria-invalid", msg ? "true" : "false"));
  return msg === "";
}

function tandaiDisentuh(nama) {
  grup(nama).forEach((el) => el.classList.add("touched"));
}


function perbaruiKekuatan() {
  const p = form.elements.password.value;
  const bar = document.querySelector("#kekuatanBar");
  const teks = document.querySelector("#kekuatanTeks");
  const bawaan = "Minimal 8 karakter, kombinasi huruf besar, huruf kecil, dan angka.";

  if (!p) {
    bar.style.width = "0";
    teks.textContent = bawaan;
    return;
  }
  let skor = 0;
  if (p.length >= 8) skor++;
  if (p.length >= 12) skor++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) skor++;
  if (/\d/.test(p)) skor++;
  if (/[^A-Za-z0-9]/.test(p)) skor++;

  const level = skor <= 2 ? ["Lemah", "#d9534f", "33%"]
              : skor <= 3 ? ["Sedang", "#f0ad4e", "66%"]
              : ["Kuat", "#3d9a50", "100%"];
  bar.style.width = level[2];
  bar.style.background = level[1];
  teks.textContent = `Kekuatan password: ${level[0]}`;
}


namaField.forEach((nama) => {
  grup(nama).forEach((el) => {
    const jenisPilihan = el.type === "radio" || el.tagName === "SELECT";

    el.addEventListener("blur", () => {
      
      if (["text", "email", "tel", "textarea"].includes(el.type)) el.value = el.value.trim();
      tandaiDisentuh(nama);
      validasiField(nama);
    });

    el.addEventListener(jenisPilihan ? "change" : "input", () => {
      tandaiDisentuh(nama);
      validasiField(nama);

      
      if (nama === "password") {
        perbaruiKekuatan();
        if (form.elements.konfirmasi.classList.contains("touched")) validasiField("konfirmasi");
      }
      if (nama === "username" && form.elements.password.classList.contains("touched")) {
        validasiField("password");
      }
    });
  });
});


(function aturBatasTanggal() {
  const hariIni = new Date();
  const iso = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const maks = new Date(hariIni.getFullYear() - USIA_MIN, hariIni.getMonth(), hariIni.getDate());
  const min = new Date(hariIni.getFullYear() - USIA_MAX, hariIni.getMonth(), hariIni.getDate());
  form.elements.tglLahir.max = iso(maks);
  form.elements.tglLahir.min = iso(min);
})();


form.addEventListener("submit", (e) => {
  e.preventDefault();

  let elemenPertama = null;
  namaField.forEach((nama) => {
    tandaiDisentuh(nama);
    if (!validasiField(nama) && !elemenPertama) elemenPertama = wakil(nama);
  });

  if (elemenPertama) {
    elemenPertama.focus();
    elemenPertama.scrollIntoView({ behavior: "smooth", block: "center" });
    return; // data tidak diproses
  }

  
  usernameTerpakai.push(form.elements.username.value.toLowerCase());
  form.reset();
  window.scrollTo({ top: 0, behavior: "smooth" });
});


function bersihkanTampilan() {
  semuaKontrol.forEach((el) => {
    el.classList.remove("touched");
    el.removeAttribute("aria-invalid");
    el.setCustomValidity("");
  });
  document.querySelectorAll(".error").forEach((s) => (s.textContent = ""));
  perbaruiKekuatan();
}

form.addEventListener("reset", () => setTimeout(bersihkanTampilan, 0));


const tombolTema = document.querySelector("#tombolTema");
const root = document.documentElement;
const ikonTema = () => (tombolTema.textContent = root.dataset.theme === "dark" ? "☀️" : "🌙");
ikonTema();
tombolTema.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  ikonTema();
});