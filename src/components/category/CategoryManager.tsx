
import { useState, useCallback } from "react";
import { Plus, Edit, Trash2, FolderPlus, Folder, FileText, ChevronRight, ChevronDown, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: string;
  name: string;
  parentId?: string;
  children?: Category[];
  pages?: any[];
  isExpanded?: boolean;
  depth?: number;
}

const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Recursos Humanos",
      isExpanded: true,
      children: [
        { 
          id: "1.1", 
          name: "Benefícios", 
          parentId: "1",
          isExpanded: false,
          children: [
            { id: "1.1.1", name: "Plano de Saúde", parentId: "1.1" },
            { id: "1.1.2", name: "Vale Refeição", parentId: "1.1" },
          ]
        },
        { 
          id: "1.2", 
          name: "Políticas", 
          parentId: "1",
          isExpanded: false,
          children: [
            { id: "1.2.1", name: "Código de Conduta", parentId: "1.2" },
            { id: "1.2.2", name: "Home Office", parentId: "1.2" },
          ]
        },
      ]
    },
    {
      id: "2",
      name: "TI",
      isExpanded: true,
      children: [
        { 
          id: "2.1", 
          name: "Segurança", 
          parentId: "2",
          isExpanded: false,
          children: [
            { id: "2.1.1", name: "Senhas", parentId: "2.1" },
            { id: "2.1.2", name: "VPN", parentId: "2.1" },
          ]
        },
        { id: "2.2", name: "Inventário", parentId: "2" },
      ]
    },
    {
      id: "3",
      name: "Comercial",
      isExpanded: false,
      children: [
        { 
          id: "3.1", 
          name: "Vendas", 
          parentId: "3",
          children: [
            { id: "3.1.1", name: "Scripts", parentId: "3.1" },
            { id: "3.1.2", name: "Propostas", parentId: "3.1" },
          ]
        },
        { id: "3.2", name: "Atendimento", parentId: "3" },
      ]
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState<Category | null>(null);

  const buildTree = useCallback((data: Category[], parentId?: string): Category[] => {
    return data
      .filter(item => item.parentId === parentId)
      .map(item => ({
        ...item,
        children: buildTree(data, item.id),
      }));
  }, []);

  const flattenCategories = useCallback((categories: Category[]): Category[] => {
    const result: Category[] = [];
    
    const flatten = (cats: Category[], depth = 0) => {
      cats.forEach(cat => {
        result.push({ ...cat, depth });
        if (cat.children && cat.children.length > 0) {
          flatten(cat.children, depth + 1);
        }
      });
    };
    
    flatten(categories);
    return result;
  }, []);

  const toggleCategory = (categoryId: string) => {
    const updateExpanded = (cats: Category[]): Category[] => {
      return cats.map(cat => ({
        ...cat,
        isExpanded: cat.id === categoryId ? !cat.isExpanded : cat.isExpanded,
        children: cat.children ? updateExpanded(cat.children) : undefined
      }));
    };
    
    setCategories(updateExpanded);
  };

  const createCategory = (name: string, parentId?: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      parentId,
      children: [],
      isExpanded: false
    };

    if (parentId) {
      const updateTree = (cats: Category[]): Category[] => {
        return cats.map(cat => {
          if (cat.id === parentId) {
            return {
              ...cat,
              children: [...(cat.children || []), newCategory],
              isExpanded: true
            };
          }
          return {
            ...cat,
            children: cat.children ? updateTree(cat.children) : undefined
          };
        });
      };
      setCategories(updateTree);
    } else {
      setCategories(prev => [...prev, newCategory]);
    }

    setNewCategoryName("");
    setIsDialogOpen(false);
  };

  const deleteCategory = (id: string) => {
    const removeFromTree = (cats: Category[]): Category[] => {
      return cats
        .filter(cat => cat.id !== id)
        .map(cat => ({
          ...cat,
          children: cat.children ? removeFromTree(cat.children) : undefined
        }));
    };
    
    setCategories(removeFromTree);
  };

  const onDragStart = (e: React.DragEvent, category: Category) => {
    setDraggedItem(category);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (e: React.DragEvent, targetCategory: Category) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.id === targetCategory.id) return;

    // Remove from old position and add to new position
    const updateTree = (cats: Category[]): Category[] => {
      const filtered = cats.filter(cat => cat.id !== draggedItem.id);
      
      return filtered.map(cat => {
        if (cat.id === targetCategory.id) {
          return {
            ...cat,
            children: [...(cat.children || []), { ...draggedItem, parentId: targetCategory.id }],
            isExpanded: true
          };
        }
        return {
          ...cat,
          children: cat.children ? updateTree(cat.children) : undefined
        };
      });
    };

    setCategories(updateTree);
    setDraggedItem(null);
  };

  const CategoryTreeItem = ({ category, depth = 0 }: { category: Category; depth?: number }) => {
    const hasChildren = category.children && category.children.length > 0;
    const indentLevel = depth * 20;

    return (
      <div className="animate-fade-in">
        <div 
          className={`group flex items-center justify-between p-2 hover:bg-muted/50 rounded-md cursor-pointer transition-all duration-200 hover:shadow-sm ${
            draggedItem?.id === category.id ? 'opacity-50' : ''
          }`}
          style={{ marginLeft: `${indentLevel}px` }}
          draggable
          onDragStart={(e) => onDragStart(e, category)}
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, category)}
        >
          <div className="flex items-center gap-2 flex-1">
            <div className="flex items-center gap-1">
              <GripVertical className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {hasChildren ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => toggleCategory(category.id)}
                >
                  {category.isExpanded ? (
                    <ChevronDown className="h-3 w-3 transition-transform duration-200" />
                  ) : (
                    <ChevronRight className="h-3 w-3 transition-transform duration-200" />
                  )}
                </Button>
              ) : (
                <div className="w-6" />
              )}
              
              <Folder className="h-4 w-4 text-blue-500" />
            </div>
            
            <span className="font-medium select-none">{category.name}</span>
            
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs">
                {category.children?.length || 0} sub
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {category.pages?.length || Math.floor(Math.random() * 10)} páginas
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-blue-100 hover:text-blue-600"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCategory(category);
                setIsDialogOpen(true);
              }}
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-6 w-6 p-0 hover:bg-green-100 hover:text-green-600"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                deleteCategory(category.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {hasChildren && category.isExpanded && (
          <div className="animate-accordion-down">
            {category.children!.map(child => (
              <CategoryTreeItem key={child.id} category={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FolderPlus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Gerenciamento de Categorias</h2>
                <p className="text-sm text-muted-foreground">Estrutura hierárquica com suporte ilimitado a subpastas</p>
              </div>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => setSelectedCategory(null)}
                  className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Nova Categoria
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Folder className="h-5 w-5 text-primary" />
                    {selectedCategory ? 
                      `Nova subcategoria em "${selectedCategory.name}"` : 
                      "Nova Categoria Principal"
                    }
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryName">Nome da Categoria</Label>
                    <Input
                      id="categoryName"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Digite o nome da categoria..."
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={() => createCategory(newCategoryName, selectedCategory?.id)}
                      disabled={!newCategoryName.trim()}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Criar Categoria
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-1 max-h-[600px] overflow-y-auto custom-scrollbar">
            {categories.map(category => (
              <CategoryTreeItem key={category.id} category={category} />
            ))}
          </div>
          
          {categories.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma categoria criada ainda.</p>
              <p className="text-sm">Clique em "Nova Categoria" para começar.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryManager;
