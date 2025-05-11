// services/signalR.ts
import * as signalR from '@microsoft/signalr';

let connection: signalR.HubConnection;

export const connectToChatHub = (username: string, token: string) => {
  connection = new signalR.HubConnectionBuilder()
    .withUrl(`http://147.175.160.198:5294/chathub`, {
      accessTokenFactory: () => token // если нужно — сюда токен
    })
    .withAutomaticReconnect()
    .build();

  connection.start().then(() => {
    console.log('SignalR connected');
    connection.invoke('JoinGroup', `User_${username}`);
  }).catch(console.error);
};

export const onMessageReceived = (callback: (sender: string, content: string, time: string) => void) => {
  connection.on('ReceiveMessage', callback);
};

export const stopConnection = async () => {
  if (connection) {
    await connection.stop();
  }
};
