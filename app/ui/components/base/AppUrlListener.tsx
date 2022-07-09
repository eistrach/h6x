import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { App, URLOpenListenerEvent } from "@capacitor/app";

const AppUrlListener: React.FC<any> = () => {
  const navigate = useNavigate();
  useEffect(() => {
    App.addListener("appUrlOpen", (event: URLOpenListenerEvent) => {
      const slug = event.url.split(".app").pop();
      if (slug) {
        navigate(slug);
      }
    });
  }, []);

  return null;
};

export default AppUrlListener;
