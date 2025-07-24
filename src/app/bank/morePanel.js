import BackupSection from "./backupSection";
import NotificationSection from "./notificationSection";
import { Divider } from '@mui/material';

export default function MorePanel({ onRefresh, onClose, localDB }) {

  return (
    <>
      <BackupSection onRefresh={onRefresh} onClose={onClose} localDB={localDB} />

      <NotificationSection onClose={onClose} />

      <Divider variant="middle">
        <span className="text-xs">Template</span>
      </Divider>
      <div className="flex items-center px-[16px] py-2">
        TODOricky
      </div>
    </>
  );
}