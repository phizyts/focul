import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Section,
	Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface EmailVerificationProps {
	url: string;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ url }) => {
	return (
		<Html>
			<Head />
			<Preview>Verify your email address for Oxcel</Preview>
			<Tailwind>
				<Body className="bg-white font-sans">
					<Container className="mx-auto py-8 px-4">
						<Heading className="text-2xl font-bold text-gray-900 text-center mb-6">
							Verify your email address
						</Heading>
						<Section>
							<Text className="text-gray-700 mb-6">
								Thanks for signing up for Oxcel! Please verify your email address by clicking
								the button below.
							</Text>
							<Button
								className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium text-center inline-block text-base transition-colors"
								href={url}
							>
								Verify Email Address
							</Button>
							<Text className="text-gray-600 text-sm mt-6">
								If you didn't create an account with Oxcel, you can safely ignore this
								email.
							</Text>
							<Text className="text-gray-600 text-sm mt-4">
								Or copy and paste this URL into your browser:{" "}
								<Link href={url} className="text-blue-600 break-all">
									{url}
								</Link>
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default EmailVerification;
