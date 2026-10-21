import data from '../db.json';
import { Product } from '../types/product';

const DELAY_MS = 600;

const delay = (ms: number) =>
  new Promise<void>((res) => setTimeout(res, ms));

// Получение списка лекарств
export async function fetchProducts(): Promise<Product[]> {
  await delay(DELAY_MS);
  return data.drugs as Product[];
}

// Получение одного лекарства по id
export async function fetchProductById(
  id: string
): Promise<Product | undefined> {
  await delay(DELAY_MS);

  return (data.drugs as Product[]).find(
    (drug) => String(drug.id) === id
  );
}