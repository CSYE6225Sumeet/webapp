const methodRestrictor = {
    badRequest: (req, res) => res.status(400).send(),
    methodNotAllowed: (req, res) => res.status(405).send()
};

module.exports = methodRestrictor;
