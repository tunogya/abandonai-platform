export interface IWebAppUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name: string;
  username: string;
  language_code: string;
  is_premium: boolean;
  added_to_attachment_menu: boolean;
  allows_write_to_pm: boolean;
  photo_url: string;
}

export interface IWebAppChat {
  id: number;
  type: string;
  title: string;
  username: string;
  photo_url: string;
}

// https://core.telegram.org/bots/webapps#initializing-mini-apps
export interface IWebApp {
  initData: string;
  initDataUnsafe: {
    query_id: string;
    user: IWebAppUser;
    receiver: IWebAppUser;
    chat: IWebAppChat;
    chat_type: string;
    chat_instance: string;
    can_send_after: number;
    auth_date: number;
    hash: string;
    signature: string;
    start_param: string;
  };
  version: string;
  platform: string;
  colorScheme: string;
  themeParams: {
    link_color: string;
    button_color: string;
    button_text_color: string;
    secondary_bg_color: string;
    hint_color: string;
    bg_color: string;
    text_color: string;
  };
  isActive: boolean;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  isClosingConfirmationEnabled: boolean;
  headerColor: string;
  backgroundColor: string;
  bottomBarColor: string;
  isVerticalSwipesEnabled: boolean;
  isFullscreen: boolean;
  isOrientationLocked: boolean;
  safeAreaInset: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  contentSafeAreaInset: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  BackButton: {
    isVisible: boolean;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isProgressVisible: boolean;
    isActive: boolean;
  };
  HapticFeedback: any;
  Accelerometer: any;
  DeviceOrientation: any;
  Gyroscope: any;
  LocationManager: any;
  isVersionAtLeast: (version: string) => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setBottomBarColor: (color: string) => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  enableVerticalSwipes: () => void;
  disableVerticalSwipes: () => void;
  requestFullscreen: () => void;
  exitFullscreen: () => void;
  lockOrientation: () => void;
  unlockOrientation: () => void;
  addToHomeScreen: () => void;
  sendData: (data: string) => void;
  ready: () => void;
  expand: () => void;
  close: () => void;
  showConfirm: (message: string, callback: any) => void;
}
