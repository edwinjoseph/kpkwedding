import Brevo from '@getbrevo/brevo';

class EmailClient {
    private static _client: Brevo.ApiClient;
    private static _apiKey: Brevo.APIKey;
    private static _apiInstance: Brevo.TransactionalEmailsApi;

    static initialize(apiKey: string) {
        this._client = Brevo.ApiClient.instance;
        this._apiKey = this._client.authentications['api-key'];
        this._apiKey.apiKey = apiKey;
        this._apiInstance = new Brevo.TransactionalEmailsApi();
    }

    static async sendIndividualEmail(
        contact: { email: string; userId: string; firstName: string; lastName: string },
        template: EmailTemplate,
        options?: {
            params?: Record<string, unknown>;
            attachment?: Array<{ url: string; name: string } | { content: string; name: string }>;
        }
    ) {
        try {
            const foundContact = await fetch(`https://api.brevo.com/v3/contacts/${contact.email}`, {
                headers: {
                    'api-key': this._apiKey.apiKey
                }
            }).then(res => res.json());

            if (foundContact.code && foundContact.code === 'document_not_found') {
                await fetch(`https://api.brevo.com/v3/contacts`, {
                    method: 'POST',
                    headers: {
                        accept: 'application/json',
                        'content-type': 'application/json',
                        'api-key': this._apiKey.apiKey
                    },
                    body: JSON.stringify({
                        email: contact.email,
                        ext_id: contact.userId,
                        attributes: {
                            FIRSTNAME: contact.firstName,
                            LASTNAME: contact.lastName
                        },
                        listIds: [8],
                        emailBlacklisted: false,
                        smsBlacklisted: true,
                        updateEnabled: false,
                        smtpBlacklistSender: []
                    })
                }).then(res => res.json());
            }

            return this.api.sendTransacEmail({
                templateId: template,
                to: [{
                    email: contact.email,
                    name: `${contact.firstName} ${contact.lastName}`
                }],
                params: options?.params,
            });
        } catch (err) {
            console.log(err)
        }
    }

    private static get api() {
        if (!this._apiInstance) {
            throw new Error('Email Client has not been initialized.');
        }

        return this._apiInstance
    }
}

export enum EmailTemplate {
    RSVP_IS_COMING = 1,
    RSVP_IS_NOT_COMING = 3,
}

export default EmailClient;
