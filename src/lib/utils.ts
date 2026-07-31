import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ADMIN_PHONE_NUMBERS = ['8584017701', '9875563329'];

export function isAllowedAdminUser(userPhone?: string | null): boolean {
  if (!userPhone) return false;
  const digits = userPhone.replace(/\D/g, '');
  const last10 = digits.slice(-10);
  return ADMIN_PHONE_NUMBERS.includes(last10);
}

