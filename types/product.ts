export interface Product {
id: string | number;
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
}

// Строка корзины: лекарство + количество
export interface CartLine {
product: Product;
quantity: number;
}