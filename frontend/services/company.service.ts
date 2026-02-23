import api from './api';

export const companyService = {
    inviteEmployee: async (email: string, name: string, department: string) => {
        const response = await api.post('/company/invite', { email, name, department });
        return response.data;
    },

    addAdmin: async (email: string, name: string) => {
        const response = await api.post('/company/add-admin', { email, name });
        return response.data;
    },

    // Future methods: getCompanyDetails, getEmployees, etc.
};
