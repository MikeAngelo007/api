var _url = process.env.LOGIN_URL;
var _port = process.env.LOGIN_PORT;
var _entryPoint = process.env.LOGIN_ENTRY;

console.log(`http://${_url}:${_port}/${_entryPoint}`);

export const url = _url ? _url : '1a-login-ms';
export const port = _port ? _port : '3005';
export const entryPoint = _entryPoint ? _entryPoint : "login";