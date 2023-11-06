export interface ScrollToElementOptions {
    offset?: number;
    includeHeader?: boolean;
}

export const scrollToElement = <T extends HTMLElement = HTMLElement>(element: T, options: ScrollToElementOptions): void => {
    const scrollPos = window.scrollY;
    const style = window.getComputedStyle(element);
    const elementTopPos = element.getBoundingClientRect().top - parseInt(style.marginTop.replace('px', ''));

    let scrollToY = scrollPos + elementTopPos;

    if (options.includeHeader) {
        const header = document.getElementsByTagName('header')[0];
        const headerHeight = header ? header.getBoundingClientRect().height : 0;

        scrollToY -= headerHeight
    }

    if (options.offset) {
        scrollToY += options.offset;
    }

    window.scrollTo({
        top: scrollToY,
        left: 0,
    });
}