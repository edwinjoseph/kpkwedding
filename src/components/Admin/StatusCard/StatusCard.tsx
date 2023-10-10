interface StatusCardProps {
    count: number;
    label: string;
}

const StatusCard = (props: StatusCardProps) => (
    <div class="flex aspect-[2/1] flex-col items-center justify-center rounded-md bg-white text-center shadow">
        <h2 class="text-2xl font-bold lg:mb-2 lg:text-4xl">{props.count === 0 ? '-' : props.count}</h2>
        <p class="text-sm font-semibold uppercase text-gray-600 lg:text-xl">{props.label}</p>
    </div>
);

export default StatusCard;
