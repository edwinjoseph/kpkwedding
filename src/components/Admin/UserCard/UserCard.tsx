import { Show } from 'solid-js';
import { ClientUser } from '@lib/supabase/invites';
import Coming from './Coming.svg';
import NotComing from './NotComing.svg';

const UserCard = (props: ClientUser) => (
    <div class="flex justify-between items-center py-[16px] px-[16px] bg-white shadow rounded-md gap-4 md:px-[24px] md:gap-10">
        <div class="flex flex-col w-full justify-between gap-4 md:flex-row md:gap-10">
            <div class="flex flex-col gap-1">
                <h3 class="font-semibold text-lg">{props.firstName} {props.lastName}</h3>
                <Show when={props.email}>
                    <p class="text-[#555] underline font-medium">{props.email}</p>
                </Show>
                <Show when={props.other}>
                    <p class="text-[#F11A41] font-medium">Other Requirements: "{props.other}"</p>
                </Show>
            </div>
            <Show when={props.isComing}>
                <div class="flex items-center gap-4">
                    <Show when={props.isVegetarian}>
                        <p class="text-sm md:text-base font-bold text-[#555] cursor-default" title="Vegetarian">VG</p>
                    </Show>
                    <Show when={props.isVegan}>
                        <p class="text-sm md:text-base font-bold text-[#555] cursor-default" title="Vegan">VE</p>
                    </Show>
                    <Show when={props.noGluten}>
                        <p class="text-sm md:text-base font-bold text-[#555] cursor-default" title="Gluten free">GF</p>
                    </Show>
                    <Show when={props.noDairy}>
                        <p class="text-sm md:text-base font-bold text-[#555] cursor-default" title="Dairy free">DF</p>
                    </Show>
                    <Show when={props.noNuts}>
                        <p class="text-sm md:text-base font-bold text-[#555] cursor-default" title="No nuts">NN</p>
                    </Show>
                </div>
            </Show>
        </div>
        <Show when={props.isComing}>
            <div>
                <Coming />
            </div>
        </Show>
        <Show when={!props.isComing}>
            <div>
                <NotComing />
            </div>
        </Show>
    </div>
)

export default UserCard;