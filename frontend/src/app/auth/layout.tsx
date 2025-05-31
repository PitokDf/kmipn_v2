export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex justify-center items-center h-dvh w-full">
            {children}
        </main>
    )
}