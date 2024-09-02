import { GoogleLogin } from '@react-oauth/google';
const LoginWithOauthGoogle: React.FC = () => {
  // see https://muhammedsahad.medium.com/react-js-a-step-by-step-guide-to-google-authentication-926d0d85edbd
  const responseMessage = (response: any) => {
    console.log(response);
  };
  const errorMessage = (error: any): void => {
    console.log(error);
  };
  return (
    <div>
        <GoogleLogin onSuccess={responseMessage} onError={() => errorMessage({})} />
    </div>
  );
};
export default LoginWithOauthGoogle;
