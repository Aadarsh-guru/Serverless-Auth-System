import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import envConfig from '../config/env.config';

const sesClient = new SESClient({
    region: envConfig.AWS_REGION,
    credentials: {
        accessKeyId: envConfig.AWS_ACCESS_KEY,
        secretAccessKey: envConfig.AWS_SECRET_ACCESS_KEY,
    },
});

interface ISendMail {
    to: string,
    subject: string,
    body: string;
};

class MailService {

    public async sendMail({ to, subject, body }: ISendMail) {
        try {
            const params = {
                Destination: {
                    ToAddresses: [to],
                },
                Message: {
                    Body: {
                        Html: {
                            Charset: "UTF-8",
                            Data: body,
                        },
                    },
                    Subject: {
                        Charset: 'UTF-8',
                        Data: subject,
                    },
                },
                Source: envConfig.ADMIN_EMAIL_ID,
            };
            return await sesClient.send(new SendEmailCommand(params));
        } catch (error) {
            throw error;
        };
    };

};

export default new MailService();