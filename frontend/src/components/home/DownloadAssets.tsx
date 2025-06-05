'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const DownloadAssetSection = () => {
    return (
        <section id="download" className="py-24 bg-gradient-to-b from-white to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                    >
                        Download Asset
                    </motion.h2>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="w-20 h-1 bg-orange-600 mx-auto rounded"
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Download Panduan */}
                    <Link
                        href="https://drive.google.com/drive/folders/1a4NvVdGX92Zh1VbFp3eYHLzKarB97-Dt?usp=sharing"
                        target="_blank"
                        className="group relative flex justify-end  w-full"
                    >
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="relative flex flex-col justify-end items-center gap-4"
                        >
                            <Image
                                width={320}
                                height={320}
                                src="/images/maskot edit kampus 2.png"
                                alt="Download Panduan"
                                className="transition-transform group-hover:scale-105"
                            />
                            <span className="text-lg font-semibold text-gray-800 group-hover:text-orange-600">
                                Download Panduan KMIPN
                            </span>
                        </motion.div>
                    </Link>

                    {/* Download Logo */}
                    <Link
                        target='_blank'
                        href="https://drive.google.com/drive/folders/1bFsRUUeCxZguOi0adeI67sUSrmVYPAIY"
                        className="group w-[320px]">
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.5,
                            }}
                            className="relative flex flex-col items-center gap-4"
                        >
                            <Image
                                width={320}
                                height={320}
                                src="/images/maskot edit kampus 2.png"
                                alt="Download Logo dan Asset"
                                className="scale-x-[-1] transition-transform group-hover:scale-105"
                            />
                            <span className="text-lg font-semibold text-gray-800 group-hover:text-orange-600">
                                Download Logo dan Asset KMIPN
                            </span>
                        </motion.div>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default DownloadAssetSection;
