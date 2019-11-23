const electron = require(`electron`);
const jsonstore = require(`jsonstore`);
const RPC = require(`discord-rpc`);
const { app, BrowserWindow } = require(`electron`);
const version = `0.0.8`;
let store = new jsonstore(process.env.JSONSTORE_TOKEN);
let win;

function createWindow() {
    store.read(`/version`).then(data => {
        win = new BrowserWindow({
            width: 800,
            height: 600,
            titleBarStyle: 'hidden',
            title: `Krew.io`,
            webPreferences: {
                nodeIntegration: true
            }
        });
    
        if(version != data) win.loadFile(`outdated.html`);
        else win.loadFile(`index.html`);
        win.on(`closed`, () => win = null);
    });
}

app.on(`ready`, () => {
    createWindow();
});
app.on(`window-all-closed`, () => {
    if(process.platform != `darwin`) app.quit();
    console.log(`Sucessfully shut down application.`); 
    // console.log(`Successfully shut down application and logged out of RPC.`);
});
app.on(`activate`, () => {
    if(win == null) createWindow();
});

//Discord RPC
const clientID = null;
const scopes = [`rpc`, `rpc.api`, `messages.read`];
const startTimestamp = new Date();

const client = new RPC.Client({ transport: `ipc` });
RPC.register(clientID);

async function refreshActivity() {
    client.setActivity({
        details: `Sailing the Seven Seas`,
        state: `Competitive`,
        startTimestamp,
        largeImageKey: `krew-logo`,
        largeImageText: `Krew.io`,
        instance: false
    });
    console.log(`[${new Date().toLocaleTimeString()}] Updated RPC.`);
};

client.on(`ready`, () => {
    refreshActivity();
    setInterval(refreshActivity, 15e3);
});
client.login({ clientID, scopes }).catch(err => `Failed to connect to Discord via RPC.`);

store.write(`/logs/${new Date()}`, `App is running.`).catch(err => console.log(`Failed to connect to the application's host server.`));