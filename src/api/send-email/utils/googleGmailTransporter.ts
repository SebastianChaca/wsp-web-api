import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
export const googleGmailTransporter = async (configService: ConfigService) => {
  const OAuth2 = google.auth.OAuth2;
  const oauth2Client = new OAuth2(
    configService.get('CLIENTEID'),
    configService.get('CLIENTESECRET'),
    'https://developers.google.com/oauthplayground',
  );

  oauth2Client.setCredentials({
    refresh_token: configService.get('REFRESH_TOKEN_GMAIL'),
  });
  const accessToken = (await oauth2Client.getAccessToken()).token;
  return {
    host: configService.get('STMP_HOST'),
    port: configService.get('EMAIL_PORT'),
    secure: true,
    auth: {
      type: 'OAuth2',
      user: configService.get('EMAIL_USER'),
      clientId: configService.get('CLIENTEID'),
      clientSecret: configService.get('CLIENTESECRET'),
      refreshToken: accessToken,
    },
  };
};
