const methodRestrictor = {
    badRequest: (req, res) => res.status(400).json({ error: 'Bad Request' }),
    methodNotAllowed: (req, res) => res.status(405).send()
};

module.exports = methodRestrictor;
