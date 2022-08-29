const ad = document.getElementById('ad');
const soyad = document.getElementById('soyad');
const mail = document.getElementById('mail');

const form = document.getElementById('form-rehber');
const kisiListesi = document.querySelector('.kisi-listesi');

//event listenerların tanımlanması
form.addEventListener('submit', kaydet);
kisiListesi.addEventListener('click', kisiIslemleriYap);

// tüm kişiler için dizi

const tumKisilerDizisi = [];
let secilenSatir = undefined;

function kisiIslemleriYap(event) {

    if (event.target.classList.contains('btn--delete')) {
        const silenecekTR = event.target.parentElement.parentElement;
        const silinecekMail = event.target.parentElement.previousElementSibling.textContent;
        kisiSil(silenecekTR, silinecekMail);
    } else if (event.target.classList.contains('btn--edit')) {
        document.querySelector('.kaydetGuncelle').value = 'Guncelle';
        const secilenTR = event.target.parentElement.parentElement;
        const guncellenecekMail = secilenTR.cells[2].textContent;

        ad.value = secilenTR.cells[0].textContent;
        soyad.value = secilenTR.cells[1].textContent;
        mail.value = secilenTR.cells[2].textContent;

        secilenSatir = secilenTR;
        console.log(tumKisilerDizisi);
    }
}

function kisiSil(silinecekTrElement, silinecekMail) {

    silinecekTrElement.remove();
    console.log(silinecekTrElement, silinecekMail);

    // //mailie göre silme işlemi

    // tumKisilerDizisi.forEach((kisi, index) => {
    //     if (kisi.mail === silinecekMail) {
    //         tumKisilerDizisi.splice(index, 1);
    //     }
    // });

    const silinmeyecekKisiler = tumKisilerDizisi.filter(function (kisi, index) {
        return kisi.mail !== silinecekMail;
    });

    tumKisilerDizisi.length = 0;
    tumKisilerDizisi.push(...silinmeyecekKisiler);

    alanlarıTemizle();
    document.querySelector('.kaydetGuncelle').value = 'Kaydet';

}

function kaydet(e) {
    e.preventDefault();

    const eklenececekVeyaGuncellenecekKisi = {
        ad: ad.value,
        soyad: soyad.value,
        mail: mail.value
    }

    const sonuc = verileriKontrolEt(eklenececekVeyaGuncellenecekKisi);
    if (sonuc.durum) {

        if (secilenSatir) {

            kisiyiGuncelle(eklenececekVeyaGuncellenecekKisi);
        } else {
            kisiyiEkle(eklenececekVeyaGuncellenecekKisi);
        }

    } else {
        bilgiOlustur(sonuc.mesaj, sonuc.durum);

    }



}

function kisiyiGuncelle(kisi) {
    // kişi parametresinde seçilen kişinin yeni değerleri vardır.
    // secilen satırda eski değerler...

    for (let i = 0; i < tumKisilerDizisi.length; i++) {
        if (tumKisilerDizisi[i].mail === secilenSatir.cells[2].textContent) {
            tumKisilerDizisi[i] = kisi;
            break;
        }
    }

    secilenSatir.cells[0].textContent = kisi.ad;
    secilenSatir.cells[1].textContent = kisi.soyad;
    secilenSatir.cells[2].textContent = kisi.mail;

    document.querySelector('.kaydetGuncelle').value = 'Kaydet';
    secilenSatir = undefined;

    console.log(tumKisilerDizisi);
}


function kisiyiEkle(eklenecekKisi) {

    const olusturulanTrElementi = document.createElement('tr');
    olusturulanTrElementi.innerHTML = `<td>${eklenecekKisi.ad}</td>
    <td>${eklenecekKisi.soyad}</td>
    <td>${eklenecekKisi.mail}</td>
    <td>
        <button class="btn btn--edit"><i class="far fa-edit"></i></button>
        <button class="btn btn--delete"><i class="far fa-trash-alt"></i></button>

    </td>`;

    kisiListesi.appendChild(olusturulanTrElementi);
    tumKisilerDizisi.push(eklenecekKisi);

    bilgiOlustur('Kişi Rehbere Kaydedildi', true);
    

}

function verileriKontrolEt(kisi) {
    // objelerde in kullanımı
    for (const deger in kisi) {
        if (kisi[deger]) {
           // console.log(kisi[deger]);
        } else {

            const sonuc = {
                durum: false,
                mesaj: 'Boş alan bırakmayınız'
            }
            return sonuc;

        }
    }
    alanlarıTemizle();
    return {
        durum: true,
        mesaj: 'Kaydedildi'
    }
}

function bilgiOlustur(mesaj, durum) {
    const olusturulanBilgi = document.createElement('div');
    olusturulanBilgi.textContent = mesaj;
    olusturulanBilgi.className = 'bilgi';


    /*          ---- UZUN VERSİYON ----
      if (durum) {
      olusturulanBilgi.classList.add('bilgi--success');
  } else {
      olusturulanBilgi.classList.add('bilgi--error');
  }*/

    olusturulanBilgi.classList.add(durum ? 'bilgi--success' : 'bilgi--error');
    document.querySelector('.container').insertBefore(olusturulanBilgi, form);

    // setTimeOut, setInterval
    setTimeout(function () {
        const silinecekDiv = document.querySelector('.bilgi')
        if (silinecekDiv) {
            silinecekDiv.remove();
        }
    }, 2000);

}

function alanlarıTemizle() {
    ad.value = '';
    soyad.value = '';
    mail.value = '';
}