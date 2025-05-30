import { useState } from "react";
import { ChevronDown, ChevronRight, Folder, File, Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { ViewMode } from "@/pages/Index";

interface SidebarProps {
  isOpen: boolean;
  onPageSelect: (pageId: string) => void;
  selectedPage: string | null;
  onViewChange: (view: ViewMode) => void;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  pages: Page[];
  children?: Category[];
  expanded?: boolean;
  depth?: number;
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
    expanded: true,
    pages: [],
    children: [
      {
        id: "rh-beneficios",
        name: "Benefícios",
        icon: "💰",
        pages: [
          { id: "rh-plano-saude", title: "Plano de Saúde", lastModified: "2024-01-15" },
          { id: "rh-vale-refeicao", title: "Vale Refeição", lastModified: "2024-01-10" },
        ],
        children: [
          {
            id: "rh-beneficios-detalhes",
            name: "Detalhes Específicos",
            icon: "📋",
            pages: [
              { id: "rh-beneficios-convenios", title: "Convênios Médicos", lastModified: "2024-01-08" },
            ],
            children: [
              {
                id: "rh-beneficios-convenios-locais",
                name: "Convênios por Região",
                icon: "🌍",
                pages: [
                  { id: "rh-convenios-sp", title: "São Paulo", lastModified: "2024-01-05" },
                  { id: "rh-convenios-rj", title: "Rio de Janeiro", lastModified: "2024-01-03" },
                ]
              }
            ]
          }
        ]
      },
      {
        id: "rh-politicas",
        name: "Políticas",
        icon: "📋",
        expanded: false,
        pages: [],
        children: [
          {
            id: "rh-codigo-conduta",
            name: "Código de Conduta",
            icon: "⚖️",
            pages: [
              { id: "rh-codigo-etica", title: "Código de Ética", lastModified: "2024-01-20" },
              { id: "rh-assedio", title: "Prevenção ao Assédio", lastModified: "2024-01-18" },
            ]
          }
        ]
      }
    ]
  },
  {
    id: "ti",
    name: "Tecnologia da Informação",
    icon: "💻",
    expanded: true,
    pages: [],
    children: [
      {
        id: "ti-seguranca",
        name: "Segurança",
        icon: "🔒",
        pages: [
          { id: "ti-senhas", title: "Políticas de Senhas", lastModified: "2024-01-20", isNew: true },
          { id: "ti-vpn", title: "Configuração VPN", lastModified: "2024-01-18" },
        ],
        children: [
          {
            id: "ti-seguranca-procedimentos",
            name: "Procedimentos",
            icon: "📝",
            pages: [
              { id: "ti-backup", title: "Backup e Recuperação", lastModified: "2024-01-12" },
            ]
          }
        ]
      },
      {
        id: "ti-sistemas",
        name: "Sistemas",
        icon: "⚙️",
        pages: [
          { id: "ti-inventario", title: "Inventário de Hardware", lastModified: "2024-01-18" },
          { id: "ti-software", title: "Licenças de Software", lastModified: "2024-01-16" },
        ]
      }
    ]
  },
  {
    id: "juridico",
    name: "Jurídico",
    icon: "⚖️",
    expanded: false,
    pages: [],
    children: [
      {
        id: "juridico-contratos",
        name: "Contratos",
        icon: "📄",
        pages: [
          { id: "juridico-modelo-contrato", title: "Modelo de Contrato", lastModified: "2024-01-12" },
        ]
      }
    ]
  }
];

export function Sidebar({ isOpen, onPageSelect, selectedPage, onViewChange }: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["rh", "ti", "rh-beneficios", "ti-seguranca"]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const CategoryTreeItem = ({ category, depth = 0 }: { category: Category; depth?: number }) => {
    const hasChildren = category.children && category.children.length > 0;
    const hasPages = category.pages && category.pages.length > 0;
    const isExpanded = expandedCategories.includes(category.id);
    const indentLevel = depth * 16;
    const maxDepth = 5;

    return (
      <div className="animate-fade-in">
        <Button
          variant="ghost"
          className={`w-full justify-start text-sm font-medium h-9 transition-all duration-300 hover:bg-accent/50 hover:shadow-sm group ${
            isExpanded ? 'bg-accent/30' : ''
          } ${depth > maxDepth ? 'opacity-75' : ''}`}
          style={{ paddingLeft: `${12 + Math.min(indentLevel, maxDepth * 16)}px` }}
          onClick={() => toggleCategory(category.id)}
        >
          <div className="flex items-center gap-2 flex-1">
            {hasChildren || hasPages ? (
              <div className="transition-transform duration-300 group-hover:scale-110">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            ) : (
              <div className="w-4" />
            )}
            
            <span className="text-base transition-transform duration-200 group-hover:scale-110">{category.icon}</span>
            <span className="flex-1 text-left truncate">{category.name}</span>
            
            {depth <= 3 && (hasPages || hasChildren) && (
              <Badge variant="secondary" className="text-xs ml-auto opacity-70 group-hover:opacity-100 transition-opacity">
                {(category.pages?.length || 0) + (category.children?.length || 0)}
              </Badge>
            )}
          </div>
        </Button>
        
        {isExpanded && (
          <div className="animate-accordion-down space-y-1 mt-1">
            {hasPages && (
              <div className="space-y-1">
                {category.pages!.map((page) => (
                  <div
                    key={page.id}
                    className="group flex items-center gap-2"
                    style={{ paddingLeft: `${28 + Math.min(indentLevel, maxDepth * 16)}px` }}
                  >
                    <Button
                      variant={selectedPage === page.id ? "secondary" : "ghost"}
                      className="flex-1 justify-start text-sm h-8 transition-all duration-200 hover:bg-accent/50"
                      onClick={() => onPageSelect(page.id)}
                    >
                      <File className="h-3 w-3 mr-2 text-muted-foreground" />
                      <span className="flex-1 text-left truncate">{page.title}</span>
                      {page.isNew && (
                        <Badge variant="secondary" className="ml-auto text-xs">Novo</Badge>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {hasChildren && (
              <div className="space-y-1">
                {category.children!.map((child) => (
                  <CategoryTreeItem key={child.id} category={child} depth={depth + 1} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40 shadow-lg">
      <div className="p-4 space-y-4 h-full flex flex-col">
        <ScrollArea className="flex-1">
          <div className="space-y-6">
            {/* Quick Actions */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="font-medium text-sm text-muted-foreground">Ações Rápidas</h3>
              </div>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-8 transition-all duration-200 hover:bg-accent/50"
                  onClick={() => onViewChange('new')}
                >
                  <Plus className="h-3 w-3 mr-2 text-muted-foreground" />
                  Nova Página
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-8 transition-all duration-200 hover:bg-accent/50"
                  onClick={() => onViewChange('categories')}
                >
                  <Folder className="h-3 w-3 mr-2 text-muted-foreground" />
                  Gerenciar Categorias
                </Button>
              </div>
            </div>

            <Separator />

            {/* Categories */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="font-medium text-sm text-muted-foreground">Categorias</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-primary/10"
                  onClick={() => onViewChange('categories')}
                >
                  <Folder className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="space-y-1">
                {categories.map((category) => (
                  <CategoryTreeItem key={category.id} category={category} />
                ))}
              </div>
            </div>

            <Separator />

            {/* CTFs Section */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium text-sm text-muted-foreground">CTFs</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-primary/10"
                  onClick={() => onViewChange('ctfs')}
                >
                  <Target className="h-3 w-3" />
                </Button>
              </div>
              
              <Button
                variant="outline"
                className="w-full justify-start text-sm h-8 transition-all duration-200 hover:bg-accent/50"
                onClick={() => onViewChange('ctfs')}
              >
                <Target className="h-3 w-3 mr-2 text-muted-foreground" />
                Ver CTFs Disponíveis
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}
