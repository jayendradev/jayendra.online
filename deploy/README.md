# VPS deploy — jayendra.online

## Install systemd service

```bash
cd /root/jayendra.online
npm ci
npm run build

cp deploy/jayendra-online.service /etc/systemd/system/jayendra-online.service
systemctl daemon-reload
systemctl enable jayendra-online
systemctl start jayendra-online
systemctl status jayendra-online
```

Uses **port 3001** so BriefWire can keep port 3000. Point nginx to `http://127.0.0.1:3001`.

## Logs

```bash
journalctl -u jayendra-online -f
```

## After code update

```bash
cd /root/jayendra.online
npm ci
npm run build
systemctl restart jayendra-online
```
