export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Popular' | 'Idli' | 'Dosa' | 'Vada' | 'Drinks' | 'Sides';
  image: string;
  veg: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}
