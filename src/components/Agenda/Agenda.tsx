import AgendaItem from './AgendaItem';

const Agenda = () => (
    <section className="my-[80px] md:my-[120px]">
        <h2 className="font-heading text-center mb-[64px] text-[32px] md:mb-[80px] md:text-[64px]">
            <span className="font-body uppercase block text-[14px] mb-[16px] md:text-xl md:mb-[24px] font-bold tracking-[5px] text-pink">Friday, 16 August 2024</span>
            Order of the day
        </h2>
        <div className="flex flex-col gap-[40px] md:gap-[64px]">
            <AgendaItem subtitle="Midday" title="Arrive at Asylum Chapel" />
            <AgendaItem subtitle="12.30pm" title="“We do”" />
            <AgendaItem subtitle="1pm" title="Pop the prosecco" />
            <AgendaItem subtitle="2.30pm" title="All aboard the wedding bus" />
            <AgendaItem subtitle="4.30pm" title="We feast" />
            <AgendaItem subtitle="7pm" title="Put on your dancing shoes" />
            <AgendaItem subtitle="Midnight" title="We (regrettably) leave" />
        </div>
    </section>
);

export default Agenda;
