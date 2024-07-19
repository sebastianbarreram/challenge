import serviceConfiguration from '../../../config/service-configuration';

export const EMAIL_SUBJECT = 'Mercado Libre | Challenge Notification';
export const GMAIL_USERNAME = serviceConfiguration().gmail.username;
export const GMAIL_PASSWORD = serviceConfiguration().gmail.password;
