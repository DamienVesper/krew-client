const electron = require(`electron`);
const RPC = require(`discord-rpc`);
const { app, BrowserWindow } = require(`electron`);
let win;

let createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        titleBarStyle: 'hidden',
        title: `Krew.io`,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadFile(`index.html`);
    win.on(`closed`, () => win = null);
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

// Discord RPC
const clientID = null;
const scopes = [`rpc`, `rpc.api`, `messages.read`];
const startTimestamp = new Date();

const client = new RPC.Client({ transport: `ipc` });
RPC.register(clientID);

async function refreshActivity() {
    client.setActivity({
        details: `Shooting Ships`,
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