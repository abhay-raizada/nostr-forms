import { useState, useEffect } from "react";
import { initialState, MEDIA_QUERY_LIST } from "./configs";
import { DEVICE_TYPE } from "../../constants/index";
import { IDeviceInfo } from "./typeDefs";

function useDeviceType() {
  let [deviceInfo, setDeviceInfo] = useState<IDeviceInfo>(initialState);

  useEffect(() => {
    const onMediaQuery = () => {
      let updatedDeviceInfo: IDeviceInfo = initialState;
      let matchedDevice = DEVICE_TYPE.DESKTOP;
      MEDIA_QUERY_LIST.forEach(({ key, mediaQuery }) => {
        if (mediaQuery.matches) {
          matchedDevice = key;
        }
        updatedDeviceInfo = {
          ...updatedDeviceInfo,
          [key]: mediaQuery.matches,
        };
      });
      updatedDeviceInfo = { ...updatedDeviceInfo, deviceType: matchedDevice };
      setDeviceInfo(updatedDeviceInfo);
    };

    onMediaQuery(); // to set state on the first run
    MEDIA_QUERY_LIST.forEach(({ mediaQuery }) =>
      mediaQuery.addEventListener("change", onMediaQuery)
    );

    return () => {
      MEDIA_QUERY_LIST.forEach(({ mediaQuery }) =>
        mediaQuery.removeEventListener("change", onMediaQuery)
      );
    };
  }, []);

  return deviceInfo;
}

export default useDeviceType;
