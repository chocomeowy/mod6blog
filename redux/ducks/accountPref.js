export const CHANGE_MODE = "change_mode";
export const UPLOAD_PIC = "profile_mode";
export const DELETE_PIC = "delete_photo";
import { Appearance } from "react-native";

const initialMode = Appearance.getColorScheme();

const initialState = {
  isDark: initialMode,
  profilePicture: null,
};

export function changeModeAction() {
  return { type: CHANGE_MODE };
}

export function uploadPicAction() {
  return { type: UPLOAD_PIC };
}

export function deletePicAction() {
  return { type: DELETE_PIC };
}

export default function accountPrefReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_MODE:
      return { ...state, isDark: !state.isDark };
    case UPLOAD_PIC:
      return { ...state, profilePicture: action.payload };
    case DELETE_PIC:
      return { ...state, profilePicture: null };
    default:
      return state;
  }
}
