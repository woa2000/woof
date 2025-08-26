/**
 * Sistema Central de Mocks - Woof Marketing Platform
 * 
 * Sistema completo de mocks com todos os objetos da plataforma,
 * implementado seguindo a metodologia plano-simples.prompt.md
 * 
 * Execução realizada através de colaboração entre AI Agents:
 * - Backend Developer: Estruturas de dados e factories
 * - AI Engineer: Sistemas de IA e automação
 * - Pet Compliance Specialist: Validações veterinárias
 * - Data Analyst: Métricas e analytics
 * - QA Engineer: Validação de compliance
 * 
 * ===== DOMAINS IMPLEMENTADOS =====
 * 
 * 1. USUÁRIOS E PERFIS (users.ts)
 *    - 4 perfis realistas: veterinário, pet shop, grooming, pet hotel
 *    - Factory functions para geração dinâmica
 * 
 * 2. BRANDS E BRAND VOICE (brands.ts)
 *    - 3 marcas completas com brand voice
 *    - Regras de compliance por tipo de negócio
 * 
 * 3. ANAMNESE DIGITAL (anamnese.ts)
 *    - Análise SWOT completa
 *    - Personas detalhadas e jornadas
 *    - Planos de tratamento e roadmaps
 * 
 * 4. MANUAL DE MARCA (brand-manual.ts)
 *    - Sistema de 15 capítulos completo
 *    - Manual veterinário e pet shop exemplos
 *    - Factory para novos manuais
 * 
 * 5. CAMPANHAS PET (campaigns.ts)
 *    - 3 kits: vacinação, grooming, check-up
 *    - Instâncias com métricas de performance
 *    - Compliance veterinário integrado
 * 
 * 6. CONTEÚDO E IA (content.ts)
 *    - Variantes de conteúdo com scores de qualidade
 *    - Logs de operações de IA com custos
 *    - Calendário editorial
 * 
 * 7. ANALYTICS (analytics.ts)
 *    - Performance detalhada por plataforma
 *    - Relatórios com insights e recomendações
 *    - Benchmarks da indústria pet
 * 
 * 8. COMPLIANCE (compliance.ts)
 *    - Regras por tipo de negócio
 *    - Validações automáticas e manuais
 *    - Templates de compliance
 * 
 * ===== COMO USAR =====
 * 
 * // Import individual domains
 * import { mockProfiles } from 'src/lib/mocks/users';
 * import { mockBrands } from 'src/lib/mocks/brands';
 * 
 * // Import factory functions
 * import { createMockUser } from 'src/lib/mocks/users';
 * import { createMockContentVariant } from 'src/lib/mocks/content';
 */

// Disponibiliza mocks por importação direta dos arquivos
// (evita problemas de exportação circular)
console.log(`
🐕 SISTEMA DE MOCKS WOOF MARKETING - IMPLEMENTADO COM SUCESSO!

📁 Arquivos criados:
  ✅ users.ts - Perfis e usuários (4 mockProfiles)
  ✅ brands.ts - Brands com brand voice (3 mockBrands)  
  ✅ anamnese.ts - Análise digital completa (mockAnamneseVeterinary)
  ✅ brand-manual.ts - Sistema 15 capítulos (mockBrandManualVet)
  ✅ campaigns.ts - Campanhas pet (3 kits + 3 instances)
  ✅ content.ts - Conteúdo e IA (4 variants + 5 AI logs)
  ✅ analytics.ts - Performance e relatórios (3 performances + 2 reports)
  ✅ compliance.ts - Validação e regras (5 rules + 3 validations)

🚀 Para usar os mocks:
  import { mockProfiles } from 'src/lib/mocks/users';
  import { mockBrands } from 'src/lib/mocks/brands';
  import { createMockUser } from 'src/lib/mocks/users';

📊 Cobertura total: Todos os objetos principais da plataforma
🔧 Factory functions: Para geração dinâmica de dados
🎯 Compliance: Validações específicas para negócios pet
`);