import type { IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties, Icon } from 'n8n-workflow';

export class MoonPostApi implements ICredentialType {
	name = 'moonPostApi';

	displayName = 'MOON Post API';

	icon: Icon = { light: 'file:moon.svg', dark: 'file:moon.dark.svg' };

	documentationUrl = 'https://app.moonpost.ro/api/docs';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			placeholder: 'mp_live_...',
			description: 'In the MOON Post panel: Settings → Connection → API and integrations → Generate key',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://app.moonpost.ro/api/v1',
			url: '/me',
		},
	};
}
