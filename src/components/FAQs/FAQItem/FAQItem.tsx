import SolidMarkdown from 'solid-markdown';
import { Collapse } from 'solid-collapse';
import cx from 'classnames';

export interface FAQItemProps {
    title: string;
    content: Array<string>;
    isOpen: () => boolean;
    onClick: () => void;
}

const FAQItem = ({ title, content, isOpen, onClick }: FAQItemProps) => (
    <div class="relative border-t border-[#CBCBCB]">
        <button class="flex justify-between w-full items-center pt-4 md:pt-6 pb-4 md:pb-6" onClick={onClick}>
            <h3 class="font-bold md:text-2xl">{title}</h3>
            <div
                class={cx('relative w-6 h-0.5 top-1/2 bg-[#8D8D8D] before:content-[""] before:block before:absolute before:h-3 before:w-0.5 before:bg-[#8D8D8D] before:-top-[11px] before:left-1/2 before:-translate-x-1/2 before:origin-bottom before:transition-transform after:content-[""] after:block after:absolute after:h-3 after:top-px after:w-0.5 after:bg-[#8D8D8D] after:left-1/2 after:origin-top after:-translate-x-1/2 after:transition-transform', {
                    'after:scale-y-100': !isOpen(),
                    'before:scale-y-100': !isOpen(),
                    'after:scale-y-0': isOpen(),
                    'before:scale-y-0': isOpen()
                })}
            />
        </button>
        <div class="md:-mt-2">
            <Collapse value={isOpen()} class="relative transition-height">
                <SolidMarkdown
                    class="pb-4 md:pb-6"
                    children={content.join('\n\n')}
                    components={{
                        p: ({ children, class: className, node: _node, ...props }) => (
                            <p
                                class={cx(className, 'text-[#555] mb-2 last:mb-0 md:mb-4')}
                                {...props}>
                                {children}
                            </p>
                        ),
                        a: ({ children, class: className, node: _node, href, ...props }) => (
                            <a
                                {...props}
                                class={cx(className, 'underline text-black')}
                                href={href}
                                target={href?.startsWith('http') ? '_blank' : '_self'}>
                                {children}
                            </a>
                        ),
                        strong: ({ children, class: className, node: _node, ...props }) => (
                            <strong class={cx(className, 'text-black font-bold')} {...props}>{children}</strong>
                        ),
                        ul: ({ children, class: className, node: _node, ...props }) => (
                            <ul class={cx(className, 'mb-4 pl-6')} {...props}>
                                {children}
                            </ul>
                        ),
                        li: ({ children, class: className, node: _node, ...props }) => (
                            <li class={cx(className, 'relative before:content-[""] before:absolute before:w-1 before:h-1 before:rounded-full before:bg-black before:-left-3 before:top-3')} {...props}>{children}</li>
                        ),
                    }}
                />
            </Collapse>
        </div>
    </div>
);

export default FAQItem;
