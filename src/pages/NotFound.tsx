import { useSettings } from '../context/settings';

export function NotFound() {
    const { locale } = useSettings();

    const text = locale === 'id'
        ? { title: 'Halaman tidak ditemukan', desc: 'Halaman yang Anda cari tidak ada atau telah dipindahkan.', back: 'Kembali ke portofolio' }
        : { title: 'Page not found', desc: "The page you're looking for doesn't exist or has been moved.", back: 'Back to portfolio' };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="font-display text-6xl font-bold bg-gradient-to-br from-accent-start to-accent-end bg-clip-text text-transparent">
                404
            </div>
            <h1 className="font-display text-2xl font-bold text-heading">{text.title}</h1>
            <p className="max-w-md text-sm text-muted">{text.desc}</p>
            <a
                href="/"
                className="mt-2 rounded-full bg-gradient-to-r from-accent-start to-accent-mid px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-start/25 transition-all hover:shadow-xl hover:shadow-accent-start/40 hover:brightness-110"
            >
                {text.back}
            </a>
        </div>
    );
}
