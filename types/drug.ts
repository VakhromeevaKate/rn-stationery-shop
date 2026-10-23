// types/drug.ts
export interface Drug {
  id: string;
  name: string;
  latin_name: string;
  active_substance: string;
  category: string;
  form: string;        // Таблетки, Капсулы, Сироп и т.д.
  dosage: string;      // 400 мг, 500 мг и т.д.
  manufacturer: string;
  prescription_required: boolean; // Рецептурный / Без рецепта
  description: string;
  stock: number;       // Остаток на складе
}

export interface CartLine {
  drug: Drug;
  quantity: number;
}