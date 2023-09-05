const AgendaItem = ({ title, subtitle }) => (
    <div className="text-center">
        <h3 className="font-heading font-black text-[24px] md:text-[32px]">
            <span className="font-body uppercase block font-bold tracking-[3.5px] text-[14px] md:tracking-[5px] md:text-[20px] text-pink">{subtitle}</span>
            {title}
        </h3>
    </div>
);

export default AgendaItem;
