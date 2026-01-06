import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  MessageCircle, 
  MapPin, 
  Database, 
  Flag, 
  DollarSign, 
  Percent, 
  Filter, 
  Target,
  Download,
  ClipboardList,
  UserCheck,
  Send,
  ShieldAlert,
  Clock,
  Briefcase,
  Zap
} from 'lucide-react';
import { ProspectingData, INITIAL_DATA } from './types';
import { CanvasBlock } from './components/CanvasBlock';
import { AutoGrowingTextarea } from './components/AutoGrowingTextarea';
import { formatCurrency, formatNumber, parseCurrencyString } from './utils/formatters';
import html2canvas from 'html2canvas';

const App: React.FC = () => {
  const [data, setData] = useState<ProspectingData>(() => {
    const saved = localStorage.getItem('prospecting_map_data');
    if (saved) {
      return JSON.parse(saved);
    }
    return { ...INITIAL_DATA };
  });

  const canvasRef = useRef<HTMLDivElement>(null);
  const utmParams = "?utm_source=system&utm_medium=ferramenta&utm_campaign=system-plano-prospeccao";
  const mainLink = `https://maquinadeleads.com/${utmParams}`;

  useEffect(() => {
    localStorage.setItem('prospecting_map_data', JSON.stringify(data));
  }, [data]);

  const updateField = <K extends keyof ProspectingData>(field: K, value: ProspectingData[K]) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleCurrencyInput = (field: 'metaVendas' | 'ticketMedio', value: string) => {
    const numericValue = parseCurrencyString(value);
    updateField(field, numericValue);
  };

  const handleExport = async () => {
    if (!canvasRef.current) return;
    const buttons = document.querySelectorAll('.no-print');
    buttons.forEach(b => (b as HTMLElement).style.opacity = '0');

    const canvas = await html2canvas(canvasRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });
    
    buttons.forEach(b => (b as HTMLElement).style.opacity = '1');
    const image = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = image;
    link.download = `plano-prospeccao-${data.empresa || 'export'}.png`;
    link.click();
  };

  const vendasMes = data.ticketMedio > 0 ? Math.ceil(data.metaVendas / data.ticketMedio) : 0;
  const vendasSemana = Math.ceil(vendasMes / 4);
  const vendasDia = Math.ceil(vendasSemana / 5);
  
  const leadsNecessarios = data.taxaConversao > 0 ? Math.ceil(vendasMes / (data.taxaConversao / 100)) : 0;
  const abordagensDiarias = Math.ceil(leadsNecessarios / 20);

  const royalBlue = "text-[#2B59FF]";
  const labelStyle = "text-[13px] font-medium text-gray-500 mb-1";
  const valueStyle = `text-[20px] font-normal leading-none ${royalBlue}`;

  return (
    <div className="min-h-screen bg-white md:bg-[#f8f9fa] py-12 px-4 font-inter">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Top Export Button */}
        <div className="flex justify-end mb-6 no-print">
          <button 
            onClick={handleExport} 
            className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-lg font-bold text-sm hover:bg-gray-800 transition-all shadow-md active:scale-95"
          >
            <Download size={18} /> Exportar Plano
          </button>
        </div>

        {/* Canvas */}
        <div ref={canvasRef} className="bg-white border-gray-100 md:border md:shadow-2xl overflow-hidden flex flex-col">
          
          {/* Header Section */}
          <div className="px-12 pt-16 pb-12 flex flex-col lg:flex-row justify-start items-start lg:items-end gap-10 lg:gap-32 border-b border-[#EEEEEE]">
            <div className="mb-8 lg:mb-0 flex-shrink-0">
              <h1 className="text-[32px] md:text-[42px] font-black text-gray-900 leading-[0.9] uppercase tracking-tighter">
                PLANO DE<br />PROSPECÇÃO
              </h1>
              <p className="text-[13px] mt-4 text-gray-400 font-medium uppercase tracking-widest">
                Gere leads em <a href={mainLink} target="_blank" rel="noopener noreferrer" className="text-black font-bold hover:underline">maquinadeleads.com</a>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 w-full lg:w-auto">
              <div className="border-b border-[#EEEEEE] pb-2 min-w-[200px]">
                <label className="block text-[13px] font-medium text-gray-500 uppercase tracking-widest mb-1">Empresa:</label>
                <input 
                  type="text" 
                  value={data.empresa}
                  onChange={(e) => updateField('empresa', e.target.value)}
                  className={`w-full bg-transparent outline-none font-normal text-[20px] ${royalBlue}`}
                  placeholder="Nome da empresa"
                />
              </div>
              <div className="border-b border-[#EEEEEE] pb-2 min-w-[240px]">
                <label className="block text-[13px] font-medium text-gray-500 uppercase tracking-widest mb-1">Produto/Serviço:</label>
                <input 
                  type="text" 
                  value={data.produto}
                  onChange={(e) => updateField('produto', e.target.value)}
                  className={`w-full bg-transparent outline-none font-normal text-[20px] ${royalBlue}`}
                  placeholder="Ex: Consultoria"
                />
              </div>
            </div>
          </div>

          {/* Grid de Metas: 4 colunas no topo */}
          <div className="grid grid-cols-1 md:grid-cols-4 border-b border-[#EEEEEE]">
            <CanvasBlock title="Meta de Vendas" subtitle="Qual é a sua meta financeira?" icon={<Flag size={28} />} className="border-r border-[#EEEEEE]">
              <div className="flex-1 flex flex-col items-start justify-start py-2 w-full">
                <input 
                  type="text" 
                  value={formatCurrency(data.metaVendas)}
                  onChange={(e) => handleCurrencyInput('metaVendas', e.target.value)}
                  className={`text-[20px] font-normal text-left bg-transparent outline-none w-full ${royalBlue}`}
                />
                <div className="w-24 h-[1px] bg-[#EEEEEE] my-4"></div>
              </div>
            </CanvasBlock>

            <div className="flex flex-col border-r border-[#EEEEEE]">
              <CanvasBlock title="Ticket Médio" subtitle="Qual é o valor médio da venda?" icon={<DollarSign size={24} />} className="flex-1 border-b border-[#EEEEEE]">
                <div className="flex-1 flex flex-col items-start justify-start w-full">
                  <input 
                    type="text" 
                    value={formatCurrency(data.ticketMedio)}
                    onChange={(e) => handleCurrencyInput('ticketMedio', e.target.value)}
                    className={`text-[20px] font-normal text-left bg-transparent outline-none w-full ${royalBlue}`}
                  />
                </div>
              </CanvasBlock>
              <CanvasBlock title="Taxa de Conversão" subtitle="Qual é a taxa de conversão em vendas?" icon={<Percent size={24} />} className="flex-1">
                <div className="flex-1 flex items-center justify-start w-full">
                  <input 
                    type="number" 
                    value={data.taxaConversao || ''}
                    onChange={(e) => updateField('taxaConversao', parseFloat(e.target.value) || 0)}
                    className={`w-12 text-[20px] font-normal text-left bg-transparent outline-none ${royalBlue}`}
                    placeholder="0"
                  />
                  <span className={`text-[20px] font-normal ${royalBlue}`}>%</span>
                </div>
              </CanvasBlock>
            </div>

            <CanvasBlock title="Vendas Necessárias" subtitle="Quantas vendas você precisa fazer?" icon={<Filter size={28} />} className="border-r border-[#EEEEEE]">
              <div className="flex-1 flex flex-col items-start justify-start gap-6 py-2 w-full">
                <div className="text-left">
                  <p className={labelStyle}>Vendas no Mês</p>
                  <p className={valueStyle}>
                    {vendasMes} <span className="text-[13px] font-medium text-gray-400 ml-1">vendas</span>
                  </p>
                </div>
                <div className="flex flex-col gap-5 w-full border-t border-[#F5F5F5] pt-6">
                  <div className="text-left">
                    <p className={labelStyle}>Por semana</p>
                    <p className={valueStyle}>{vendasSemana}</p>
                  </div>
                  <div className="text-left">
                    <p className={labelStyle}>Por dia útil</p>
                    <p className={valueStyle}>{vendasDia}</p>
                  </div>
                </div>
              </div>
            </CanvasBlock>

            <div className="flex flex-col">
              <CanvasBlock title="Leads Necessários" subtitle="De quantos leads você irá precisar?" icon={<Target size={28} />} className="flex-1 border-b border-[#EEEEEE]">
                <div className="flex-1 flex flex-col items-start justify-start w-full">
                  <p className={`text-[20px] font-normal text-left leading-none tracking-tight ${royalBlue}`}>
                    {formatNumber(leadsNecessarios)} <span className="text-[14px] font-medium ml-1">leads</span>
                  </p>
                </div>
              </CanvasBlock>
              <CanvasBlock title="Capacidade de Vendas" subtitle="Quantos novos contatos sua operação vai precisar iniciar por dia?" icon={<Zap size={24} />} className="flex-1">
                <div className="flex-1 flex flex-col items-start justify-start w-full">
                  <p className={`text-[20px] font-normal text-left leading-none tracking-tight ${royalBlue}`}>
                    {formatNumber(abordagensDiarias)} <span className="text-[14px] font-medium ml-1">contatos</span>
                  </p>
                </div>
              </CanvasBlock>
            </div>
          </div>

          {/* Seção Plano de Execução */}
          <div className="bg-[#fcfcfc] border-b border-[#EEEEEE] px-12 py-8">
            <h2 className="text-[24px] font-black text-gray-900 uppercase tracking-tight">
              PLANO DE EXECUÇÃO
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 flex-1">
            <CanvasBlock title="Segmentação" subtitle="Qual é o segmento de mercado do seu cliente ideal?" icon={<Users size={28} />} className="border-r border-b border-[#EEEEEE]">
              <AutoGrowingTextarea value={data.segmentacao} onChange={(v) => updateField('segmentacao', v)} placeholder="Ex: Pet Shop" />
            </CanvasBlock>

            <CanvasBlock title="Comunicação" subtitle="Quais melhores canais para abordagem?" icon={<MessageCircle size={28} />} className="border-b border-[#EEEEEE]">
              <AutoGrowingTextarea value={data.comunicacao} onChange={(v) => updateField('comunicacao', v)} placeholder="Ex: WhatsApp" />
            </CanvasBlock>

            <CanvasBlock title="Localização" subtitle="Qual bairro/cidade o cliente ideal está?" icon={<MapPin size={28} />} className="border-r border-b border-[#EEEEEE]">
              <AutoGrowingTextarea value={data.localizacao} onChange={(v) => updateField('localizacao', v)} placeholder="Ex: Curitiba" />
            </CanvasBlock>

            <CanvasBlock title="Fontes" subtitle="Onde o lead será extraído?" icon={<Database size={28} />} className="border-b border-[#EEEEEE]">
              <AutoGrowingTextarea value={data.fontes} onChange={(v) => updateField('fontes', v)} placeholder="Ex: Google Maps" />
            </CanvasBlock>

            <CanvasBlock 
              title="QUALIFICAÇÃO DA LISTA" 
              subtitle="Quais são os critérios para qualificar uma lista?" 
              icon={<ClipboardList size={28} />} 
              className="border-r border-b border-[#EEEEEE]"
            >
              <AutoGrowingTextarea value={data.qualificacaoLista} onChange={(v) => updateField('qualificacaoLista', v)} placeholder="Ex: Pet Shop em Curitiba que tenham WhatsApp" />
            </CanvasBlock>

            <CanvasBlock 
              title="QUALIFICAÇÃO DO LEAD" 
              subtitle="Quais são os critérios para qualificar o potencial cliente?" 
              icon={<UserCheck size={28} />} 
              className="border-b border-[#EEEEEE]"
            >
              <AutoGrowingTextarea value={data.qualificacaoLead} onChange={(v) => updateField('qualificacaoLead', v)} placeholder="Ex: Decisor tem autonomia..." />
            </CanvasBlock>

            <CanvasBlock 
              title="ENTREGA DE VALOR" 
              subtitle="O que irá oferecer para atrair a atenção do lead?" 
              icon={<Briefcase size={28} />} 
              className="border-r border-b border-[#EEEEEE]"
            >
              <AutoGrowingTextarea value={data.oferta} onChange={(v) => updateField('oferta', v)} placeholder="Ex: Diagnóstico gratuito de 15 minutos" />
            </CanvasBlock>

            <CanvasBlock title="ABORDAGEM" subtitle="Como é a sua mensagem inicial?" icon={<Send size={28} />} className="border-b border-[#EEEEEE]">
              <AutoGrowingTextarea value={data.abordagem} onChange={(v) => updateField('abordagem', v)} placeholder="Ex: Olá [Nome], vi que vocês..." />
            </CanvasBlock>

            <CanvasBlock title="OBJEÇÕES" subtitle="Quais são as 3 principais objeções?" icon={<ShieldAlert size={28} />} className="border-r border-b border-[#EEEEEE]">
              <AutoGrowingTextarea value={data.objecoes} onChange={(v) => updateField('objecoes', v)} placeholder="Ex: Tá caro, já tenho fornecedor..." />
            </CanvasBlock>

            <CanvasBlock title="FOLLOW UP" subtitle="Quantas tentativas e em quais intervalos?" icon={<Clock size={28} />}>
              <AutoGrowingTextarea value={data.followUp} onChange={(v) => updateField('followUp', v)} placeholder="Ex: 5 tentativas em 10 dias..." />
            </CanvasBlock>
          </div>

          <div className="px-12 md:px-16 py-10 flex flex-col md:flex-row justify-between items-center border-t border-[#EEEEEE] bg-white gap-8">
            <div className="flex items-center">
              <a href={mainLink} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <img 
                  src="https://static.wixstatic.com/media/ac21eb_14dd25b59e154fa385a05afe19edf107~mv2.png/v1/fill/w_153,h_45,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/1.png" 
                  alt="Logo" 
                  className="h-10 w-auto object-contain"
                />
              </a>
            </div>
            <p className="text-[12px] font-medium text-gray-400 uppercase tracking-widest text-center md:text-right">
              Gere leads em <a href={mainLink} target="_blank" rel="noopener noreferrer" className="text-black font-bold hover:underline">maquinadeleads.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;