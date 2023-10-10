import Section from '../Section';
import LocationCard from './LocationCard';

const Locations = () => (
    <Section class="relative bg-slate-700 bg-[url('/assets/map-mobile.jpg')] bg-cover bg-center py-10 before:absolute before:left-0 before:top-0 before:h-full before:w-full before:bg-gradient-to-b before:from-white before:to-45% before:content-[''] md:bg-[url('/assets/map.jpg')]">
        <Section.Container>
            <div class="relative flex flex-col items-center gap-10 md:flex-row md:justify-center md:gap-16 lg:gap-20">
                <LocationCard
                    image="/assets/asylum-chapel.jpg"
                    title="The Ceremony"
                    name="The Asylum Chapel"
                    address={["Caroline Gardens, Asylum Rd", "London SE15 2SQ" ]}
                    url="https://www.google.com/maps/dir/?api=1&destination=Asylum+Chapel,+Caroline+Gardens,+Asylum+Rd,+London+SE15+2SQ&travelmode=transit"
                />
                <LocationCard
                    image="/assets/lordship-pub.jpg"
                    title="The reception"
                    name="The Lordship Pub"
                    address={["211 Lordship Ln", "London SE22 8HA" ]}
                    url="https://www.google.com/maps/dir/?api=1&destination=The+Lordship+Pub,+211+Lordship+Ln,+London+SE22+8HA&travelmode=transit"
                />
            </div>
        </Section.Container>
    </Section>
)

export default Locations;
