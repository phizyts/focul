const NotFoundComponent = () => {
	return (
		<div className="flex h-full w-full items-center justify-center">
			<div className="text-center">
				<h1 className="text-4xl font-semibold">404</h1>
				<p className="mt-2 text-muted-foreground">Page not found</p>
				<a
					href="/dashboard"
					className="mt-4 inline-block text-sm text-primary hover:underline"
				>
					Return to dashboard
				</a>
			</div>
		</div>
	);
};

export default NotFoundComponent;
