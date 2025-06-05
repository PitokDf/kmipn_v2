'use client'

import React, { useState, useEffect } from 'react';
import { Shield, ArrowLeft, Lock, AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function UnauthorizedPage() {
    const [isAnimated, setIsAnimated] = useState(false);
    const [glowIntensity, setGlowIntensity] = useState(0);

    useEffect(() => {
        setIsAnimated(true);
        const interval = setInterval(() => {
            setGlowIntensity(prev => (prev + 1) % 100);
        }, 50);
        return () => clearInterval(interval);
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">


            {/* Main content */}
            <div className={`max-w-md w-full text-center transform transition-all duration-1000 ${isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>

                {/* Icon with glow effect */}
                <div className="relative mb-8">
                    <div
                        className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-30"
                        style={{
                            transform: `scale(${1 + glowIntensity * 0.01})`,
                            opacity: 0.2 + (glowIntensity * 0.003)
                        }}
                    />
                    <div className="relative bg-gradient-to-br from-red-500 to-red-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                        <Shield className="w-12 h-12 text-white animate-pulse" />
                    </div>
                </div>

                {/* Error code */}
                <div className="mb-6">
                    <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400 mb-2 animate-pulse">
                        401
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-red-400 mb-4">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="text-lg font-semibold">Unauthorized Access</span>
                    </div>
                </div>

                {/* Glass morphism card */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Lock className="w-6 h-6 text-gray-300" />
                        <h2 className="text-2xl font-bold text-white">Akses Ditolak</h2>
                    </div>

                    <p className="text-gray-300 mb-6 leading-relaxed">
                        Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
                        Silakan login dengan kredensial yang tepat atau hubungi administrator.
                    </p>

                    {/* Action buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleGoBack}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Kembali
                        </button>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={handleGoHome}
                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 group"
                            >
                                <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                Beranda
                            </button>

                            <button
                                onClick={handleRefresh}
                                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 group"
                            >
                                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>

                {/* Additional info */}
                <div className="text-gray-400 text-sm">
                    <p>Kode Error: 401 - Unauthorized</p>
                </div>
            </div>

            {/* Floating elements */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-48 h-48 bg-red-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
    );
}