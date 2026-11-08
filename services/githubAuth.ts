import { GITHUB_CLIENT_ID } from '../github.config';

const DEVICE_URL = 'https://github.com/login/device/code';
const TOKEN_URL = 'https://github.com/login/oauth/access_token';
const USER_URL = 'https://api.github.com/user';

export type DeviceCode = {
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number;
};

export type GitHubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
};

type TokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function requestDeviceCode(): Promise<DeviceCode> {
  const response = await fetch(DEVICE_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      scope: 'read:user',
    }).toString(),
  });

  if (!response.ok) {
    throw new Error('Не удалось получить код GitHub');
  }

  const data = (await response.json()) as DeviceCode;

  if (!data.device_code || !data.user_code) {
    throw new Error('GitHub вернул некорректный ответ');
  }

  return data;
}

export async function authorizeDevice(
  device: DeviceCode,
): Promise<string> {
  const expiresAt = Date.now() + device.expires_in * 1000;
  let interval = device.interval * 1000;

  while (Date.now() < expiresAt) {
    await wait(interval);

    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GITHUB_CLIENT_ID,
        device_code: device.device_code,
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
      }).toString(),
    });

    const data = (await response.json()) as TokenResponse;

    if (data.access_token) {
      return data.access_token;
    }

    if (data.error === 'authorization_pending') {
      continue;
    }

    if (data.error === 'slow_down') {
      interval += 5000;
      continue;
    }

    if (data.error === 'access_denied') {
      throw new Error('Вы отменили авторизацию GitHub');
    }

    if (data.error === 'expired_token') {
      throw new Error('Время действия кода истекло. Попробуйте снова');
    }

    throw new Error(
      data.error_description || 'Ошибка авторизации GitHub',
    );
  }

  throw new Error('Время ожидания авторизации истекло');
}

export async function getGitHubUser(
  accessToken: string,
): Promise<GitHubUser> {
  const response = await fetch(USER_URL, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${accessToken}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!response.ok) {
    throw new Error('Не удалось получить профиль GitHub');
  }

  return (await response.json()) as GitHubUser;
}