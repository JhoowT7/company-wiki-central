
import React, { useState } from 'react';
import { Search, Plus, ExternalLink, Edit, Trash2, Target, Globe, Shield, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CTF {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  category: 'web' | 'crypto' | 'pwn' | 'forensics' | 'misc' | 'osint';
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

const mockCTFs: CTF[] = [
  {
    id: '1',
    title: 'HackTheBox',
    description: 'Plataforma premium para prática de penetration testing com máquinas virtuais reais.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
    link: 'https://www.hackthebox.com',
    category: 'pwn',
    difficulty: 'medium',
    tags: ['penetration testing', 'linux', 'windows']
  },
  {
    id: '2',
    title: 'TryHackMe',
    description: 'Aprenda segurança cibernética através de desafios práticos e laboratórios guiados.',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
    link: 'https://tryhackme.com',
    category: 'web',
    difficulty: 'easy',
    tags: ['beginner friendly', 'guided', 'learning']
  },
  {
    id: '3',
    title: 'OverTheWire',
    description: 'Wargames e desafios de segurança para todos os níveis de habilidade.',
    image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400',
    link: 'https://overthewire.org',
    category: 'crypto',
    difficulty: 'hard',
    tags: ['wargames', 'command line', 'linux']
  },
  {
    id: '4',
    title: 'PicoCTF',
    description: 'Competição de segurança cibernética projetada para estudantes do ensino médio.',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400',
    link: 'https://picoctf.org',
    category: 'misc',
    difficulty: 'easy',
    tags: ['educational', 'students', 'competition']
  },
  {
    id: '5',
    title: 'VulnHub',
    description: 'Máquinas virtuais vulneráveis para download e prática offline.',
    image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400',
    link: 'https://vulnhub.com',
    category: 'forensics',
    difficulty: 'medium',
    tags: ['virtual machines', 'offline', 'boot2root']
  },
  {
    id: '6',
    title: 'OWASP WebGoat',
    description: 'Aplicação web intencionalmente insegura para aprender sobre vulnerabilidades web.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
    link: 'https://owasp.org/www-project-webgoat/',
    category: 'web',
    difficulty: 'easy',
    tags: ['web security', 'owasp', 'vulnerabilities']
  }
];

const CTFsPage: React.FC = () => {
  const [ctfs, setCTFs] = useState<CTF[]>(mockCTFs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCTF, setNewCTF] = useState<Partial<CTF>>({
    title: '',
    description: '',
    image: '',
    link: '',
    category: 'web',
    difficulty: 'easy',
    tags: []
  });

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
    hard: 'bg-red-100 text-red-800'
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
    if (newCTF.title && newCTF.description && newCTF.link) {
      const ctf: CTF = {
        id: Date.now().toString(),
        title: newCTF.title,
        description: newCTF.description,
        image: newCTF.image || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
        link: newCTF.link,
        category: newCTF.category as CTF['category'],
        difficulty: newCTF.difficulty as CTF['difficulty'],
        tags: newCTF.tags || []
      };
      
      setCTFs([...ctfs, ctf]);
      setNewCTF({
        title: '',
        description: '',
        image: '',
        link: '',
        category: 'web',
        difficulty: 'easy',
        tags: []
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteCTF = (id: string) => {
    setCTFs(ctfs.filter(ctf => ctf.id !== id));
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
            Plataformas e desafios para prática de segurança cibernética
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar CTF
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Novo CTF</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newCTF.title}
                  onChange={(e) => setNewCTF({ ...newCTF, title: e.target.value })}
                  placeholder="Nome da plataforma CTF"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newCTF.description}
                  onChange={(e) => setNewCTF({ ...newCTF, description: e.target.value })}
                  placeholder="Descrição breve da plataforma"
                />
              </div>
              <div>
                <Label htmlFor="link">Link</Label>
                <Input
                  id="link"
                  value={newCTF.link}
                  onChange={(e) => setNewCTF({ ...newCTF, link: e.target.value })}
                  placeholder="https://exemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="image">URL da Imagem</Label>
                <Input
                  id="image"
                  value={newCTF.image}
                  onChange={(e) => setNewCTF({ ...newCTF, image: e.target.value })}
                  placeholder="URL da imagem (opcional)"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <select
                    id="category"
                    value={newCTF.category}
                    onChange={(e) => setNewCTF({ ...newCTF, category: e.target.value as CTF['category'] })}
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
                  </select>
                </div>
              </div>
              <Button onClick={handleAddCTF} className="w-full">
                Adicionar CTF
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
        </select>
      </div>

      {/* CTF Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCTFs.map((ctf) => {
          const CategoryIcon = categoryIcons[ctf.category];
          
          return (
            <Card key={ctf.id} className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
              <div className="relative overflow-hidden">
                <img
                  src={ctf.image}
                  alt={ctf.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 right-3 flex gap-2">
                  <Badge className={`${categoryColors[ctf.category]} border`}>
                    <CategoryIcon className="h-3 w-3 mr-1" />
                    {ctf.category.toUpperCase()}
                  </Badge>
                </div>
                <div className="absolute top-3 left-3">
                  <Badge className={difficultyColors[ctf.difficulty]}>
                    {ctf.difficulty === 'easy' ? 'Fácil' : ctf.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                  </Badge>
                </div>
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCTF(ctf.id)}
                    className="text-white hover:text-red-300 h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                  {ctf.title}
                </CardTitle>
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
                
                <a
                  href={ctf.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-300 group">
                    Acessar
                    <ExternalLink className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredCTFs.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            Nenhum CTF encontrado
          </h3>
          <p className="text-sm text-muted-foreground">
            Tente ajustar os filtros ou adicionar um novo CTF.
          </p>
        </div>
      )}
    </div>
  );
};

export default CTFsPage;
