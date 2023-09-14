import AgendaItem from './AgendaItem';
import Section from '../Section';

const Agenda = () => (
    <Section>
        <Section.Container>
            <Section.Title text="Order of the day" subtitle="Friday, 16 August 2024" centered />
            <div class="flex flex-col gap-[40px] md:gap-[64px]">
                <AgendaItem subtitle="Midday" title="Arrive at Asylum Chapel" />
                <AgendaItem subtitle="12.30pm" title="“We do”" />
                <AgendaItem subtitle="1pm" title="Pop the prosecco" />
                <AgendaItem subtitle="2.30pm" title="All aboard the wedding bus" />
                <AgendaItem subtitle="4.30pm" title="We feast" />
                <AgendaItem subtitle="7pm" title="Put on your dancing shoes" />
                <AgendaItem subtitle="Midnight" title="We (regrettably) leave" />
            </div>
        </Section.Container>
    </Section>
);

export default Agenda;
