export const uploadToCloudinary = async (file: File, folder: string) => {
  if (!file) return;

  const UPLOAD_PRESET = "fetanfews";
  const CLOUD_NAME = "duvvy4im7";
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folder);
  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Upload failed");

    return data.secure_url;
  } catch (error) {
    console.log("Upload Failed", error);
  }
};
