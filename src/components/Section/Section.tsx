import { Dynamic } from "solid-js/web";
import { Component, JSXElement } from 'solid-js';
import twcx from '@utils/tailwind-cx';

type SectionComponent = Component<{ children: JSXElement, class?: string, ref?: HTMLElement | undefined }> & {
    Container: Component<{ children: JSXElement }>,
    Title: Component<{ text: string, subtitle?: string, heading?: 'h1' | 'h2' | 'h3', centered?: boolean; class?: string; }>
};

const Section: SectionComponent = (props) => (
    <section class={twcx('my-20 md:my-[120px]', props.class)} ref={props.ref}>
        {props.children}
    </section>
);

Section.Container = ({ children }) => (
    <div class="mx-auto w-full max-w-[1440px] px-4 md:px-10">
        {children}
    </div>
);

Section.Title = ({ text, subtitle, heading, centered, ...props }) => (
    <Dynamic component={heading || 'h2'} class={twcx(`font-heading mb-16 text-[32px] md:mb-20 md:text-[64px]`, {
        'text-center': centered,
    }, props.class)}>
        {subtitle && (
            <span class="mb-4 block font-body text-sm font-bold uppercase tracking-[5px] text-pink md:mb-6 md:text-xl">{subtitle}</span>
        )}
        {text}
    </Dynamic>
);

export default Section;
