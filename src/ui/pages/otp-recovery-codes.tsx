import React from 'react';
import { Box, Text, Loading } from '@aptible/arrow-ds';

import { HalEmbedded } from '@app/types';
import { fetchOtpCodes } from '@app/mfa';

import { useData } from '../use-data';
import { useCurrentUser } from '../use-current-user';

interface OtpCode {
  id: string;
  value: string;
  used: boolean;
}
type OtpResponse = HalEmbedded<{ otp_recovery_codes: OtpCode[] }>;

export const OtpRecoveryCodesPage = () => {
  const { user } = useCurrentUser();
  const { data, isLoading } = useData<OtpResponse>(
    fetchOtpCodes({ otpId: user.currentOtpId }),
    user.currentOtpId,
  );

  if (isLoading) return <Loading />;
  if (!data) return <Box>Woops</Box>;
  const codes = data._embedded.otp_recovery_codes;

  return (
    <Box className="py-4 px-16">
      <Text>Recovery codes</Text>
      {codes.map((d) => {
        return (
          <Text key={d.id} className="my-2">
            {d.value}
          </Text>
        );
      })}
    </Box>
  );
};