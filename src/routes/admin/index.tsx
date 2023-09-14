import Section from '@components/Section';
import { For, Show } from 'solid-js';
import SubmitButton from '@components/SubmitButton';
import { invites } from '../../stub/invites';

interface StatusCardProps {
    count: number;
    label: string;
}

const StatusCard = (props: StatusCardProps) => (
    <div class="bg-white text-center aspect-[2/1] flex flex-col justify-center items-center shadow rounded-md">
        <h2 class="text-2xl font-bold lg:text-4xl lg:mb-2">{props.count}</h2>
        <p class="text-sm font-semibold lg:text-xl uppercase text-gray-600">{props.label}</p>
    </div>
);

interface InviteCardProps {
    firstName: string;
    lastName: string;
    dietaryOptions: null | {
        isVegan: boolean;
        isVegetarian: boolean;
        noNuts: boolean;
        noDairy: boolean;
        noGluten: boolean;
        other: null | string;
    }
}

const InviteCard = (props: InviteCardProps) => (
    <div class="flex justify-between items-center py-[18px] px-[16px] bg-white my-[20px] first:mt-0 last:mb-0 shadow rounded-md">
        <h3 class="font-semibold">{props.firstName} {props.lastName}</h3>
        <div class="flex gap-3">
            <Show when={props.dietaryOptions?.isVegan}>
                <img src="/assets/vegan.gif" alt="Vegan" title="Vegan" width="35px"/>
            </Show>
            <Show when={props.dietaryOptions?.isVegetarian}>
                <img src="/assets/vegetarian.gif" alt="Vegetarian" title="Vegetarian" width="35px" />
            </Show>
            <Show when={props.dietaryOptions?.noNuts}>
                <img src="/assets/no-nuts.gif" alt="No nuts" title="No nuts" width="35px" />
            </Show>
            <Show when={props.dietaryOptions?.noDairy}>
                <img src="/assets/no-dairy.gif" alt="No dairy" title="No dairy" width="35px" />
            </Show>
            <Show when={props.dietaryOptions?.noGluten}>
                <img src="/assets/no-gluten.gif" alt="No gluten" title="No gluten" width="35px" />
            </Show>
        </div>
    </div>
)

const Admin = () => {
    const unconfirmed = invites.filter(invite => !invite.responded);
    const attending = invites.filter(invite => invite.responded && invite.canMakeIt);
    const declined = invites.filter(invite => invite.responded && !invite.canMakeIt);
    return (
        <main class="min-h-screen bg-gray-100 overflow-hidden">
            <Section class="my-6 md:my-8">
                <Section.Container>
                    <div class="flex justify-between items-center mt-[24px] mb-[24px]">
                        <Section.Title heading="h1" text="Dashboard" class="mb-0 md:mb-0" />
                        <SubmitButton text="Add an invite" class="text-[14px]" />
                    </div>
                    <div class="grid gap-4 grid-cols-2 md:grid-cols-4">
                        <StatusCard count={invites.length} label="Invited" />
                        <StatusCard count={unconfirmed.length} label="Unconfirmed" />
                        <StatusCard count={attending.length} label="Attending" />
                        <StatusCard count={declined.length} label="Declined" />
                    </div>
                </Section.Container>
            </Section>
            <Section class="my-6 md:my-8">
                <Section.Container>
                    <div class="pb-[16px] mb-[16px]">
                        <h2 class="font-bold md:text-2xl">Unconfirmed</h2>
                        <For each={unconfirmed}>
                            {(invite) => (
                                <InviteCard {...invite} />
                            )}
                        </For>
                    </div>
                    <div class="pb-[16px] mb-[16px]">
                        <div>
                            <h2 class="font-bold md:text-2xl">Attending</h2>
                            <div></div>
                        </div>
                        <For each={attending}>
                            {(invite) => (
                                <InviteCard {...invite} />
                            )}
                        </For>
                    </div>
                    <div class="pb-[16px] mb-[16px]">
                        <h2 class="font-bold md:text-2xl">Declined</h2>
                        <For each={declined}>
                            {(invite) => (
                                <InviteCard {...invite} />
                            )}
                        </For>
                    </div>
                </Section.Container>
            </Section>
        </main>
    );
}

export default Admin;
