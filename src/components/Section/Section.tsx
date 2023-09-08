import cx from 'classnames';

const Section = ({ children, className }) => (
    <section className={cx('my-20 md:my-[120px] first:mt-0', className)}>
        {children}
    </section>
);

Section.Container = ({ children }) => (
    <div className="px-4 md:px-10 max-w-[1440px] mx-auto">
        {children}
    </div>
);

Section.Title = ({ text, subtitle }) => (
    <h2 className="font-heading text-center mb-16 text-[32px] md:mb-20 md:text-[64px]">
        {subtitle && (
            <span className="font-body uppercase block text-3.5 mb-4 md:text-xl md:mb-6 font-bold tracking-[5px] text-pink">{subtitle}</span>
        )}
        {text}
    </h2>
);

export default Section;
