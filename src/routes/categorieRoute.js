import express from "express";
import { creatCategores, deleteCategorie, getAllCategories, getSingleCategorie, updateCategory } from "../features/Categorie/categorieController.js";
import { isAdmin, protectRoute } from "../middleware/protectedRouteMiddleware.js";

const categorieRouter = express.Router();
//create category route
categorieRouter.post('/create-categories', protectRoute, isAdmin, creatCategores);

// update category route
categorieRouter.put('/update-category/:id', protectRoute, isAdmin, updateCategory);

//get all categories route
categorieRouter.get('/get-allCategoreis', getAllCategories);

//get single categorie route
categorieRouter.get('/get-singleCategorie/:slug', getSingleCategorie);

//delete category route
categorieRouter.delete('/delete-categorie/:cid', protectRoute, isAdmin, deleteCategorie)


export default categorieRouter;