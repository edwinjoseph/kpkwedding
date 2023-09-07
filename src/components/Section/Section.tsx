import cx from 'classnames';

const Section = ({ children, className }) => (
    <section className={cx('my-[80px] md:my-[120px]', className)}>
        {children}
    </section>
);

Section.Container = ({ children }) => (
    <div className="px-4 md:px-10 max-w-[1369px] mx-auto">
        {children}
    </div>
);

export default Section;
