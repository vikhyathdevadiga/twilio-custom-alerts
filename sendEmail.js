import sgMail from '@sendgrid/mail';
import 'dotenv/config'

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendEmailAlert(subject, body){
    const msg = {
        templateId: process.env.SENDGRID_TEMPLATE_ID,
        to: process.env.TO_EMAIL,
        from: process.env.FROM_EMAIL,
        subject: subject.toString(),
        dynamicTemplateData: {
            "subject": subject,
            "body": body      
        }
    };
    sgMail
    .send(msg)
    .then(() => {}, error => {
        console.error(error);
        if (error.response) {
        console.error(error.response.body)
        }
    });
}
export { sendEmailAlert }