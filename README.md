# Jawaban Latihan Soal Evaluasi Mandiri — Modul 6 Validasi Form

## 1. Mengapa validasi client-side tidak boleh menjadi satu-satunya lapisan validasi?

Kode yang berjalan di browser sepenuhnya berada di bawah kendali pengguna, sehingga mudah dilewati. Pengguna dapat menonaktifkan JavaScript, mengubah atau menghapus atribut seperti `required` dan `pattern` lewat DevTools, atau mengirim request langsung ke server tanpa melalui form menggunakan alat seperti Postman atau `curl`. Akibatnya, data yang tidak valid bahkan berbahaya, misalnya untuk serangan SQL injection atau XSS, tetap bisa masuk ke server. Validasi client-side hanya berfungsi untuk kenyamanan pengguna karena memberi umpan balik cepat tanpa menunggu respons server, sedangkan lapisan keamanan yang sebenarnya adalah validasi ulang di sisi server.



## 2. Atribut validasi bawaan HTML5 dan fungsinya

Atribut `required` membuat sebuah field wajib diisi sehingga tidak boleh dikosongkan. Atribut `minlength` dan `maxlength` membatasi jumlah karakter minimal dan maksimal yang boleh dimasukkan. Atribut `min` dan `max` membatasi nilai terendah dan tertinggi pada input bertipe angka atau tanggal. Atribut `pattern` mewajibkan isian cocok dengan sebuah regular expression, misalnya untuk username yang hanya boleh huruf kecil, angka, dan underscore. Atribut `type` seperti `email`, `url`, atau `number` memeriksa format isian sesuai tipenya. Terakhir, atribut `step` menentukan kelipatan nilai yang diizinkan pada input angka atau tanggal.



## 3. Perbedaan `checkValidity()` dan `reportValidity()`

Keduanya sama-sama memeriksa apakah sebuah field memenuhi aturan validasi dan mengembalikan `true` jika valid atau `false` jika tidak. Perbedaannya ada pada tampilan: `checkValidity()` hanya melakukan pengecekan secara senyap tanpa menampilkan apa pun kepada pengguna, sehingga cocok dipakai ketika pesan error ingin ditampilkan sendiri lewat elemen di DOM. Sebaliknya, `reportValidity()` selain memeriksa juga langsung memunculkan pesan error bawaan browser berupa bubble dan memindahkan fokus ke field yang bermasalah.



## 4. Fungsi `setCustomValidity("")` dan alasan pentingnya dipanggil setelah error diperbaiki

Pemanggilan `setCustomValidity("pesan")` menandai sebuah field sebagai tidak valid dengan pesan kustom, sehingga `checkValidity()` akan bernilai `false`. Sebaliknya, `setCustomValidity("")` dengan string kosong menghapus status error kustom tersebut sehingga field kembali dianggap valid. Pemanggilan ini penting karena status error kustom tidak hilang dengan sendirinya. Jika tidak di-reset, field akan terus dianggap tidak valid dan form tidak bisa dikirim, meskipun pengguna sudah memperbaiki isiannya.



## 5. Aturan validasi "Tanggal Lahir" tidak boleh di masa depan

Aturannya ada dua: field tanggal lahir wajib diisi, dan tanggal yang dipilih tidak boleh lebih besar dari tanggal hari ini. Saat membandingkan, bagian jam pada tanggal hari ini diabaikan sehingga yang dibandingkan hanya tanggalnya. Pseudocode-nya sebagai berikut:

```
FUNGSI validasiTanggalLahir(input, errorEl):
    hariIni = tanggal hari ini (jam diabaikan)

    JIKA input.value KOSONG:
        pesan = "Tanggal lahir wajib diisi"
    SELAIN ITU JIKA tanggal(input.value) > hariIni:
        pesan = "Tanggal lahir tidak boleh di masa depan"
    SELAIN ITU:
        pesan = ""

    input.setCustomValidity(pesan)
    errorEl.textContent = pesan
    KEMBALIKAN pesan == ""
```

Sebagai lapisan tambahan, atribut `max` pada input tanggal juga dapat diisi dengan tanggal hari ini agar kalender di browser langsung menolak tanggal masa depan.