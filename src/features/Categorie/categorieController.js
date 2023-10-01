import categorieModel from "../../models/categorieModel.js";
import slugify from "slugify";

// create categories
export const creatCategores = async(req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            res.status(401).send({ massage: 'Name is requierd' });
        }
        const isCategorie = await categorieModel.findOne({ name });
        if (isCategorie) {
            return res.status(404).send({
                success: false,
                message: 'this categorid already exist'
            })
        }

        const categorie = await new categorieModel({ name, slug: slugify(name) }).save();
        return res.status(201).send({
            success: true,
            message: 'categorie is created',
            categorie
        })


    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success: false,
            message: 'error in create categorie',
            error

        })

    }


}

//update category 
export const updateCategory = async(req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        const updateCategorie = await categorieModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true });
        res.status(201).send({ success: true, message: 'category updated', updateCategorie })
    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success: false,
            message: 'error to update category',
            error
        })

    }

}

// get all categories 
export const getAllCategories = async(req, res) => {
    try {
        const allCategoreis = await categorieModel.find({});
        res.status(200).send({
            success: true,
            message: 'all categores list',
            allCategoreis
        })
    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success: false,
            message: 'error to find all categories',
            error

        })

    }

}

//get single categorie

export const getSingleCategorie = async(req, res) => {
    try {
        const { slug } = req.params;
        const getSingleCat = await categorieModel.findOne({ slug });
        res.status(500).send({
            success: true,
            message: 'single items get successfully',
            getSingleCat
        })

    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success: false,
            message: 'error to get single categorie',
            error
        })

    }

}

//delete categorie

export const deleteCategorie = async(req, res) => {
    try {
        const { cid } = req.params;
        const category = await categorieModel.findByIdAndDelete(cid);
        return res.status(200).send({
            success: true,
            message: `${category.name} is deleted successfully`
        })

    } catch (error) {
        // console.log(error);
        return res.status(500).send({
            success: false,
            message: 'error to deleted category',
            error
        })

    }

}