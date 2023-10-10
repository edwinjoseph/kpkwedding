import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const twcx = (...classes: ClassValue[]) => twMerge(clsx(...classes));

export default twcx;