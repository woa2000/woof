// Componente LogoSystemEditor atualizado com modal
function LogoSystemEditor({ content, onChange }: { 
  content: any; 
  onChange: (newContent: any) => void; 
}) {
  const [formData, setFormData] = useState({
    logo_versions: content?.logo_versions || [],
    file_formats: content?.file_formats || ['SVG', 'PNG'],
    asset_sizes: content?.asset_sizes || {
      favicon: [32, 48],
      app_icon: { android: 512, ios: 1024 }
    },
    clear_space: content?.clear_space || '',
    min_size_px: content?.min_size_px || 24,
    donts: content?.donts || [],
    uploaded_logos: content?.uploaded_logos || []
  });

  const [newVersion, setNewVersion] = useState('');
  const [newFormat, setNewFormat] = useState('');
  const [newDont, setNewDont] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sincronizar com o conteúdo quando ele mudar
  useEffect(() => {
    setFormData({
      logo_versions: content?.logo_versions || [],
      file_formats: content?.file_formats || ['SVG', 'PNG'],
      asset_sizes: content?.asset_sizes || {
        favicon: [32, 48],
        app_icon: { android: 512, ios: 1024 }
      },
      clear_space: content?.clear_space || '',
      min_size_px: content?.min_size_px || 24,
      donts: content?.donts || [],
      uploaded_logos: content?.uploaded_logos || []
    });
  }, [content]);

  const handleChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onChange(updated);
  };

  const addLogoVersion = () => {
    if (newVersion.trim() && !formData.logo_versions.includes(newVersion.trim())) {
      handleChange('logo_versions', [...formData.logo_versions, newVersion.trim()]);
      setNewVersion('');
    }
  };

  const removeLogoVersion = (index: number) => {
    handleChange('logo_versions', formData.logo_versions.filter((_: string, i: number) => i !== index));
  };

  const addFileFormat = () => {
    if (newFormat.trim() && !formData.file_formats.includes(newFormat.trim())) {
      handleChange('file_formats', [...formData.file_formats, newFormat.trim()]);
      setNewFormat('');
    }
  };

  const removeFileFormat = (index: number) => {
    handleChange('file_formats', formData.file_formats.filter((_: string, i: number) => i !== index));
  };

  const addDont = () => {
    if (newDont.trim() && !formData.donts.includes(newDont.trim())) {
      handleChange('donts', [...formData.donts, newDont.trim()]);
      setNewDont('');
    }
  };

  const removeDont = (index: number) => {
    handleChange('donts', formData.donts.filter((_: string, i: number) => i !== index));
  };

  // Funções para gerenciar logos
  const handleLogoAdded = (newLogo: any) => {
    const updatedLogos = [...formData.uploaded_logos, newLogo];
    handleChange('uploaded_logos', updatedLogos);
  };

  const handleLogoUpdated = (logoIndex: number, updatedLogo: any) => {
    const updatedLogos = [...formData.uploaded_logos];
    updatedLogos[logoIndex] = updatedLogo;
    handleChange('uploaded_logos', updatedLogos);
  };

  const handleLogoRemoved = (logoIndex: number) => {
    const updatedLogos = formData.uploaded_logos.filter((_: any, i: number) => i !== logoIndex);
    handleChange('uploaded_logos', updatedLogos);
  };

  return (
    <div className="space-y-6">
      {/* Upload de Logotipos - Seção Principal */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">📁 Logotipos</h3>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar Logotipo
          </Button>
        </div>
        
        {/* Lista de Logotipos */}
        <LogoList
          logos={formData.uploaded_logos}
          onLogoUpdated={handleLogoUpdated}
          onLogoRemoved={handleLogoRemoved}
        />
      </div>

      {/* Versões do Logo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Versões do Logo
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.logo_versions.map((version: string, index: number) => (
            <span 
              key={index} 
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              {version}
              <button
                type="button"
                onClick={() => removeLogoVersion(index)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            value={newVersion}
            onChange={(e) => setNewVersion(e.target.value)}
            placeholder="Nova versão..."
            onKeyPress={(e) => e.key === 'Enter' && addLogoVersion()}
          />
          <Button type="button" onClick={addLogoVersion}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Formatos de Arquivo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Formatos de Arquivo
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.file_formats.map((format: string, index: number) => (
            <span 
              key={index} 
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
            >
              {format}
              <button
                type="button"
                onClick={() => removeFileFormat(index)}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            value={newFormat}
            onChange={(e) => setNewFormat(e.target.value)}
            placeholder="Novo formato..."
            onKeyPress={(e) => e.key === 'Enter' && addFileFormat()}
          />
          <Button type="button" onClick={addFileFormat}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tamanhos de Assets */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tamanhos de Assets
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Favicon (px)</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={formData.asset_sizes.favicon[0]}
                onChange={(e) => handleChange('asset_sizes', {
                  ...formData.asset_sizes,
                  favicon: [parseInt(e.target.value) || 0, formData.asset_sizes.favicon[1]]
                })}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <input
                type="number"
                value={formData.asset_sizes.favicon[1]}
                onChange={(e) => handleChange('asset_sizes', {
                  ...formData.asset_sizes,
                  favicon: [formData.asset_sizes.favicon[0], parseInt(e.target.value) || 0]
                })}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">App Icons (px)</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500">Android</label>
                <input
                  type="number"
                  value={formData.asset_sizes.app_icon.android}
                  onChange={(e) => handleChange('asset_sizes', {
                    ...formData.asset_sizes,
                    app_icon: { ...formData.asset_sizes.app_icon, android: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">iOS</label>
                <input
                  type="number"
                  value={formData.asset_sizes.app_icon.ios}
                  onChange={(e) => handleChange('asset_sizes', {
                    ...formData.asset_sizes,
                    app_icon: { ...formData.asset_sizes.app_icon, ios: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Área de Respiro */}
      <div>
        <label htmlFor="clear_space" className="block text-sm font-medium text-gray-700 mb-2">
          Área de Respiro
        </label>
        <Input
          id="clear_space"
          type="text"
          value={formData.clear_space}
          onChange={(e) => handleChange('clear_space', e.target.value)}
          placeholder="Ex: mínimo 1x a altura do logo"
        />
      </div>

      {/* Tamanho Mínimo */}
      <div>
        <label htmlFor="min_size_px" className="block text-sm font-medium text-gray-700 mb-2">
          Tamanho Mínimo (px)
        </label>
        <Input
          id="min_size_px"
          type="number"
          value={formData.min_size_px}
          onChange={(e) => handleChange('min_size_px', parseInt(e.target.value) || 0)}
          placeholder="24"
        />
      </div>

      {/* O que não fazer */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          O que não fazer
        </label>
        <div className="space-y-2 mb-2">
          {formData.donts.map((dont: string, index: number) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded">
              <span className="flex-1 text-sm">{dont}</span>
              <button
                type="button"
                onClick={() => removeDont(index)}
                className="text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            value={newDont}
            onChange={(e) => setNewDont(e.target.value)}
            placeholder="Nova regra do que não fazer..."
            onKeyPress={(e) => e.key === 'Enter' && addDont()}
          />
          <Button type="button" onClick={addDont}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Modal de Upload */}
      <LogoUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLogoAdded={handleLogoAdded}
      />
    </div>
  );
}
