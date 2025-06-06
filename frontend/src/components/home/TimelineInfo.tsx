import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Trophy, Info } from 'lucide-react';

const LombaScheduleDialog = () => {
    const [open, setOpen] = useState(false);

    const lombaData = [
        {
            kategori: "Hackaton",
            pendaftaran: "1 Juli - 31 Agustus 2025",
            batasSubmit: "7 September 2025",
            penyisihan1: "-",
            penyisihan2: "-",
            pengumumanFinalis: "29 September 2025",
            babakFinal: "12-14 Oktober 2025"
        },
        {
            kategori: "Keamanan Siber",
            pendaftaran: "1 Juli - 31 Agustus 2025",
            batasSubmit: "7 September 2025",
            penyisihan1: "15 September 2025*",
            penyisihan2: "-",
            pengumumanFinalis: "29 September 2025",
            babakFinal: "12-14 Oktober 2025"
        },
        {
            kategori: "E-Government",
            pendaftaran: "1 Juli - 31 Agustus 2025",
            batasSubmit: "7 September 2025",
            penyisihan1: "-",
            penyisihan2: "-",
            pengumumanFinalis: "29 September 2025",
            babakFinal: "12-14 Oktober 2025"
        },
        {
            kategori: "Perencanaan Bisnis Bidang TIK",
            pendaftaran: "1 Juli - 31 Agustus 2025",
            batasSubmit: "7 September 2025",
            penyisihan1: "-",
            penyisihan2: "-",
            pengumumanFinalis: "29 September 2025",
            babakFinal: "12-14 Oktober 2025"
        },
        {
            kategori: "Animasi",
            pendaftaran: "1 Juli - 31 Agustus 2025",
            batasSubmit: "7 September 2025",
            penyisihan1: "-",
            penyisihan2: "-",
            pengumumanFinalis: "29 September 2025",
            babakFinal: "12-14 Oktober 2025"
        },
        {
            kategori: "Internet of Things",
            pendaftaran: "1 Juli - 31 Agustus 2025",
            batasSubmit: "7 September 2025",
            penyisihan1: "-",
            penyisihan2: "-",
            pengumumanFinalis: "29 September 2025",
            babakFinal: "12-14 Oktober 2025"
        },
        {
            kategori: "Cipta Inovasi di Bidang TIK",
            pendaftaran: "1 Juli - 31 Agustus 2025",
            batasSubmit: "7 September 2025",
            penyisihan1: "-",
            penyisihan2: "-",
            pengumumanFinalis: "29 September 2025",
            babakFinal: "12-14 Oktober 2025"
        },
        {
            kategori: "Pengembangan Aplikasi Permainan",
            pendaftaran: "1 Juli - 31 Agustus 2025",
            batasSubmit: "7 September 2025",
            penyisihan1: "15 September 2025**",
            penyisihan2: "22-26 September 2025***",
            pengumumanFinalis: "29 September 2025",
            babakFinal: "12-14 Oktober 2025"
        }
    ];

    const keterangan = [
        "* Babak Penyisihan 1 Keamanan Siber dilaksanakan secara daring (MCQ Online Test)",
        "** Pengumuman Babak Penyisihan 1 Pengembangan Aplikasi Permainan",
        "*** Babak Penyisihan 2 Pengembangan Aplikasi Permainan dilaksanakan hanya dengan mengunggah video demo"
    ];

    return (
        <div className="flex items-center justify-center">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        className="bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 text-white px-6 py-4 sm:px-8 sm:py-6 text-base sm:text-lg font-semibold rounded-md shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                        <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        <span>Detail Timeline</span>
                    </Button>
                </DialogTrigger>

                <DialogContent className="max-w-6xl w-[95vw] h-[90vh] bg-white flex flex-col sm:w-auto">
                    <DialogHeader className="flex-shrink-0 pb-4 border-b border-gray-200">
                        <DialogTitle className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-2">
                            <Trophy className="inline-block mr-2 h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                            Jadwal Kegiatan KMIPN VII
                        </DialogTitle>
                        <DialogDescription className="text-center text-gray-600 text-sm sm:text-base">
                            Kompetisi Mahasiswa Indonesia di Bidang Teknologi Informasi dan Komunikasi
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto px-1 sm:px-2 py-4 space-y-4 sm:space-y-6">
                        {lombaData.map((lomba, index) => (
                            <div key={index} className="border dark:border-gray-200 rounded-lg p-3 sm:p-4 bg-gradient-to-r from-white to-gray-50 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center mb-3">
                                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 font-semibold text-xs sm:text-sm px-2 py-1">
                                        {lomba.kategori}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs sm:text-sm">
                                    <div className="flex items-start space-x-2 bg-white p-2 rounded border-l-2 border-green-400">
                                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <span className="font-medium text-gray-700 block">Pendaftaran:</span>
                                            <p className="text-gray-600 break-words">{lomba.pendaftaran}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-2 bg-white p-2 rounded border-l-2 border-orange-400">
                                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <span className="font-medium text-gray-700 block">Batas Submit:</span>
                                            <p className="text-gray-600 break-words">{lomba.batasSubmit}</p>
                                        </div>
                                    </div>

                                    {lomba.penyisihan1 !== "-" && (
                                        <div className="flex items-start space-x-2 bg-white p-2 rounded border-l-2 border-purple-400">
                                            <Info className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <span className="font-medium text-gray-700 block">Penyisihan 1:</span>
                                                <p className="text-gray-600 break-words">{lomba.penyisihan1}</p>
                                            </div>
                                        </div>
                                    )}

                                    {lomba.penyisihan2 !== "-" && (
                                        <div className="flex items-start space-x-2 bg-white p-2 rounded border-l-2 border-purple-400">
                                            <Info className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <span className="font-medium text-gray-700 block">Penyisihan 2:</span>
                                                <p className="text-gray-600 break-words">{lomba.penyisihan2}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start space-x-2 bg-white p-2 rounded border-l-2 border-yellow-400">
                                        <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <span className="font-medium text-gray-700 block">Pengumuman Finalis:</span>
                                            <p className="text-gray-600 break-words">{lomba.pengumumanFinalis}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-2 bg-white p-2 rounded border-l-2 border-red-400">
                                        <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <span className="font-medium text-gray-700 block">Babak Final:</span>
                                            <p className="text-gray-600 break-words">{lomba.babakFinal}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex-shrink-0 mt-4 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <h3 className="font-semibold text-amber-800 mb-2 flex items-center text-sm sm:text-base">
                            <Info className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                            Keterangan:
                        </h3>
                        <ul className="space-y-1 text-xs sm:text-sm text-amber-700">
                            {keterangan.map((item, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="mr-2 flex-shrink-0">•</span>
                                    <span className="break-words">{item}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-3 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded text-xs sm:text-sm text-blue-800">
                            <strong>Catatan Penting:</strong> Dikarenakan adanya perbedaan teknis dalam pelaksanaan pada setiap kategori lomba,
                            maka terjadinya perubahan jadwal pada Babak Penyisihan akan sangat memungkinkan. Pelaksanaan final dilakukan secara daring.
                            Pastikan kembali Jadwal Kategori Lomba yang akan Anda ikuti pada halaman resmi KMIPN VII.
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LombaScheduleDialog;