export interface AgendaItemProps {
    title: string;
    subtitle: string;
}

const AgendaItem = ({ title, subtitle }: AgendaItemProps) => (
    <div class="text-center">
        <h3 class="font-heading text-[24px] font-black md:text-[32px]">
            <span class="block font-body text-[14px] font-bold uppercase tracking-[3.5px] text-pink md:text-[20px] md:tracking-[5px]">{subtitle}</span>
            {title}
        </h3>
    </div>
);

export default AgendaItem;
