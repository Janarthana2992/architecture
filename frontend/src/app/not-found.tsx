import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
    title: "404 — Page Not Found | Ethos Habitats",
    description: "The page you are looking for does not exist.",
};

export default function NotFound() {
    return (
        <>
            <Navbar />
            <main
                id="main-content"
                className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6"
            >
                <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400 mb-6">
                    404
                </p>
                <h1 className="font-serif text-5xl md:text-7xl text-[var(--text-primary)] mb-6 leading-tight">
                    Page Not Found
                </h1>
                <p className="text-[var(--text-secondary)] max-w-md mb-10 leading-relaxed">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/" className="btn-primary">
                        Go Home
                    </Link>
                    <Link
                        href="/portfolio"
                        className="px-8 py-3 border border-[var(--border)] text-[var(--text-secondary)] text-xs tracking-[0.15em] uppercase hover:border-gold-500 hover:text-gold-400 transition-all duration-300"
                    >
                        View Portfolio
                    </Link>
                </div>
            </main>
            <Footer />
        </>
    );
}
