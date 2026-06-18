export default interface TNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  tag: string;
  icon: React.ReactNode;
  date: string;
  isNew: boolean;
}
