const serverUrl = process.env.BETTER_AUTH_URL;

export const uploadImage = async (file: File | string) => {
	try {
		if (typeof file === 'string') {
			if (!file || file === '/uploadpfp.png') {
				return '/uploadpfp.png';
			}
			return file;
		}

		const formData = new FormData();
		formData.append('file', file);

		const response = await fetch(`${serverUrl}/api/upload`, {
			method: 'POST',
			body: formData,
		});

		if (!response.ok) {
			console.error(`Upload failed with status: ${response.status}`);
			return null;
		}

		const data = await response.json();
		return data.secure_url;
	} catch (err) {
		console.error('Error uploading image:', err);
		return null;
	}
};
