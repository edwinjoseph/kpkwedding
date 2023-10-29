import LearnMoreIcon from '../LearnMoreIcon';
import Section from '../Section';

const Hero = (props: { ref: HTMLElement | ((el: HTMLElement) => void) | undefined }) => {
    let ref: HTMLElement | undefined;

    const setRef = (el: HTMLElement) => {
        ref = el;
        if (props.ref instanceof Function) {
            props.ref(el);
        }
    }

    const handleScrollDown = () => {
        if (ref) {
            const style = window.getComputedStyle(ref);
            window.scrollTo({
                top: ref.getBoundingClientRect().height + parseInt(style.marginBottom.replace('px', '')),
                left: 0,
                behavior: 'smooth'
            })
        }
    }

    return (
        <Section class="mt-0 md:mt-0" ref={setRef}>
            <Section.Container isFullWidth>
                <div class={`mx-auto flex flex-col justify-center bg-[url('/assets/hero-mobile.jpg')] bg-cover bg-top h-[calc(100svh_-_180px)] min-h-[400px] md:bg-[url('/assets/hero-tablet.jpg')] lg:bg-[url('/assets/hero.jpg')]`}>
                    <h1 class="my-[30px] text-center font-heading text-[64px] leading-[64px] text-white md:text-[120px] md:leading-[120px]">Kezia <br class="lg:hidden" />& James</h1>
                    <h2 class="text-center text-lg font-bold uppercase tracking-[4px] text-white md:text-2xl">The wedding</h2>
                </div>
                <LearnMoreIcon class="z-20 mx-auto mt-[-47px] cursor-pointer" onClick={handleScrollDown} />
            </Section.Container>
        </Section>
    )
}

export default Hero