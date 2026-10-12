export interface Product {
  id: string;
  name: string;
  latin_name: string;
  active_substance: string;
  category: string;
  form: string;
  dosage: string;
  manufacturer: string;
  prescription_required: boolean;
  description: string;
  stock: number;
  /** Демонстрационная цена: в исходном db.json цены нет. */
  price: number;
}

export interface CartLine { product: Product; quantity: number; }
