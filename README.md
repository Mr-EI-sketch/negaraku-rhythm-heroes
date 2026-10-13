# NEGARAKU: RHYTHM HEROES

Permainan web Muzik Tahun 1 Proaktif dengan empat misi, peta kemajuan, ganjaran, XP dan bintang. Murid memasukkan nama serta kelas. Selepas misi terakhir, markah keseluruhan dan markah setiap misi dihantar ke Google Sheet cikgu.

## Cara cikgu sambungkan Google Sheet

Sambungan dibuat sekali sahaja daripada akaun Google cikgu. Tiada aplikasi berbayar diperlukan.

1. Cipta Google Sheet kosong dalam akaun cikgu.
2. Dalam helaian itu, pilih **Extensions → Apps Script**.
3. Gantikan kandungan `Code.gs` dengan kod dalam [apps-script/Code.gs](apps-script/Code.gs), kemudian tekan **Save**.
4. Pilih **Deploy → New deployment → Web app**. Pilih **Execute as: Me**. Untuk murid menghantar tanpa log masuk, pilih akses **Anyone** jika dibenarkan oleh tetapan sekolah. Tekan **Deploy** dan benarkan akses apabila diminta.
5. Salin URL deployment yang berakhir dengan `/exec`.
6. Buka permainan, tekan **Guru**, tampal URL itu, kemudian tekan **Simpan & jana pautan murid**.
7. Tekan **Salin pautan kelas** dan hantar pautan tersebut kepada murid. Mereka masukkan nama dan kelas; selepas semua empat misi selesai, satu rekod akan ditambah automatik ke tab **Markah Murid**.

Jika tetapan sekolah tidak membenarkan akses web app **Anyone**, minta pentadbir sekolah menyediakan pilihan yang diluluskan untuk menerima markah. Pautan kelas mengandungi alamat penerima; kongsi hanya kepada kelas yang berkenaan. Google Sheet kekal dalam akaun cikgu dan tidak boleh dibaca melalui pautan permainan.

Rekod mengandungi tarikh dan masa, nama, kelas, jumlah XP dan bintang, XP serta bintang bagi setiap misi. ID pengembaraan mengelakkan penghantaran semula yang berganda apabila murid cuba menghantar semula.

## Bahan lirik

Permainan tidak membekalkan lirik lagu. Cikgu boleh tampal petikan yang dibekalkan dalam **Tetapan Guru**; petikan itu disimpan dalam pelayar peranti tersebut sahaja.

