# Booking Components

Esta pasta contém os componentes modulares para o sistema de reservas, organizados de forma limpa e reutilizável.

## Estrutura dos Componentes

### BookingDrawer (Principal)

- **Arquivo**: `../booking-drawer.tsx`
- **Descrição**: Componente principal que orquestra todos os outros componentes
- **Responsabilidades**:
  - Gerenciamento do estado do formulário
  - Validações
  - Submissão à API
  - Coordenação entre componentes

### Componentes Modulares

#### 1. BookingDrawerHeader

- **Arquivo**: `booking-drawer-header.tsx`
- **Descrição**: Cabeçalho do drawer com título e botão de fechar
- **Props**: `onClose`

#### 2. BookingBasicInfo

- **Arquivo**: `booking-basic-info.tsx`
- **Descrição**: Campos para informações básicas (título, descrição)
- **Props**: `title`, `description`, `onTitleChange`, `onDescriptionChange`

#### 3. BookingDateTime

- **Arquivo**: `booking-date-time.tsx`
- **Descrição**: Seleção de data e horários
- **Props**: `date`, `startTime`, `endTime`, callbacks de mudança
- **Features**: Calendário, validação de datas passadas

#### 4. BookingLocation

- **Arquivo**: `booking-location.tsx`
- **Descrição**: Seleção de unidade/localização e sala
- **Props**: `locationId`, `roomId`, callbacks de mudança
- **Features**: Carregamento dinâmico de salas baseado na localização

#### 5. BookingAdditionalConfig

- **Arquivo**: `booking-additional-config.tsx`
- **Descrição**: Configurações adicionais (responsável, aprovação, café)
- **Props**: `managerId`, `requiresApproval`, `includesCoffee`, callbacks

#### 6. BookingDrawerFooter

- **Arquivo**: `booking-drawer-footer.tsx`
- **Descrição**: Rodapé com botões de ação
- **Props**: `onCancel`, `onSubmit`, `isSubmitting`

## Vantagens da Modularização

### ✅ Organização

- Cada componente tem uma responsabilidade única
- Fácil localização e manutenção do código
- Estrutura clara e previsível

### ✅ Reutilização

- Componentes podem ser reutilizados em outros contextos
- Fácil criação de variações (ex: modal ao invés de drawer)
- Testabilidade individual

### ✅ Manutenibilidade

- Mudanças isoladas não afetam outros componentes
- Fácil adição de novas funcionalidades
- Debug simplificado

### ✅ Performance

- Componentes menores são mais eficientes
- Re-renders otimizados
- Lazy loading possível

## Padrões Utilizados

### Tipagem TypeScript

- Interfaces bem definidas para props
- Tipos específicos para dados do formulário
- Validação em tempo de compilação

### Hooks Personalizados

- `useApi` para chamadas HTTP
- Estado local gerenciado com `useState`
- Efeitos controlados com `useEffect`

### Design Patterns

- **Composition**: Drawer composto por múltiplos componentes
- **Controlled Components**: Estado gerenciado pelo componente pai
- **Callback Props**: Comunicação via callbacks
- **Single Responsibility**: Cada componente tem uma função específica

## Como Usar

```typescript
import { BookingDrawer } from "@/components/business-components/booking-drawer";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <BookingDrawer
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onSuccess={() => {
        setIsOpen(false);
        // Atualizar lista de reservas
      }}
    />
  );
}
```

## Extensibilidade

Para adicionar novos campos ou seções:

1. **Criar novo componente** na pasta `booking/`
2. **Exportar** no `index.ts`
3. **Importar** e usar no `BookingDrawer`
4. **Atualizar** interface `BookingFormData` se necessário
5. **Documentar** neste README
