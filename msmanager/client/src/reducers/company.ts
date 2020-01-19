export interface ICompany {
    id: number;
    name: string;
    city: string;
    zipCode: string;
    address: string;
    phone: number;
    email: string;
    fax: string;
    _links: any;
}

interface ICompanyAction { type: string, companies: ICompany[] }
interface ICompanyOneAction { type: string, company: ICompany }

export function companies(state = [], action: ICompanyAction) {
    return action.type === 'COMPANIES_FETCH_DATA_SUCCESS' ? action.companies : state;
}

export function company(state = {}, action: ICompanyOneAction) {
    return action.type === 'COMPANY_FETCH_DATA_SUCCESS' ? action.company : state;
}
