export interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    source: string;
    status: 'Novo' | 'Contatado' | 'Convertido';
    date: string;
}
export interface Campaign {
    id: string;
    name: string;
    platform: 'Meta Ads';
    status: 'Ativa' | 'Pausada' | 'Concluída';
    spend: number;
    leads: number;
}
export interface AnamneseReport {
    id: string;
    generatedAt: string;
    url: string;
}
//# sourceMappingURL=common.d.ts.map