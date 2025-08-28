// src/app/actions/get-saloons-by-service.ts
import { API_BASE_URL } from "../../../config/constants";

export interface Saloon {
  id: string;
  name: string;
  description: string;
  shortIntro: string;
  rating: number;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaloonService {
  saloonId: string;
  serviceId: string;
  price: number;
  durationMinutes: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  saloon: Saloon;
}

export interface ServiceWithSaloons {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  parentServiceId: string | null;
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
  saloonServices: SaloonService[];
}

export interface SaloonData {
  id: string;
  name: string;
  shortIntro: string;
  price: number;
  durationMinutes: number;
  isAvailable: boolean;
  rating: number;
  address: string;
}

const getSaloonsByService = async (serviceId: string): Promise<SaloonData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/services/${serviceId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ServiceWithSaloons = await response.json();
    
    // Extract saloon data from the response
    const saloonsData: SaloonData[] = data.saloonServices
      .filter(saloonService => saloonService.isAvailable) // Only include available services
      .map(saloonService => ({
        id: saloonService.saloon.id,
        name: saloonService.saloon.name,
        shortIntro: saloonService.saloon.shortIntro,
        price: saloonService.price,
        durationMinutes: saloonService.durationMinutes,
        isAvailable: saloonService.isAvailable,
        rating: saloonService.saloon.rating,
        address: saloonService.saloon.address,
      }));
    
    return saloonsData;
  } catch (error) {
    console.error('Error fetching saloons by service:', error);
    throw error;
  }
};

export default getSaloonsByService;