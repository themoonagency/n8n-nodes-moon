import type { IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties, Icon } from 'n8n-workflow';

export class MoonChatApi implements ICredentialType {
	name = 'moonChatApi';

	displayName = 'MOON Chat API';

	icon: Icon = { light: 'file:moon.svg', dark: 'file:moon.dark.svg' };

	documentationUrl = 'https://app.moonchat.ro/api/docs';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			placeholder: 'mc_live_...',
			description: 'In the MOON Chat panel: Shop settings → Notifications → API and integrations → Generate key',
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
			baseURL: 'https://app.moonchat.ro/api/v1',
			url: '/me',
		},
	};
}
