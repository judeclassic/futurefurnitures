
export default class CommentController {
    constructor(Comment, User, Product, Subscription, bcrypt, jwt) {
        this.Comment = Comment;
        this.User = User;
        this.Product = Product;
        this.Subscription = Subscription;
        this.bcrypt = bcrypt;
        this.jwt = jwt;
    }

    async createComment(req, res) {
        try {
            const comment = await this.Comment.create(req.body);
            res.status(200).json({
                code: 200,
                message: "Comment created successfully",
                comment,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: "Internal server error",
                error,
            });
        }
    }

    async getAllComments(req, res) {
        try {
            const comments = await this.Comment.find({ isDeleted: false });
            res.status(200).json({
                code: 200,
                message: "Comments fetched successfully",
                comments,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: "Internal server error",
                error,
            });
        }
    }

    async getCommentById(req, res) {
        try {
            const comment = await this.Comment.findById(req.params.id);
            res.status(200).json({
                code: 200,
                message: "Comment fetched successfully",
                comment,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: "Internal server error",
                error,
            });
        }
    }

    async getCommentByProductId(req, res) {
        try {
            const comments = await this.Comment.find({
                product: req.params.productId,
                isDeleted: false,
            });
            res.status(200).json({
                code: 200,
                message: "Comments fetched successfully",
                comments,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: "Internal server error",
                error,
            });
        }
    }

    async getCommentByUserId(req, res) {
        try {
            const comments = await this.Comment.find({
                user: req.params.userId,
                isDeleted: false,
            });
            res.status(200).json({
                code: 200,
                message: "Comments fetched successfully",
                comments,
            });
        }
        catch (error) {
            res.status(500).json({
                code: 500,
                message: "Internal server error",
                error,
            });
        }
    }

    async getCommentByProductIdAndUserId(req, res) {
        try {
            const comments = await this.Comment.find({
                product: req.params.productId,
                user: req.params.userId,
                isDeleted: false,
            });
            res.status(200).json({
                code: 200,
                message: "Comments fetched successfully",
                comments,
            });
        }
        catch (error) {
            res.status(500).json({
                code: 500,
                message: "Internal server error",
                error,
            });
        }
    }


    async updateComment(req, res) {
        try {
            const comment = await this.Comment.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            res.status(200).json({
                code: 200,
                message: "Comment updated successfully",
                comment,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: "Internal server error",
                error,
            });
        }
    }

    async deleteComment(req, res) {
        try {
            const comment = await this.Comment.findByIdAndUpdate(
                req.params.id,
                { isDeleted: true },
                { new: true }
            );
            res.status(200).json({
                code: 200,
                message: "Comment deleted successfully",
                comment,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: "Internal server error",
                error,
            });
        }
    }
}

