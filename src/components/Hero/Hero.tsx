import LearnMoreIcon from '../LearnMoreIcon';
import Section from '../Section';

const Hero = () => (
    <Section>
        <Section.Container>
            <div class={`flex flex-col justify-center max-w-[1369px] mx-auto aspect-[343/540] md:aspect-[377/505] lg:aspect-[413/234] bg-[url('/assets/hero-mobile.jpg')] md:bg-[url('/assets/hero-tablet.jpg')] lg:bg-[url('/assets/hero.jpg')] bg-cover bg-top`}>
                <h1 class="font-heading my-[30px] text-[64px] leading-[64px] text-center md:text-[120px] md:leading-[120px] relative z-20 text-white">Kezia & James</h1>
                <h2 class="uppercase text-l md:text-2xl text-center font-bold text-white tracking-[4px]">The wedding</h2>
            </div>
            <LearnMoreIcon class="-mt-[30px] ml-auto mr-auto z-20" />
        </Section.Container>
    </Section>
)

export default Hero