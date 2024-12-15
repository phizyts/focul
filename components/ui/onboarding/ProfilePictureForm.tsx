import SecondaryButton from "@/components/SecondaryButton";
import Image from "next/image";

const ProfilePictureForm = ({
	data,
	updateData,
}: {
	data: any;
	updateData: any;
}) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target?.files?.[0];
		if (file) {
			updateData(file);
			const objectUrl = URL.createObjectURL(file);
			updateData({ url: objectUrl });
		}
	};
	return (
		<div className="mt-5">
			<h1 className="text-2xl font-medium">Set your profile picture</h1>
			<p className="text-muted">Upload your profile picture to continue</p>
			<div className="flex justify-between items-center mt-7">
				<Image
					src={data.url}
					alt="Profile Picture"
					width={120}
					height={120}
					className="rounded-full object-cover w-[120px] h-[120px]"
				/>
				<div>
					<span className="text-muted">PNG, JPG under 15MB</span>
					<label className="h-[35px] flex gap-2 py-2 px-4 rounded-[8px] w-fit duration-200 text-primary border hover:bg-[#F5F5F5] border-border text-sm mt-2">
						<input type="file" className="hidden" onChange={handleChange} />
						<i className="ri-upload-2-fill"></i>
						Upload
					</label>
				</div>
			</div>
		</div>
	);
};
export default ProfilePictureForm;
