import { Icon, IconProps } from '@chakra-ui/react';

export const FailedIcon = ({ w = '94px', h = '94px' }: IconProps) => {
  return (
    <Icon w={w} h={h} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM11 15V17H13V15H11ZM11 7V13H13V7H11Z"
        fill="#FF4A60"
      />
    </Icon>
  );
};
