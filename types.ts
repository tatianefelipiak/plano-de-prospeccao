export interface ProspectingData {
  empresa: string;
  produto: string;
  segmentacao: string;
  comunicacao: string;
  localizacao: string;
  fontes: string;
  metaVendas: number;
  ticketMedio: number;
  taxaConversao: number;
  // Novos campos do Plano de Execução
  qualificacaoLista: string;
  qualificacaoLead: string;
  abordagem: string;
  objecoes: string;
  followUp: string;
  oferta: string;
}

export const INITIAL_DATA: ProspectingData = {
  empresa: '',
  produto: '',
  segmentacao: '',
  comunicacao: '',
  localizacao: '',
  fontes: '',
  metaVendas: 0,
  ticketMedio: 0,
  taxaConversao: 0,
  qualificacaoLista: '',
  qualificacaoLead: '',
  abordagem: '',
  objecoes: '',
  followUp: '',
  oferta: '',
};