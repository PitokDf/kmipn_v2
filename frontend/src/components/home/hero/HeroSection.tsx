import Image from 'next/image';
import CountdownTimer from './CountdownTimer';
import WaveBackground from './WaveBackground';

const HeroSection = () => {
    return (
        <section id='home' className="h-[100dvh] bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]"
        >
            <WaveBackground />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-40">
                <div className="text-center">
                    <h1 className="text-4xl flex justify-center md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                        <span className="flex justify-center items-center flex-col">
                            Welcome to
                            <Image
                                className='w-[200px] md:w-[400px]'
                                height={200}
                                width={400}
                                alt='KMIPN 7 LOGO'
                                src={"/images/logos/kmipn-7.png"}
                            />
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-orange-100 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Kompetisi Mahasiswa Informatika Politeknik
                        Nasional (KMIPN) merupakan ajang
                        bergengsi untuk Politeknik se-Indonesia
                        di bidang Informatika.
                    </p>

                    <div className="flex justify-center mb-12">
                        <CountdownTimer />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/auth/register"
                            className="px-8 py-3 bg-white text-orange-600 rounded-full font-semibold shadow-lg hover:bg-orange-50 
                            transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-400">
                            Daftar Sekarang
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
