declare module '@getbrevo/brevo' {
    export class ApiClient {
        static instance: ApiClient;
        authentications: { 'api-key': APIKey };
    }

    export class APIKey {
        apiKey: string;
    }

    export class TransactionalEmailsApi {
        sendTransacEmail<Params extends Record<string, unknown> = Record<string, unknown>>(email: {
            sender?: EmailInfo;
            templateId?: number;
            to: Array<EmailInfo>;
            params?: Params;
            attachment?: Array<Attachment>;
        }): Promise<any>;
    }

    export type EmailInfo = { name: string; email: string };


    export type Attachment =
        | { url: string; name: string }
        | { content: string; name: string };
}