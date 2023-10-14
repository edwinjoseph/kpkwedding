export const isHTMLElement = (value: unknown): value is HTMLElement => {
    return value instanceof HTMLElement;
}

export const isHTMLInputElement = (value: unknown): value is HTMLInputElement => {
    return value instanceof HTMLInputElement;
}
