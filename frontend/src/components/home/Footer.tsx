import { AtSign, Youtube } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Logo and Description */}
                <div className="flex flex-col items-center space-y-4 text-center">
                    <h2 className="text-xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        KMIPN VII
                    </h2>
                    <p className="text-gray-400 text-sm max-w-3xl">
                        Kompetisi Mahasiswa Informatika Politeknik Nasional (KMIPN) merupakan ajang bergengsi bagi mahasiswa politeknik se-Indonesia untuk menunjukkan inovasi dan kreativitas di bidang informatika.
                    </p>
                </div>

                {/* Quick Links and Social Media */}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="/#home"
                                    className="text-gray-400 hover:text-blue-500 transition-colors"
                                >
                                    Home
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/#sambutan"
                                    className="text-gray-400 hover:text-blue-500 transition-colors"
                                >
                                    Sambutan
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/#timeline"
                                    className="text-gray-400 hover:text-blue-500 transition-colors"
                                >
                                    Timeline
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/#kategori"
                                    className="text-gray-400 hover:text-blue-500 transition-colors"
                                >
                                    Kategori
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4">Contact Us</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>Email: <a href="mailto:kmipn@pnp.ac.id" className="hover:text-blue-500">kmipn@pnp.ac.id</a></li>
                            <li>Phone: <a href="tel:+075172590" className="hover:text-blue-500">0751-72590</a></li>
                            <li>Address: Politeknik Negeri Padang</li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4">Follow Us</h3>
                        <div className="flex space-x-4 justify-start items-center">
                            <a
                                href="https://www.facebook.com/share/16UCy9XJ3S/?mibextid=wwXIfr"
                                target="_blank"
                                className="text-gray-400 hover:text-blue-600 transition-colors"
                            >
                                <span className="sr-only">Facebook</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6"
                                >
                                    <path d="M22.675 0h-21.35C.594 0 0 .594 0 1.325v21.351C0 23.406.594 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.892-4.788 4.659-4.788 1.325 0 2.465.099 2.794.143v3.24h-1.918c-1.506 0-1.798.717-1.798 1.767v2.313h3.597l-.468 3.622h-3.129V24h6.137C23.406 24 24 23.406 24 22.675V1.325C24 .594 23.406 0 22.675 0z" />
                                </svg>
                            </a>
                            <a
                                href="https://x.com/kmipn7_pnp?s=21"
                                target="_blank"
                                className="text-gray-400 hover:text-blue-400 transition-colors"
                            >
                                <span className="sr-only">Twitter</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6"
                                >
                                    <path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.93 4.93 0 0 0 2.165-2.723c-.935.555-1.974.959-3.077 1.184A4.916 4.916 0 0 0 16.847 3c-2.72 0-4.928 2.205-4.928 4.917 0 .385.043.762.127 1.124-4.094-.206-7.723-2.163-10.148-5.134a4.902 4.902 0 0 0-.667 2.474 4.922 4.922 0 0 0 2.19 4.1 4.903 4.903 0 0 1-2.23-.616v.062a4.917 4.917 0 0 0 3.946 4.827 4.934 4.934 0 0 1-2.224.085 4.921 4.921 0 0 0 4.6 3.42A9.866 9.866 0 0 1 .515 19.53 13.911 13.911 0 0 0 7.548 21c9.056 0 14.009-7.496 14.009-13.986 0-.213-.005-.426-.015-.637A10.025 10.025 0 0 0 24 4.557z" />
                                </svg>
                            </a>
                            <a
                                href="https://www.instagram.com/kmipn7_pnp?igsh=MTkwMWhrYTMxOHJ3OA%3D%3D&utm_source=qr"
                                target="_blank"
                                className="text-gray-400 hover:text-pink-500 transition-colors"
                            >
                                <span className="sr-only">Instagram</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6"
                                >
                                    <path d="M7.75 0h8.5A7.75 7.75 0 0 1 24 7.75v8.5A7.75 7.75 0 0 1 16.25 24h-8.5A7.75 7.75 0 0 1 0 16.25v-8.5A7.75 7.75 0 0 1 7.75 0zm0 1.5A6.25 6.25 0 0 0 1.5 7.75v8.5A6.25 6.25 0 0 0 7.75 22.5h8.5A6.25 6.25 0 0 0 22.5 16.25v-8.5A6.25 6.25 0 0 0 16.25 1.5h-8.5zM12 5.25A6.75 6.75 0 1 1 5.25 12 6.757 6.757 0 0 1 12 5.25zm0 1.5A5.25 5.25 0 1 0 17.25 12 5.257 5.257 0 0 0 12 6.75zm6.25-2.31a1.5 1.5 0 1 1-1.5 1.5 1.5 1.5 0 0 1 1.5-1.5z" />
                                </svg>
                            </a>
                            <a
                                href="https://youtube.com/@kmipn7pnp?si=0U6XvZ9LgWr8eldU"
                                target="_blank"
                                className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <span className="sr-only">Youtube</span>
                                <Youtube className="w-7 h-7" />
                            </a>
                            <a
                                href="https://www.tiktok.com/@kmipn.7.pnp?_t=ZS-8wOVEwdZYQR&_r=1"
                                target="_blank"
                                className="text-gray-400 hover:text-purple-100 flex justify-center items-center transition-colors"
                            >
                                <span className="sr-only">Tiktok</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-tiktok" viewBox="0 0 16 16">
                                    <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Credits */}
                <div className="mt-10 text-center text-gray-500 text-sm">
                    <p>Developed by <span className="font-bold text-gray-300"><a target="_blank" href="https://www.pnp.ac.id/">Tim Web KMIPN VII Politeknik Negeri Padang</a></span> © {new Date().getFullYear()}. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
