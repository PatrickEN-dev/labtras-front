import { TermsModal } from "@/components/ui-base/terms-modal";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface LabTransTermsProps {
  variant?: "link" | "button";
  className?: string;
}

export function LabTransTerms({ variant = "link", className = "" }: LabTransTermsProps) {
  const handleAccept = () => {
    localStorage.setItem("termos-aceitos", new Date().toISOString());
  };

  const handleCancel = () => {};

  const triggerElement =
    variant === "button" ? (
      <Button variant="outline" size="sm" className={className}>
        <FileText className="h-4 w-4 mr-2" />
        Termos de Uso
      </Button>
    ) : (
      <button className={`text-blue-600 hover:text-blue-800 underline text-sm ${className}`}>
        Termos de Uso
      </button>
    );

  return (
    <TermsModal
      trigger={triggerElement}
      title="Termos de Uso - LabTrans"
      onAccept={handleAccept}
      onCancel={handleCancel}
      acceptButtonText="Aceito os Termos"
      cancelButtonText="Cancelar"
    >
      <div className="space-y-6">
        <section>
          <h3 className="font-semibold text-gray-900 mb-2">1. Aceitação dos Termos</h3>
          <p>
            Ao utilizar o sistema LabTrans de reserva de salas de reuniões, você concorda com os
            termos e condições aqui estabelecidos. Se não concordar com qualquer parte destes
            termos, não utilize o sistema.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-gray-900 mb-2">2. Uso do Sistema</h3>
          <p className="mb-2">O sistema destina-se exclusivamente para:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Reserva de salas de reuniões do laboratório</li>
            <li>Gerenciamento de horários e disponibilidade</li>
            <li>Solicitação de serviços de café durante reuniões</li>
            <li>Consulta de agenda e relatórios</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-gray-900 mb-2">3. Responsabilidades do Usuário</h3>
          <p className="mb-2">O usuário compromete-se a:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Utilizar o sistema de forma responsável e ética</li>
            <li>Manter a confidencialidade de suas credenciais de acesso</li>
            <li>Respeitar os horários de reserva estabelecidos</li>
            <li>Cancelar reservas quando necessário com antecedência</li>
            <li>Zelar pela conservação das salas e equipamentos</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-gray-900 mb-2">4. Política de Reservas</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Reservas podem ser feitas com até 30 dias de antecedência</li>
            <li>Cancelamentos devem ser feitos com pelo menos 2 horas de antecedência</li>
            <li>Usuários que não comparecerem sem cancelar terão restrições futuras</li>
            <li>Salas devem ser liberadas pontualmente ao final do horário reservado</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-gray-900 mb-2">5. Privacidade e Dados</h3>
          <p>
            Respeitamos sua privacidade. Dados pessoais são utilizados apenas para funcionamento do
            sistema de reservas e não são compartilhados com terceiros. Informações de uso podem ser
            coletadas para melhorias no sistema.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-gray-900 mb-2">6. Limitação de Responsabilidade</h3>
          <p>O LabTrans não se responsabiliza por:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Problemas técnicos que impeçam o uso das salas</li>
            <li>Perda de dados ou informações pessoais</li>
            <li>Conflitos entre usuários por uso das salas</li>
            <li>Danos a equipamentos por mau uso</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-gray-900 mb-2">7. Modificações</h3>
          <p>
            Estes termos podem ser modificados a qualquer momento. Usuários serão notificados sobre
            mudanças significativas e precisarão aceitar novamente os termos atualizados.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-gray-900 mb-2">8. Contato</h3>
          <p>
            Para dúvidas ou suporte, entre em contato através do email:
            <span className="font-medium text-blue-600"> suporte@labtrans.ufsc.br</span>
          </p>
        </section>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Data de última atualização:</strong> 17 de novembro de 2025
          </p>
        </div>
      </div>
    </TermsModal>
  );
}
