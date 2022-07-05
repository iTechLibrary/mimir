import { FC } from 'react';
import InstructionsClaim from '../components/InstructionsClaim';
import { TitleArticle } from '../globalUI/TextArticle';
import { TextBase } from '../globalUI/TextBase';
import styled from '@emotion/styled';
import ListItems from '../components/ListBooks';
import EmptyListItems from '../components/EmptyListItems';
import { dimensions } from '@mimir/ui-kit';
import { useGetAllTakenItemsQuery } from '@mimir/apollo-client';
import { useAppSelector } from '../hooks/useTypedSelector';
import { RolesTypes } from '../../utils/rolesTypes';
import ManagerInfoCard from '../components/ManagerInfoCard';
import { ManagerCardTypes } from '../components/ManagerInfoCard/managerCardTypes';
import Button from '../components/Button';
import { t } from 'i18next';

const WrapperHome = styled.div`
  @media (max-width: ${dimensions.tablet_width}) {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  position: absolute;
  width: 234px;
  height: 52px;
  right: 46px;
  top: 40px;
`;

const Wrapper = styled.div`
  margin-top: 3rem;
  margin-bottom: ${dimensions.xl_2};
`;

const CardsWrapper = styled.div`
  padding-top: 58px;
  display: flex;
  flex-direction: column;
  row-gap: 30px;
`;

const NotificationsWrapper = styled.div`
  height: 587px;
`;

const OverdueDonatesWrapper = styled.div`
  display: flex;
  height: 467px;
  flex-direction: row;
  column-gap: 18px;
`;

const HomePage: FC = () => {
  const { id, userRole } = useAppSelector((state) => state.user);
  const { data, loading } = useGetAllTakenItemsQuery({
    variables: { person_id: id },
  });
  const Pic = '../../../assets/avatar.jpg';
  const managerData = [
    {
      title: 'Alica in Wonderland',
      img: Pic,
      person_id: '1',
      created_at: '2022-06-01 10:45:09.999641',
      description:
        '1lala lalal alallala lalal lla lal lala la   lla lal lala la   lla lal lala la   lla lal lala la   lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la lalla la la lla la la lalallal a',
    },
    {
      title: 'Alica in Wonderland',
      img: Pic,
      person_id: '1',
      created_at: '2022-08-04 10:45:09.999641',
      description:
        '3lala lalal alallala lalal lla lal lala la   lla lal lala la   lla lal lala la   lla lal lala la   lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la lalla la la lla la la lalallal a',
    },
    {
      title: 'Alica in Wonderland',
      img: Pic,
      person_id: '1',
      created_at: '2022-08-01 10:45:09.999641',
      description:
        '2lala lalal alallala lalal lla lal lala la   lla lal lala la   lla lal lala la   lla lal lala la   lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la lalla la la lla la la lalallal a',
    },
    {
      title: 'Alica in Wonderland',
      img: Pic,
      person_id: '1',
      created_at: '2022-08-01 10:45:09.999641',
      description:
        '2lala lalal alallala lalal lla lal lala la   lla lal lala la   lla lal lala la   lla lal lala la   lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la  lla lal lala la lalla la la lla la la lalallal a',
    },
  ].sort((a, b) =>
    a.created_at > b.created_at ? 1 : b.created_at > a.created_at ? -1 : 0
  );

  if (loading) return <h1>Loading...</h1>;

  return (
    <WrapperHome>
      {userRole === RolesTypes.READER ? (
        <>
          <InstructionsClaim />
          {data?.getAllTakenItems.length ? (
            <>
              <Wrapper>
                <TitleArticle>Don't forget to pass</TitleArticle>
                <TextBase>List of items you have taken and due dates</TextBase>
              </Wrapper>
              <ListItems items={data?.getAllTakenItems} />
            </>
          ) : (
            <EmptyListItems />
          )}
        </>
      ) : (
        <>
          <ButtonWrapper>
            <Button value={t(`Open library statistics`)} />
          </ButtonWrapper>
          <CardsWrapper>
            <OverdueDonatesWrapper>
              <ManagerInfoCard
                type={ManagerCardTypes.OVERDUE}
                fields={managerData}
              />
              <ManagerInfoCard
                type={ManagerCardTypes.DONATES}
                fields={managerData}
              />
            </OverdueDonatesWrapper>
            <NotificationsWrapper>
              <ManagerInfoCard
                type={ManagerCardTypes.NOTIFICATIONS}
                fields={managerData}
              />
            </NotificationsWrapper>
          </CardsWrapper>
        </>
      )}
    </WrapperHome>
  );
};

export default HomePage;
