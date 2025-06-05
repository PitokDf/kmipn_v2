import "../globals.css"
import Navbar from "@/components/home/Navbar";
import "../../styles/homepage.css"
import BackToTop from "@/components/home/BackToTop";


export default function HomePageLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="pt-16">
                {children}
            </main>
            <BackToTop />
        </>
    );
}