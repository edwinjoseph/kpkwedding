import Section from '../Section';
import BackToTopIcon from '../BackToTopIcon';

const Final = () => (
    <Section class="md:mb-20">
        <Section.Container>
            <picture>
                <source media="(max-width: 767px)" srcset="/assets/final-mobile.jpg" />
                <source media="(min-width: 768px)" srcset="/assets/final.jpg" />
                <img src="/assets/final.png" alt="Kezia and James" loading="lazy" />
            </picture>
            <BackToTopIcon class="mx-auto mt-20" />
        </Section.Container>
    </Section>
)

export default Final