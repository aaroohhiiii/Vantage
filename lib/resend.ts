import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
	throw new Error('Missing RESEND_API_KEY');
}

const resend = new Resend(apiKey);

type HelloWorldEmailParams = {
	to?: string;
	from?: string;
};

export async function sendHelloWorldEmail({
	to = 'aarohi.gattewar@gmail.com',
	from = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev',
}: HelloWorldEmailParams = {}) {
	return resend.emails.send({
		from,
		to,
		subject: 'Hello World',
		html: '<p>Congrats on sending your <strong>first email</strong>!</p>',
	});
}
