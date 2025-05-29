
import { useState } from "react";
import { Plus, Edit, Trash2, FolderPlus, Folder, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Category {
  id: string;
  name: string;
  parentId?: string;
  children?: Category[];
  pages?: any[];
}

const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Recursos Humanos",
      children: [
        { id: "1.1", name: "Benefícios", parentId: "1" },
        { id: "1.2", name: "Políticas", parentId: "1" },
      ]
    },
    {
      id: "2",
      name: "TI",
      children: [
        { id: "2.1", name: "Segurança", parentId: "2" },
        { id: "2.2", name: "Inventário", parentId: "2" },
      ]
    },
    {
      id: "3",
      name: "Comercial",
      children: [
        { id: "3.1", name: "Vendas", parentId: "3" },
        { id: "3.2", name: "Atendimento", parentId: "3" },
      ]
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const createCategory = (name: string, parentId?: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      parentId,
      children: []
    };

    if (parentId) {
      // Adicionar como subcategoria
      setCategories(prev => prev.map(cat => 
        cat.id === parentId 
          ? { ...cat, children: [...(cat.children || []), newCategory] }
          : cat
      ));
    } else {
      // Adicionar como categoria principal
      setCategories(prev => [...prev, newCategory]);
    }

    setNewCategoryName("");
    setIsDialogOpen(false);
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
    // TODO: Implementar remoção de subcategorias
  };

  const renameCategory = (id: string, newName: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, name: newName } : cat
    ));
  };

  const CategoryTree = ({ category, level = 0 }: { category: Category; level?: number }) => (
    <div className={`ml-${level * 4}`}>
      <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md group">
        <div className="flex items-center gap-2">
          <Folder className="h-4 w-4 text-blue-500" />
          <span className="font-medium">{category.name}</span>
          <span className="text-xs text-muted-foreground">
            ({category.children?.length || 0} subpastas)
          </span>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedCategory(category);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="h-3 w-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => deleteCategory(category.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {category.children?.map(child => (
        <CategoryTree key={child.id} category={child} level={level + 1} />
      ))}
    </div>
  );

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Gerenciamento de Categorias
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedCategory(null)}>
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Nova Categoria
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {selectedCategory ? `Nova subcategoria em "${selectedCategory.name}"` : "Nova Categoria Principal"}
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
                    >
                      Criar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map(category => (
              <CategoryTree key={category.id} category={category} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryManager;
