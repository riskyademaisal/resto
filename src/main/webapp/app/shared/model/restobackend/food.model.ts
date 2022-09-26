import { Size } from 'app/shared/model/enumerations/size.model';

export interface IFood {
  id?: number;
  name?: string;
  description?: string | null;
  price?: number;
  foodSize?: Size;
  imageContentType?: string | null;
  image?: string | null;
}

export const defaultValue: Readonly<IFood> = {};
