import {getDescription, getLocation, getStartTime} from '@components/RSVP/AddCalendarEvent/utils';
import SubmitButton from '@components/SubmitButton';
import {ClientInvite} from '@lib/supabase/invites';

const AddCalendarEvent = (props: { invite: ClientInvite }) => {
    const handleCreateEvent = (e) => {
        const config = {
            options: ['Apple', 'Google', 'Yahoo', 'Microsoft365', 'iCal|Other'],
            buttonStyle: 'custom',
            customCss: new URL('/add-to-calender.css', window.location.origin).toString(),

            name: "Kezia and James' wedding",
            description: getDescription(props.invite),
            startDate: "2024-08-16",
            startTime: getStartTime(props.invite),
            location: getLocation(props.invite),
            endTime: "23:59",
            timezone: 'GMT',
            iCalFileName: 'kezia-james-wedding',
            status: "CONFIRMED"
        };

        atcb_action(config, e.target)
    }

    return (
        <SubmitButton text="Add to calender" onClick={handleCreateEvent} />
    )
}

export default AddCalendarEvent;
