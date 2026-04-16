export type MemoryCategory = "happy";

export type MemoryItem = {
  id: string;
  title: string;
  category: MemoryCategory;
  image: string;
  ending: "bad" | "true" | "secret";
  description: string;
};

export const MEMORY_ITEMS: MemoryItem[] = [
  {
    id: "album-01",
    title: "Bakışlar Sert",
    category: "happy",
    image: "/photos/album/album-01.jpeg",
    ending: "true",
    description: "Modlar düşük, bakışlar net.",
  },
  {
    id: "album-02",
    title: "Canavar Modu",
    category: "happy",
    image: "/photos/album/album-02.png",
    ending: "true",
    description: "Kıyamet öncesi son ifade.",
  },
  {
    id: "album-03",
    title: "Trip Başlangıcı",
    category: "happy",
    image: "/photos/album/album-03.jpeg",
    ending: "true",
    description: "Sessiz ama etkili bir rest.",
  },
  {
    id: "album-04",
    title: "Gözler Konuşuyor",
    category: "happy",
    image: "/photos/album/album-04.jpeg",
    ending: "true",
    description: "Tek karede tüm duygu raporu.",
  },
  {
    id: "album-05",
    title: "Soğuk Cevap",
    category: "happy",
    image: "/photos/album/album-05.jpeg",
    ending: "true",
    description: "Bu bakıştan sonra tartışma uzamaz.",
  },
  {
    id: "album-06",
    title: "İnce Ayar",
    category: "happy",
    image: "/photos/album/album-06.jpeg",
    ending: "true",
    description: "Sinir dozu ölçül, etkisi yüksek.",
  },
  {
    id: "album-07",
    title: "Yüzler Ciddi",
    category: "happy",
    image: "/photos/album/album-07.jpeg",
    ending: "true",
    description: "Modumuz net: şaka kaldırmıyor.",
  },
  {
    id: "album-08",
    title: "Kritik An",
    category: "happy",
    image: "/photos/album/album-08.jpeg",
    ending: "true",
    description: "Bir kelime, bir kaş hareketi.",
  },
  {
    id: "album-09",
    title: "Sessiz Gerilim",
    category: "happy",
    image: "/photos/album/album-09.jpeg",
    ending: "true",
    description: "Arka planda fırtına, önde sakinlik.",
  },
  {
    id: "album-10",
    title: "Çatık Kaşlar",
    category: "happy",
    image: "/photos/album/album-10.jpeg",
    ending: "true",
    description: "Sinirli ama karizmatik kare.",
  },
  {
    id: "album-11",
    title: "Son Uyarı",
    category: "happy",
    image: "/photos/album/album-11.jpeg",
    ending: "true",
    description: "Bakışlar net, mesaj açık.",
  },
  {
    id: "album-12",
    title: "Duygu Patlaması",
    category: "happy",
    image: "/photos/album/album-12.jpeg",
    ending: "true",
    description: "Gülmeden de güçlü duruş.",
  },
  {
    id: "album-13",
    title: "Trip Kombosu",
    category: "happy",
    image: "/photos/album/album-13.jpeg",
    ending: "true",
    description: "İkiniz de aynı frekansta.",
  },
  {
    id: "album-14",
    title: "Yüksek Tansiyon",
    category: "happy",
    image: "/photos/album/album-14.jpeg",
    ending: "true",
    description: "Kare küçük, enerji büyük.",
  },
  {
    id: "album-15",
    title: "Sinirli Stil",
    category: "happy",
    image: "/photos/album/album-15.jpeg",
    ending: "true",
    description: "Bakışlar sert, aura premium.",
  },
  {
    id: "album-16",
    title: "Sokak Modu",
    category: "happy",
    image: "/photos/album/album-16.jpeg",
    ending: "true",
    description: "Anı net, tavır daha net.",
  },
  {
    id: "album-17",
    title: "Tam Ciddiyet",
    category: "happy",
    image: "/photos/album/album-17.jpeg",
    ending: "true",
    description: "Şaka yok, poz çok iyi.",
  },
  {
    id: "album-18",
    title: "Zeytin Dokunuşu",
    category: "happy",
    image: "/photos/album/album-18.jpg",
    ending: "true",
    description: "Albümde farklı bir bonus kare.",
  },
];

export const CHARACTER_OPTIONS = [
  {
    id: "Dufs" as const,
    title: "Dufs",
    role: "Taylor Swift",
    image: "/photos/avatar-ufuk-real.png",
    accent: "from-cyan-300/40 to-blue-500/30",
  },
  {
    id: "Šedf" as const,
    title: "Šedf",
    role: "Emily Watson",
    image: "/photos/avatar-sedef-real.png",
    accent: "from-fuchsia-300/40 to-pink-500/30",
  },
];
