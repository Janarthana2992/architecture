"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6 bg-[var(--bg)]">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400 mb-6">
                Error
            </p>
            <h1 className="font-serif text-5xl md:text-6xl text-[var(--text-primary)] mb-6">
                Something Went Wrong
            </h1>
            <p className="text-[var(--text-secondary)] max-w-md mb-10 leading-relaxed">
                An unexpected error occurred. Please try again or return home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={reset}
                    className="btn-primary"
                >
                    Try Again
                </button>
                <Link
                    href="/"
                    className="px-8 py-3 border border-[var(--border)] text-[var(--text-secondary)] text-xs tracking-[0.15em] uppercase hover:border-gold-500 hover:text-gold-400 transition-all duration-300"
                >
                    Go Home
                </Link>
            </div>
            {process.env.NODE_ENV === "development" && error?.message && (
                <pre className="mt-10 text-xs text-red-400 bg-red-950/30 border border-red-900/40 px-4 py-3 max-w-xl overflow-auto text-left">
                    {error.message}
                </pre>
            )}
        </main>
    );
}
