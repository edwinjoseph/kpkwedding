import { Dynamic } from "solid-js/web";
import cx from 'classnames';
import { twMerge } from 'tailwind-merge'
import { Component, JSXElement } from 'solid-js';

const createClass = (cxClass: string, overriddenClass?: string) => twMerge(cxClass, overriddenClass);

type SectionComponent = Component<{ children: JSXElement, class?: string }> & {
    Container: Component<{ children: JSXElement }>,
    Title: Component<{ text: string, subtitle?: string, heading?: 'h1' | 'h2' | 'h3', centered?: boolean; class?: string; }>
};

const Section: SectionComponent = (props) => (
    <section class={createClass(cx('my-20 md:my-[120px]', {
        'first:mt-0': !props.class?.includes('mt-'),
        'last:mb-0': !props.class?.includes('mb-')
    }), props.class)}>
        {props.children}
    </section>
);

Section.Container = ({ children }) => (
    <div class="px-4 md:px-10 max-w-[1440px] w-full mx-auto">
        {children}
    </div>
);

Section.Title = ({ text, subtitle, heading, centered, ...props }) => (
    <Dynamic component={heading || 'h2'} class={createClass(cx(`font-heading mb-16 text-[32px] md:mb-20 md:text-[64px]`, {
        'text-center': centered,
    }, props.class))}>
        {subtitle && (
            <span class="font-body uppercase block text-sm mb-4 md:text-xl md:mb-6 font-bold tracking-[5px] text-pink">{subtitle}</span>
        )}
        {text}
    </Dynamic>
);

export default Section;
