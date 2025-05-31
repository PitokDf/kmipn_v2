import { KategoriSection, LokasiKami } from "@/components/home/CategoriSection";
import Footer from "@/components/home/Footer";
import HeroSection from "@/components/home/hero/HeroSection";
import SambutanSection from "@/components/home/SambutanSection";
import TimelineSection from "@/components/home/TimelineSection";

export const metadata = {
    title: 'KMIPN VII',
};

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <SambutanSection />
            <TimelineSection />
            <KategoriSection />
            <LokasiKami />
            <Footer />
        </>
    );
}