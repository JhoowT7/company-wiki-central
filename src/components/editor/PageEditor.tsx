
import React from 'react';
import AdvancedEditor from './AdvancedEditor';

interface PageEditorProps {
  pageId?: string;
  onSave: (content: any) => void;
  onCancel: () => void;
}

const PageEditor: React.FC<PageEditorProps> = ({ pageId, onSave, onCancel }) => {
  // Mock data for existing page
  const mockPageData = pageId ? {
    title: "Políticas de Segurança da Informação",
    content: `# Políticas de Segurança da Informação

## Introdução
Este documento estabelece as diretrizes fundamentais para a proteção da informação na empresa.

## Senhas
- Mínimo de 12 caracteres
- Incluir maiúsculas, minúsculas, números e símbolos
- Não reutilizar senhas

## Acesso a Sistemas
- Autenticação em dois fatores obrigatória
- Logout automático após 30 minutos de inatividade

## Backup
- Backup diário automatizado
- Testes de restauração mensais`,
  } : {
    title: "",
    content: ""
  };

  return (
    <div className="h-full">
      <AdvancedEditor
        pageId={pageId}
        onSave={onSave}
        onCancel={onCancel}
        initialTitle={mockPageData.title}
        initialContent={mockPageData.content}
      />
    </div>
  );
};

export default PageEditor;
