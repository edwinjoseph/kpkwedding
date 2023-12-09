import AgendaItem from './AgendaItem';
import Section from '../Section';

const Agenda = () => (
    <Section>
        <Section.Container>
            <Section.Title text="Order of the Day" subtitle="Friday, 16 August 2024" centered />
            <div class="flex flex-col gap-[40px] md:gap-[64px]">
                <AgendaItem subtitle="Midday" title="Arrive at Asylum Chapel" />
                <AgendaItem subtitle="12:30pm" title="“We do”" />
                <AgendaItem subtitle="1pm" title="Pop the prosecco" />
                <AgendaItem subtitle="2:30pm" title="All aboard the wedding bus" />
                <AgendaItem subtitle="3pm" title="Cocktails &amp; canapes at The Lordship Pub" />
                <AgendaItem subtitle="4:30pm" title="We feast" />
                <AgendaItem subtitle="6:30pm" title="Evening celebrations" />
                <AgendaItem subtitle="Midnight" title="We (regrettably) leave" />
            </div>
        </Section.Container>
    </Section>
);

export default Agenda;
