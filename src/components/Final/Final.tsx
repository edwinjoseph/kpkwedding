import Section from '../Section';
import BackToTopIcon from '../BackToTopIcon';

const Final = () => {
    const handleBackToTopClick = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
    }

    return (
        <Section class="mb-20 md:mb-20">
            <Section.Container>
                <picture>
                    <source media="(max-width: 767px)" srcset="/assets/final-mobile.jpg" />
                    <source media="(min-width: 768px)" srcset="/assets/final.jpg" />
                    <img src="/assets/final.png" alt="Kezia and James" loading="lazy" />
                </picture>
                <BackToTopIcon class="mx-auto mt-20 cursor-pointer" onClick={handleBackToTopClick} />
            </Section.Container>
        </Section>
    )
}

export default Final