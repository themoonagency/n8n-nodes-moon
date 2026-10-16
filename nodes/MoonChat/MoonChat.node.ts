import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';

const lista = (property: string) => ({
	output: { postReceive: [{ type: 'rootProperty' as const, properties: { property } }] },
});

export class MoonChat implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'MOON Chat',
		name: 'moonChat',
		icon: { light: 'file:moon.svg', dark: 'file:moon.dark.svg' },
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Read leads, conversations and stats from your MOON Chat AI chatbot',
		defaults: { name: 'MOON Chat' },
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'moonChatApi', required: true }],
		requestDefaults: {
			baseURL: 'https://app.moonchat.ro/api/v1',
			headers: { Accept: 'application/json' },
		},
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get Conversation',
						value: 'getConversation',
						action: 'Get a conversation with its messages',
						description: 'Get one conversation with all its messages',
						routing: { request: { method: 'GET', url: '=/conversatii/{{$parameter.conversationId}}' } },
					},
					{
						name: 'Get Many Conversations',
						value: 'getConversations',
						action: 'Get many conversations',
						description: 'Get the latest real conversations',
						routing: {
							request: { method: 'GET', url: '/conversatii' },
							...lista('conversatii'),
						},
					},
					{
						name: 'Get Many Leads',
						value: 'getLeads',
						action: 'Get many leads',
						description: 'Get visitors who left a phone number or email',
						routing: {
							request: { method: 'GET', url: '/leaduri' },
							...lista('leaduri'),
						},
					},
					{
						name: 'Get Shop',
						value: 'getShop',
						action: 'Get the connected shop',
						description: 'Get the shop linked to this API key',
						routing: { request: { method: 'GET', url: '/me' } },
					},
					{
						name: 'Get Stats',
						value: 'getStats',
						action: 'Get chatbot stats',
						description: 'Get conversations, leads and messages for the last N days',
						routing: { request: { method: 'GET', url: '/statistici' } },
					},
				],
				default: 'getLeads',
			},
			{
				displayName: 'Conversation ID',
				name: 'conversationId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { operation: ['getConversation'] } },
				description: 'ID from a lead or from Get Many Conversations',
			},
			{
				displayName: 'Since',
				name: 'since',
				type: 'dateTime',
				default: '',
				displayOptions: { show: { operation: ['getLeads', 'getConversations'] } },
				description: 'Only items with activity after this date',
				routing: { send: { type: 'query', property: 'de_la', value: '={{ $value ? new Date($value).toISOString() : undefined }}' } },
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: { minValue: 1, maxValue: 100 },
				default: 50,
				displayOptions: { show: { operation: ['getLeads', 'getConversations'] } },
				description: 'Max number of results to return',
				routing: { send: { type: 'query', property: 'limita' } },
			},
			{
				displayName: 'Only With Lead',
				name: 'leadsOnly',
				type: 'boolean',
				default: false,
				displayOptions: { show: { operation: ['getConversations'] } },
				description: 'Whether to return only conversations where the visitor left contact details',
				routing: { send: { type: 'query', property: 'doar_leaduri', value: '={{ $value ? 1 : undefined }}' } },
			},
			{
				displayName: 'Days',
				name: 'days',
				type: 'number',
				typeOptions: { minValue: 1, maxValue: 365 },
				default: 30,
				displayOptions: { show: { operation: ['getStats'] } },
				routing: { send: { type: 'query', property: 'zile' } },
			},
		],
	};
}
