import { isOverdue } from './converTime';
import { IStatus } from '../../types';

type ResponseGetCurrentStatus = {
  type: string;
  body: string;
};

export function getCurrentStatus(
  currentStatus: IStatus | null | undefined
): string | ResponseGetCurrentStatus {
  switch (currentStatus?.status) {
    case 'Free':
      return 'on the shelf';
    case 'Busy' || 'Prolong': {
      if (isOverdue(currentStatus.created_at)) {
        return {
          type: 'Overdue',
          body: currentStatus?.person?.username as string,
        };
      }
      return {
        type: 'Busy',
        body: currentStatus?.person?.username as string,
      };
    }
    case 'Pending':
      return 'Pending approval';
    default:
      return '-';
  }
}
