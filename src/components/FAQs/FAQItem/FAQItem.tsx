import { Collapse } from 'solid-collapse';
import cx from 'classnames';
import RichText from '@components/RichText';

export interface FAQItemProps {
    title: string;
    content: Array<string>;
    isOpen: () => boolean;
    onClick: () => void;
}

const FAQItem = ({ title, content, isOpen, onClick }: FAQItemProps) => (
    <div class="relative border-t border-[#CBCBCB]">
        <button class="flex justify-between w-full justify-items-start items-center pt-4 md:pt-6 pb-4 md:pb-6 gap-1" onClick={onClick}>
            <h3 class="font-bold md:text-2xl">{title}</h3>
            <div
                class={cx('relative w-6 h-0.5 top-1/2 bg-[#8D8D8D] shrink-0 before:content-[""] before:block before:absolute before:h-3 before:w-0.5 before:bg-[#8D8D8D] before:-top-[11px] before:left-1/2 before:-translate-x-1/2 before:origin-bottom before:transition-transform after:content-[""] after:block after:absolute after:h-3 after:top-px after:w-0.5 after:bg-[#8D8D8D] after:left-1/2 after:origin-top after:-translate-x-1/2 after:transition-transform', {
                    'after:scale-y-100': !isOpen(),
                    'before:scale-y-100': !isOpen(),
                    'after:scale-y-0': isOpen(),
                    'before:scale-y-0': isOpen()
                })}
            />
        </button>
        <div class="md:-mt-2">
            <Collapse value={isOpen()} class="relative transition-height">
                <RichText
                    class="pb-4 md:pb-6"
                    content={content}
                />
            </Collapse>
        </div>
    </div>
);

export default FAQItem;
