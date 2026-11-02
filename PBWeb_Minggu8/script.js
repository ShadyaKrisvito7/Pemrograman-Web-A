
const judulSitus = document.querySelector("header h1");
console.log(judulSitus);
console.log(judulSitus.textContent);



const tombolTema = document.querySelector("#btn-tema");

function toggleTema() {
    document.body.classList.toggle("dark-mode");

    const modeGelapAktif = document.body.classList.contains("dark-mode");
    tombolTema.textContent = modeGelapAktif ? "Mode Terang" : "Mode Gelap";
}

tombolTema.addEventListener("click", toggleTema);


const tombolInfo = document.querySelector("#btn-info");
const kotakAside = document.querySelector("aside");

tombolInfo.addEventListener("click", () => {
    kotakAside.classList.toggle("tersembunyi");
});


const daftarPortofolio = [
    {
        judul: "Mulai Belajar Pemrograman",
        tanggal: "Awal Perkuliahan",
        isi: "Sebagai mahasiswa Informatika, saya mulai mempelajari dasar-dasar pemrograman dan berbagai hal yang berkaitan dengan teknologi."
    },
    {
        judul: "Belajar Pengembangan Web",
        tanggal: "Saat Ini",
        isi: "Saya terus mencoba memahami cara membuat website sederhana menggunakan HTML, CSS, dan JavaScript."
    },
    {
        judul: "Tujuan ke Depan",
        tanggal: "Rencana",
        isi: "Saya ingin meningkatkan kemampuan di bidang pemrograman dan pengembangan web sebagai bekal mencapai tujuan di bidang teknologi."
    }
];

const containerPortofolio = document.querySelector("#daftar-portofolio");


// Fungsi membuat item portofolio
function buatItemPortofolio(data) {
    const article = document.createElement("article");

    const judul = document.createElement("h3");
    judul.textContent = data.judul;

    const waktu = document.createElement("time");
    waktu.textContent = data.tanggal;

    const isi = document.createElement("p");
    isi.textContent = data.isi;

    const tombolLike = document.createElement("button");
    tombolLike.classList.add("btn-like");

    let jumlahLike = 0;
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


// Menampilkan data portofolio
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
            year: "numeric"
        }),
        isi: isiBaru.trim()
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
    }

});


containerPortofolio.addEventListener("mouseover", (e) => {
    const article = e.target.closest("article");

    if (article) {
        article.classList.add("artikel-hover");
    }
});

containerPortofolio.addEventListener("mouseout", (e) => {
    const article = e.target.closest("article");

    if (article) {
        article.classList.remove("artikel-hover");
    }
});


const bagianArtikelAPI = document.createElement("section");
bagianArtikelAPI.innerHTML = `
    <h2>ARTIKEL DARI API</h2>
    <p id="loading">Memuat artikel...</p>
    <div id="daftar-artikel-api"></div>
`;

containerPortofolio.parentElement.appendChild(bagianArtikelAPI);

const loading = document.querySelector("#loading");
const containerArtikel = document.querySelector("#daftar-artikel-api");


async function muatArtikelDariAPI() {

    loading.style.display = "block";

    try {

        const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts?_limit=5"
        );

        if (!response.ok) {
            throw new Error("Status: " + response.status);
        }

        const daftarPost = await response.json();

        console.log("Data artikel dari API:", daftarPost);

        daftarPost.forEach((post) => {

            const article = document.createElement("article");

            const judul = document.createElement("h3");
            judul.textContent = post.title;

            const isi = document.createElement("p");
            isi.textContent = post.body;

            const tombolLike = document.createElement("button");
            tombolLike.classList.add("btn-like");

            let jumlahLike = 0;
            tombolLike.dataset.like = jumlahLike;
            tombolLike.textContent = `Like (${jumlahLike})`;

            const tombolHapus = document.createElement("button");
            tombolHapus.classList.add("btn-hapus");
            tombolHapus.textContent = "Hapus";

            article.appendChild(judul);
            article.appendChild(isi);
            article.appendChild(tombolLike);
            article.appendChild(tombolHapus);

            containerArtikel.appendChild(article);

        });

    } catch (error) {

        containerArtikel.innerHTML =
            "<p>Gagal memuat artikel, silakan coba lagi nanti.</p>";

        console.error("Gagal mengambil data artikel:", error);

    } finally {

        loading.style.display = "none";

    }
}

muatArtikelDariAPI();


async function muatProfilPenulis() {

    try {

        const response = await fetch(
            "https://jsonplaceholder.typicode.com/users/1"
        );

        if (!response.ok) {
            throw new Error("Status: " + response.status);
        }

        const user = await response.json();

        console.log("Data pengguna:", user);

        const bagianProfil = document.createElement("div");

        const judulProfil = document.createElement("h3");
        judulProfil.textContent = "Tentang Penulis";

        const namaPenulis = document.createElement("p");
        namaPenulis.textContent = "Nama: " + user.name;

        const emailPenulis = document.createElement("p");
        emailPenulis.textContent = "Email: " + user.email;

        bagianProfil.appendChild(judulProfil);
        bagianProfil.appendChild(namaPenulis);
        bagianProfil.appendChild(emailPenulis);

        kotakAside.appendChild(bagianProfil);

    } catch (error) {

        console.error("Gagal memuat profil penulis:", error);

    }
}

muatProfilPenulis();


const formKomentar = document.querySelector("#form-komentar");
const inputNama = document.querySelector("#input-nama");
const inputPesan = document.querySelector("#input-pesan");
const pesanError = document.querySelector("#pesan-error");
const daftarKomentar = document.querySelector("#daftar-komentar");

const MIN_KARAKTER_PESAN = 5;


// Fungsi membuat komentar
function buatKomentar(nama, pesan) {

    const itemKomentar = document.createElement("li");

    const teksKomentar = document.createElement("span");
    teksKomentar.textContent = `${nama}: ${pesan}`;

    const tombolHapusKomentar = document.createElement("button");
    tombolHapusKomentar.classList.add("btn-hapus-komentar");
    tombolHapusKomentar.textContent = "Hapus";

    itemKomentar.appendChild(teksKomentar);
    itemKomentar.appendChild(tombolHapusKomentar);

    daftarKomentar.appendChild(itemKomentar);
}


// Mengambil komentar awal dari API
async function muatKomentarDariAPI() {

    try {

        const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts/1/comments"
        );

        if (!response.ok) {
            throw new Error("Status: " + response.status);
        }

        const daftarKomentarAPI = await response.json();

        console.log("Data komentar dari API:", daftarKomentarAPI);

        daftarKomentarAPI.forEach((komentar) => {

            buatKomentar(
                komentar.name,
                komentar.body
            );

        });

    } catch (error) {

        console.error("Gagal memuat komentar:", error);

        pesanError.textContent =
            "Komentar awal gagal dimuat dari server.";

    }

}

muatKomentarDariAPI();


formKomentar.addEventListener("submit", (e) => {

    e.preventDefault();

    const nama = inputNama.value.trim();
    const pesan = inputPesan.value.trim();

    if (nama === "" || pesan === "") {

        pesanError.textContent =
            "Nama dan komentar wajib diisi!";

        return;

    }

    if (pesan.length < MIN_KARAKTER_PESAN) {

        pesanError.textContent =
            `Komentar minimal ${MIN_KARAKTER_PESAN} karakter.`;

        return;

    }

    pesanError.textContent = "";

    buatKomentar(nama, pesan);

    formKomentar.reset();

});


daftarKomentar.addEventListener("click", (e) => {

    if (e.target.classList.contains("btn-hapus-komentar")) {

        e.target.closest("li").remove();

    }

});


const tombolHapusSemua = document.querySelector("#btn-hapus-semua");

tombolHapusSemua.addEventListener("click", () => {

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

    tombolAtas.classList.toggle(
        "tampil",
        window.scrollY > BATAS_SCROLL
    );

});

tombolAtas.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});
