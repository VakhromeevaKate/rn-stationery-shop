// api/mockDrugsAPI.ts
import { Drug } from '../types/drug';
import drugsData from '../mocks/db.json';

export const fetchDrugs = async (): Promise<Drug[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(drugsData.drugs as Drug[]); // Обрати внимание: добавили .drugs
    }, 300);
  });
};

export const fetchDrugById = async (id: string): Promise<Drug | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const drug = (drugsData.drugs as Drug[]).find((d) => d.id === id); // И здесь тоже .drugs
      resolve(drug);
    }, 200);
  });
};