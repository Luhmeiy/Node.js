import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
const app: FastifyInstance = fastify();

interface Product {
    name: string;
    price: number;
}

app.post('/createproduct', (req: FastifyRequest, res: FastifyReply) => {
    const {name, price} = req.body as Product;

    if (!name) {
        res.status(422).send({ message: "O campo nome é obrigatório!" });
    }

    console.log(name);
    console.log(price);

    res.status(201).send({ message: `O produto ${name} foi criado com sucesso!` });
});

app.get('/', (req, res) => {
    res.status(200).send({ message: "Primeira rota criada" })
});

app.listen({
	port: 3000
});