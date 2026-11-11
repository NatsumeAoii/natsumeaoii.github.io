import { useSettings } from '../context/settings';

export function NotFound() {
    const { locale } = useSettings();

    const text = locale === 'id'
        ? { title: 'Halaman tidak ditemukan', desc: 'Halaman yang Anda cari tidak ada atau telah dipindahkan.', back: 'Kembali ke portofolio' }
        : { title: 'Page not found', desc: "The page you're looking for doesn't exist or has been moved.", back: 'Back to portfolio' };

    return (
        <div className="not-found">
            <span className="not-found-code">404</span>
            <h1>{text.title}</h1>
            <p>{text.desc}</p>
            <a href="/" className="btn-primary">
                {text.back}
            </a>
        </div>
    );
}
