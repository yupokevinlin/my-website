export namespace NavigationUtils {
  export const goToWebsite = (website: string): void => {
    const newWindow: Window | null = window.open(website, "_blank", "noopener,noreferrer");
    if (newWindow) {
      newWindow.opener = null;
    }
  };

  export const sendEmail = (email: string): void => {
    const newWindow: Window | null = window.open(`mailto:${email}`, "_blank", "noopener,noreferrer");
    if (newWindow) {
      newWindow.opener = null;
    }
  };

  export const download = (downloadLink: string): void => {
    const newWindow: Window | null = window.open(downloadLink, "_blank", "noopener,noreferrer");
    if (newWindow) {
      newWindow.opener = null;
    }
  };
}

export default NavigationUtils;
