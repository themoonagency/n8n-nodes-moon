import {
	NodeConnectionTypes,
	type IHookFunctions,
	type IWebhookFunctions,
	type INodeType,
	type INodeTypeDescription,
	type IWebhookResponseData,
} from 'n8n-workflow';

const BAZA = 'https://app.moonpost.ro/api/v1';

export class MoonPostTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'MOON Post Trigger',
		name: 'moonPostTrigger',
		icon: { light: 'file:moon.svg', dark: 'file:moon.dark.svg' },
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Starts the workflow when MOON Post publishes a post',
		defaults: { name: 'MOON Post Trigger' },
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'moonPostApi', required: true }],
		webhooks: [{ name: 'default', httpMethod: 'POST', responseMode: 'onReceived', path: 'webhook' }],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				default: 'postare_publicata',
				options: [
					{ name: 'Post Published', value: 'postare_publicata', description: 'A post went live on the blog or social media' },
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const data = this.getWorkflowStaticData('node');
				if (data.webhookId === undefined) return false;
				const r = (await this.helpers.httpRequestWithAuthentication.call(this, 'moonPostApi', {
					method: 'GET', url: BAZA + '/webhooks', json: true,
				})) as { webhooks?: Array<{ id: number }> };
				if ((r.webhooks || []).some((h) => h.id === data.webhookId)) return true;
				delete data.webhookId;
				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const r = (await this.helpers.httpRequestWithAuthentication.call(this, 'moonPostApi', {
					method: 'POST', url: BAZA + '/webhooks', json: true,
					body: { url: this.getNodeWebhookUrl('default'), eveniment: this.getNodeParameter('event') as string },
				})) as { id?: number };
				if (r.id === undefined) return false;
				this.getWorkflowStaticData('node').webhookId = r.id;
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const data = this.getWorkflowStaticData('node');
				if (data.webhookId !== undefined) {
					try {
						await this.helpers.httpRequestWithAuthentication.call(this, 'moonPostApi', {
							method: 'DELETE', url: BAZA + '/webhooks/' + data.webhookId, json: true,
						});
					} catch (error) {
						this.logger.warn('MOON: could not delete the webhook ' + String(data.webhookId) + ': ' + (error as Error).message);
						return false;
					}
					delete data.webhookId;
				}
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		return { workflowData: [this.helpers.returnJsonArray(this.getBodyData())] };
	}
}
