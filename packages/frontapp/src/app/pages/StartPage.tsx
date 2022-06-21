import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { useAppDispatch } from '../hooks/useTypedDispatch';
import { setUser, TUserLocation } from '../store/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { colors, dimensions, fonts } from '@mimir/ui-kit';
import Input from '../components/Input';
import Dropdown from '../components/Dropdown';
import { useGetAllLocationsQuery } from '@mimir/apollo-client';

const StartPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10.5rem;

  @media (max-width: ${dimensions.phone_width}) {
    margin-top: 5rem;
    padding: 3rem;
  }
`;

const Logo = styled.div`
  background-image: url('../../assets/Mimir.svg');
  width: 12.5rem;
  height: 17.2rem;
`;

const WelcomeHeader = styled.h1`
  font-family: ${fonts.secondary};
  font-weight: 600;
  font-size: ${dimensions.base_2};
  line-height: 2.6rem;
  color: ${colors.main_black};
  margin-top: ${dimensions.xs};
  margin-bottom: ${dimensions.base};
  text-align: center;
`;

const StartPageParagraph = styled.p`
  margin-top: 0;
  margin-bottom: ${dimensions.xl_3};
  font-weight: 300;
  font-size: ${dimensions.xl};
  line-height: ${dimensions.xl_2};
  color: ${colors.main_black};
  text-align: center;

  @media (max-width: ${dimensions.phone_width}) {
    font-size: ${dimensions.lg};
  }
`;

const WrapperForInputAndButton = styled.div`
  display: flex;

  @media (max-width: ${dimensions.phone_width}) {
    flex-direction: column;
  }
`;

const InputStart = styled(Input)`
  margin-right: ${dimensions.xs};
  margin-bottom: 0.7rem;
  padding-left: ${dimensions.xl};
  padding-bottom: 0.4rem;
  width: 20rem;
  height: 3.125rem;
  border: 1px solid #1a1ed6;
  box-sizing: border-box;
  border-radius: ${dimensions.xl_3};

  font-weight: 300;
  font-size: ${dimensions.xl};
  line-height: ${dimensions.xl_2};

  ::placeholder {
    font-weight: 400;
    font-size: ${dimensions.xl};
    line-height: ${dimensions.xl_2};
    color: ${colors.main_gray};
    opacity: 0.5;
    padding-left: ${dimensions.xl};
  }

  :focus {
    color: ${colors.main_black};
    outline: 0;
    box-shadow: 0 0 0 0.1rem ${colors.accent_color};
  }

  @media (max-width: ${dimensions.phone_width}) {
    width: 100%;

    ::placeholder {
      padding-left: ${dimensions.xs_2};
      font-size: ${dimensions.base};
    }
  }
`;

const LoginButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 8rem;
  height: 3.1rem;
  background: ${colors.accent_color};
  border-radius: ${dimensions.xl_3};
  border: none;
  font-weight: 700;
  font-size: ${dimensions.base};
  line-height: ${dimensions.xl};
  color: ${colors.bg_secondary};
  cursor: pointer;

  :hover {
    background: ${colors.hover_color};
  }

  :active {
    background: ${colors.pressed_color};
  }

  @media (max-width: ${dimensions.phone_width}) {
    width: 100%;
  }
`;

const RestyledDropdown = styled(Dropdown)`
  border: 2px solid ${colors.accent_color};
  max-width: 350px;
  width: 100%;
  height: ${dimensions.xl_10};
`;

const StartPage: FC = () => {
  const { t } = useTranslation();
  const history = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [location, setLocation] = useState<TUserLocation>();
  const dispatch = useAppDispatch();
  const { data: GetAllLocationsData, loading: GetAllLocationsLoading } =
    useGetAllLocationsQuery();

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleChangeDropdown = (location: TUserLocation) => {
    setLocation(location);
  };

  const addUser = () => {
    if (!location || !username) return;
    dispatch(setUser({ username, location }));
    history('/home');
  };

  return (
    <StartPageWrapper>
      <Logo />
      <WelcomeHeader>Welcome to the library MIMIR</WelcomeHeader>
      <StartPageParagraph>Simplify the process of claim</StartPageParagraph>
      {!GetAllLocationsLoading && !!GetAllLocationsData && (
        <RestyledDropdown
          placeholder={t('Start.ChooseLocation')}
          options={GetAllLocationsData.getAllLocations.map((loc) => ({
            id: loc!.id,
            value: loc!.location,
          }))}
          onChange={(option) => handleChangeDropdown(option as TUserLocation)}
        />
      )}
      <WrapperForInputAndButton>
        <InputStart
          value={username}
          onChange={handleChangeInput}
          type="text"
          placeholder="Enter your username"
        />
        <LoginButton onClick={addUser}>Login</LoginButton>
      </WrapperForInputAndButton>
    </StartPageWrapper>
  );
};

export default StartPage;
