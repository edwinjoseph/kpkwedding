export interface AgendaItemProps {
    title: string;
    subtitle: string;
}

const AgendaItem = ({ title, subtitle }: AgendaItemProps) => (
    <div class="text-center">
        <h3 class="font-heading font-black text-[24px] md:text-[32px]">
            <span class="font-body uppercase block font-bold tracking-[3.5px] text-[14px] md:tracking-[5px] md:text-[20px] text-pink">{subtitle}</span>
            {title}
        </h3>
    </div>
);

export default AgendaItem;
