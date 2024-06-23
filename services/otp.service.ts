import crypto from 'crypto';
import { otpTemplate } from '../constants/mail.templates';
import envConfig from '../config/env.config';
import mailService from './mail.service';

class OTPService {

    public generateOTP() {
        return crypto.randomInt(1000, 9999);
    };

    public async hashOTP(data: string) {
        return await crypto.createHmac('sha256', envConfig.HASH_SECRET as string).update(data).digest('hex');
    };

    public async sendOTP(to: string, otp: number) {
        try {
            return await mailService.sendMail({
                to: to,
                subject: "Verify your email address",
                body: otpTemplate(otp),
            });
        } catch (error) {
            throw error;
        }
    };

    public async verifyOTP(data: string, hashedOTP: string,) {
        return hashedOTP === await this.hashOTP(data);
    };

};


export default new OTPService();