import { supabase } from "@/framework/supabase";
import { uploadFile } from "@/helpers/storage";

/**
 * Creates a new post in Supabase with optional files (images/videos).
 * Automatically sets the user_id from the logged-in user.
 */
export const getPublicUrl = (path) => {
  const { data } = supabase.storage.from("uploads").getPublicUrl(path);
  return data.publicUrl;
};

export const createPost = async ({ body, files = [] }) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { success: false, msg: "User not authenticated" };

    const uploadedPaths = [];

    for (const file of files) {
      const isImage = file.type === "image";
       const isVideo = file.type === "video";
      const folderName = isImage ? "postImage" : "postVideos";

      const fileResult = await uploadFile(folderName, file.uri, isImage);
      if (!fileResult.success) return { success: false, msg: fileResult.msg || "File upload failed" };

      const publicUrl = getPublicUrl(fileResult.data); // <-- important
      uploadedPaths.push({
        type: isVideo ? "video" : "image",
        path: publicUrl
      });
    }

    const payload = {
      userId: user.id,
      body,
      file: uploadedPaths.length > 0 ? uploadedPaths : null,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from("posts").insert([payload]).select().single();
    if (error) return { success: false, msg: error.message };

    return { success: true, data };
  } catch (err) {
    console.error("createPost exception:", err);
    return { success: false, msg: err.message || "Unexpected error occurred" };
  }
};

