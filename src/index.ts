import RingCentral from '@rc-ex/core';
import {ExtensionTelephonySessionsEvent} from '@rc-ex/core/lib/definitions';
import WebSocketExtension from '@rc-ex/ws';
import waitFor from 'wait-for-async';

const rc = new RingCentral({
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
  server: process.env.RINGCENTRAL_SERVER_URL,
});

(async () => {
  await rc.authorize({
    username: process.env.RINGCENTRAL_USERNAME!,
    extension: process.env.RINGCENTRAL_EXTENSION,
    password: process.env.RINGCENTRAL_PASSWORD!,
  });
  const webSocketExtension = new WebSocketExtension({
    // debugMode: true,
  });
  await rc.installExtension(webSocketExtension);
  webSocketExtension.subscribe(
    ['/restapi/v1.0/account/~/extension/~/telephony/sessions'],
    async (event: ExtensionTelephonySessionsEvent) => {
      console.log(JSON.stringify(event, null, 2));
      const party = event.body!.parties![0];
      if (
        party.direction === 'Outbound' &&
        party.status!.code === 'Proceeding'
      ) {
        console.log('forward the call');
        const r = await rc
          .restapi()
          .account()
          .telephony()
          .sessions(event.body!.telephonySessionId)
          .parties(party.id)
          .forward()
          .post({
            phoneNumber: process.env.RINGCENTRAL_FORWARD_TO_NUMBER,
          });
        console.log(JSON.stringify(r, null, 2));
      }
    }
  );
  await waitFor({
    interval: 999999999,
  });
  await rc.revoke();
})();
