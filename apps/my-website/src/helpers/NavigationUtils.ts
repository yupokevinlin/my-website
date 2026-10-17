// Links belong in <Link href> or <Button href> (components/), which render a
// real <a> that search engines follow. This is only for the drawer's Resume item.
export namespace NavigationUtils {
  export const download = (downloadLink: string): void => {
    const newWindow: Window | null = window.open(downloadLink, "_blank", "noopener,noreferrer");
    if (newWindow) {
      newWindow.opener = null;
    }
  };
}

export default NavigationUtils;
