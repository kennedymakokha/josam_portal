import { api } from '../slices'

export const injectEndpoints = api.injectEndpoints({
    endpoints: (builder: { mutation: (arg0: { query: ((body: any) => { url: string; method: string; body: any; }) | ((body: any) => { url: string; method: string; body: any; }) | ((body: any) => { url: string; method: string; body: any; }) | (() => { url: string; method: string; }); }) => any; query: (arg0: { query: (() => string) | (() => string); }) => any; }) => ({
        registerService: builder.mutation({
            query: (body) => ({
                url: '/services',
                method: 'POST',
                body,
            }),
        }),
        toggleactiveService: builder.mutation({
            query: (id: any) => ({
                url: `/services/toggle-active/${id}`,
                method: 'PUT',
                body: {}
            }),
        }),
        deleteService: builder.mutation({
            query: (id: any) => ({
                url: `/services/${id}`,
                method: 'DELETE',
                body: {}
            }),
        }),
        updateService: builder.mutation({
            query: (body) => ({
                url: `/services/${body._id}`,
                method: 'PUT',
                body
            }),
        }),
        getServices: builder.query({
            query: () => '/services',
        }),
        // getServiceById: builder.query({
        //     query: (id: string) => `/services/${id}`,
        // })
    }),
});

export const {
    useRegisterServiceMutation,
    useGetServicesQuery,
    useToggleactiveServiceMutation,
    useDeleteServiceMutation,
    useUpdateServiceMutation,
} = injectEndpoints;
