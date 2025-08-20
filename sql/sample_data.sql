-- Script para inserir dados de demonstração do Manual da Marca Woof
-- Execute após criar a estrutura inicial da tabela brand_manuals

INSERT INTO brand_manuals (
  id,
  user_id,
  brand_name,
  version,
  status,
  creation_method,
  manual_data,
  description,
  tags,
  is_template,
  is_public,
  created_at,
  updated_at,
  published_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000'::uuid,
  -- Substitua pelo seu user_id real ou use: (SELECT id FROM auth.users LIMIT 1)
  auth.uid(),
  'Woof',
  '1.0',
  'published',
  'manual',
  '{
    "metadata": {
      "brand": "Woof",
      "version": "1.0",
      "last_updated": "2025-07-24",
      "author": "Equipe de Branding Woof"
    },
    "chapters": [
      {
        "id": "01",
        "title": "Visão & Essência",
        "objective": "Relembrar propósito, missão e personalidade da Woof para orientar decisões digitais.",
        "content": {
          "purpose": "Dar eficiência ao marketing e às vendas de negócios físicos do universo pet, permitindo que os proprietários foquem em suas especialidades.",
          "manifesto": "Um chamado para conectar, emocionar e vender: damos voz aos negócios pet — como um latido que chama a atenção e fideliza clientes.",
          "personality_adjectives": ["caloroso", "consultivo", "confiante"]
        },
        "completion_status": "complete",
        "last_updated": "2025-07-24"
      },
      {
        "id": "02",
        "title": "Sistema de Logotipo Digital",
        "objective": "Evitar usos incorretos em sites, apps e redes sociais.",
        "content": {
          "logo_versions": [
            "principal_colorida",
            "monocromatica_preta",
            "monocromatica_branca",
            "escala_cinza"
          ],
          "file_formats": ["SVG", "PNG"],
          "asset_sizes": {
            "favicon": [32, 48],
            "app_icon": {
              "android": 512,
              "ios": 1024
            }
          },
          "clear_space": "1x_altura_W",
          "min_size_px": 24,
          "donts": [
            "distorcer",
            "rotacionar",
            "adicionar_sombra",
            "aplicar_gradiente",
            "alterar_cor"
          ]
        },
        "completion_status": "complete",
        "last_updated": "2025-07-24"
      },
      {
        "id": "03",
        "title": "Paleta de Cores Web",
        "objective": "Garantir consistência visual e acessibilidade em ambientes digitais.",
        "content": {
          "primary": {
            "name": "Woof Orange",
            "hex": "#FF6B00",
            "usage_min_percent": 30
          },
          "support": [
            { "name": "Dark Brown", "hex": "#4A2E00" },
            { "name": "Warm Yellow", "hex": "#FFC25C" },
            { "name": "Teal Accent", "hex": "#009688" },
            { "name": "Dark Gray", "hex": "#333333" },
            { "name": "Light Gray", "hex": "#F4F4F4" }
          ],
          "dark_mode": {
            "background": "#1B1B1B",
            "text": "#F5F5F5"
          },
          "contrast_standard": "WCAG 2.2 AA"
        },
        "completion_status": "complete",
        "last_updated": "2025-07-24"
      },
      {
        "id": "04",
        "title": "Tipografia Responsiva",
        "objective": "Manter hierarquia clara em qualquer tela.",
        "content": {
          "primary_font": "Montserrat",
          "secondary_font": "Lato",
          "fallbacks": ["Inter", "Helvetica", "Arial"],
          "scale_rem": {
            "h1": 2.25,
            "h2": 1.75,
            "h3": 1.5,
            "body": 1,
            "caption": 0.875
          },
          "line_height": 1.4,
          "letter_spacing": "normal"
        },
        "completion_status": "complete",
        "last_updated": "2025-07-24"
      },
      {
        "id": "05",
        "title": "Grid & Layout Digital",
        "objective": "Padronizar espaçamentos e componibilizar telas.",
        "content": {
          "grids": {
            "desktop": 12,
            "tablet": 8,
            "mobile": 4
          },
          "spacing_tokens_px": [4, 8, 16, 24, 32, 40],
          "breakpoints_px": {
            "sm": 640,
            "md": 768,
            "lg": 1024,
            "xl": 1280
          }
        },
        "completion_status": "complete",
        "last_updated": "2025-07-24"
      },
      {
        "id": "07",
        "title": "Ícones & Ilustrações",
        "objective": "Alinhar estilo gráfico on-line.",
        "content": {
          "stroke_width_px": 2,
          "corner_radius_px": 4,
          "allowed_motifs": ["patas", "coleiras", "ossos"],
          "palette_restricted": true,
          "icon_repository": "https://github.com/woof/icons"
        },
        "completion_status": "complete",
        "last_updated": "2025-07-24"
      },
      {
        "id": "06",
        "title": "Tom de Voz Digital",
        "objective": "Unificar a comunicação escrita em todos os canais on-line.",
        "content": {
          "pillars": ["caloroso", "consultivo", "confiante"],
          "examples": {
            "push_notification": "Ei! Seu pet merece atenção — já conferiu nossas dicas de hoje?",
            "banner_cta": "Quero atrair mais clientes",
            "support_reply": "Estamos aqui para ajudá-lo. Conte conosco!"
          },
          "preferred_words": ["agilidade", "eficiência", "cuidado"],
          "avoid_words": ["garantia absoluta", "barato"]
        },
        "completion_status": "complete",
        "last_updated": "2025-07-24"
      },
      {
        "id": "07",
        "title": "Social Media Toolkit",
        "objective": "Manter visual coeso entre redes sociais.",
        "content": {
          "templates": {
            "feed": "1080x1080",
            "story": "1080x1920",
            "reel_cover": "1080x1920"
          },
          "safe_margins_percent": 10,
          "hashtag_rules": {
            "max_per_post": 5,
            "brand_tag": "#WoofMarketing"
          }
        },
        "completion_status": "complete",
        "last_updated": "2025-07-24"
      },
      {
        "id": "08",
        "title": "Banners & Ads Digitais",
        "objective": "Facilitar criação de anúncios.",
        "content": {
          "iab_sizes_px": [ [728, 90], [300, 250], [1080, 1080] ],
          "max_file_weight_kb": 150,
          "animation_guidelines": "HTML5, 15 s, loop = 1"
        },
        "completion_status": "complete",
        "last_updated": "2025-07-24"
      },
      {
        "id": "09",
        "title": "Gestão de Ativos & Nomenclatura",
        "objective": "Evitar confusão de arquivos e versões.",
        "content": {
          "folder_structure": ["/logo", "/icons", "/ui", "/social"],
          "naming_convention": "tipo-versao-idioma.ext",
          "single_source_of_truth": "https://drive.google.com/drive/folders/BrandKit"
        },
        "completion_status": "complete",
        "last_updated": "2025-07-24"
      },
      {
        "id": "10",
        "title": "Checklist de Aprovação Digital",
        "objective": "Reduzir retrabalho antes da publicação.",
        "content": {
          "steps": [
            "logo_correto",
            "contraste_ok",
            "alt_text_inserido",
            "fontes_adequadas",
            "grid_respeitado",
            "links_testados",
            "responsivo_validado",
            "acessibilidade_passou",
            "revisao_copys",
            "aprovado_por_gerente"
          ]
        },
        "completion_status": "complete",
        "last_updated": "2025-07-24"
      }
    ]
  }'::jsonb,
  'Manual completo da marca Woof - Exemplo de demonstração com todos os capítulos preenchidos',
  ARRAY['pet', 'marketing', 'digital', 'woof', 'exemplo'],
  true, -- is_template
  true, -- is_public
  '2025-07-24 10:00:00'::timestamp with time zone,
  '2025-07-24 10:00:00'::timestamp with time zone,
  '2025-07-24 10:00:00'::timestamp with time zone
) ON CONFLICT (id) DO NOTHING;
