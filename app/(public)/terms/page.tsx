import { PageHeader } from '@/components/page-header';

export default function TermsPage() {
  return (
    <>
      <PageHeader
        title="Syarat & Ketentuan"
        description="Ketentuan umum yang berlaku saat Anda menggunakan website ini."
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-3xl space-y-6 text-muted-foreground leading-relaxed text-sm">
        <section className="space-y-2">
          <h2 className="text-foreground text-base font-semibold">Penggunaan website</h2>
          <p>
            Anda setuju untuk menggunakan website ini hanya untuk tujuan yang sah. Dilarang mengakses
            website ini dengan cara yang dapat mengganggu, merusak, atau menguji kerentanan sistem
            tanpa izin tertulis dari kami.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-foreground text-base font-semibold">Hak kekayaan intelektual</h2>
          <p>
            Seluruh konten di website ini (teks, branding, dan desain) adalah milik PT. RFT Digital Solution
            atau pemberi lisensinya, kecuali dinyatakan sebaliknya. Penyalinan atau distribusi
            ulang tanpa izin tidak diperkenankan.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-foreground text-base font-semibold">Batasan tanggung jawab</h2>
          <p>
            Materi di website ini disediakan untuk informasi umum. Kami tidak menjamin bahwa website ini
            akan selalu tersedia tanpa gangguan. Sejauh diizinkan oleh hukum, kami membatasi tanggung jawab
            yang timbul dari penggunaan website ini.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-foreground text-base font-semibold">Perubahan ketentuan</h2>
          <p>
            Kami dapat memperbarui syarat dan ketentuan ini dari waktu ke waktu. Penggunaan website yang
            berlanjut setelah perubahan dianggap sebagai persetujuan terhadap ketentuan yang telah direvisi.
          </p>
        </section>
      </div>
    </>
  );
}
