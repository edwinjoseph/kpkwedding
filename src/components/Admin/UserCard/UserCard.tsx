import { Show } from 'solid-js';
import { ClientUser } from '@lib/supabase/invites';
import Coming from './Coming.svg';
import NotComing from './NotComing.svg';

const UserCard = (props: ClientUser) => (
    <div class="flex items-center justify-between gap-4 rounded-md bg-white p-[16px] shadow md:gap-10 md:px-[24px]">
        <div class="flex w-full flex-col justify-between gap-4 md:flex-row md:gap-10">
            <div class="flex flex-col gap-1">
                <h3 class="text-lg font-semibold">{props.firstName} {props.lastName}</h3>
                <Show when={props.email}>
                    <p class="font-medium text-[#555] underline">{props.email}</p>
                </Show>
                <Show when={props.other}>
                    <p class="font-medium text-[#F11A41]">Other Requirements: "{props.other}"</p>
                </Show>
            </div>
            <Show when={props.isComing}>
                <div class="flex items-center gap-4">
                    <Show when={props.isVegetarian}>
                        <p class="cursor-default text-sm font-bold text-[#555] md:text-base" title="Vegetarian">VG</p>
                    </Show>
                    <Show when={props.isVegan}>
                        <p class="cursor-default text-sm font-bold text-[#555] md:text-base" title="Vegan">VE</p>
                    </Show>
                    <Show when={props.noGluten}>
                        <p class="cursor-default text-sm font-bold text-[#555] md:text-base" title="Gluten free">GF</p>
                    </Show>
                    <Show when={props.noDairy}>
                        <p class="cursor-default text-sm font-bold text-[#555] md:text-base" title="Dairy free">DF</p>
                    </Show>
                    <Show when={props.noNuts}>
                        <p class="cursor-default text-sm font-bold text-[#555] md:text-base" title="No nuts">NN</p>
                    </Show>
                </div>
            </Show>
        </div>
        <Show when={props.isComing}>
            <div>
                <Coming />
            </div>
        </Show>
        <Show when={props.isComing === false}>
            <div>
                <NotComing />
            </div>
        </Show>
    </div>
)

export default UserCard;