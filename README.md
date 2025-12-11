# React + Vite

## Instructions
```
npm install  
npm run dev  
npm run dev -- --host  
```

## Deploy  
```
npm run build  
serve -s dist -l 5173  
cloudflared tunnel --url http://localhost:5173  
cloudflared tunnel --url http://localhost:8000
```

### Note: you might need to edit the .env file