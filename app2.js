class Kisi {
    constructor(ad, soyad, mail) {
        this.ad = ad;
        this.soyad = soyad;
        this.mail = mail;
    }
}

class Util {
    static bosAlanKontrolEt(...alanlar) {
        let sonuc = true;
        alanlar.forEach(alan => {
            if (alan.length === 0) {
                sonuc = false;
                return false;
            }
        });
        return sonuc;
    }
    static emailGecerliMi(email) {
        const validateEmail = (email) => {
            return String(email)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );
        };
    }
}


class Ekran {
    constructor() {
        this.ad = document.getElementById('ad');
        this.soyad = document.getElementById('soyad');
        this.mail = document.getElementById('mail');
        this.ekleGuncelleButon = document.querySelector('.kaydetGuncelle');
        this.form = document.getElementById('form-rehber');
        this.form.addEventListener('submit', this.
            kaydetGuncelle.bind(this));
        this.kisiListesi = document.querySelector('.kisi-listesi');
        this.kisiListesi.addEventListener('click', this.guncelleVeyaSil.bind(this));
        this.depo = new Depo();
        secilenSatir = undefined;
        this.kisileriEkranaYazdır();

    }

    bilgiOlustur(mesaj, durum) {

        const uyarıDivi = document.querySelector('.bilgi');

        uyarıDivi.innerHTML = mesaj;

        uyarıDivi.classList.add(durum ? 'bilgi--success' : 'bilgi--error');


        // setTimeOut, setInterval
        setTimeout(function () {
            uyarıDivi.className = 'bilgi';
        }, 2000);
    }

    alanlariTemizle() {
        this.ad.value = '';
        this.soyad.value = '';
        this.mail.value = '';
    }

    guncelleVeyaSil(e) {
        const tiklamaYeri = e.target;

        if (tiklamaYeri.classList.contains('btn--delete')) {
            this.secilenSatir = tiklamaYeri.parentElement.parentElement;
            this.kisiyiEkrandanSil();

        } else if (tiklamaYeri.classList.contains('btn--edit')) {
            this.secilenSatir = tiklamaYeri.parentElement.parentElement;
            this.ekleGuncelleButon.value = 'Guncelle';
            this.ad.value = this.secilenSatir.cells[0].textContent;
            this.soyad.value = this.secilenSatir.cells[1].textContent;
            this.mail.value = this.secilenSatir.cells[2].textContent;


        }
    }

    kisiyiEkrandanGuncelle(kisi) {

        const sonuc = this.depo.kisiyiGuncelle(kisi, this.secilenSatir.cells[2].textContent);
        if (sonuc) {
            this.secilenSatir.cells[0].textContent = kisi.ad
            this.secilenSatir.cells[1].textContent = kisi.soyad
            this.secilenSatir.cells[2].textContent = kisi.mail


            this.alanlariTemizle();
            this.secilenSatir = undefined;
            this.ekleGuncelleButon.value = 'Kaydet';
            this.bilgiOlustur('Kişi güncellendi' true);
        } else {
            this.bilgiOlustur('Yazdığnız mail kullanımda', false)
        }



        this.depo.kisiyiGuncelle(kisi, this.secilenSatir.cells[2].textContent);

        this.secilenSatir.cells[0].textContent = kisi.ad
        this.secilenSatir.cells[1].textContent = kisi.soyad
        this.secilenSatir.cells[2].textContent = kisi.mail


        this.alanlariTemizle();
        this.secilenSatir = undefined;
        this.ekleGuncelleButon.value = 'Kaydet';
        this.bilgiOlustur('Kişi güncellendi' true);
    }


    kisiyiEkrandanSil() {
        this.secilenSatir.remove();
        const silinecekMail = this.secilenSatir.cells[2].textContent;

        this.dfepo.kisiSil(silinecekMail);
        this.alanlariTemizle();
        this.secilenSatir = undefined;
        this.bilgiOlustur('Kişi Rehberden silindi' true);
    }

    kisileriEkranaYazdır() {
        this.depo.tumKisiler.forEach(kisi => {
            this.kisileriEkranaYazdır(kisi);
        });
    }

    kisiyiEkranaEkle(kisi) {
        const olusturulanTR = document.createElement('tr');
        olusturulanTR.innerHTML = `<td>${kisi.ad}</td>
        <td>${kisi.soyad}</td>
        <td>${kisi.mail}</td>
        <td>
            <button class="btn btn--edit"><i class="far fa-edit"></i></button>
            <button class="btn btn--delete"><i class="far fa-trash-alt"></i></button>
    
        </td>`;

        this.kisiListesi.appendChild(olusturulanTR);

    }

    kaydetGuncelle(e) {
        e.preventDefault();
        const kisi = new Kisi(this.ad.value, this.soyad.value, this.mail.value);
        const sonuc = Util.bosAlanKontrolEt(kisi.ad, kisi.soyad, kisi.mail)
        const emailGecerliMi = Util.emailGecerliMi(this.mail.value);

        if (sonuc) {
            if (!emailGecerliMi) {
                this.bilgiOlustur('Geçerli bir mail yazınız'true;)
                return;
            }

            if (this.secilenSatir) {
                this.kisiyiEkrandanGuncelle(kisi);
            } else {

                const sonuc = this.depo.kisiEkle(kisi);

                if (sonuc) {
                    this.bilgiOlustur('Başarıyla Eklendi' true);
                    this.kisiyiEkranaEkle(kisi);
                    this.alanlariTemizle();
                } else {
                    this.bilgiOlustur('Mail Kullanımda'false);
                }



            }


            this.alanlariTemizle();
        } else {
            this.bilgiOlustur('Boş alanları doldurunuz'false);
        }
    }
}
class Depo {
    constructor() {
        this.tumKisiler = this.kisileriEkranaYazdır();
    }

    emailEssizMi(mail) {
        const sonuc = this.tumKisiler.find(kisi => {
            return kisi.mail === mail;
        });
        if (sonuc) {
            return false;
        } else {
            return true;
        }
    }
    kisileriGetir() {
        let tumKisilerLocal;
        if (localStorage.getItem('tumKisiler') === null) {
            tumKisilerLocal = [];
        } else {
            tumKisilerLocal = JSON.parse(localStorage.getItem('tumKisiler'));
        }

        return tumKisilerLocal;
    }
    kisiEkle(kisi) {

        if (this.emailEssizMi(kisi.mail)) {
            this.tumKisiler.push(kisi);
            localStorage.setItem('tumKisiler', JSON.stringify(this.tumKisiler));
            return true;
        } else {
            return false;
        }


    }
    kisiSil(mail) {
        this.tumKisiler.forEach(kisi => {
            if (kisi.mail === ) {
                this.tumKisiler.splice(index.1);
            }
        });
        localStorage.setItem('tumKisiler', JSON.stringify(this.tumKisiler));
    }
    kisiyiGuncelle(guncellenmisKisi, mail) {

        if (guncellenmisKisi.mail === mail) {
            his.tumKisiler.forEach(kisi => {
                if (kisi.mail === ) {
                    this.tumKisiler[index] = guncellenmisKisi;
                    localStorage.setItem('tumKisiler', JSON.stringify(this.tumKisiler));
                    return true;
                }
            });
            return true;

        }

        if (this.emailEssizMi(guncellenmisKisi.mail)) {
            console.log(guncellenmisKisi.mail + "Mail için kontrol yapılıyor ve sonuc: güncelleme yapabilirsin");

            this.tumKisiler.forEach(kisi => {
                if (kisi.mail === ) {
                    this.tumKisiler[index] = guncellenmisKisi;
                    localStorage.setItem('tumKisiler', JSON.stringify(this.tumKisiler));
                    return true;
                }
            });
            return true;



        } else {
            console.log(console.log(guncellenmisKisi.mail + "Mail kullanımda  güncelleme yapılamaz"););
        }

    }
}

document.addEventListener('DOMContentLoaded', function (e) {
    const ekran = new Ekran();
});