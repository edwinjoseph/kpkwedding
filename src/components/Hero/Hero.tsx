import LearnMoreIcon from '../LearnMoreIcon';
import Section from '../Section';

const Hero = () => (
    <Section>
        <Section.Container>
            <div class={`mx-auto flex aspect-[343/540] max-w-[1369px] flex-col justify-center bg-[url('/assets/hero-mobile.jpg')] bg-cover bg-top md:aspect-[377/505] md:bg-[url('/assets/hero-tablet.jpg')] lg:aspect-[413/234] lg:bg-[url('/assets/hero.jpg')]`}>
                <h1 class="relative z-20 my-[30px] text-center font-heading text-[64px] leading-[64px] text-white md:text-[120px] md:leading-[120px]">Kezia & James</h1>
                <h2 class="text-center text-lg font-bold uppercase tracking-[4px] text-white md:text-2xl">The wedding</h2>
            </div>
            <LearnMoreIcon class="z-20 mx-auto mt-[-30px]" />
        </Section.Container>
    </Section>
)

export default Hero