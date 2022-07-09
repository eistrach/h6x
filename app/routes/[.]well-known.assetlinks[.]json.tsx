import { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  return [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "io.h6x.app",
        sha256_cert_fingerprints: [
          "72:3D:63:F0:5B:74:68:6E:67:4B:DA:7A:90:DF:5E:D1:09:1E:60:4D:B8:7A:5E:DF:3F:67:E5:EF:E1:B2:80:4E",
        ],
      },
    },
  ];
};
