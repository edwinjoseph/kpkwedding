import { Ref } from 'solid-js';
import Section from '@components/Section';
import RSVPForm from '@components/RSVP/RSVPForm';
import { ClientInvite } from '@lib/supabase/invites';

const RSVP = (props: { isAuthenticated: boolean, invite: ClientInvite | null }) => {
    let ref: Ref<HTMLElement>;

    return (
        <Section ref={ref}>
            <Section.Container>
                <img src="/assets/kezia-and-james.jpg" alt="Kezia and James enjoying a drink together" class="mb-20 md:hidden" />
                <Section.Title text="RSVP" class="mb-[16px] md:mb-[16px]" centered />
                <RSVPForm rsvp={ref} isAuthenticated={props.isAuthenticated} invite={props.invite} />
            </Section.Container>
        </Section>
    );
}

export default RSVP;
