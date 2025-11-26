import * as Yup from 'yup';

export const SignUpSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .test('is-admin-email', 'Only admin@yxis.com is allowed to register', (value) => {
      return value === 'admin@yxis.com';
    }),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters long')
    .required('Password is required'),
});
