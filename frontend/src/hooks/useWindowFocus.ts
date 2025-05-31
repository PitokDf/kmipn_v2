/**
 * Hook untuk medeteksi ketika window/tab browser mendapatkan focus kambeli
 * @param onFocus callback yang dipanggil ketika window/tab focused.
 */

import { useEffect } from "react";

export function useWindowFocus(onFocus: () => void) {
    useEffect(() => {
        const handleFocus = () => onFocus()

        window.addEventListener('focus', handleFocus)
        return () => window.removeEventListener('focus', handleFocus)
    }, [onFocus])
}