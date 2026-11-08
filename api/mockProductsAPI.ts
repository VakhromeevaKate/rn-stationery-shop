import data from '../mocks/drugs.json';
import { Product } from '../types/product';

const DELAY_MS = 250;
const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
// В исходном db.json цены нет, поэтому для демонстрации корзины используем условную цену.
const products: Product[] = data.drugs.map((drug) => ({
  ...drug,
  price: 80 + (Number(drug.id) % 40) * 15,
}));

export async function fetchProducts(): Promise<Product[]> {
  await delay(DELAY_MS);
  return products;
}

export async function fetchProductById(id: string): Promise<Product | undefined> {
  await delay(DELAY_MS);
  return products.find((product) => product.id === id);
}
