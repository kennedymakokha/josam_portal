import { api } from './../slices'

export const injectEndpoints = api.injectEndpoints({
    endpoints: (builder: { mutation: (arg0: { query: ((body: any) => { url: string; method: string; body: any; }) | ((body: any) => { url: string; method: string; body: any; }) | ((body: any) => { url: string; method: string; body: any; }) | (() => { url: string; method: string; }); }) => any; query: (arg0: { query: (() => string) | (() => string); }) => any; }) => ({
        signup: builder.mutation({
            query: (body) => ({
                url: '/auth/register',
                method: 'POST',
                body,
            }),
        }),
        activate: builder.mutation({
            query: (body) => ({
                url: '/auth/activate-user',
                method: 'POST',
                body,
            }),
        }),
        login: builder.mutation({
            query: (body) => ({
                url: '/auth/login',
                method: 'POST',
                body,
            }),
        }),
        getSession: builder.query({
            query: () => '/auth',
        }),
        getusers: builder.query({
            query: () => '/auth/users',
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useActivateMutation,
    useSignupMutation,
    useLoginMutation,
    useGetSessionQuery,
    useLogoutMutation,
    useGetusersQuery,
} = injectEndpoints;
