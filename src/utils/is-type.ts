import { Ref } from 'solid-js';

export const isRefHTMLElement = (value: Ref<HTMLElement> | undefined): value is HTMLElement => {
    return Boolean(value) && !(value instanceof Function);
}

export const isRefHTMLButtonElement = (value: Ref<HTMLButtonElement> | undefined): value is HTMLButtonElement => {
    return Boolean(value) && !(value instanceof Function);
}