// product validation

export const productValidation = (req, res, next) => {
    console.log('yaha tak bhi bat pahuchi h ')
    const { name, description, price, categorie, quantity, } = req.fields;
    const { photo } = req.files;
    switch (true) {
        case !name:
            return res.status(500).send({ error: 'name is required' })
        case !description:
            return res.status(500).send({ error: 'description is required' });
        case !price:
            return res.status(500).send({ error: 'price is required' })
        case !categorie:
            return res.status(500).send({ error: 'categorie is required' })
        case !quantity:
            return res.status(500).send({ error: 'quantity  is required' })
        case photo && photo.size > 100000:
            return res.status(500).send({ error: 'photo is required and should be less than 1mb' });
    }
    next();
}