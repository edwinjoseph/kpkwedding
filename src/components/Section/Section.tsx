import { Dynamic } from "solid-js/web";
import cx from 'classnames';
import { Component, JSXElement } from 'solid-js';

type SectionComponent = Component<{ children: JSXElement, class?: string }> & {
    Container: Component<{ children: JSXElement }>,
    Title: Component<{ text: string, subtitle?: string, heading?: 'h1' | 'h2' | 'h3', class?: string; }>
};

const Section: SectionComponent = (props) => (
    <section class={cx('my-20 md:my-[120px]', props.class, {
        'first:mt-0': !props.class?.includes('mt-'),
        'last:mb-0': !props.class?.includes('mb-')
    })}>
        {props.children}
    </section>
);

Section.Container = ({ children }) => (
    <div class="px-4 md:px-10 max-w-[1440px] w-full mx-auto">
        {children}
    </div>
);

Section.Title = ({ text, subtitle, heading, ...props }) => (
    <Dynamic component={heading || 'h2'} class={cx(`font-heading text-center mb-16 text-[32px] md:mb-20 md:text-[64px]`, props.class)}>
        {subtitle && (
            <span class="font-body uppercase block text-sm mb-4 md:text-xl md:mb-6 font-bold tracking-[5px] text-pink">{subtitle}</span>
        )}
        {text}
    </Dynamic>
);

export default Section;
