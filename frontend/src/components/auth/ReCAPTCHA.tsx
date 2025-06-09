import { useTheme } from "next-themes"
import { LegacyRef } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import { toast } from "sonner"

type ReCAPTCHAComponentProps = {
    recaptchaRef: LegacyRef<ReCAPTCHA>,
    setRecaptchaToken: (token: string | null) => void
}

export function ReCAPTCHAComponent({
    recaptchaRef,
    setRecaptchaToken
}: ReCAPTCHAComponentProps) {
    const { theme } = useTheme()
    const handleRecaptcha = (token: string | null) => {
        if (!token) {
            toast("Gagal verifikasi reCAPTCHA");
            setRecaptchaToken(null);
            return;
        }
        setRecaptchaToken(token);
    };

    return (
        <div className="flex justify-center p-0">
            <ReCAPTCHA
                badge="bottomright"
                onChange={handleRecaptcha}
                onError={() => toast("Gagal memuat reCAPTCHA")}
                onExpired={() => toast("reCAPTCHA expired, coba lagi")}
                theme={theme === "dark" ? "dark" : "light"}
                className="w-full p-0"
                size="invisible"
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                ref={recaptchaRef}
            />
        </div>
    )
}