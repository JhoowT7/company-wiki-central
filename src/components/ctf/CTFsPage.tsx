
import React, { useState, useEffect } from 'react';
import { Search, Plus, ExternalLink, Edit, Trash2, Target, Globe, Shield, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { database } from '@/stores/database';
import { CTF } from '@/types';
import { useToast } from '@/hooks/use-toast';

const CTFsPage: React.FC = () => {
  const [ctfs, setCTFs] = useState<CTF[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCTF, setNewCTF] = useState<Partial<CTF>>({
    title: '',
    description: '',
    url: '',
    category: 'web',
    difficulty: 'easy',
    tags: [],
    points: 100
  });
  const { toast } = useToast();

  useEffect(() => {
    loadCTFs();
    const unsubscribe = database.subscribe(() => {
      loadCTFs();
    });
    return unsubscribe;
  }, []);

  const loadCTFs = () => {
    const loadedCTFs = database.getCTFs();
    setCTFs(loadedCTFs);
  };

  const categoryIcons = {
    web: Globe,
    crypto: Shield,
    pwn: Target,
    forensics: Search,
    misc: Code,
    osint: Search
  };

  const categoryColors = {
    web: 'bg-blue-100 text-blue-800 border-blue-200',
    crypto: 'bg-purple-100 text-purple-800 border-purple-200',
    pwn: 'bg-red-100 text-red-800 border-red-200',
    forensics: 'bg-green-100 text-green-800 border-green-200',
    misc: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    osint: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  };

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
    expert: 'bg-red-200 text-red-900'
  };

  const filteredCTFs = ctfs.filter(ctf => {
    const matchesSearch = ctf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ctf.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ctf.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || ctf.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || ctf.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleAddCTF = () => {
    if (!newCTF.title || !newCTF.description) {
      toast({
        title: "Erro",
        description: "Título e descrição são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      database.createCTF({
        title: newCTF.title,
        description: newCTF.description,
        difficulty: newCTF.difficulty as CTF['difficulty'],
        category: newCTF.category || 'misc',
        points: newCTF.points || 100,
        tags: Array.isArray(newCTF.tags) ? newCTF.tags : [],
        url: newCTF.url,
        status: 'available',
        createdBy: 'user-1',
        hints: []
      });

      toast({
        title: "Sucesso!",
        description: "CTF criado com sucesso!",
      });

      setNewCTF({
        title: '',
        description: '',
        url: '',
        category: 'web',
        difficulty: 'easy',
        tags: [],
        points: 100
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Erro ao criar CTF:", error);
      toast({
        title: "Erro",
        description: "Erro ao criar CTF",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCTF = (id: string) => {
    try {
      database.deleteCTF(id);
      toast({
        title: "Sucesso!",
        description: "CTF excluído com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao excluir CTF:", error);
      toast({
        title: "Erro",
        description: "Erro ao excluir CTF",
        variant: "destructive"
      });
    }
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setNewCTF({ ...newCTF, tags });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Target className="h-8 w-8 text-primary" />
            CTFs - Capture The Flag
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie seus desafios de segurança cibernética
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Criar CTF
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Novo CTF</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={newCTF.title}
                  onChange={(e) => setNewCTF({ ...newCTF, title: e.target.value })}
                  placeholder="Nome do desafio CTF"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  value={newCTF.description}
                  onChange={(e) => setNewCTF({ ...newCTF, description: e.target.value })}
                  placeholder="Descrição do desafio"
                />
              </div>
              <div>
                <Label htmlFor="url">URL (opcional)</Label>
                <Input
                  id="url"
                  value={newCTF.url}
                  onChange={(e) => setNewCTF({ ...newCTF, url: e.target.value })}
                  placeholder="https://exemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="points">Pontos</Label>
                <Input
                  id="points"
                  type="number"
                  value={newCTF.points}
                  onChange={(e) => setNewCTF({ ...newCTF, points: parseInt(e.target.value) || 100 })}
                  placeholder="100"
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="tags"
                  value={Array.isArray(newCTF.tags) ? newCTF.tags.join(', ') : ''}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="web, sql injection, beginner"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <select
                    id="category"
                    value={newCTF.category}
                    onChange={(e) => setNewCTF({ ...newCTF, category: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="web">Web</option>
                    <option value="crypto">Crypto</option>
                    <option value="pwn">PWN</option>
                    <option value="forensics">Forensics</option>
                    <option value="misc">Misc</option>
                    <option value="osint">OSINT</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="difficulty">Dificuldade</Label>
                  <select
                    id="difficulty"
                    value={newCTF.difficulty}
                    onChange={(e) => setNewCTF({ ...newCTF, difficulty: e.target.value as CTF['difficulty'] })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="easy">Fácil</option>
                    <option value="medium">Médio</option>
                    <option value="hard">Difícil</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>
              <Button onClick={handleAddCTF} className="w-full">
                Criar CTF
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar CTFs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background"
        >
          <option value="all">Todas as categorias</option>
          <option value="web">Web</option>
          <option value="crypto">Crypto</option>
          <option value="pwn">PWN</option>
          <option value="forensics">Forensics</option>
          <option value="misc">Misc</option>
          <option value="osint">OSINT</option>
        </select>
        
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background"
        >
          <option value="all">Todas as dificuldades</option>
          <option value="easy">Fácil</option>
          <option value="medium">Médio</option>
          <option value="hard">Difícil</option>
          <option value="expert">Expert</option>
        </select>
      </div>

      {/* CTF Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCTFs.map((ctf) => {
          const CategoryIcon = categoryIcons[ctf.category];
          
          return (
            <Card key={ctf.id} className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                    {ctf.title}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge className={`${categoryColors[ctf.category]} border`}>
                      <CategoryIcon className="h-3 w-3 mr-1" />
                      {ctf.category.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={difficultyColors[ctf.difficulty]}>
                    {ctf.difficulty === 'easy' ? 'Fácil' : 
                     ctf.difficulty === 'medium' ? 'Médio' : 
                     ctf.difficulty === 'hard' ? 'Difícil' : 'Expert'}
                  </Badge>
                  <Badge variant="outline">{ctf.points} pts</Badge>
                </div>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {ctf.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {ctf.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {ctf.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{ctf.tags.length - 3}
                    </Badge>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {ctf.url ? (
                    <a
                      href={ctf.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-300 group">
                        Acessar
                        <ExternalLink className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                      </Button>
                    </a>
                  ) : (
                    <Button disabled className="flex-1">
                      Sem URL
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCTF(ctf.id)}
                    className="px-3"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredCTFs.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            {ctfs.length === 0 ? "Nenhum CTF criado ainda" : "Nenhum CTF encontrado"}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {ctfs.length === 0 ? "Crie seu primeiro desafio CTF." : "Tente ajustar os filtros."}
          </p>
          {ctfs.length === 0 && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro CTF
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default CTFsPage;
