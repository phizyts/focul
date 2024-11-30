import {
	Body,
	Container,
	Column,
	Head,
	Heading,
	Html,
	Img,
	Link,
	Preview,
	Row,
	Section,
	Text,
} from "@react-email/components";
import * as React from "react";

interface TwoFactorVerificationEmailProps {
	otp?: string;
}

export const TwoFactorVerificationEmail = ({
	otp,
}: TwoFactorVerificationEmailProps) => (
	<Html>
		<Head />
		<Preview>Your 2FA Verification Code</Preview>
		<Body style={main}>
			<Container style={container}>
				<Section style={logoContainer}>
					<Img
						src={`https://i.ibb.co/rZqZ6Q2/New-Project-2-4-1.png`}
						width="119"
						height="30"
						alt="Oxcel"
					/>
				</Section>
				<Heading style={h1}>2FA Verification Code</Heading>
				<Text style={heroText}>
					Your 2FA verification code is below - enter it in your open browser
					window and we'll help you get signed in.
				</Text>

				<Section style={codeBox}>
					<Text style={confirmationCodeText}>{otp}</Text>
				</Section>

				<Text style={text}>
					If you didn't request this email, there's nothing to worry about, you
					can safely ignore it.
				</Text>

				<Section>
					<Text style={footerText}>
						©2024 Oxcel, the Ultimate Solution to Your Student Life. <br />
						<br />
						All rights reserved.
					</Text>
				</Section>
			</Container>
		</Body>
	</Html>
);

TwoFactorVerificationEmail.PreviewProps = {
	validationCode: "DJZ-TLX",
} as TwoFactorVerificationEmailProps;

export default TwoFactorVerificationEmail;

const footerText = {
	fontSize: "12px",
	color: "#b7b7b7",
	lineHeight: "15px",
	textAlign: "left" as const,
	marginBottom: "50px",
};

const footerLink = {
	color: "#b7b7b7",
	textDecoration: "underline",
};

const footerLogos = {
	marginBottom: "32px",
	paddingLeft: "8px",
	paddingRight: "8px",
	width: "100%",
};

const socialMediaIcon = {
	display: "inline",
	marginLeft: "32px",
};

const main = {
	backgroundColor: "#ffffff",
	margin: "0 auto",
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
	margin: "0 auto",
	padding: "0px 20px",
};

const logoContainer = {
	marginTop: "32px",
};

const h1 = {
	color: "#171d24",
	fontSize: "36px",
	fontWeight: "700",
	margin: "30px 0",
	padding: "0",
	lineHeight: "42px",
};

const heroText = {
	fontSize: "20px",
	lineHeight: "28px",
	marginBottom: "30px",
};

const codeBox = {
	background: "rgb(245, 244, 245)",
	borderRadius: "4px",
	marginBottom: "30px",
	padding: "40px 10px",
};

const confirmationCodeText = {
	fontSize: "30px",
	textAlign: "center" as const,
	verticalAlign: "middle",
};

const text = {
	color: "#000",
	fontSize: "14px",
	lineHeight: "24px",
};
