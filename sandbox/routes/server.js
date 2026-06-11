import server from './src/app.js';

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Sandbox server is running on port ${PORT}`);
});