
import { useState } from "react";
import { Upload, Palette, Users, Download, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "../ThemeProvider";

const AdminSettings = () => {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    siteName: "Wiki Empresarial",
    siteDescription: "Base de conhecimento da sua empresa",
    logo: "",
    primaryColor: "#3b82f6",
    enableComments: true,
    enableVersioning: true,
    allowPublicPages: false,
  });

  const [users] = useState([
    { id: 1, name: "João Silva", email: "joao@empresa.com", role: "admin", active: true },
    { id: 2, name: "Maria Santos", email: "maria@empresa.com", role: "editor", active: true },
    { id: 3, name: "Pedro Costa", email: "pedro@empresa.com", role: "viewer", active: false },
  ]);

  const updateSiteSettings = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateSiteSettings('logo', url);
    }
  };

  const exportData = () => {
    // Implementar exportação de dados
    console.log("Exportando dados da Wiki...");
  };

  const createUser = () => {
    // Implementar criação de usuário
    console.log("Criando novo usuário...");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Configurações da Wiki</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações gerais, usuários e personalização da sua Wiki empresarial.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Configure as informações básicas da sua Wiki
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Nome da Wiki</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => updateSiteSettings('siteName', e.target.value)}
                  placeholder="Nome da sua Wiki"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Descrição</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => updateSiteSettings('siteDescription', e.target.value)}
                  placeholder="Descrição da sua Wiki empresarial"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <Label>Funcionalidades</Label>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Comentários</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir comentários nas páginas
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableComments}
                    onCheckedChange={(checked) => updateSiteSettings('enableComments', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Versionamento</Label>
                    <p className="text-sm text-muted-foreground">
                      Manter histórico de versões
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableVersioning}
                    onCheckedChange={(checked) => updateSiteSettings('enableVersioning', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Páginas Públicas</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir páginas visíveis publicamente
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowPublicPages}
                    onCheckedChange={(checked) => updateSiteSettings('allowPublicPages', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personalização Visual</CardTitle>
              <CardDescription>
                Customize a aparência da sua Wiki
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Logo da Empresa</Label>
                  <div className="flex items-center gap-4">
                    {settings.logo && (
                      <img 
                        src={settings.logo} 
                        alt="Logo" 
                        className="w-12 h-12 object-contain rounded border"
                      />
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <Label htmlFor="logo-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm" asChild>
                          <span>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Logo
                          </span>
                        </Button>
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Cor Primária</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      id="primaryColor"
                      value={settings.primaryColor}
                      onChange={(e) => updateSiteSettings('primaryColor', e.target.value)}
                      className="w-12 h-10 border rounded cursor-pointer"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => updateSiteSettings('primaryColor', e.target.value)}
                      placeholder="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Tema</Label>
                    <p className="text-sm text-muted-foreground">
                      Escolha entre modo claro ou escuro
                    </p>
                  </div>
                  <Button variant="outline" onClick={toggleTheme}>
                    {theme === "light" ? (
                      <Moon className="h-4 w-4 mr-2" />
                    ) : (
                      <Sun className="h-4 w-4 mr-2" />
                    )}
                    {theme === "light" ? "Modo Escuro" : "Modo Claro"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Gerenciamento de Usuários
                <Button onClick={createUser}>
                  <Users className="w-4 h-4 mr-2" />
                  Novo Usuário
                </Button>
              </CardTitle>
              <CardDescription>
                Gerencie usuários e suas permissões
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div 
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{user.name}</h4>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          : user.role === 'editor'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}>
                        {user.role}
                      </span>
                      <Switch checked={user.active} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Backup e Exportação</CardTitle>
              <CardDescription>
                Faça backup dos seus dados e configure exportações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Exportar Dados Completos</h4>
                  <p className="text-sm text-muted-foreground">
                    Baixe um arquivo com todo o conteúdo da Wiki
                  </p>
                </div>
                <Button onClick={exportData}>
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Backup Automático</h4>
                  <p className="text-sm text-muted-foreground">
                    Configure backups automáticos diários
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
