import Section from '@components/Section';
import RSVPForm from '@components/RSVP/RSVPForm';
import { ClientInvite } from '@lib/supabase/invites';

const RSVP = (props: { isAuthenticated: boolean, invite: ClientInvite | null }) => {
    return (
        <Section>
            <Section.Container>
                <Section.Title text="RSVP" class="mb-[16px] md:mb-[16px]" centered />
                <RSVPForm isAuthenticated={props.isAuthenticated} invite={props.invite} />
            </Section.Container>
        </Section>
    );
}

export default RSVP;
