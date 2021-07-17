export const LIGHT_MODE = "light_mode";
export const DARK_MODE = "dark_mode";
export const UPLOAD_PIC = "profile_mode";
export const DELETE_PIC = "delete_photo";

const initialState = {
  isDark: false,
  profilePicture: null,
};

export function lightModeAction() {
  return { type: LIGHT_MODE };
}
