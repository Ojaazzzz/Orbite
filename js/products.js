/* =====================================================
   ORBITE STORE — Data produk
   Semua harga dalam Rupiah (IDR).
   ===================================================== */

const CATEGORIES = [
    { id: "iphone", label: "iPhone" },
    { id: "mac", label: "Mac" },
    { id: "ipad", label: "iPad" },
    { id: "watch", label: "Watch" },
    { id: "audio", label: "Audio" },
    { id: "aksesori", label: "Aksesori" }
];

const PRODUCTS = [

    /* ---------------------------------------------
       iPhone
       --------------------------------------------- */
    {
        id: "iphone-18-pro",
        name: "iPhone 18 Pro",
        category: "iphone",
        tagline: "Pro, tanpa kompromi.",
        description:
            "Chip A20 Pro, kamera Fusion 48 MP dengan aperture variabel, dan bodi aluminium unibody. Performa Pro dalam desain paling tangguh.",
        price: 22999000,
        image: "assets/img/iphone-18-pro.png",
        badge: "Baru",
        featured: true,
        colors: [
            { name: "Black", hex: "#1c1c1e" },
            { name: "Silver", hex: "#d9d9dc" },
            { name: "Glacier", hex: "#c7d3d8" },
            { name: "Burgundy", hex: "#722f3a" }
        ],
        storage: [
            { label: "256 GB", extra: 0 },
            { label: "512 GB", extra: 2500000 },
            { label: "1 TB", extra: 5500000 },
            { label: "2 TB", extra: 9500000 }
        ],
        highlights: [
            "Chip A20 Pro dengan GPU generasi baru",
            "Kamera Fusion 48 MP dengan aperture variabel",
            "Layar Super Retina XDR 6,3 inci, ProMotion",
            "Bodi aluminium unibody dan Ceramic Shield 2",
            "Apple Intelligence dan Siri AI"
        ],
        specs: [
            { label: "Layar", value: "6,3 inci Super Retina XDR" },
            { label: "Chip", value: "Apple A20 Pro" },
            { label: "Kamera", value: "48 MP Fusion, aperture variabel" },
            { label: "Baterai", value: "Hingga 33 jam pemutaran video" },
            { label: "Konektivitas", value: "5G, Wi-Fi 7, USB-C" },
            { label: "Ketahanan", value: "IP68, Ceramic Shield 2" }
        ]
    },
    {
        id: "iphone-duo",
        name: "iPhone Duo",
        category: "iphone",
        tagline: "Satu iPhone. Dua wajah.",
        description:
            "iPhone lipat pertama Apple. Layar dalam 7,6 inci, engsel titanium, dan chip A20 Pro untuk produktivitas dan hiburan dalam satu perangkat.",
        price: 37999000,
        image: "assets/img/iphone-duo.png",
        badge: "Baru",
        featured: true,
        colors: [
            { name: "Night Sky", hex: "#2d3340" },
            { name: "Star White", hex: "#f2efe6" }
        ],
        storage: [
            { label: "256 GB", extra: 0 },
            { label: "512 GB", extra: 4000000 },
            { label: "1 TB", extra: 8000000 },
            { label: "2 TB", extra: 14000000 }
        ],
        highlights: [
            "Layar lipat dalam 7,6 inci",
            "Layar luar 5,36 inci untuk penggunaan cepat",
            "Chip A20 Pro dengan performa flagship",
            "Engsel titanium dan bodi ringan",
            "Kamera Dual Fusion 48 MP"
        ],
        specs: [
            { label: "Layar", value: "7,6 inci lipat + 5,36 inci luar" },
            { label: "Chip", value: "Apple A20 Pro" },
            { label: "Kamera", value: "48 MP + 48 MP Dual Fusion" },
            { label: "Baterai", value: "Hingga 28 jam pemutaran video" },
            { label: "Konektivitas", value: "5G, Wi-Fi 7, USB-C" },
            { label: "Ketahanan", value: "IP68, titanium" }
        ]
    },
    {
        id: "iphone-16-pro",
        name: "iPhone 16 Pro",
        category: "iphone",
        tagline: "Titanium. Sekuat itu.",
        description:
            "Chip A18 Pro, kamera Fusion 48 MP, dan bodi titanium kelas aerospace. iPhone paling Pro yang pernah dibuat.",
        price: 18999000,
        image: "assets/img/iphone-16-pro.png",
        badge: "Baru",
        featured: false,
        colors: [
            { name: "Natural Titanium", hex: "#c2bcb2" },
            { name: "Desert Titanium", hex: "#bfa48f" },
            { name: "White Titanium", hex: "#f2f1ed" },
            { name: "Black Titanium", hex: "#3c3c3d" }
        ],
        storage: [
            { label: "128 GB", extra: 0 },
            { label: "256 GB", extra: 2000000 },
            { label: "512 GB", extra: 5000000 },
            { label: "1 TB", extra: 8000000 }
        ],
        highlights: [
            "Chip A18 Pro dengan GPU 6-core",
            "Kamera Fusion 48 MP dengan zoom optik 5x",
            "Layar Super Retina XDR 6,3 inci, ProMotion 120Hz",
            "Bodi titanium ringan dan tahan lama",
            "Tombol Camera Control baru"
        ],
        specs: [
            { label: "Layar", value: "6,3 inci Super Retina XDR" },
            { label: "Chip", value: "Apple A18 Pro" },
            { label: "Kamera", value: "48 MP + 48 MP + 12 MP" },
            { label: "Baterai", value: "Hingga 27 jam pemutaran video" },
            { label: "Konektivitas", value: "5G, Wi-Fi 7, USB-C" },
            { label: "Ketahanan", value: "IP68, Ceramic Shield" }
        ]
    },
    {
        id: "iphone-16",
        name: "iPhone 16",
        category: "iphone",
        tagline: "Warna baru. Tenaga baru.",
        description:
            "Chip A18, Camera Control, dan baterai yang tahan seharian. Semua yang kamu butuhkan, dalam satu genggaman.",
        price: 14999000,
        image: "assets/img/iphone-16.jpg",
        badge: "Baru",
        featured: false,
        colors: [
            { name: "Ultramarine", hex: "#4a5fa5" },
            { name: "Teal", hex: "#6b8e8a" },
            { name: "Pink", hex: "#f2c6cf" },
            { name: "White", hex: "#f5f5f0" },
            { name: "Black", hex: "#2f2f30" }
        ],
        storage: [
            { label: "128 GB", extra: 0 },
            { label: "256 GB", extra: 1500000 },
            { label: "512 GB", extra: 4000000 }
        ],
        highlights: [
            "Chip A18 dengan GPU 5-core",
            "Kamera Fusion 48 MP",
            "Layar Super Retina XDR 6,1 inci",
            "Tombol Camera Control",
            "Pengisian daya USB-C"
        ],
        specs: [
            { label: "Layar", value: "6,1 inci Super Retina XDR" },
            { label: "Chip", value: "Apple A18" },
            { label: "Kamera", value: "48 MP + 12 MP" },
            { label: "Baterai", value: "Hingga 22 jam pemutaran video" },
            { label: "Konektivitas", value: "5G, Wi-Fi 7, USB-C" },
            { label: "Ketahanan", value: "IP68, Ceramic Shield" }
        ]
    },
    {
        id: "iphone-15",
        name: "iPhone 15",
        category: "iphone",
        tagline: "Tetap istimewa.",
        description:
            "Dynamic Island, kamera utama 48 MP, dan USB-C. Pilihan cerdas untuk pengalaman iPhone terbaik.",
        price: 11999000,
        image: "assets/img/iphone-15.jpg",
        badge: null,
        featured: false,
        colors: [
            { name: "Pink", hex: "#f2c6cf" },
            { name: "Yellow", hex: "#f0e2b6" },
            { name: "Green", hex: "#c9dcc8" },
            { name: "Blue", hex: "#c3d6e8" },
            { name: "Black", hex: "#2f2f30" }
        ],
        storage: [
            { label: "128 GB", extra: 0 },
            { label: "256 GB", extra: 1500000 },
            { label: "512 GB", extra: 4000000 }
        ],
        highlights: [
            "Chip A16 Bionic",
            "Kamera utama 48 MP",
            "Dynamic Island",
            "Pengisian daya USB-C",
            "Layar Super Retina XDR 6,1 inci"
        ],
        specs: [
            { label: "Layar", value: "6,1 inci Super Retina XDR" },
            { label: "Chip", value: "Apple A16 Bionic" },
            { label: "Kamera", value: "48 MP + 12 MP" },
            { label: "Baterai", value: "Hingga 20 jam pemutaran video" },
            { label: "Konektivitas", value: "5G, Wi-Fi 6, USB-C" },
            { label: "Ketahanan", value: "IP68, Ceramic Shield" }
        ]
    },

    /* ---------------------------------------------
       Mac
       --------------------------------------------- */
    {
        id: "macbook-pro-14",
        name: "MacBook Pro 14 inci",
        category: "mac",
        tagline: "Chip M4 Pro. Kekuatan baru.",
        description:
            "Layar Liquid Retina XDR, performa kelas studio, dan baterai hingga 22 jam. Untuk pekerjaan yang tidak bisa menunggu.",
        price: 24999000,
        image: "assets/img/macbook-pro.jpg",
        badge: "Baru",
        featured: false,
        colors: [
            { name: "Space Black", hex: "#2e2e30" },
            { name: "Silver", hex: "#d8d8da" }
        ],
        storage: [
            { label: "512 GB", extra: 0 },
            { label: "1 TB", extra: 3000000 },
            { label: "2 TB", extra: 7000000 }
        ],
        highlights: [
            "Chip M4 Pro 12-core",
            "Layar Liquid Retina XDR 120Hz",
            "Baterai hingga 22 jam",
            "HDMI, SDXC, MagSafe, dan Thunderbolt 5",
            "Sistem audio enam speaker"
        ],
        specs: [
            { label: "Layar", value: "14,2 inci Liquid Retina XDR" },
            { label: "Chip", value: "Apple M4 Pro" },
            { label: "Memori", value: "24 GB unified memory" },
            { label: "Penyimpanan", value: "512 GB SSD" },
            { label: "Baterai", value: "Hingga 22 jam" },
            { label: "Berat", value: "1,60 kg" }
        ]
    },
    {
        id: "macbook-air-13",
        name: "MacBook Air 13 inci",
        category: "mac",
        tagline: "Ringan. Tanpa kompromi.",
        description:
            "Chip M4 dalam bodi 1,24 kg. Senyap, cepat, dan tahan hingga 18 jam untuk hari yang panjang.",
        price: 16999000,
        image: "assets/img/macbook-air.jpg",
        badge: null,
        featured: true,
        colors: [
            { name: "Midnight", hex: "#2e3440" },
            { name: "Starlight", hex: "#e8e0d4" },
            { name: "Silver", hex: "#d8d8da" },
            { name: "Sky Blue", hex: "#b8c9d9" }
        ],
        storage: [
            { label: "256 GB", extra: 0 },
            { label: "512 GB", extra: 2500000 },
            { label: "1 TB", extra: 5500000 }
        ],
        highlights: [
            "Chip M4 10-core",
            "Layar Liquid Retina 13,6 inci",
            "Baterai hingga 18 jam",
            "Desain tanpa kipas, sepenuhnya senyap",
            "MagSafe dan dua port Thunderbolt 4"
        ],
        specs: [
            { label: "Layar", value: "13,6 inci Liquid Retina" },
            { label: "Chip", value: "Apple M4" },
            { label: "Memori", value: "16 GB unified memory" },
            { label: "Penyimpanan", value: "256 GB SSD" },
            { label: "Baterai", value: "Hingga 18 jam" },
            { label: "Berat", value: "1,24 kg" }
        ]
    },
    {
        id: "imac-24",
        name: "iMac 24 inci",
        category: "mac",
        tagline: "Semua dalam satu layar.",
        description:
            "Layar 4,5K Retina yang memukau, chip M4, dan desain setipis 11,5 mm. Meja kerjamu naik kelas.",
        price: 21999000,
        image: "assets/img/imac.jpg",
        badge: null,
        featured: false,
        colors: [
            { name: "Blue", hex: "#7c9fc4" },
            { name: "Green", hex: "#a8c3a0" },
            { name: "Pink", hex: "#e8b4b8" },
            { name: "Silver", hex: "#d8d8da" }
        ],
        storage: [
            { label: "256 GB", extra: 0 },
            { label: "512 GB", extra: 2500000 }
        ],
        highlights: [
            "Chip M4",
            "Layar 4,5K Retina 24 inci",
            "Kamera Center Stage 12 MP",
            "Sistem audio enam speaker",
            "Desain all-in-one setipis 11,5 mm"
        ],
        specs: [
            { label: "Layar", value: "24 inci 4,5K Retina" },
            { label: "Chip", value: "Apple M4" },
            { label: "Memori", value: "16 GB unified memory" },
            { label: "Penyimpanan", value: "256 GB SSD" },
            { label: "Kamera", value: "12 MP Center Stage" },
            { label: "Berat", value: "4,44 kg" }
        ]
    },
    {
        id: "mac-mini",
        name: "Mac mini",
        category: "mac",
        tagline: "Kecil. Bertenaga besar.",
        description:
            "Chip M4 dalam bodi 12,7 cm. Cukup satu kabel untuk meja kerja yang rapi dan performa yang serius.",
        price: 8999000,
        image: "assets/img/mac-mini.jpg",
        badge: null,
        featured: false,
        colors: [
            { name: "Silver", hex: "#d8d8da" }
        ],
        storage: [
            { label: "256 GB", extra: 0 },
            { label: "512 GB", extra: 2500000 },
            { label: "1 TB", extra: 5500000 }
        ],
        highlights: [
            "Chip M4 10-core",
            "Desain 12,7 x 12,7 cm",
            "Port USB-C dan headphone di depan",
            "Mendukung hingga tiga layar",
            "Efisiensi energi luar biasa"
        ],
        specs: [
            { label: "Chip", value: "Apple M4" },
            { label: "Memori", value: "16 GB unified memory" },
            { label: "Penyimpanan", value: "256 GB SSD" },
            { label: "Port", value: "3x Thunderbolt 4, HDMI, Ethernet" },
            { label: "Konektivitas", value: "Wi-Fi 6E, Bluetooth 5.3" },
            { label: "Berat", value: "0,67 kg" }
        ]
    },

    /* ---------------------------------------------
       iPad
       --------------------------------------------- */
    {
        id: "ipad-pro",
        name: "iPad Pro 13 inci",
        category: "ipad",
        tagline: "Sangat tipis. Sangat bertenaga.",
        description:
            "Chip M4 dan layar Ultra Retina XDR tandem OLED dalam bodi 5,1 mm. Laptop-class power, tablet-class freedom.",
        price: 19999000,
        image: "assets/img/ipad-pro.png",
        badge: "Baru",
        featured: true,
        colors: [
            { name: "Silver", hex: "#d8d8da" },
            { name: "Space Black", hex: "#2e2e30" }
        ],
        storage: [
            { label: "256 GB", extra: 0 },
            { label: "512 GB", extra: 4000000 },
            { label: "1 TB", extra: 8000000 },
            { label: "2 TB", extra: 14000000 }
        ],
        highlights: [
            "Chip M4 dengan Neural Engine",
            "Layar Ultra Retina XDR tandem OLED",
            "Bodi setipis 5,1 mm",
            "Kompatibel Apple Pencil Pro",
            "Kamera depan landscape 12 MP"
        ],
        specs: [
            { label: "Layar", value: "13 inci Ultra Retina XDR" },
            { label: "Chip", value: "Apple M4" },
            { label: "Penyimpanan", value: "256 GB" },
            { label: "Kamera", value: "12 MP Wide, LiDAR" },
            { label: "Baterai", value: "Hingga 10 jam" },
            { label: "Berat", value: "579 gram" }
        ]
    },
    {
        id: "ipad-air",
        name: "iPad Air 11 inci",
        category: "ipad",
        tagline: "Bertenaga. Serba bisa.",
        description:
            "Chip M3, layar Liquid Retina, dan dukungan Apple Pencil Pro. Ringan dibawa, serius untuk bekerja.",
        price: 10999000,
        image: "assets/img/ipad-air.jpg",
        badge: null,
        featured: false,
        colors: [
            { name: "Blue", hex: "#a9c4d6" },
            { name: "Purple", hex: "#c9c0dc" },
            { name: "Starlight", hex: "#e8e0d4" },
            { name: "Space Gray", hex: "#7d7d80" }
        ],
        storage: [
            { label: "128 GB", extra: 0 },
            { label: "256 GB", extra: 2000000 },
            { label: "512 GB", extra: 5000000 }
        ],
        highlights: [
            "Chip M3",
            "Layar Liquid Retina 11 inci",
            "Dukungan Apple Pencil Pro",
            "Kamera depan landscape 12 MP",
            "Lengkap dengan USB-C"
        ],
        specs: [
            { label: "Layar", value: "11 inci Liquid Retina" },
            { label: "Chip", value: "Apple M3" },
            { label: "Penyimpanan", value: "128 GB" },
            { label: "Kamera", value: "12 MP Wide" },
            { label: "Baterai", value: "Hingga 10 jam" },
            { label: "Berat", value: "460 gram" }
        ]
    },

    /* ---------------------------------------------
       Watch
       --------------------------------------------- */
    {
        id: "apple-watch-10",
        name: "Apple Watch Series 10",
        category: "watch",
        tagline: "Satu tatapan. Semua info.",
        description:
            "Layar OLED terbesar yang pernah ada di Apple Watch, chip S10, dan pemantauan kesehatan yang makin lengkap.",
        price: 5999000,
        image: "assets/img/watch-series.jpg",
        badge: "Baru",
        featured: true,
        colors: [
            { name: "Jet Black", hex: "#2b2b2d" },
            { name: "Rose Gold", hex: "#d8b4a8" },
            { name: "Silver", hex: "#d8d8da" }
        ],
        storage: null,
        highlights: [
            "Layar OLED lebar dengan sudut membulat",
            "Chip S10",
            "Deteksi sleep apnea",
            "Pengisian daya cepat",
            "Tahan air hingga 50 meter"
        ],
        specs: [
            { label: "Layar", value: "OLED always-on 46 mm" },
            { label: "Chip", value: "Apple S10" },
            { label: "Baterai", value: "Hingga 18 jam" },
            { label: "Konektivitas", value: "GPS, Wi-Fi, Bluetooth 5.3" },
            { label: "Ketahanan", value: "Tahan air 50 m" },
            { label: "Kompatibilitas", value: "iPhone dengan iOS 18" }
        ]
    },
    {
        id: "apple-watch-se",
        name: "Apple Watch SE",
        category: "watch",
        tagline: "Sehat dimulai dari sini.",
        description:
            "Fitur keselamatan penting dan pemantauan kesehatan harian, dengan harga yang lebih ramah.",
        price: 3799000,
        image: "assets/img/watch-se.jpg",
        badge: null,
        featured: false,
        colors: [
            { name: "Midnight", hex: "#2e3440" },
            { name: "Starlight", hex: "#e8e0d4" },
            { name: "Silver", hex: "#d8d8da" }
        ],
        storage: null,
        highlights: [
            "Chip S8",
            "Deteksi kecelakaan dan deteksi jatuh",
            "Pemantauan tidur",
            "Tahan air hingga 50 meter",
            "Terhubung dengan keluarga lewat Family Setup"
        ],
        specs: [
            { label: "Layar", value: "Retina always-on 44 mm" },
            { label: "Chip", value: "Apple S8" },
            { label: "Baterai", value: "Hingga 18 jam" },
            { label: "Konektivitas", value: "GPS, Wi-Fi, Bluetooth 5.3" },
            { label: "Ketahanan", value: "Tahan air 50 m" },
            { label: "Kompatibilitas", value: "iPhone dengan iOS 16" }
        ]
    },

    /* ---------------------------------------------
       Audio
       --------------------------------------------- */
    {
        id: "airpods-pro-2",
        name: "AirPods Pro 2",
        category: "audio",
        tagline: "Senyap. Jernih. Ajaib.",
        description:
            "Active Noise Cancellation hingga dua kali lebih efektif, Audio Spatial personal, dan kenyamanan sepanjang hari.",
        price: 3499000,
        image: "assets/img/airpods-pro.jpg",
        badge: "Populer",
        featured: true,
        colors: [
            { name: "White", hex: "#f5f5f0" }
        ],
        storage: null,
        highlights: [
            "Chip H2",
            "Active Noise Cancellation hingga 2x",
            "Audio Spatial personal",
            "Case USB-C dengan speaker dan Find My",
            "Tahan air IP54"
        ],
        specs: [
            { label: "Chip", value: "Apple H2" },
            { label: "Audio", value: "Adaptive Audio, Spatial Audio" },
            { label: "Baterai", value: "Hingga 6 jam, 30 jam dengan case" },
            { label: "Pengisian", value: "USB-C, MagSafe, Qi" },
            { label: "Ketahanan", value: "IP54" },
            { label: "Isi kotak", value: "AirPods Pro 2, case, kabel USB-C" }
        ]
    },
    {
        id: "airpods-4",
        name: "AirPods 4",
        category: "audio",
        tagline: "Nyaman sepanjang hari.",
        description:
            "Desain open-ear yang ringan dengan chip H2. Suara jernih tanpa menutup telinga.",
        price: 2299000,
        image: "assets/img/airpods-4.jpg",
        badge: null,
        featured: false,
        colors: [
            { name: "White", hex: "#f5f5f0" }
        ],
        storage: null,
        highlights: [
            "Chip H2",
            "Desain open-ear yang nyaman",
            "Panggilan suara jernih",
            "Hingga 30 jam dengan case",
            "Case USB-C"
        ],
        specs: [
            { label: "Chip", value: "Apple H2" },
            { label: "Audio", value: "Spatial Audio personal" },
            { label: "Baterai", value: "Hingga 5 jam, 30 jam dengan case" },
            { label: "Pengisian", value: "USB-C" },
            { label: "Ketahanan", value: "IP54" },
            { label: "Isi kotak", value: "AirPods 4, case, kabel USB-C" }
        ]
    },
    {
        id: "airpods-max",
        name: "AirPods Max",
        category: "audio",
        tagline: "Musik dalam warna.",
        description:
            "Headphone over-ear dengan driver dinamis 40 mm, Audio Spatial, dan bodi aluminium yang dirancang untuk kenyamanan.",
        price: 8999000,
        image: "assets/img/airpods-max.jpg",
        badge: null,
        featured: false,
        colors: [
            { name: "Pink", hex: "#e8b4b8" },
            { name: "Starlight", hex: "#e8e0d4" },
            { name: "Midnight", hex: "#2e3440" },
            { name: "Blue", hex: "#a9c4d6" }
        ],
        storage: null,
        highlights: [
            "Driver dinamis 40 mm",
            "Active Noise Cancellation",
            "Audio Spatial dengan head tracking",
            "Bodi aluminium dan headband mesh",
            "Hingga 20 jam dengan ANC aktif"
        ],
        specs: [
            { label: "Driver", value: "Dinamis 40 mm" },
            { label: "Audio", value: "Adaptive EQ, Spatial Audio" },
            { label: "Baterai", value: "Hingga 20 jam" },
            { label: "Pengisian", value: "USB-C" },
            { label: "Berat", value: "385 gram" },
            { label: "Isi kotak", value: "AirPods Max, Smart Case, kabel USB-C" }
        ]
    },

    /* ---------------------------------------------
       Aksesori
       --------------------------------------------- */
    {
        id: "magic-keyboard",
        name: "Magic Keyboard",
        category: "aksesori",
        tagline: "Mengetik, di level berikutnya.",
        description:
            "Keyboard nirkabel dengan tombol presisi, baterai tahan lama, dan desain aluminium yang menyatu dengan Mac.",
        price: 1799000,
        image: "assets/img/magic-keyboard.png",
        badge: null,
        featured: false,
        colors: [
            { name: "Silver", hex: "#d8d8da" }
        ],
        storage: null,
        highlights: [
            "Tombol presisi dengan travel nyaman",
            "Koneksi nirkabel Bluetooth",
            "Baterai hingga satu bulan",
            "Bodi aluminium",
            "Kabel USB-C untuk pengisian"
        ],
        specs: [
            { label: "Koneksi", value: "Bluetooth" },
            { label: "Baterai", value: "Hingga 1 bulan" },
            { label: "Pengisian", value: "USB-C" },
            { label: "Kompatibilitas", value: "Mac, iPad, iPhone" },
            { label: "Material", value: "Aluminium" },
            { label: "Isi kotak", value: "Magic Keyboard, kabel USB-C" }
        ]
    },
    {
        id: "apple-pencil-pro",
        name: "Apple Pencil Pro",
        category: "aksesori",
        tagline: "Presisi di ujung jari.",
        description:
            "Squeeze, barrel roll, dan haptic feedback membuka cara baru untuk menggambar, mencatat, dan berkarya.",
        price: 2199000,
        image: "assets/img/apple-pencil.png",
        badge: null,
        featured: false,
        colors: [
            { name: "White", hex: "#f5f5f0" }
        ],
        storage: null,
        highlights: [
            "Squeeze untuk membuka tool palette",
            "Barrel roll untuk kontrol kuas presisi",
            "Haptic feedback halus",
            "Find My untuk menemukan pencil",
            "Pengisian dan pairing magnetis"
        ],
        specs: [
            { label: "Kompatibilitas", value: "iPad Pro M4, iPad Air M2" },
            { label: "Koneksi", value: "Bluetooth, magnetis" },
            { label: "Pengisian", value: "Magnetis nirkabel" },
            { label: "Sensor", value: "Tekanan, kemiringan, gyroscope" },
            { label: "Fitur", value: "Squeeze, barrel roll, haptic" },
            { label: "Isi kotak", value: "Apple Pencil Pro" }
        ]
    }
];

/* Helper: ambil produk berdasarkan id */
function getProductById(id) {
    return PRODUCTS.find((product) => product.id === id) || null;
}

/* Helper: label kategori */
function getCategoryLabel(id) {
    const category = CATEGORIES.find((item) => item.id === id);
    return category ? category.label : id;
}
