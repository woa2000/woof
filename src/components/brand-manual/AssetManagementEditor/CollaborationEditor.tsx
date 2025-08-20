'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Users, Plus, Trash2 } from 'lucide-react';

interface CollaborationData {
  roles_responsibilities: Record<string, {
    permissions: string;
    responsibilities: string[];
  }>;
  workflow_process: Record<string, string>;
  communication_channels: Record<string, string>;
}

interface CollaborationEditorProps {
  data: CollaborationData;
  onChange: (data: CollaborationData) => void;
}

export function CollaborationEditor({ data, onChange }: CollaborationEditorProps) {
  const addRole = () => {
    const newRole = `nova_funcao_${Date.now()}`;
    onChange({
      ...data,
      roles_responsibilities: {
        ...data.roles_responsibilities,
        [newRole]: {
          permissions: 'Permissões da função',
          responsibilities: []
        }
      }
    });
  };

  const removeRole = (roleKey: string) => {
    const newRoles = { ...data.roles_responsibilities };
    delete newRoles[roleKey];
    onChange({ ...data, roles_responsibilities: newRoles });
  };

  const handleRoleChange = (roleKey: string, field: string, value: any) => {
    onChange({
      ...data,
      roles_responsibilities: {
        ...data.roles_responsibilities,
        [roleKey]: {
          ...data.roles_responsibilities[roleKey],
          [field]: value
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5" />
              Papéis e Responsabilidades
            </h3>
            <Button onClick={addRole} variant="secondary">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Papel
            </Button>
          </div>

          <div className="space-y-4">
            {Object.entries(data.roles_responsibilities).map(([roleKey, roleData]) => (
              <div key={roleKey} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start gap-4 mb-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Papel:</label>
                    <Input
                      value={roleKey}
                      onChange={(e) => {
                        const newRoles = { ...data.roles_responsibilities };
                        const roleInfo = newRoles[roleKey];
                        delete newRoles[roleKey];
                        newRoles[e.target.value] = roleInfo;
                        onChange({ ...data, roles_responsibilities: newRoles });
                      }}
                      placeholder="nome_do_papel"
                    />
                  </div>
                  <div className="flex-2">
                    <label className="block text-sm font-medium mb-1">Permissões:</label>
                    <Input
                      value={roleData.permissions}
                      onChange={(e) => handleRoleChange(roleKey, 'permissions', e.target.value)}
                      placeholder="Descrição das permissões"
                    />
                  </div>
                  <Button
                    onClick={() => removeRole(roleKey)}
                    variant="secondary"
                    className="mt-6"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
