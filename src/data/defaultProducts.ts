import { Product } from "../types";

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "prod_1",
    name: "Gold-Dusted Royal Espresso",
    price: 320,
    description: "Double shot of single-origin Ethiopian Arabica, extracted under custom pressure profile, finished with a delicate dusting of edible 24K gold leaf. Served in a warm porcelain cup.",
    category: "coffee",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600",
    available: true
  },
  {
    id: "prod_2",
    name: "Ambre Velvet Cold Brew",
    price: 380,
    description: "Cold brew steeped for 18 hours in mountain spring water, infused with double-aged Madagascar vanilla bean and poured over an ice sphere. Silky texture with amber highlights.",
    category: "specialty",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600",
    available: true
  },
  {
    id: "prod_3",
    name: "Saffron Macadamia Latte",
    price: 420,
    description: "House-roasted espresso blended with velvety macadamia nut milk, infused with real organic Kashmiri saffron threads and brushed with local orange blossom honey.",
    category: "coffee",
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=600",
    available: true
  },
  {
    id: "prod_4",
    name: "Rose Honey Chemex Special",
    price: 400,
    description: "Single-origin pour-over crafted with a custom Chemex glass filter, introducing light notes of premium rose water, wildflower honey, and an clean, citrus finish.",
    category: "specialty",
    image: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&q=80&w=600",
    available: true
  },
  {
    id: "prod_5",
    name: "Smoked Pistachio Croissant",
    price: 280,
    description: "A 72-layer butter pastry baked crisp, filled with premium roasted Sicilian pistachio paste, smoked sea salt flakes, and topped with chopped golden pistachios.",
    category: "pastry",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=600",
    available: true
  },
  {
    id: "prod_6",
    name: "Valrhona Noir Truffle Tart",
    price: 340,
    description: "Decadent dark chocolate shell filled with a silky 70% Valrhona dark chocolate ganache, infused with black winter truffle oil and flaky maldon salt.",
    category: "dessert",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600",
    available: true
  },
  {
    id: "prod_7",
    name: "Lavender Honey Infused Latte",
    price: 390,
    description: "Artisanal espresso with microfoamed oat milk, sweetened with organic lavender essence and natural honeycomb chunks. Calm and deeply aromatic.",
    category: "coffee",
    image: "/src/assets/images/lavender_honey_latte_1782275446086.jpg",
    available: true
  },
  {
    id: "prod_8",
    name: "Salted Pecan Croissant-Roll",
    price: 290,
    description: "A spiral pastry roll filled with slow-cooked maple caramel, toasted southern pecans, and glazed with an amber brown-butter syrup.",
    category: "pastry",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600",
    available: true
  }
];
