export namespace NavigationUtils {
  export const goToWebsite = (website: string): void => {
    const newWindow: Window = window.open(website, "_blank", "noopener,noreferrer")
    if (newWindow) {
      newWindow.opener = null;
    }
  };

  export const sendEmail = (email: string): void => {
    const newWindow: Window = window.open(`mailto:${email}`, "_blank", "noopener,noreferrer")
    if (newWindow) {
      newWindow.opener = null;
    }
  };
}

export default NavigationUtils;
