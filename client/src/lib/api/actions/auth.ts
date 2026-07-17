import { setToken } from '#/utils/token';
import { axiosInstance } from '../axios-instance';

export class AuthAction {
  static async register(data: Record<string, string>) {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  }
  static async login(data: { email: string; password: string }) {
    const response = await axiosInstance.post('/auth/login', data);

    setToken(response.data.accessToken);
    return response.data;
  }

  static async verifyEmail(token: string) {
    const res = await axiosInstance.get(`/auth/verify-email?token=${token}`);
    setToken(res.data.accessToken);
    return res.data;
  }

  static async getAuthUser() {
    const res = await axiosInstance.get('/auth/user');
    return res.data;
  }

  static async forgotPassword(email: string) {
    const res = await axiosInstance.post('/auth/forgot-password', { email });
    return res.data;
  }
  static async resetPassword(password: string, token: string) {
    const res = await axiosInstance.post(
      `/auth/reset-password?token=${token}`,
      { password },
    );
    return res.data;
  }
}
