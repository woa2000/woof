// Placeholder page for Anamnese Digital detail until implemented
// @ts-nocheck  // TODO: ajustar tipagem correta para Page props (Next.js 15)
import React, { use } from 'react';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params);
	return (
		<div className="p-6 space-y-4">
			<h1 className="text-2xl font-semibold">Anamnese Digital #{id}</h1>
			<p className="text-sm text-gray-500">Página em construção.</p>
		</div>
	);
}
