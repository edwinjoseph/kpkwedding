import Section from '../Section';
import BackToTopIcon from '../BackToTopIcon';

const Final = () => (
    <Section className="md:mb-20">
        <Section.Container>
            <div className="aspect-[343/409] md:aspect-[1360/666] bg-[url('/assets/final-mobile.jpg')] md:bg-[url('/assets/final.jpg')] bg-cover bg-center" role="presentation" />
            <BackToTopIcon className="mx-auto mt-20" />
        </Section.Container>
    </Section>
)

export default Final