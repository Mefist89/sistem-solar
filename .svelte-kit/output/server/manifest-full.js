export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.D_wqxlTq.js",app:"_app/immutable/entry/app.CAUUhJmW.js",imports:["_app/immutable/entry/start.D_wqxlTq.js","_app/immutable/chunks/Bd6aYrWs.js","_app/immutable/chunks/DSYNrBbg.js","_app/immutable/chunks/DILMmgF_.js","_app/immutable/entry/app.CAUUhJmW.js","_app/immutable/chunks/DSYNrBbg.js","_app/immutable/chunks/BdBwslws.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
