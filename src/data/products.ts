import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "MJ-001",
    slug: "mesin-bor-cordless-20v",
    name: "Mesin Bor Cordless 20V",
    category: "Perkakas",
    price: 785000,
    stock: 24,
    unit: "unit",
    rating: 4.8,
    description:
      "Bor cordless 20V dengan baterai lithium, cocok untuk pekerjaan kayu dan logam ringan. Termasuk 2 baterai dan charger cepat.",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80",
    features: ["Baterai 20V dual pack", "Torque 55 Nm", "Chuck 13 mm"],
  },
  {
    id: "MJ-002",
    slug: "kompresor-udara-2hp",
    name: "Kompresor Udara 2 HP",
    category: "Perkakas",
    price: 2450000,
    stock: 8,
    unit: "unit",
    rating: 4.6,
    description:
      "Kompresor udara 2 HP tangki 50 liter untuk bengkel, cat semprot, dan pengisian ban.",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80",
    features: ["Tangki 50 liter", "Motor 2 HP", "Tekanan max 8 bar"],
  },
  {
    id: "MJ-003",
    slug: "cat-tembok-interior-25kg",
    name: "Cat Tembok Interior 25 kg",
    category: "Bahan Bangunan",
    price: 385000,
    stock: 120,
    unit: "pail",
    rating: 4.7,
    description:
      "Cat interior anti jamur dengan daya sebar tinggi. Tersedia warna putih tulang dan custom tint.",
    image:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=900&q=80",
    features: ["Anti jamur", "Daya sebar 10-12 m²/kg", "Rendah VOC"],
  },
  {
    id: "MJ-004",
    slug: "semen-portland-50kg",
    name: "Semen Portland 50 kg",
    category: "Bahan Bangunan",
    price: 62000,
    stock: 500,
    unit: "sak",
    rating: 4.5,
    description:
      "Semen portland berkualitas untuk struktur, plester, dan acian. Pengiriman per pallet tersedia.",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80",
    features: ["Berat 50 kg", "Cepat setting", "Cocok untuk struktur"],
  },
  {
    id: "MJ-005",
    slug: "printer-laser-a4",
    name: "Printer Laser A4",
    category: "Kantor",
    price: 1899000,
    stock: 15,
    unit: "unit",
    rating: 4.4,
    description:
      "Printer laser monokrom A4 untuk kantor. Hemat toner, koneksi USB dan Wi-Fi.",
    image:
      "https://images.unsplash.com/photo-1612815154858-960ea67a0c18?auto=format&fit=crop&w=900&q=80",
    features: ["Cetak 30 ppm", "Wi-Fi + USB", "Duplex otomatis"],
  },
  {
    id: "MJ-006",
    slug: "kertas-hvs-a4-70gsm",
    name: "Kertas HVS A4 70 gsm",
    category: "Kantor",
    price: 48500,
    stock: 200,
    unit: "rim",
    rating: 4.9,
    description:
      "Kertas HVS A4 70 gsm isi 500 lembar. Putih bersih, tidak macet di printer.",
    image:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=900&q=80",
    features: ["500 lembar / rim", "70 gsm", "Putih terang"],
  },
  {
    id: "MJ-007",
    slug: "lampu-led-panel-40w",
    name: "Lampu LED Panel 40W",
    category: "Listrik",
    price: 125000,
    stock: 80,
    unit: "pcs",
    rating: 4.6,
    description:
      "Panel LED 40W cahaya putih 6500K untuk ruangan kerja dan toko. Hemat listrik dan tahan lama.",
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80",
    features: ["40 Watt", "6500K daylight", "Umur 25.000 jam"],
  },
  {
    id: "MJ-008",
    slug: "kabel-nyyh-2x25",
    name: "Kabel NYYH 2x2.5 mm",
    category: "Listrik",
    price: 18500,
    stock: 1000,
    unit: "meter",
    rating: 4.7,
    description:
      "Kabel tembaga NYYH 2x2.5 mm untuk instalasi rumah. Dijual per meter, potong sesuai kebutuhan.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
    features: ["Tembaga murni", "2x2.5 mm", "Standar SNI"],
  },
  {
    id: "MJ-009",
    slug: "rak-gudang-heavy-duty",
    name: "Rak Gudang Heavy Duty",
    category: "Gudang",
    price: 3250000,
    stock: 6,
    unit: "set",
    rating: 4.8,
    description:
      "Rak gudang 5 tingkat kapasitas 200 kg per tingkat. Rangka baja, mudah dirakit.",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80",
    features: ["5 tingkat", "200 kg / tingkat", "Baja powder coat"],
  },
  {
    id: "MJ-010",
    slug: "pallet-plastik-industri",
    name: "Pallet Plastik Industri",
    category: "Gudang",
    price: 275000,
    stock: 40,
    unit: "pcs",
    rating: 4.3,
    description:
      "Pallet plastik ukuran 120x100 cm, kuat untuk forklift dan stacking.",
    image:
      "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=900&q=80",
    features: ["120 x 100 cm", "Tahan cuaca", "4-way entry"],
  },
  {
    id: "MJ-011",
    slug: "helm-safety-proyek",
    name: "Helm Safety Proyek",
    category: "K3",
    price: 45000,
    stock: 150,
    unit: "pcs",
    rating: 4.5,
    description:
      "Helm safety SNI dengan inner lining nyaman. Tersedia warna kuning, putih, dan merah.",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80",
    features: ["Sertifikasi SNI", "Adjustable", "Ventilasi udara"],
  },
  {
    id: "MJ-012",
    slug: "sepatu-safety-u-steel",
    name: "Sepatu Safety U-Steel",
    category: "K3",
    price: 289000,
    stock: 32,
    unit: "pasang",
    rating: 4.6,
    description:
      "Sepatu safety ujung baja, sol anti slip. Cocok untuk gudang dan proyek konstruksi.",
    image:
      "https://images.unsplash.com/photo-1605733513597-a8f8341084e6?auto=format&fit=crop&w=900&q=80",
    features: ["Steel toe", "Sol anti slip", "Ukuran 39–44"],
  },
];
