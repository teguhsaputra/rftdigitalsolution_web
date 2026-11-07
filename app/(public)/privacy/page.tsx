import { PageHeader } from '@/components/page-header';
import { getBrandSettings } from '@/lib/brand-settings-db';

export default async function PrivacyPage() {
  const { contactEmail } = await getBrandSettings();
  return (
    <>
      <PageHeader
        title="Privacy Policy"
        description="Bagaimana kami mengelola informasi yang Anda bagikan melalui website ini."
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-3xl space-y-6 text-muted-foreground leading-relaxed text-sm">
        <section className="space-y-2">
          <h2 className="text-foreground text-base font-semibold">Informasi yang kami kumpulkan</h2>
          <p>
            Ketika Anda menghubungi kami lewat WhatsApp atau email, kami memproses informasi yang Anda
            berikan (seperti nama, nomor/alamat email, dan isi pesan) untuk merespons
            pertanyaan Anda.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-foreground text-base font-semibold">Cookies dan analytics</h2>
          <p>
            Website ini menggunakan cookies esensial yang diperlukan untuk operasional. Jika di kemudian
            hari kami menambahkan tools analytics atau pihak ketiga, kebijakan ini akan diperbarui dan
            mekanisme persetujuan akan diterapkan sesuai kebutuhan.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-foreground text-base font-semibold">Penyimpanan data</h2>
          <p>
            Data korespondensi hanya disimpan selama diperlukan untuk tujuan pengumpulannya, kecuali jika
            periode yang lebih lama diwajibkan oleh hukum yang berlaku.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-foreground text-base font-semibold">Kontak</h2>
          <p>
            Untuk pertanyaan terkait privasi, silakan hubungi{' '}
            <a href={`mailto:${contactEmail}`} className="text-white underline-offset-4 hover:underline">
              {contactEmail}
            </a>
            .
          </p>
        </section>
      </div>
    </>
  );
}
