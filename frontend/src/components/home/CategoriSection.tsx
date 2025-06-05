'use client';

import { getAllCategory } from '@/lib/apis/category';
import { formatTanggal } from '@/lib/formatTanggal';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

const KategoriSection = () => {
    const { data: categories, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: getAllCategory,
    });

    return (
        <section id="kategori" className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                    >
                        Kategori Lomba
                    </motion.h2>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="w-20 h-1 bg-orange-600 mx-auto rounded"
                    />
                    <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mt-4">
                        Berbagai kategori lomba yang dapat kamu ikuti pada KMIPN 2025. Pilih bidang yang sesuai dengan minat dan keahlianmu!
                    </p>
                </div>

                {isLoading ? (
                    <p className="text-center text-gray-500">Loading kategori...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories?.map((category, index: number) => {
                            const now = new Date()
                            now.setHours(0, 0, 0, 0)
                            const isExpired = now.getTime() > new Date(category.deadline).getTime();
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                                        {category.categoriName}
                                    </h3>
                                    <p className="text-gray-600 text-sm text-center mb-4">
                                        {category.description}
                                    </p>

                                    <div className="flex justify-center">
                                        <span
                                            className={`px-3 py-1 text-sm rounded-full font-medium ${isExpired
                                                ? 'bg-red-100 text-red-600'
                                                : 'bg-orange-100 text-orange-700'
                                                }`}
                                        >
                                            {isExpired
                                                ? 'Deadline berakhir'
                                                : `Deadline: ${formatTanggal(category.deadline)}`}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

const LokasiKami = () => {
    return (
        <section id="lokasi" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                    >
                        Lokasi Kami
                    </motion.h2>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="w-20 h-1 bg-orange-500 mx-auto rounded"
                    ></motion.div>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-full md:w-1/2 h-96 rounded-lg overflow-hidden shadow-lg">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19385.530568904283!2d100.4508963!3d-0.9188021!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4b7be9e52a171%3A0x609ef1cc57a38e32!2sPoliteknik%20Negeri%20Padang!5e1!3m2!1sid!2sid!4v1734576212506!5m2!1sid!2sid"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                    <div className="w-full md:w-1/2">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Politeknik Negeri Padang
                        </h3>
                        <p className="text-lg text-gray-600">
                            Limau Manis, Pauh, Kota Padang, Sumatera Barat 25175
                            <br />
                            Indonesia, Padang
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export { KategoriSection, LokasiKami };