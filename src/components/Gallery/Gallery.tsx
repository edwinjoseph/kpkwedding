import Section from '../Section';

const Gallery = () => (
    <Section>
        <Section.Container>
            <picture>
                <source media="(max-width: 767px)" srcset="/assets/gallery-mobile.png" />
                <source media="(min-width: 768px)" srcset="/assets/gallery-1x.png 1360w 1x" />
                <source media="(min-width: 768px)" srcset="/assets/gallery-2x.png 1360w 2x" />
                <img src="/assets/gallery-2x.png" alt="Moments in Kezia and James' relationship" loading="lazy" />
            </picture>
        </Section.Container>
    </Section>
);

export default Gallery;