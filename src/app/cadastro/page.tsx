'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { signUp } from '@/lib/auth/auth-helpers';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignUpFormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const SignUpPage: React.FC = () => {
  const router = useRouter();
  
  const [formData, setFormData] = useState<SignUpFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<SignUpFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof SignUpFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: SignUpFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const { data, error } = await signUp(
        formData.email, 
        formData.password,
        { name: formData.name }
      );

      if (error) {
        setErrors({
          general: error.message
        });
        return;
      }

      if (data.user) {
        setIsSuccess(true);
        // Redirect after showing success message
        setTimeout(() => {
          router.push('/login?message=check_email');
        }, 2000);
      }
    } catch (error) {
      setErrors({
        general: 'Erro ao criar conta. Tente novamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light-gray via-white to-warm-yellow/20 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-display font-bold text-dark-brown mb-2">
              Conta criada com sucesso!
            </h1>
            <p className="text-dark-gray mb-4">
              Verifique seu e-mail para confirmar sua conta antes de fazer login.
            </p>
            <p className="text-sm text-gray-500">
              Redirecionando para login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-gray via-white to-warm-yellow/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <h1 className="text-2xl font-display font-bold text-dark-brown mb-2">
            Crie sua conta
          </h1>
          <p className="text-dark-gray">
            Junte-se à Woof e transforme seu marketing veterinário
          </p>
        </div>

        {/* Card de Cadastro */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Erro Geral */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSignUp} className="space-y-6">
            <Input
              type="text"
              name="name"
              label="Nome completo"
              placeholder="Seu nome"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
              icon={<User size={18} />}
              autoComplete="name"
            />

            <Input
              type="email"
              name="email"
              label="E-mail"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              icon={<Mail size={18} />}
              autoComplete="email"
            />

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                label="Senha"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                icon={<Lock size={18} />}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                label="Confirmar senha"
                placeholder="Digite a senha novamente"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
                icon={<Lock size={18} />}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg"
              disabled={isLoading}
              style={{ backgroundColor: '#FF6B00', minHeight: '48px' }}
            >
              {isLoading ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>

          {/* Link para Login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-dark-gray">
              Já tem uma conta?{' '}
              <Link
                href="/login"
                className="text-woof-orange font-medium hover:text-dark-brown transition-colors"
              >
                Faça login
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            © 2025 Woof Marketing Platform. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
