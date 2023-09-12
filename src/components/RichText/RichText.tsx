import cx from 'classnames';
import SolidMarkdown from 'solid-markdown';

export interface RichTextProps {
    class?: string;
    content: Array<string>;
}

const RichText = (props: RichTextProps) => (
    <SolidMarkdown
        class={props.class}
        children={props.content.join('\n\n')}
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
);

export default RichText;
