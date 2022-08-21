import { FC, useEffect, useState } from 'react';
import { getDates, getStatus } from '../../models/helperFunctions/converTime';
import {
  StyledBookStatus,
  StyledBookStatusWrapper,
} from '../../globalUI/Status';
import { useLocation } from 'react-router-dom';
import { RoutesTypes } from '../../../utils/routes';
import { StatusTypes } from '@mimir/global-types';
import { t } from 'i18next';

interface IBookStatusProps {
  status: string | undefined;
  date: any;
}

const BookStatus: FC<IBookStatusProps> = ({ status, date }) => {
  const [statusText, setStatusText] = useState<string>('');
  const currentStatus = getStatus(status, date);
  const { pathname } = useLocation();

  useEffect(() => {
    switch (currentStatus) {
      case StatusTypes.FREE:
        if (
          pathname === RoutesTypes.HISTORY_OF_CLAIM ||
          pathname === RoutesTypes.HISTORY_OF_DONATE
        )
          setStatusText(t(`Statuses.${currentStatus + pathname}`));
        break;
      case StatusTypes.BUSY: {
        const day = `${getDates(date).returnDate.getDate()}`.padStart(2, '0');
        const month = `${getDates(date).returnDate.getMonth() + 1}`.padStart(
          2,
          '0'
        );
        setStatusText(t(`Statuses.${currentStatus}`) + `${day}.${month}`);
        break;
      }
      case StatusTypes.PROLONG: {
        const day = `${getDates(date).returnDate.getDate()}`.padStart(2, '0');
        const month = `${getDates(date).returnDate.getMonth() + 1}`.padStart(
          2,
          '0'
        );
        setStatusText(t(`Statuses.${currentStatus}`) + `${day}.${month}`);
        break;
      }
      default:
        setStatusText(t(`Statuses.${currentStatus}`));
        break;
    }
  }, [currentStatus]);
  return (
    <StyledBookStatusWrapper status={currentStatus}>
      <StyledBookStatus status={currentStatus}>{statusText}</StyledBookStatus>
    </StyledBookStatusWrapper>
  );
};

export default BookStatus;
