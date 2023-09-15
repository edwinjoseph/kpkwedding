import Section from '../Section';
import LocationCard from './LocationCard';

const Locations = () => (
    <Section class="relative bg-slate-700 bg-[url('/assets/map-mobile.jpg')] md:bg-[url('/assets/map.jpg')] bg-cover bg-center py-10 before:content-[''] before:w-full before:h-full before:absolute before:top-0 before:left-0 before:bg-gradient-to-b before:from-white before:to-45%">
        <Section.Container>
            <div class="relative flex items-center gap-10 flex-col md:flex-row md:gap-15 md:justify-center lg:gap-20">
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
