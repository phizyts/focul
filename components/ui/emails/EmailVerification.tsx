import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Img,
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
				<Body className="bg-gray-50 font-sans">
					<Container className="mx-auto py-8 px-4 max-w-[600px]">
						<Section className="bg-white rounded-lg shadow-sm p-8">
							<div className="mb-8">
								<Img
									src={`https://i.ibb.co/rZqZ6Q2/New-Project-2-4-1.png`}
									width="119"
									height="30"
									alt="Oxcel"
									className="mx-auto"
								/>
							</div>

							<Heading className="text-3xl font-bold text-gray-900 text-center mb-6">
								Verify your email address
							</Heading>

							<Text className="text-gray-700 text-lg mb-8 text-center">
								Thanks for signing up for Oxcel! Please verify your email address
								to complete your registration and access all features.
							</Text>

							<Button
								className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-medium text-center block w-full text-lg transition-colors"
								href={url}
							>
								Verify Email Address
							</Button>

							<Text className="text-gray-600 text-sm text-center mt-8 mb-4">
								Or copy and paste this URL into your browser:
							</Text>
							<Text className="text-blue-600 text-sm text-center break-all mb-8">
								{url}
							</Text>

							<Text className="text-gray-600 text-sm text-center mb-8">
								If you didn't create an account with Oxcel, you can safely ignore
								this email.
							</Text>

							<hr className="border-gray-200 mb-8" />

							<Text className="text-gray-500 text-xs text-center">
								©2024 Oxcel, the Ultimate Solution to Your Student Life.
								<br />
								<br />
								All rights reserved.
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default EmailVerification;
