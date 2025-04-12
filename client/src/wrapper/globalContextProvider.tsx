import { AuthProvider } from '../context/useAuthContext';

export const GlobalProvider = ({ children }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};
