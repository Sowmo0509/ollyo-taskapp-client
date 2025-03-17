import { useEffect } from "react";
import pusher from "@/services/pusher";

type PusherCallback = (data: any) => void;

export const usePusher = (channelName: string, eventName: string, callback: PusherCallback) => {
  useEffect(() => {
    const channel = pusher.subscribe(channelName);
    channel.bind(eventName, callback);

    return () => {
      channel.unbind(eventName, callback);
      pusher.unsubscribe(channelName);
    };
  }, [channelName, eventName, callback]);
};
