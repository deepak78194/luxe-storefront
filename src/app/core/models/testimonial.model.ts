export interface Testimonial {
  id: string;
  name: string;
  handle?: string;
  avatar?: string;
  rating: number;
  text: string;
  product?: string;
  date?: string;
  verified?: boolean;
}
