
import { useState } from "react";
import { ChevronDown, ChevronRight, Folder, File, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  isOpen: boolean;
  onPageSelect: (pageId: string) => void;
  selectedPage: string | null;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  pages: Page[];
  expanded?: boolean;
}

interface Page {
  id: string;
  title: string;
  lastModified: string;
  isNew?: boolean;
}

const categories: Category[] = [
  {
    id: "rh",
    name: "Recursos Humanos",
    icon: "👥",
    pages: [
      { id: "rh-beneficios", title: "Benefícios", lastModified: "2024-01-15" },
      { id: "rh-regras", title: "Regras Internas", lastModified: "2024-01-10" },
      { id: "rh-ferias", title: "Políticas de Férias", lastModified: "2024-01-05" },
    ]
  },
  {
    id: "ti",
    name: "Tecnologia da Informação",
    icon: "💻",
    pages: [
      { id: "ti-sistemas", title: "Acesso a Sistemas", lastModified: "2024-01-20", isNew: true },
      { id: "ti-inventario", title: "Inventário", lastModified: "2024-01-18" },
      { id: "ti-seguranca", title: "Boas Práticas de Segurança", lastModified: "2024-01-12" },
    ]
  },
  {
    id: "comercial",
    name: "Comercial",
    icon: "📈",
    pages: [
      { id: "com-vendas", title: "Estratégias de Vendas", lastModified: "2024-01-22" },
      { id: "com-atendimento", title: "Scripts de Atendimento", lastModified: "2024-01-16" },
      { id: "com-crm", title: "CRM", lastModified: "2024-01-14" },
    ]
  },
  {
    id: "templates",
    name: "Templates e Documentos",
    icon: "📄",
    pages: [
      { id: "temp-contratos", title: "Contratos", lastModified: "2024-01-19" },
      { id: "temp-emails", title: "Modelos de E-mail", lastModified: "2024-01-17" },
      { id: "temp-manuais", title: "Manuais Técnicos", lastModified: "2024-01-13" },
    ]
  }
];

export function Sidebar({ isOpen, onPageSelect, selectedPage }: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["rh", "ti"]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (!isOpen) return null;

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 border-r bg-muted/30 z-40">
      <ScrollArea className="h-full p-4">
        <div className="space-y-2">
          {/* Recent Pages */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium text-sm text-muted-foreground">Páginas Recentes</h3>
            </div>
            <div className="space-y-1">
              {categories.flatMap(cat => cat.pages).slice(0, 3).map(page => (
                <Button
                  key={page.id}
                  variant="ghost"
                  className="w-full justify-start text-sm h-8"
                  onClick={() => onPageSelect(page.id)}
                >
                  <File className="h-3 w-3 mr-2" />
                  {page.title}
                  {page.isNew && <Badge variant="secondary" className="ml-auto text-xs">Novo</Badge>}
                </Button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-3">Categorias</h3>
            {categories.map((category) => (
              <div key={category.id} className="mb-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm font-medium h-9"
                  onClick={() => toggleCategory(category.id)}
                >
                  {expandedCategories.includes(category.id) ? (
                    <ChevronDown className="h-4 w-4 mr-1" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-1" />
                  )}
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </Button>
                
                {expandedCategories.includes(category.id) && (
                  <div className="ml-6 mt-1 space-y-1">
                    {category.pages.map((page) => (
                      <Button
                        key={page.id}
                        variant={selectedPage === page.id ? "secondary" : "ghost"}
                        className="w-full justify-start text-sm h-8"
                        onClick={() => onPageSelect(page.id)}
                      >
                        <File className="h-3 w-3 mr-2" />
                        {page.title}
                        {page.isNew && <Badge variant="secondary" className="ml-auto text-xs">Novo</Badge>}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
