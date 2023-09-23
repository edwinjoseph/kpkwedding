import { Show } from 'solid-js';

interface UserCardProps {
    firstName: string;
    lastName: string;
    response?: null | {
        isVegan?: boolean;
        isVegetarian?: boolean;
        noNuts?: boolean;
        noDairy?: boolean;
        noGluten?: boolean;
        other?: null | string;
    }
}

const UserCard = (props: UserCardProps) => (
    <div class="flex justify-between items-center py-[18px] px-[16px] bg-white my-[20px] first:mt-0 last:mb-0 shadow rounded-md">
        <h3 class="font-semibold">{props.firstName} {props.lastName}</h3>
        <div class="flex gap-3">
            <Show when={props.response?.isVegan}>
                <img src="/assets/vegan.gif" alt="Vegan" title="Vegan" width="35px"/>
            </Show>
            <Show when={props.response?.isVegetarian}>
                <img src="/assets/vegetarian.gif" alt="Vegetarian" title="Vegetarian" width="35px" />
            </Show>
            <Show when={props.response?.noNuts}>
                <img src="/assets/no-nuts.gif" alt="No nuts" title="No nuts" width="35px" />
            </Show>
            <Show when={props.response?.noDairy}>
                <img src="/assets/no-dairy.gif" alt="No dairy" title="No dairy" width="35px" />
            </Show>
            <Show when={props.response?.noGluten}>
                <img src="/assets/no-gluten.gif" alt="No gluten" title="No gluten" width="35px" />
            </Show>
        </div>
    </div>
)

export default UserCard;