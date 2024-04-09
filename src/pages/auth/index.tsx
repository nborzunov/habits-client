import { Auth, AuthContainer, Login, Signup } from '@entities/auth';
import { Route } from 'react-router-dom';

export const AuthPage = () => {
    return (
        <>
            <Route
                path='/auth'
                element={
                    <AuthContainer>
                        <Auth />
                    </AuthContainer>
                }
            />
            <Route
                path='/login'
                element={
                    <AuthContainer>
                        <Login />
                    </AuthContainer>
                }
            />
            <Route
                path='/signup'
                element={
                    <AuthContainer>
                        <Signup />
                    </AuthContainer>
                }
            />
        </>
    );
};
