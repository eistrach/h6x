import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.h6x.app",
  appName: "h6x",
  webDir: "public/build",
  bundledWebRuntime: false,
  server: {
    url: "http://localhost:3000",
    cleartext: true,
    allowNavigation: ["*"],
  },
};
//qGZLN6aaA&iV4#
export default config;
