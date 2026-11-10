import prisma from "../config/prisma.js";
export const createComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const { content } = req.body;
        if (typeof postId !== "string") {
            return res.status(400).json({
                message: "Invalid post ID",
            });
        }
        if (!content || typeof content !== "string" || !content.trim()) {
            return res.status(400).json({
                message: "Comment content is required",
            });
        }
        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            },
            include: {
                author: {
                    select: {
                        username: true,
                    },
                },
            },
        });
        if (!post || !post.published) {
            return res.status(404).json({
                message: "Published post not found",
            });
        }
        const comment = await prisma.comment.create({
            data: {
                content: content.trim(),
                postId,
                authorId: req.user.userId,
            },
        });
        return res.status(201).json({
            message: "Comment created successfully",
            comment,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong while creating comment",
        });
    }
};
export const getComments = async (req, res) => {
    try {
        const postId = req.params.postId;
        if (typeof postId !== "string") {
            return res.status(400).json({
                message: "Invalid post ID",
            });
        }
        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            },
        });
        if (!post || !post.published) {
            return res.status(404).json({
                message: "Published post not found",
            });
        }
        const comments = await prisma.comment.findMany({
            where: {
                postId,
            },
            include: {
                author: {
                    select: {
                        username: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json({
            message: "Comments retrieved successfully",
            comments,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong while retrieving comments",
        });
    }
};
export const updateComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const { content } = req.body;
        if (typeof commentId !== "string") {
            return res.status(400).json({
                message: "Invalid comment ID",
            });
        }
        if (!content || typeof content !== "string" || !content.trim()) {
            return res.status(400).json({
                message: "Comment content is required",
            });
        }
        const comment = await prisma.comment.findUnique({
            where: {
                id: commentId,
            },
        });
        if (!comment) {
            return res.status(404).json({
                message: "Comment not found",
            });
        }
        if (comment.authorId !== req.user.userId) {
            return res.status(403).json({
                message: "You can only update your own comments",
            });
        }
        const updatedComment = await prisma.comment.update({
            where: {
                id: commentId,
            },
            data: {
                content: content.trim(),
            },
        });
        return res.status(200).json({
            message: "Comment updated successfully",
            comment: updatedComment,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong while updating comment",
        });
    }
};
export const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        if (typeof commentId !== "string") {
            return res.status(400).json({
                message: "Invalid comment ID",
            });
        }
        const comment = await prisma.comment.findUnique({
            where: {
                id: commentId,
            },
            include: {
                post: true,
            },
        });
        if (!comment) {
            return res.status(404).json({
                message: "Comment not found",
            });
        }
        const isCommentOwner = comment.authorId === req.user.userId;
        const isPostOwner = comment.post.authorId === req.user.userId;
        if (!isCommentOwner && !isPostOwner) {
            return res.status(403).json({
                message: "You are not allowed to delete this comment",
            });
        }
        await prisma.comment.delete({
            where: {
                id: commentId,
            },
        });
        return res.status(200).json({
            message: "Comment deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong while deleting comment",
        });
    }
};
//# sourceMappingURL=commentController.js.map