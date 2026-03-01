export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
  }
  
  export interface Company {
    id: string;
    name: string;
  }
  
  export interface AuthResponse {
    message: string;
    token: string;
    user: User;
    company: Company;
  }
  
  export interface SaasTool {
    id: string;
    name: string;
    category: string;
    monthly_cost: number;
    licenses_total: number;
    licenses_used: number;
    usage_rate: number;
    renewal_date: string;
    status: 'active' | 'warning' | 'inactive';
  }