
class SalamPengguna extends HTMLElement {
    connectedCallback() {
        const nama = this.getAttribute("nama") || "Tamu";
        this.textContent = `Halo, ${nama}! Selamat datang di blog.`;
    }
}
customElements.define("salam-pengguna", SalamPengguna);



class KartuArtikel extends HTMLElement {
    #like = 0;

    static get observedAttributes() {
        return ["judul", "isi"];
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {
        console.log("kartu-artikel dilepas");
    }

    attributeChangedCallback() {
        if (this.isConnected) {
            this.render();
        }
    }

    render() {
        this.innerHTML = `<article class="kartu"><h3></h3><p></p>
            <button class="btn-like"></button>
            <button class="btn-hapus">Hapus</button></article>`;

        this.querySelector("h3").textContent = this.getAttribute("judul") ?? "";
        this.querySelector("p").textContent  = this.getAttribute("isi")   ?? "";

        const like = this.querySelector(".btn-like");
        like.textContent = `Like (${this.#like})`;
        like.addEventListener("click", () => {
            this.#like++;
            like.textContent = `Like (${this.#like})`;
        });

        this.querySelector(".btn-hapus")
            .addEventListener("click", () => this.remove());
    }
}
customElements.define("kartu-artikel", KartuArtikel);