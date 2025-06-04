
import { useState, useEffect } from "react";
import { Plus, Tag, Edit, Trash2, Palette, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { database } from "@/stores/database";
import { useToast } from "@/hooks/use-toast";
import { Category } from "@/types";

const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
    icon: '📝'
  });
  const { toast } = useToast();

  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
    '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
  ];

  const icons = ['📝', '📚', '🔧', '💼', '🎯', '🚀', '💡', '🔍'];

  useEffect(() => {
    const loadCategories = () => {
      setCategories(database.getCategories());
    };

    loadCategories();
    const unsubscribe = database.subscribe(loadCategories);
    return () => {
      unsubscribe();
    };
  }, []);

  const createCategory = () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome da categoria é obrigatório",
        variant: "destructive"
      });
      return;
    }

    try {
      database.createCategory(newCategory);
      
      toast({
        title: "Sucesso",
        description: "Categoria criada com sucesso!",
      });

      setNewCategory({ name: '', description: '', color: '#3b82f6', icon: '📝' });
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar categoria",
        variant: "destructive"
      });
    }
  };

  const updateCategory = () => {
    if (!editingCategory || !newCategory.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome da categoria é obrigatório",
        variant: "destructive"
      });
      return;
    }

    try {
      const success = database.updateCategory(editingCategory.id, newCategory);
      if (success) {
        toast({
          title: "Sucesso",
          description: "Categoria atualizada com sucesso!",
        });
        setEditingCategory(null);
        setNewCategory({ name: '', description: '', color: '#3b82f6', icon: '📝' });
      } else {
        toast({
          title: "Erro",
          description: "Categoria não encontrada",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar categoria",
        variant: "destructive"
      });
    }
  };

  const deleteCategory = (id: string) => {
    try {
      const success = database.deleteCategory(id);
      if (success) {
        toast({
          title: "Sucesso",
          description: "Categoria excluída com sucesso!",
        });
      } else {
        toast({
          title: "Erro",
          description: "Categoria não encontrada",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir categoria",
        variant: "destructive"
      });
    }
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      description: category.description || '',
      color: category.color || '#3b82f6',
      icon: category.icon || '📝'
    });
    setIsCreateDialogOpen(true);
  };

  const resetForm = () => {
    setEditingCategory(null);
    setNewCategory({ name: '', description: '', color: '#3b82f6', icon: '📝' });
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Tag className="h-8 w-8 text-primary" />
            Gerenciamento de Categorias
          </h1>
          <p className="text-muted-foreground mt-2">
            Organize seu conteúdo com categorias personalizadas
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90" onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Editar Categoria' : 'Criar Nova Categoria'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome da Categoria</Label>
                <Input
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="Digite o nome da categoria"
                />
              </div>
              
              <div>
                <Label>Descrição (opcional)</Label>
                <Textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Descrição da categoria"
                />
              </div>

              <div>
                <Label>Cor</Label>
                <div className="flex gap-2 mt-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 ${
                        newCategory.color === color ? 'border-gray-900' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewCategory({ ...newCategory, color })}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label>Ícone</Label>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {icons.map((icon) => (
                    <button
                      key={icon}
                      className={`w-10 h-10 rounded border-2 text-lg ${
                        newCategory.icon === icon ? 'border-primary bg-primary/10' : 'border-gray-300'
                      }`}
                      onClick={() => setNewCategory({ ...newCategory, icon })}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={editingCategory ? updateCategory : createCategory} 
                disabled={!newCategory.name.trim()} 
                className="w-full"
              >
                {editingCategory ? 'Atualizar Categoria' : 'Criar Categoria'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Categorias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.length === 0 ? (
          <Card className="col-span-full p-12 text-center">
            <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma categoria encontrada</h3>
            <p className="text-muted-foreground mb-4">
              Crie sua primeira categoria para organizar o conteúdo
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Criar Primeira Categoria
            </Button>
          </Card>
        ) : (
          categories.map((category) => (
            <Card key={category.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {category.description && (
                  <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                )}
                <div className="flex justify-between items-center">
                  <Badge variant="outline" style={{ color: category.color, borderColor: category.color }}>
                    <Hash className="h-3 w-3 mr-1" />
                    {category.name}
                  </Badge>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => startEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteCategory(category.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  function createCategory() {
    if (!newCategory.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome da categoria é obrigatório",
        variant: "destructive"
      });
      return;
    }

    try {
      database.createCategory(newCategory);
      
      toast({
        title: "Sucesso",
        description: "Categoria criada com sucesso!",
      });

      setNewCategory({ name: '', description: '', color: '#3b82f6', icon: '📝' });
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar categoria",
        variant: "destructive"
      });
    }
  }

  function updateCategory() {
    if (!editingCategory || !newCategory.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome da categoria é obrigatório",
        variant: "destructive"
      });
      return;
    }

    try {
      const success = database.updateCategory(editingCategory.id, newCategory);
      if (success) {
        toast({
          title: "Sucesso",
          description: "Categoria atualizada com sucesso!",
        });
        setEditingCategory(null);
        setNewCategory({ name: '', description: '', color: '#3b82f6', icon: '📝' });
      } else {
        toast({
          title: "Erro",
          description: "Categoria não encontrada",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar categoria",
        variant: "destructive"
      });
    }
  }

  function deleteCategory(id: string) {
    try {
      const success = database.deleteCategory(id);
      if (success) {
        toast({
          title: "Sucesso",
          description: "Categoria excluída com sucesso!",
        });
      } else {
        toast({
          title: "Erro",
          description: "Categoria não encontrada",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir categoria",
        variant: "destructive"
      });
    }
  }

  function startEdit(category: Category) {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      description: category.description || '',
      color: category.color || '#3b82f6',
      icon: category.icon || '📝'
    });
    setIsCreateDialogOpen(true);
  }

  function resetForm() {
    setEditingCategory(null);
    setNewCategory({ name: '', description: '', color: '#3b82f6', icon: '📝' });
    setIsCreateDialogOpen(false);
  }
};

export default CategoryManager;
