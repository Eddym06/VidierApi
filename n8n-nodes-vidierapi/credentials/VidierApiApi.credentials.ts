import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class VidierApiApi implements ICredentialType {
	name = 'vidierApiApi';
	displayName = 'VidierApi API';
	documentationUrl = 'https://vidierapi.com/docs';
	properties: INodeProperties[] = [
		{
			displayName: 'API URL',
			name: 'apiUrl',
			type: 'string',
			default: 'http://localhost:3002',
			placeholder: 'https://api.vidierapi.com',
			description: 'The base URL of your VidierApi instance',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Optional API key for authentication',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Authorization': '={{$credentials.apiKey ? "Bearer " + $credentials.apiKey : ""}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.apiUrl}}',
			url: '/api/health',
		},
	};
}
