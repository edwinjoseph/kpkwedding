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
        to: { email: string; name: string },
        template: EmailTemplate,
        options?: {
            params?: Record<string, unknown>;
            attachment?: Array<{ url: string; name: string } | { content: string; name: string }>;
        }
    ) {
        try {
            return this.api.sendTransacEmail({
                templateId: template,
                to: [to],
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
