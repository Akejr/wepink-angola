import { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "1",
    slug: "pink-diamond",
    name: "Pink Diamond",
    subtitle: "Eau de Parfum",
    price: 45000,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDC20DaYGTqg5bB9wrJ5JJXeRN7u5Nb8mYyGSjUd_AI87vXxOrJf8pOwd-Mz_21flysAcCoi-jpZxDpOd-wJiP1RUuh39l6mE5WU4FGxTQ6IgqAypb1e5KaacQ-npW644QQ9WMV_4aMQ9XwFYCzzA1bOyTfCTzUPG2LEei99NajiiCC5qvRWvr254i4hFqd5rXVSO-c3Dp6hhl7gRuxCmjL4AzuVeJaBYBCnKEgjYs22Frp-7wHEz-TshkdJxKSDSk6eJYxQvictFfS",
    imageAlt:
      "Minimalist perfume bottle with a pink cap against a soft peach background",
    category: "floral",
    badge: "NEW",
    description:
      "Uma fragrância vibrante com notas de saída cítricas e coração floral de jasmim e rosa. Criada para a mulher que brilha com luz própria.",
    scentProfile: ["Cítrico", "Floral", "Jasmim", "Rosa"],
    sizes: [
      { label: "50ml", ml: 50, price: 32000 },
      { label: "100ml", ml: 100, price: 45000 },
    ],
    details: {
      duration: "Fixação de até 12 horas com projeção elegante.",
      ingredients: "Essências importadas com certificação de origem.",
    },
  },
  {
    id: "2",
    slug: "obsession",
    name: "Obsession",
    subtitle: "Parfum",
    price: 32500,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-z9me7d3ljpPqhNMnGElsrxDTc7lA1mvNr32kfoVdmWvaIwxaNdRY9M2H5sz_9QINCQl4_RpoxaZmNSJbRniGCkWVBW5w-GxUpIJHs0txXmmp-S1B3jisVIQLIM3AZrFpBbV5ACGhktrb_SJAo-tQkpsgcFs0GCN5U0YO1gxgsdTg1KTUo5LkyyVJ6QDCOKmwdTSqE0L6feohcS8XRbWFVq4PxIU0Uxddh4Em7ujg-xYy5vMYFCoZOFEH86s2D98tCe49RXRp__Ga",
    imageAlt:
      "Elegant glass perfume bottle with gold detailing on a neutral linen surface",
    category: "oriental",
    description:
      "Intensa e misteriosa, Obsession combina notas amadeiradas com âmbar e baunilha. Uma assinatura olfativa que não passa despercebida.",
    scentProfile: ["Amadeirado", "Âmbar", "Baunilha", "Musk"],
    sizes: [
      { label: "30ml", ml: 30, price: 22000 },
      { label: "50ml", ml: 50, price: 32500 },
    ],
    details: {
      duration: "Fixação de até 10 horas com sillage marcante.",
      ingredients:
        "Blend exclusivo de essências orientais e amadeiradas premium.",
    },
  },
  {
    id: "3",
    slug: "night-bloom",
    name: "Night Bloom",
    subtitle: "Eau de Parfum",
    price: 55000,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB0HywOxP3WvVR8lruuuKIBWCEJN0wRfn0KPygcfr-mp5ZlBq_Imet_q-QVPIL2n_uQ2FIwwTkY50zpaXgc1mnkIaM6NtE8AQCpgspiSkdmapO3BR64GYqBjIaghEOKaw97VzFKkgS_uQxivM6KwuhgX0jqGlncjogZVvwKjSVln8ucuoPuIvH43zHcnbYW02FjzDhbX71c38xwrnmmSYwrhghDVyjvm35tRzDm6gtuuCGdyvi3z4D0snNwijKrOoC44YnbG1xqeDwD",
    imageAlt:
      "Luxury dark glass perfume bottle surrounded by dry botanical elements",
    category: "woody",
    badge: "BEST SELLER",
    description:
      "Para noites especiais, Night Bloom oferece uma experiência olfativa única com notas de oud, sândalo e flor-de-laranjeira.",
    scentProfile: ["Oud", "Sândalo", "Flor-de-laranjeira", "Patchouli"],
    sizes: [
      { label: "50ml", ml: 50, price: 38000 },
      { label: "100ml", ml: 100, price: 55000 },
    ],
    details: {
      duration: "Fixação de até 14 horas. Ideal para eventos noturnos.",
      ingredients: "Oud natural e sândalo de Mysore com certificação.",
    },
  },
  {
    id: "4",
    slug: "rose-whisper",
    name: "Rose Whisper",
    subtitle: "Body Splash",
    price: 18900,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB5KwXOacK1kZ-QssAYjO3C6xLLDKE5_uQIUzqpcQ-sjynAAdiq2rzUrmAnqfSGS0C4UHvZQrBQvgUwscW7xFUKNyr6g72DuSui_wf_luApvpENz3JIlGXRTScR7PjCmAcVC7S2uyb6E-y2OVA5eG1tRgj7k22K15lKbV5G5vxBPMHk0PZrMyftTZNL4vXjHtSPAC6agg17l6jxsciohadFDMUKPb8JNP4PFUCWpCSJPhSncB1Hp30V11syncjB_bXrIMBGuXCE6k5p",
    imageAlt:
      "Clear perfume bottle with liquid reflecting pink light and floating rose petals",
    category: "floral",
    description:
      "Leve e romântica, Rose Whisper é perfeita para o dia-a-dia. Pétalas de rosa frescas com um toque de peônia e brisa marinha.",
    scentProfile: ["Rosa", "Peônia", "Brisa Marinha", "Almíscar Branco"],
    sizes: [
      { label: "100ml", ml: 100, price: 12500 },
      { label: "200ml", ml: 200, price: 18900 },
    ],
    details: {
      duration: "Fixação de até 6 horas, perfeita para uso diário.",
      ingredients: "Água floral de rosa búlgara e essências naturais.",
    },
  },
  {
    id: "5",
    slug: "velvet-orchid",
    name: "Velvet Orchid",
    subtitle: "Eau de Cologne",
    price: 27000,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCmS29_IQPCR1u5FS2_ztxbrDRIe4ECIZvtibEQJxwWjEjV4ISdvkU1VgAmmwrX4UkJCffsVA2gE2lrjSq0IIFxLk4g-Tsl8CujM34jD6Pwcmk3vYQFnOJYirz9dP2Arst0l-PfTvFdRize7KjikXGb6ZjFFXI54hmCIXzw-KTCzlCCTOxB-_SnrXNrJMlgfk_8OxnKb9cd-UQs89yY2X7ZsKnK5Uqpi_CMrBeKGc4rehe4x5EdOdFplQOu9sRUUSikNMtwhJZnE1XK",
    imageAlt:
      "Stylized composition of a designer perfume bottle on textured cream paper with a single orchid stem",
    category: "floral",
    description:
      "Sofisticada e envolvente, Velvet Orchid mistura orquídea negra com notas de rum e mel. Uma experiência sensorial luxuosa.",
    scentProfile: ["Orquídea", "Rum", "Mel", "Bergamota"],
    sizes: [
      { label: "75ml", ml: 75, price: 20000 },
      { label: "150ml", ml: 150, price: 27000 },
    ],
    details: {
      duration: "Fixação de até 8 horas com evolução sofisticada.",
      ingredients: "Extrato de orquídea negra e mel de acácia.",
    },
  },
  {
    id: "6",
    slug: "discovery-set",
    name: "Discovery Set",
    subtitle: "Sample Collection",
    price: 12500,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuByVtqoWS-GKSXUXK__-tEGAo7KpNjufysZbqT9cZEDQa8kt23EWi55E7sP5yXHJMRg7mab5vVpz1HbHgQjKBYQkRYcD5TWKESDd7XOUY1bEZi9tLsPmtFwsHKU3bb1eM9JTACPwElj122zaUDDqz4-jWCRrh7ZoeOdx5wsTwzMmz6KioiVECcyv3hqeWYDFZsAtncaW-77Oiri52lC3MJ4hJQWfluz2iBAL18w8xOqUOC9PGPZOEVjlhpBItusfUIRyUHxVfRttB81",
    imageAlt:
      "A collection of small fragrance vials on a polished light wood surface with soft morning light",
    category: "citrus",
    badge: "EDIÇÃO LIMITADA",
    description:
      "O kit perfeito para explorar o universo Wepink. Cinco fragrâncias em miniatura para descobrir a sua assinatura olfativa.",
    scentProfile: ["Variado", "Floral", "Amadeirado", "Cítrico"],
    sizes: [{ label: "5 x 2ml", ml: 10, price: 12500 }],
    details: {
      duration: "Ideal para experimentação antes da compra definitiva.",
      ingredients: "Todas as 5 fragrâncias bestseller da Wepink.",
    },
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("pt-AO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(price)
    .replace(/\s/g, ".");
}
