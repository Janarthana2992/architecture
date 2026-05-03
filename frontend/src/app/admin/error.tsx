"use client";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function AdminError({
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
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
            <AlertTriangle size={36} className="text-red-400 mb-6" strokeWidth={1.5} />
            <h2 className="font-serif text-2xl text-cream-100 mb-3">
                Something went wrong
            </h2>
            <p className="text-cream-200/50 text-sm max-w-sm mb-8 leading-relaxed">
                {process.env.NODE_ENV === "development"
                    ? error.message
                    : "An error occurred loading this page."}
            </p>
            <button
                onClick={reset}
                className="px-6 py-2.5 bg-gold-500/20 border border-gold-500/40 text-gold-400 text-xs tracking-[0.15em] uppercase hover:bg-gold-500/30 transition-colors duration-200"
            >
                Try Again
            </button>
        </div>
    );
}
