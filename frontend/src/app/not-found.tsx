'use client'

import React, { useState, useEffect, FormEvent } from 'react';
import { Search, ArrowLeft, Home, RefreshCw, MapPin, Compass, AlertCircle, Zap } from 'lucide-react';

export default function NotFoundPage() {
    const [isAnimated, setIsAnimated] = useState(false);
    const [floatingElements, setFloatingElements] = useState<{
        id: number,
        x: number,
        y: number,
        size: number,
        delay: number
    }[]>([]);
    const [glitchEffect, setGlitchEffect] = useState(false);

    useEffect(() => {
        setIsAnimated(true);

        // Generate floating elements
        const elements = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
            delay: Math.random() * 5
        }));
        setFloatingElements(elements);

        // Glitch effect
        const glitchInterval = setInterval(() => {
            setGlitchEffect(true);
            setTimeout(() => setGlitchEffect(false), 200);
        }, 4000);

        return () => clearInterval(glitchInterval);
    }, []);

    const handleGoBack = () => {
        if (typeof window !== 'undefined' && window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = '/';
        }
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    const handleGoHome = () => {
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden">
                {floatingElements.map((element) => (
                    <div
                        key={element.id}
                        className="absolute bg-white rounded-full opacity-10 animate-float"
                        style={{
                            left: `${element.x}%`,
                            top: `${element.y}%`,
                            width: `${element.size}px`,
                            height: `${element.size}px`,
                            animationDelay: `${element.delay}s`,
                            animationDuration: `${3 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            {/* Animated grid background */}
            <div className="absolute inset-0 opacity-5">
                <div className="grid grid-cols-12 h-full">
                    {[...Array(144)].map((_, i) => (
                        <div key={i} className="border border-white/20" />
                    ))}
                </div>
            </div>

            {/* Main content */}
            <div className={`max-w-md w-full text-center transform transition-all duration-1000 ${isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>

                {/* 404 with glitch effect */}
                <div className="relative mb-8">
                    <h1 className={`text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4 select-none ${glitchEffect ? 'animate-pulse' : ''
                        }`}>
                        404
                    </h1>
                    {glitchEffect && (
                        <>
                            <h1 className="absolute top-0 left-0 text-9xl font-black text-red-500 opacity-70 transform translate-x-1">
                                404
                            </h1>
                            <h1 className="absolute top-0 left-0 text-9xl font-black text-blue-500 opacity-70 transform -translate-x-1">
                                404
                            </h1>
                        </>
                    )}
                </div>

                {/* Icon with orbital animation */}
                <div className="relative mb-8">
                    <div className="relative w-32 h-32 mx-auto">
                        {/* Orbiting elements */}
                        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <Search className="w-6 h-6 text-cyan-400" />
                            </div>
                        </div>
                        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}>
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                                <MapPin className="w-6 h-6 text-pink-400" />
                            </div>
                        </div>
                        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '10s' }}>
                            <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <Zap className="w-6 h-6 text-yellow-400" />
                            </div>
                        </div>

                        {/* Center compass */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl">
                                <Compass className="w-8 h-8 text-white animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Glass morphism card */}
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 shadow-2xl mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <AlertCircle className="w-6 h-6 text-orange-400" />
                        <h2 className="text-2xl font-bold text-white">Halaman Tidak Ditemukan</h2>
                    </div>

                    <p className="text-gray-300 mb-6 leading-relaxed">
                        Ups! Sepertinya halaman yang Anda cari telah hilang di alam semesta digital.
                        Mungkin halaman ini telah dipindahkan, dihapus, atau URL-nya salah ketik.
                    </p>

                    {/* Action buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleGoHome}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2 group"
                        >
                            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Kembali ke Beranda
                        </button>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={handleGoBack}
                                className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 group"
                            >
                                <ArrowLeft className="w-4 h-4 hidden md:block group-hover:-translate-x-1 transition-transform" />
                                Kembali
                            </button>

                            <button
                                onClick={handleRefresh}
                                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 group"
                            >
                                <RefreshCw className="w-4 h-4 hidden md:block group-hover:rotate-180 transition-transform duration-500" />
                                Coba Lagi
                            </button>
                        </div>
                    </div>
                </div>

                {/* Additional info */}
                <div className="text-gray-400 text-sm">
                    <p>Kode Error: 404 - Page Not Found</p>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-10 w-16 h-16 bg-cyan-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />

            <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
}