interface StatusCardProps {
    count: number;
    label: string;
}

const StatusCard = (props: StatusCardProps) => (
    <div class="bg-white text-center aspect-[2/1] flex flex-col justify-center items-center shadow rounded-md">
        <h2 class="text-2xl font-bold lg:text-4xl lg:mb-2">{props.count === 0 ? '-' : props.count}</h2>
        <p class="text-sm font-semibold lg:text-xl uppercase text-gray-600">{props.label}</p>
    </div>
);

export default StatusCard;
