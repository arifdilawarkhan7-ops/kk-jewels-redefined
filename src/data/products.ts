import necklace1 from "@/assets/necklace-1.jpg";
import ring1 from "@/assets/ring-1.jpg";
import earrings1 from "@/assets/earrings-1.jpg";
import bracelet1 from "@/assets/bracelet-1.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: "necklaces" | "rings" | "earrings" | "bracelets";
  image: string;
  description: string;
  featured?: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Diamond Teardrop Necklace",
    price: 45999,
    category: "necklaces",
    image: necklace1,
    description: "An exquisite teardrop diamond pendant set in 18K gold, perfect for elegant evenings. Features a brilliant-cut center stone surrounded by micro-pavé diamonds.",
    featured: true,
  },
  {
    id: "2",
    name: "Halo Engagement Ring",
    price: 89999,
    category: "rings",
    image: ring1,
    description: "A stunning engagement ring featuring a brilliant round-cut diamond in a halo setting. Crafted in 18K rose gold with exceptional sparkle and clarity.",
    featured: true,
  },
  {
    id: "3",
    name: "Crystal Drop Earrings",
    price: 28999,
    category: "earrings",
    image: earrings1,
    description: "Luxurious gold drop earrings adorned with pear-shaped crystals and delicate diamond accents. Perfect for special occasions and elegant gatherings.",
    featured: true,
  },
  {
    id: "4",
    name: "Gemstone Tennis Bracelet",
    price: 67999,
    category: "bracelets",
    image: bracelet1,
    description: "A sophisticated tennis bracelet featuring alternating diamonds and colored gemstones in 18K gold. Adjustable clasp ensures perfect fit.",
    featured: true,
  },
  {
    id: "5",
    name: "Infinity Diamond Necklace",
    price: 52999,
    category: "necklaces",
    image: necklace1,
    description: "Symbol of eternal love, this infinity pendant is adorned with brilliant diamonds and set in lustrous 18K white gold.",
  },
  {
    id: "6",
    name: "Sapphire Wedding Band",
    price: 38999,
    category: "rings",
    image: ring1,
    description: "Classic wedding band featuring channel-set sapphires and diamonds. Timeless design in 18K yellow gold.",
  },
  {
    id: "7",
    name: "Pearl Stud Earrings",
    price: 15999,
    category: "earrings",
    image: earrings1,
    description: "Elegant freshwater pearl studs with gold settings. Perfect for everyday sophistication.",
  },
  {
    id: "8",
    name: "Charm Link Bracelet",
    price: 42999,
    category: "bracelets",
    image: bracelet1,
    description: "Delicate link bracelet with customizable charms. Crafted in 18K rose gold with secure clasp.",
  },
];
