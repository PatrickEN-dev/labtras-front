import { LabTransTerms } from "@/components/business-components/labtrans-terms";

interface FooterProps {
  showTerms?: boolean;
}

export function Footer({ showTerms = true }: FooterProps) {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" suppressHydrationWarning={true}>
        <div
          className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
          suppressHydrationWarning={true}
        >
          <div className="text-center md:text-left" suppressHydrationWarning={true}>
            <p className="text-sm text-gray-600">
              © 2025 LabTrans - Laboratório de Transportes e Logística
            </p>
            <p className="text-xs text-gray-500">Universidade Federal de Santa Catarina</p>
          </div>

          {showTerms && (
            <div className="flex items-center space-x-4" suppressHydrationWarning={true}>
              <LabTransTerms variant="link" className="text-xs" />
              <span className="text-gray-300">|</span>
              <a
                href="mailto:contato@labtrans.ufsc.br"
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Contato
              </a>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
