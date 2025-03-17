import { usePusher } from "@/hooks/usePusher";

const Test = () => {
  const handlePusherEvent = (data: any) => {
    console.log("Received notification: ", data);
    alert(JSON.stringify(data));
  };

  usePusher("my-channel", "my-event", handlePusherEvent);

  return <div>GetNotification</div>;
};

export default Test;
